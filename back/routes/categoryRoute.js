import express from "express";
import {
  createCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategory,
  getCategory,
  getSubCategoriesByCategory,
  getSubCategory,
  updateCategory,
  updateSubCategory,
} from "../controller/categoryController.js";
import { verifyAdmin } from "../middleware/verifyToken.js";
import { verifyUser } from "../middleware/VerifyUser.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/category", isAdmin, createCategory); // Add Category
router.delete("/category/:id", isAdmin, deleteCategory); // Delete category
router.delete("/subCategory/:categoryId/:subCategoryId" , isAdmin , deleteSubCategory) // Delete sub category
router.get("/category", getAllCategory); // Get all categories
router.get("/category/:id", getCategory); // Get category
router.put("/category/:id", isAdmin, updateCategory); // update category
router.put("/subCategory/:id", isAdmin, updateSubCategory);  // update sub category 
router.get("/subCategory/:categoryId", getSubCategory);  // Get All SubCategories of catgegory
router.get("/category/sub/:id?", getSubCategoriesByCategory); //Get Specific Sub category
export default router;
