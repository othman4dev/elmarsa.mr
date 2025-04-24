import AppError from "../AppError.js";
import Product from "../models/productModule.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import { tryCatch } from "../utils/tryCatch.js";
import mongoose from "mongoose";
import User from "../models/userModule.js";
import jwt from 'jsonwebtoken';  // Import jsonwebtoken using ES module syntax
import Category from "../models/categoryModel.js";
import dayjs from "dayjs"; // For formatting dates


export const getShops = tryCatch(async (req, res) => {
  const { categoryName, sortBy, searchQuery } = req.query;

  let shopFilter = { role: "store" };
  
  if (searchQuery) {
    shopFilter.username = { $regex: searchQuery, $options: "i" };
  }

  let shops = await User.find(shopFilter).select("username phone email image createdAt").lean();

  const shopDetails = await Promise.all(
    shops.map(async (shop) => {
      const products = await Product.find({ sellerId: shop._id })
        .select("categoryId images") 
        .lean();

      if (products.length === 0) return null;

      const categoryIds = [...new Set(products.map((p) => p.categoryId.toString()))];
      const categories = await Category.find({ _id: { $in: categoryIds } }).select("name").lean();
      let formattedCategories = categories.map((category) => category.name); 

      if (categoryName && !formattedCategories.includes(categoryName)) {
        return null;
      }

      let productsImages = products.map((product) => product.images?.[0] || null).filter(Boolean);

      // Ensure at least 4 images by duplicating if necessary
      while (productsImages.length < 4 && productsImages.length > 0) {
        productsImages.push(...productsImages.slice(0, 4 - productsImages.length));
      }

      return {
        ...shop,
        categories: formattedCategories,
        announcements: products.length,
        createdAt: dayjs(shop.createdAt).format("YYYY-MM-DD HH:mm"),
        productsImages,
      };
    })
  );

  let filteredShops = shopDetails.filter((shop) => shop !== null);

  if (sortBy) {
    if (sortBy === "announcements") {
      filteredShops.sort((a, b) => b.announcements - a.announcements);
    } else if (sortBy === "alphabetical") {
      filteredShops.sort((a, b) => a.username.localeCompare(b.username));
    } else if (sortBy === "date") {
      filteredShops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  res.status(200).json(filteredShops);
});




