import AppError from "../AppError.js";
import Product from "../models/productModule.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import { tryCatch } from "../utils/tryCatch.js";
import mongoose from "mongoose";
import User from "../models/userModule.js";
import jwt from 'jsonwebtoken';  // Import jsonwebtoken using ES module syntax
import Category from "../models/categoryModel.js";


export const addProduct = tryCatch(async (req, res) => {
  console.log("Received request to add product:", req.body);

  const { title, description, price, email, ville , neighborhood, phone, location, categoryId, subCategoryId, images } = req.body;

  const priceValue = price || "0";

  if (!title || !description || !email || !ville || !phone || !location) {
    console.error("Validation Error: Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Fetch default category if categoryId is empty
  let updatedCategoryId = categoryId;
  let updatedSubCategoryId = subCategoryId;

  if (!categoryId || categoryId === "") {
    const defaultCategory = await Category.findOne();
    if (!defaultCategory) {
      return res.status(400).json({ message: "No categories found in the database" });
    }
    updatedCategoryId = defaultCategory._id;
  }

  if (!subCategoryId || subCategoryId === "") {
    const defaultSubCategory = await Category.findOne({ _id: updatedCategoryId }, { subCategories: 1 });
    if (defaultSubCategory?.subCategories?.length > 0) {
      updatedSubCategoryId = defaultSubCategory.subCategories[0]._id;
    }
  }
  console.log("Updated Category ID:", updatedCategoryId);
  console.log("Updated SubCategory ID:", updatedSubCategoryId);
  if (!mongoose.Types.ObjectId.isValid(updatedCategoryId)) {
    console.error("Validation Error: Invalid categoryId format", updatedCategoryId);
    return res.status(400).json({ message: "Invalid categoryId format" });
  }

  let { sellerId } = req.body;

  if (!sellerId) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error("Validation Error: Missing token");
      return res.status(400).json({ message: "Missing token" });
    }

    try {
      const tokenData = jwt.decode(token);
      sellerId = tokenData.id;
    } catch (error) {
      console.error("Token Error:", error);
      return res.status(400).json({ message: "Invalid token" });
    }
  }

  if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
    console.error("Validation Error: Invalid or missing sellerId", sellerId);
    return res.status(400).json({ message: "Invalid or missing sellerId" });
  }

  const parsedPrice = parseFloat(priceValue);
  if (isNaN(parsedPrice)) {
    console.error("Validation Error: Invalid price format", priceValue);
    return res.status(400).json({ message: "Invalid price format" });
  }

  console.log("Checking if seller exists:", sellerId);
  const seller = await User.findById(sellerId);
  if (!seller) {
    console.error("Error: Seller not found", sellerId);
    return res.status(404).json({ message: "Seller not found" });
  }

  console.log("Creating new product...");
  const newProduct = new Product({
    title,
    description,
    price: parsedPrice,
    email,
    ville,
    neighborhood,
    phone,
    location,
    categoryId: updatedCategoryId,
    subCategoryId: updatedSubCategoryId,
    sellerId,
    images: images || [],
  });

  await newProduct.save();
  console.log("Product successfully added:", newProduct);

  return res.status(201).json({
    status: "success",
    data: newProduct,
  });
});






export const deleteProduct = tryCatch(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "succuss",
    data: "product has been deleted",
  });
});

//get all products
export const getAllProductActive = tryCatch(async (req, res) => {
  const findProducts = new ApiFeatures(Product.find(), req.query)
    .filter()
    .limiting()
    .pagination()
    .sorting();

  findProducts.query = findProducts.query.where({ status: "active" });
  const product = await findProducts.query;
  res.status(200).json({
    status: "succuss",
    result: product.length,
    data: { product },
  });
});
export const getAllProduct = tryCatch(async (req, res) => {
  const findProducts = new ApiFeatures(Product.find(), req.query)
    .filter()
    .limiting()
    .pagination()
    .sorting();

  const products = await findProducts.query;
  res.status(200).json({
    status: "success",  // Corrected typo
    result: products.length,  // Corrected variable name
    data: products,  // Directly pass products
  });
});


export const getProduct = tryCatch(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError(400, "Invalid Product ID", 400);
  }
  const findProducts = await Product.findById(req.params.id);

  console.log(findProducts);

  res.status(200).json({
    status: "succuss",
    data: findProducts,
  });
});

export const searchProduct = tryCatch(async (req, res) => {
  const searchTerm = req.query.q;
  const findProducts = await Product.find({
    title: { $regex: searchTerm, $options: "i" },
  });

  if (findProducts.length === 0) {
    return res.status(200).json({
      status: "succuss",
      data: "product not found",
    });
  }
  res.status(200).json({
    status: "succuss",
    data: findProducts,
  });
});


// PUT Edit Product with Debugging
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Get productId from params
    const { title, description, price, email, ville, neighborhood ,  phone, location, categoryId, images, sellerId, subCategoryId } = req.body;

    // Log incoming data to debug
    console.log("Received request body:", req.body);

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: `The product with the ID ${productId} was not found` });
    }

    // Update the product fields only if they exist in the request body
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.email = email || product.email;
    product.ville = ville || product.ville;
    product.neighborhood = neighborhood || product.neighborhood;
    product.phone = phone || product.phone;
    product.location = location || product.location;
    product.categoryId = categoryId || product.categoryId;
    product.images = images || product.images;
    product.sellerId = sellerId || product.sellerId;
    product.subCategoryId = subCategoryId || product.subCategoryId;

    // Log updated product data
    console.log("Updated product data:", product);

    // Save the updated product
    const updatedProduct = await product.save();

    // Respond with the updated product data
    res.status(200).json({ msg: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error, unable to update product" });
  }
};



