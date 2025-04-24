import Category from "../models/categoryModel.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import { tryCatch } from "../utils/tryCatch.js";

export const createCategory = tryCatch(async (req, res) => {
  let { name_en, name_fr, name_ar, icon, description_en,description_fr,description_ar, bgColor, subCategories } = req.body;
  bgColor = bgColor || "bg-white";

  const newCategory = new Category({
    name_en,
    name_fr,
    name_ar,
    name: name_en,
    icon,
    description_en,
    description_fr,
    description_ar,
    description: description_en,
    bgColor,
    subCategories: subCategories.map(sub => ({
      ...sub,
      name: sub.name_en,
      description: sub.description_en,
    })),
  });

  const savedCategory = await newCategory.save();
  res.status(200).json({
    status: "success",
    savedCategory,
  });
});

export const deleteCategory = tryCatch(async (req, res) => {
  const categoryfound = await Category.findById(req.params.id);
  if (categoryfound === null) {
    res.status(200).json({
      status: "faild",
      data: "No category with this id",
    });
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "succuss",
    data: "category has been deleted",
  });
});
export const deleteSubCategory = tryCatch(async (req, res) => {
  const { categoryId, subCategoryId } = req.params;
  console.log("category id : " , categoryId);
  console.log("Sub category id :" , subCategoryId);
  // Find the category
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({
      status: "failed",
      data: "No category found with this ID",
    });
  }

  // Find the subcategory index
  const subCategoryIndex = category.subCategories.findIndex(sub => sub._id.toString() === subCategoryId);
  if (subCategoryIndex === -1) {
    return res.status(404).json({
      status: "failed",
      data: "No subcategory found with this ID",
    });
  }

  // Remove the subcategory
  category.subCategories.splice(subCategoryIndex, 1);

  // Save the updated category
  await category.save();

  return res.status(200).json({
    status: "success",
    data: "Subcategory has been deleted",
  });
});


export const getAllCategory = tryCatch(async (req, res) => {
  const findCategory = new ApiFeatures(Category.find(), req.query)
    .filter()
    .limiting()
    .pagination()
    .sorting();
  const categories = await findCategory.query;
  res.status(200).json({
    status: "succuss",
    result: categories.length,
    data: { categories },
  });
});
export const getCategory = tryCatch(async (req, res) => {
  const findCategory = await Category.findById(req.params.id);
  if (findCategory === null) {
    res.status(200).json({
      status: "faild",
      data: "No category with this id",
    });
  }
  res.status(200).json({
    status: "succuss",
    data: findCategory,
  });
});

// export const updateCategory = tryCatch(async (req, res) => {
//   const categoryId = req.params.id;
//   const { name, icon } = req.body;
//   const foundCategory = await Category.findById(categoryId);
//   const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
//     $set: {
//       name,
//       icon,
//     },
//   });
//   if (foundCategory === null) {
//     return res.status(200).json({
//       status: "faild",
//       data: "no category with this id",
//     });
//   } else {
//     res.status(200).json({
//       status: "succuss",
//       data: updatedCategory,
//     });
//   }
// });

export const updateSubCategory = tryCatch(async (req, res) => {
  const categoryId = req.params.id;
  const { subCategories } = req.body;

  const foundCategory = await Category.findById(categoryId);
  if (!foundCategory) {
    return res.status(404).json({
      status: "failed",
      data: "No category found with this id",
    });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: { subCategories } },
    { new: true }  // to return the updated document
  );

  res.status(200).json({
    status: "success",
    data: updatedCategory,
  });
});
export const updateCategory = tryCatch(async (req, res) => {
  const categoryId = req.params.id;
  let {
    name_en,
    name_fr,
    name_ar,
    description_en,
    description_fr,
    description_ar,
    subCategories,
    bgColor,
    icon
  } = req.body;

  bgColor = bgColor || "bg-white";

  const foundCategory = await Category.findById(categoryId);
  if (!foundCategory) {
    return res.status(404).json({
      status: "failed",
      data: "No category found with this id",
    });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: {
        name_en,
        name_fr,
        name_ar,
        description_en,
        description_fr,
        description_ar,
        subCategories,
        bgColor,
        icon
      }
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedCategory,
  });
});


export const getSubCategory = tryCatch(async (req, res) => {
  const subCategoryId = req.params.categoryId; // This is the ID of the subcategory

  // Find the category that contains this subcategory
  const foundCategory = await Category.findOne({ "subCategories._id": subCategoryId });

  if (!foundCategory) {
    return res.status(404).json({
      status: "failed",
      data: "No subcategory found with this id",
    });
  }

  // Find the specific subcategory inside the category
  const subCategory = foundCategory.subCategories.find(sub => sub._id.toString() === subCategoryId);

  if (!subCategory) {
    return res.status(404).json({
      status: "failed",
      data: "Subcategory not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});
import mongoose from 'mongoose';

export const getSubCategoriesByCategory = tryCatch(async (req, res) => {
  console.log("req : ", req.params);
  const { id: categoryId } = req.params;

  // If categoryId is "0", return all subcategories
  if (categoryId === "0") {
    const allSubCategories = await Category.find({}); // Retrieve all categories
    const allSubCategoriesData = allSubCategories.map(category => category.subCategories).flat();

    return res.status(200).json({
      status: "success",
      data: allSubCategoriesData, // Return all subcategories
    });
  }

  // Check if the categoryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      status: "failed",
      data: "Invalid Category ID format",
    });
  }

  console.log("categoryId : ", categoryId);
  
  // Find the category by its valid ID
  const category = await Category.findById(categoryId);

  if (!category) {
    return res.status(404).json({
      status: "failed",
      data: "Category not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: category.subCategories, // Return subcategories of the found category
  });
});
