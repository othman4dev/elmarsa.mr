import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  searchProduct,
  updateProduct,
  addFavorite,
  removeFavorite,
  getFavorites,
  getProductStat,
  getAllProductActive,
  getProductBySeller,
  getProductsBySeller,
  getFilteredProducts,
  changeProductActivity
} from "../controller/productController.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
import { verifyUser } from "../middleware/VerifyUser.js";
import { get } from "mongoose";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();

router.post("/product", verifyUser, addProduct);
// router.put("/product/:id", verifyAdmin, verifyToken, updateProduct);
router.put("/product/:id", verifyUser, updateProduct);
router.get("/product", getAllProductActive);
router.get("/productList", isAdmin, getAllProduct);
router.get("/product/find/:id", getProduct);
router.get("/product/search", searchProduct);
router.delete("/product/:id", verifyUser, deleteProduct);
router.delete("/product/favorites/:productId", verifyUser, removeFavorite);
router.post("/product/favorites/:productId", verifyUser, addFavorite); // Replace verifyToken with verifyUser
router.get("/product/favorites", verifyUser, getFavorites);
router.get("/product/stat", isAdmin, getProductStat);
router.get("/product/seller/:sellerId", getProductBySeller);
router.get("/products/seller", verifyUser, getProductsBySeller); //for my products
router.get("/products/:categoryId?/:minPrice?/:maxPrice?/:ville?/:searchQuery?/:withPrice?/:withImage?/:withPro?" , getFilteredProducts);
router.put("/products/changeActivity" , isAdmin , changeProductActivity);
export default router;
