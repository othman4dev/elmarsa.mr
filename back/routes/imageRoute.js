import express from "express";
import { uploadImage } from "../controller/imageController.js"; // Import the uploadImage controller
import multer from 'multer';

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const router = express.Router();

// Define the route for image upload
router.post("/upload-image", upload.single('image'), uploadImage);  // Use the controller

export default router;
