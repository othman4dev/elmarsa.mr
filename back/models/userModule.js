import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["normal", "store"],
      default: "normal",
    },
    storeProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null, // Only store users will have this
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
export default User;
