import jwt from "jsonwebtoken";
import AppError from "../AppError.js";
import User from "../models/userModule.js";

export const verifyToken = async (req, res, next) => {
  try {
    console.log(`API call: ${req.method} ${req.originalUrl}`);
    const token = req.cookies.token;

    if (!token) {
      throw new AppError(401, "Not authenticated", 401);
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_STRING);

    // Attach user to the request
    const findUser = await User.findById(decoded.id);
    const { password, ...info } = findUser._doc;

    req.user = info;
    if (!req.user) {
      throw new AppError(404, "User not found", 404);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyToken2 = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Ensure the token starts with 'Bearer'
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: "Bad Request: Invalid token format" });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (err) {
    // Log the error for debugging
    console.error("JWT Error:", err);

    // Send a 403 Forbidden response if verification fails
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      next(new AppError(400, "you are not admin", 401));
    }
  });
};
