import express from "express";
import {
  getUser,
  updateUser,
  getSeller,
  getAllUser,
  getUserStat,
  deleteUser,
  switchMode,
  updateUserInfos,
  updatePassword,
  returnTrue,
} from "../controller/userController.js";
const router = express.Router();
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
import { verifyUser } from "../middleware/VerifyUser.js";
import { isAdmin } from "../middleware/isAdmin.js";

router.get("/user", verifyUser, getUser);
router.get("/user/seller/:userId", getSeller);
router.get("/allUser", getAllUser);
router.put("/user/update/:id", verifyUser, updateUser);
router.get("/user/statistic", isAdmin, getUserStat);
router.delete("/user/:id", isAdmin, deleteUser);
router.put("/switch/:userId", switchMode);
router.put("/updateUser", verifyUser, updateUserInfos);
router.put("/updatePassword", verifyUser, updatePassword);
router.get("/deleteUserData", returnTrue);

export default router;
