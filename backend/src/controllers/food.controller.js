import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Food from "../models/food.model.js";
import Restaurant from "../models/restaurant.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addFoodIntoRestaurant = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;

  const { name, description, price, category } = req.body;

  const restaurant = await Restaurant.findOne({
    owner: ownerId,
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant is not registered for this owner");
  }

  if (
    !name?.trim() ||
    !description?.trim() ||
    !category?.trim() ||
    price == null ||
    Number(price) < 0
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingFood = await Food.findOne({
    restaurant: restaurant._id,
    name: name.trim(),
  });

  if (existingFood) {
    throw new ApiError(409, "Food already exists in this restaurant");
  }

  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Food image is required");
  }

  const imagePath = await uploadOnCloudinary(imageLocalPath);

  if (!imagePath) {
    throw new ApiError(400, "Food image upload failed");
  }

  const food = await Food.create({
    restaurant: restaurant._id,
    name: name.trim(),
    description: description.trim(),
    price,
    image: imagePath.url,
    category: category.trim(),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, food, "Food added to restaurant menu successfully"),
    );
});

const updateFoodDetail = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { foodId } = req.params;

  const restaurant = await Restaurant.findOne({
    owner: ownerId,
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const existingFood = await Food.findOne({
    _id: foodId,
    restaurant: restaurant._id,
  });

  if (!existingFood) {
    throw new ApiError(404, "Food not found");
  }

  const imageLocalPath = req.file?.path;

  if (imageLocalPath) {
    const imagePath = await uploadOnCloudinary(imageLocalPath);

    if (!imagePath) {
      throw new ApiError(400, "Food image upload failed");
    }

    existingFood.image = imagePath.url;
  }

  const { name, description, price, category, isAvailable } = req.body;

  if (name !== undefined) existingFood.name = name.trim();
  if (description !== undefined) existingFood.description = description.trim();
  if (price !== undefined) existingFood.price = Number(price);
  if (category !== undefined) existingFood.category = category.trim();
  if (isAvailable !== undefined) existingFood.isAvailable = isAvailable;

  await existingFood.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, existingFood, "Food details updated successfully"),
    );
});

const changeAvailabilityFood = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { foodId } = req.params;
  const { isAvailable } = req.body;

  if (typeof isAvailable !== "boolean") {
    throw new ApiError(400, "isAvailable must be true or false");
  }

  const restaurant = await Restaurant.findOne({ owner: ownerId });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const existingFood = await Food.findOne({
    restaurant: restaurant._id,
    _id: foodId,
  });

  if (!existingFood) {
    throw new ApiError(404, "Food not found in your restaurant");
  }

  existingFood.isAvailable = isAvailable;
  await existingFood.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        existingFood,
        isAvailable ? "Food is now available" : "Food is now unavailable",
      ),
    );
});

const deleteFood = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  const { foodId } = req.params;

  const restaurant = await Restaurant.findOne({
    owner: ownerId,
  });
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }
  const food = await Food.findOneAndDelete({
    _id: foodId,
    restaurant: restaurant._id,
  });
  if (!food) {
    throw new ApiError(404, "Food not found in your restaurant");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food is deleted from the restaurant"));
});

const getAllFood = asyncHandler(async (req, res) => {
  const foods = await Food.aggregate([
    {
      $match: {
        isAvailable: true,
      },
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant",
    },
    {
      $sort: {
        category: 1,
        name: 1,
      },
    },
    {
      $group: {
        _id: "$category",
        foods: {
          $push: {
            _id: "$_id",
            name: "$name",
            description: "$description",
            price: "$price",
            image: "$image",
            isAvailable: "$isAvailable",
            restaurant: {
              _id: "$restaurant._id",
              name: "$restaurant.name",
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        foods: 1,
      },
    },
  ]);
  if (foods.length === 0) {
    throw new ApiError(400, "No Food is available");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, foods, "Foods fetched successfully"));
});

const getFoodDetail = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  const food = await Food.findById(foodId);
  if (!food) {
    throw new ApiError(404, "Food is not at restaurent");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food details fetched"));
});

const getRestaurantMenu = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const menu = await Food.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        isAvailable: true,
      },
    },
    {
      $sort: {
        category: 1,
        name: 1,
      },
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant",
    },
    {
      $group: {
        _id: "$category",
        foods: {
          $push: {
            _id: "$_id",
            name: "$name",
            description: "$description",
            price: "$price",
            image: "$image",
            isAvailable: "$isAvailable",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        foods: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        restaurant,
        menu,
      },
      "Restaurant menu fetched successfully",
    ),
  );
});

const getFoodByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const categoryFood = await Food.find({ category }).populate(
    "restaurant",
    "name address",
  );

  if (categoryFood.length === 0) {
    throw new ApiError(404, "No food found in this category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, categoryFood, "Food fetched successfully"));
});

const getOwnerFoods = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const restaurant = await Restaurant.findOne({
    owner: ownerId,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const foods = await Food.find({
    restaurant: restaurant._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, foods, "Foods fetched successfully"));
});


export {
  addFoodIntoRestaurant,
  updateFoodDetail,
  changeAvailabilityFood,
  deleteFood,
  getAllFood,
  getFoodDetail,
  getRestaurantMenu,
  getFoodByCategory,
  getOwnerFoods,
};
