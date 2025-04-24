import express from "express";
import {
  register,
  login,
  googleCallback,
  logOut,
  facebookCallback,
  googleCallbackMobile,
  sendWhatsappMessage,
  verifyPhoneNumber,
  verifyAndRegister,
  checkPhoneNumberExists,
  loginWithPhone,
} from "../controller/authController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import passport from "passport";
import { verifyUser } from "../middleware/VerifyUser.js";
// import { sendWhatsappMessage } from "../controller/twilio.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logOut", verifyToken, logOut);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", googleCallback);
router.get("/google/callbackMobile", googleCallbackMobile);
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", facebookCallback);
router.post("/sendWhatsappMessage", sendWhatsappMessage);
router.post("/verifyNumberPhone", verifyUser,verifyPhoneNumber);
router.post("/verifyPhoneNumber", verifyAndRegister); //while register
router.post("/loginWithPhone", loginWithPhone); //while login
router.post("/checkPhoneNumberExists", checkPhoneNumberExists);
// Facebook Login
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Facebook Callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/dashboard",
  })
);
export default router;
