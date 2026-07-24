import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import "../config/env.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Restaurant from "../models/restaurant.model.js";

import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while generating access and refresh token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = await req.body;
  if ([name, email, phone, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  console.log(req.file);
  console.log(req.body);

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    return res.status(400).json(new ApiResponse(400, {}, "User already exist"));
  }
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }
  console.log("Image path", imageLocalPath);
  const imagePath = await uploadOnCloudinary(imageLocalPath);

  if (!imagePath) {
    throw new ApiError(400, "Image cloudinary upload error");
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    profile: imagePath?.url,
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Username or phone no is required");
  }
  const user = await User.findOne({
    $or: [{ email }, { phone: email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const passwordCheck = await user.isPasswordCorrect(password);
  if (!passwordCheck) {
    throw new ApiError(401, "Invalid user credential");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id,
  );

  user.refreshToken = refreshToken;
  await user.save();

  const loggedUser = await User.findById(user?._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)

    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body;

  if (!token) {
    throw new ApiError(400, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (token !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expire or unused");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id,
    );
    user.refreshToken = refreshToken;
    await user.save();
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "New Access token generated",
        ),
      );
  } catch (error) {
    console.error("Actual Error:", error);
    throw new ApiError(500, "Something went wrong (New Access token)");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const passwordCheck = await user.isPasswordCorrect(oldPassword);
  if (!passwordCheck) {
    throw new ApiError(400, "Invalid password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken",
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched"));
});

const getAllRestaurant = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({
    isDeleted:false
  }).sort({ createdAt: 1 }); // 1 = Ascending, -1 = Descending

  if (!restaurants.length) {
    throw new ApiError(404, "No restaurants found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, restaurants, "Restaurants fetched successfully"),
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrUser,
  getAllRestaurant,
};
