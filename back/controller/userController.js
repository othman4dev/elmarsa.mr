import mongoose from "mongoose";
import AppError from "../AppError.js";
import User from "../models/userModule.js";
import { tryCatch } from "../utils/tryCatch.js";
import { updateSchema } from "../schema/validationSchema.js";
import bcrypt from "bcrypt";

//get login user
export const getUser = tryCatch(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  console.log("user", user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user) {
    throw new AppError(400, "user not found", 400);
  }
  // const { password, ...info } = findUser._doc;
  res.status(200).json({
    status: "success",
    user: user,
  });
});

export const updateUser = tryCatch(async (req, res) => {
  let userId = req.user._id;

  // Validate input data
  const { username, email, password, oldPassword, isAdmin } =
    await updateSchema.validateAsync(req.body);

  if (req.params.id) {
    userId = req.params.id;
  }
  console.log("User ID:", userId);

  // Find the user
  const findUser = await User.findById(userId);
  if (!findUser) {
    throw new AppError(404, "User not found", 404);
  }

  let hashedPassword = findUser.password; // Default to existing password

  // If the user wants to update the password
  if (password) {
    if (!oldPassword) {
      throw new AppError(400, "Please provide the old password", 400);
    }

    // Check if the old password matches
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      findUser.password
    );
    console.log("Password matches:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new AppError(400, "Old password is incorrect", 400);
    }

    // Hash the new password
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Update the user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        email,
        password: hashedPassword,
        isAdmin: req.user.isAdmin ? isAdmin : null,
      },
    },
    { new: true } // Return the updated document
  );

  // Remove the password field before sending the response
  const { password: pwd, ...info } = updatedUser._doc;

  // Send the response
  res.status(200).json({
    status: "success",
    user: info,
  });
});

export const getSeller = tryCatch(async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, "invalid user Id", 400);
  }
  const findUser = await User.findById(userId);

  if (!findUser) {
    throw new AppError(400, "user not found", 400);
  }
  const { password, ...info } = findUser._doc;
  res.status(200).json({
    status: "succuss",
    user: info,
  });
});

export const getAllUser = tryCatch(async (req, res) => {
  const users = await User.find({}, { password: 0 });
  res.status(200).json({
    status: "succuss",
    result: users.length,
    data: users,
  });
});
export const deleteUser = tryCatch(async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, "invalid user Id", 400);
  }
  const findUser = await User.findByIdAndDelete(userId);
  if (!findUser) {
    throw new AppError(400, "user not found", 400);
  }
  res.status(200).json({
    status: "succuss",
    message: "User deleted successfully",
  });
});

export const getUserStat = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  const frenchMonths = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const data = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: lastYear },
      },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  const formattedData = data.map((item) => ({
    month: frenchMonths[item._id - 1],
    total: item.total,
  }));
  res.status(200).json({ formattedData });
};

// Controller function for switching the mode
export const switchMode = async (req, res) => {
  const { userId } = req.params;
  const { mode } = req.body; // assuming the mode is sent in the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Change the role based on the mode
    if (mode === "buying") {
      User.role = "normal"; // Change role to 'normal' if mode is 'buying'
    } else {
      user.role = "store"; // Change role to 'store' for any other mode
    }

    // Save the updated user
    await user.save();

    // Respond with the updated user
    res
      .status(200)
      .json({ message: "User mode and role updated successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserInfos = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token
    const { username, phone, email, password, isAdmin, role, image } = req.body;
    console.log("image : ", image);
    // Find user by ID to get the old phone number
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields if needed
    //if (!email && !username && !phone && !isAdmin && !role) {
    //  return res.status(400).json({ message: "Please provide at least one field to update.", body: req.body });
    //}

    // Check if phone number has changed
    let updatedFields = { username, email, password, isAdmin, role, image };
    if (phone) {
      // If phone has changed, set phoneVerified to false
      if (phone !== user.phone) {
        updatedFields.phoneVerified = false;
      }
      updatedFields.phone = phone; // Update phone number
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      userId, // The user is identified by their userId
      updatedFields, // Fields to update
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the updated user back in the response
    return res
      .status(200)
      .json({ message: "User information updated successfully", updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while updating user information",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches the one stored in the database
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while updating the password",
      error: err.message,
    });
  }
};

export const returnTrue = async (req, res) => {
  // return the 200 status
  return res
    .status(200)
    .json({ message: "Suppression des données utilisateur" });
};
