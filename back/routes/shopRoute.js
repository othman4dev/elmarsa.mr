import express from "express";
import {
 getShops
} from "../controller/shopController.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
import { verifyUser } from "../middleware/VerifyUser.js";
import { get } from "mongoose";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();

router.get("/shops" , getShops);
export default router;
