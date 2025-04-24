import mongoose from "mongoose";

// Define the verification schema
const verificationSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create a TTL index on the `createdAt` field (default created by timestamps)
verificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
