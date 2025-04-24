import jwt from "jsonwebtoken";
import AppError from "../AppError.js";
import User from "../models/userModule.js";
import mongoose from 'mongoose';

export const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("token",authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: "Bad Request: Invalid token format" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_STRING);
        req.user = decoded;  // Attach the user info to the request
        next();
    } catch (err) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};