export const updateProduct2 = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  const { title, description, price, email, ville, phone, location, categoryId, images, sellerId } = req.body;

  // Log the request body to ensure it's being passed correctly
  console.log("Request body:", req.body);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(400, "Invalid Product ID", 400);
  }

  const findProduct = await Product.findById(productId);
  if (!findProduct) {
    throw new AppError(404, "Product not found", 404);
  }

  if (!userId.equals(findProduct.sellerId) && !req.user.isAdmin) {
    throw new AppError(403, "You can't update this product", 403);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        title,
        description,
        price,
        email,
        ville,
        phone,
        location,
        categoryId,
        images,
        sellerId
      },
    },
    { new: true }
  );

  // Log the updated product to check if the update went through
  console.log("Updated Product:", updatedProduct);

  res.status(200).json({ status: "success", data: updatedProduct });
});



export const addFavorite = tryCatch(async (req, res) => {
  const userId = req.user.id; // Assuming user data is in req.user from verifyUser middleware
  const productId = req.params.productId;
  // Check if the product ID is valid
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  // Find the user by ID
  const user = await User.findById(userId);
  console.log("user", user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the product is already in the favorites
  if (!user.favorites.includes(productId)) {
    user.favorites.push(productId);
    await user.save();
  }

  // Populate the favorites to return the updated list
  const userWithFavorites = await User.findById(userId).populate("favorites");

  return res.status(200).json({
    status: "success",
    data: userWithFavorites.favorites,
  });
});


export const removeFavorite = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  // Find the user by ID
  const user = await User.findById(userId);
  console.log("user", user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.favorites = user.favorites.filter(
    (favorite) => favorite && !favorite.equals(productId)
  );
  await user.save();
  const userWithFavorites = await User.findById(userId).populate("favorites");
  res.status(200).json({
    status: "succuss",
    data: userWithFavorites.favorites,
  });
});

export const getFavorites = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).populate("favorites");
  res.status(200).json({
    status: "succuss",
    data: user.favorites,
  });
});
export const getProductStat = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  const frenchMonths = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const data = await Product.aggregate([
    {
      $match: {
        createdAt: { $gte: lastYear },
      },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  const formattedData = data.map((item) => ({
    month: frenchMonths[item._id - 1],
    total: item.total,
  }));
  res.status(200).json({ formattedData });
};

export const getProductsBySeller = tryCatch(async (req, res) => {
  console.log("req : ", req);
  const userId = req.user.id;
  console.log("user id :", userId);
  const products = await Product.find({ sellerId: userId });
  res.status(200).json({
    status: "succuss",
    data: products,
  });
  console.log("userId : ", userId);
  console.log("products : ", products);
});
export const getProductBySeller = tryCatch(async (req, res) => {
  const { sellerId } = req.params;
  console.log(sellerId);
  if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ status: "error", message: "Invalid Seller ID" });
  }

  const products = await Product.find({ sellerId: sellerId });
  console.log("products : ", products);
  res.status(200).json({
    status: "success",
    data: products,
  });
});
export const getFilteredProducts = tryCatch(async (req, res) => {
  const { categoryId, subCategoryId, ville, minPrice, maxPrice, searchQuery, withPrice, withImage, withPro } = req.query;
  const query = { status: "active" }; // Ensure only inactive products are fetched

  if (categoryId) query.categoryId = categoryId;
  if (subCategoryId) query.subCategoryId = subCategoryId;
  // else query.categoryId = "";

  // Handle multiple cities
  if (ville) {
    query.ville = Array.isArray(ville) ? { $in: ville } : ville;
  }

  try {
    let products = await Product.find(query).sort({ createdAt: -1 }); ;

    // Filter by price if withPrice is true
    if (withPrice === 'true') {
      products = products.filter(product => product.price > 0);
    }

    // Filter by image if withImage is true
    if (withImage === 'true') {
      products = products.filter(product => product.images && product.images.length > 0);
    }

    // Filter by premium if withPro is true
    if (withPro === 'true') {
      products = products.filter(product => product.isPremium === true);
    }

    // Convert price to number and filter manually
    if (minPrice || maxPrice) {
      products = products.filter(product => {
        const price = Number(product.price);
        if (isNaN(price)) return false;

        let min = minPrice ? Number(minPrice) : Number.NEGATIVE_INFINITY;
        let max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;

        // Ensure min is smaller than max
        if (min > max) [min, max] = [max, min];
        return price >= min && price <= max;
      });
    }
    // Filter by search query (case insensitive)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      products = products.filter(product =>
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
    console.error("Error : ", error);
  } finally {
    console.log("req : ", req.query);
  }
});

export const changeProductActivity = tryCatch(async (req, res) => {
  const { productId, status } = req.body;

  if (!productId || !["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product status updated", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product status", error });
    console.error("Error:", error);
  }
});
