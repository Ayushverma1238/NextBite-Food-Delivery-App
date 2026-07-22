import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Food from "../models/food.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createRestaurant = asyncHandler(async (req, res) => {
  const {
    ownerId,
    name,
    description,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    latitude,
    longitude,
  } = req.body;

  if (
    !ownerId ||
    !name ||
    !phone ||
    !email ||
    !address ||
    !city ||
    !state ||
    !pincode ||
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(ownerId);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const existingRestaurant = await Restaurant.findOne({
    owner: ownerId,
    isDeleted: false,
  });

  if (existingRestaurant) {
    throw new ApiError(400, "Owner already has a restaurant");
  }

  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Restaurant image is required");
  }

  const imagePath = await uploadOnCloudinary(imageLocalPath);

  if (!imagePath) {
    throw new ApiError(400, "Restaurant image uploading failed");
  }

  user.role = "OWNER";
  await user.save({ validateBeforeSave: false });

  const restaurant = await Restaurant.create({
    owner: ownerId,
    name,
    image: imagePath.url,
    description,
    phone,
    email,
    address,
    city,
    state,
    pincode,

    location: {
      type: "POINT",
      coordinates: [Number(longitude), Number(latitude)],
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, restaurant, "Restaurant created successfully"));
});

const updateRestaurantDetails = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  console.log("req body", req.body)

  const restaurant = await Restaurant.findOne({
    owner: ownerId,
    isDeleted:false
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant does not exist");
  }

  const imageLocalPath = req.file?.path;

  let imagePath = null;

  if (imageLocalPath) {
    imagePath = await uploadOnCloudinary(imageLocalPath);

    if (!imagePath) {
      throw new ApiError(400, "Restaurant image uploading failed");
    }
  }

  const { latitude, longitude, ...rest } = req.body;

  Object.assign(restaurant, rest);

  if (latitude !== undefined && longitude !== undefined) {
    restaurant.location = {
      type: "POINT",
      coordinates: [Number(longitude), Number(latitude)],
    };
  }

  if (imagePath) {
    restaurant.image = imagePath.url;
  }

  await restaurant.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        restaurant,
        "Restaurant details updated successfully",
      ),
    );
});

const getMyRestaurant = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  const restaurant = await Restaurant.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              profile: 1,
              phone: 1,
            },
          },
        ],
        as: "ownerDetail",
      },
    },
    {
      $unwind: "$ownerDetail",
    },
  ]);

  if (restaurant.length === 0) {
    throw new ApiError(404, "Restaurant not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, restaurant[0], "Restaurant detail fetched"));
});

const toggleOpen = asyncHandler(async (req, res) => {
  const { isOpen } = req.body;
  const ownerId = req.user._id;
  if (typeof isOpen !== "boolean") {
    throw new ApiError(400, "Restaurant status must be true or false");
  }

  let restaurant;

  if (req.user.role === "admin") {
    restaurant = await Restaurant.findOne({ owner: ownerId });
  } else {
    restaurant = await Restaurant.findOne({ owner: req.user._id });
  }

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  restaurant.isOpen = isOpen;
  await restaurant.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        restaurant,
        `Restaurant is now ${isOpen ? "Open" : "Closed"}`,
      ),
    );
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant does not exist");
  }

  restaurant.isDeleted = !restaurant.isDeleted;
  restaurant.deletedAt = restaurant.isDeleted ? new Date() : null;

  await restaurant.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        restaurant,
        restaurant.isDeleted
          ? "Restaurant deleted successfully"
          : "Restaurant restored successfully",
      ),
    );
});

// show restaurant owner dashboard analytics and plateform analytics

const getOwnerDashboard = asyncHandler(async (req, res) => {

    const ownerId = req.user._id;

    const restaurant = await Restaurant.findOne({
        owner: ownerId,
        isDeleted: false
    });

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    const restaurantId = restaurant._id;

    const totalFoods = await Food.countDocuments({
        restaurant: restaurantId,
        isDeleted: false
    });

    const totalOrders = await Order.countDocuments({
        restaurant: restaurantId
    });

    const pendingOrders = await Order.countDocuments({
        restaurant: restaurantId,
        orderStatus: "PENDING"
    });

    const completedOrders = await Order.countDocuments({
        restaurant: restaurantId,
        orderStatus: "DELIVERED"
    });

    const cancelledOrders = await Order.countDocuments({
        restaurant: restaurantId,
        orderStatus: "CANCELLED"
    });

    const today = new Date();

    today.setHours(0,0,0,0);

    const todayOrders = await Order.countDocuments({
        restaurant: restaurantId,
        createdAt:{
            $gte:today
        }
    });

    const revenue = await Order.aggregate([
        {
            $match:{
                restaurant:restaurantId,
                paymentStatus:"SUCCESS"
            }
        },
        {
            $group:{
                _id:null,
                totalRevenue:{
                    $sum:"$totalAmount"
                }
            }
        }
    ]);

    const totalRevenue = revenue.length ? revenue[0].totalRevenue : 0;

    const todayRevenueData = await Order.aggregate([
        {
            $match:{
                restaurant:restaurantId,
                paymentStatus:"SUCCESS",
                createdAt:{
                    $gte:today
                }
            }
        },
        {
            $group:{
                _id:null,
                revenue:{
                    $sum:"$totalAmount"
                }
            }
        }
    ]);

    const todayRevenue = todayRevenueData.length
        ? todayRevenueData[0].revenue
        : 0;

    const monthlyRevenue = await Order.aggregate([
        {
            $match:{
                restaurant:restaurantId,
                paymentStatus:"SUCCESS"
            }
        },
        {
            $group:{
                _id:{
                    month:{
                        $month:"$createdAt"
                    }
                },
                revenue:{
                    $sum:"$totalAmount"
                }
            }
        },
        {
            $sort:{
                "_id.month":1
            }
        }
    ]);

    const recentOrders = await Order.find({
        restaurant:restaurantId
    })
    .populate("owner","name")
    .sort({createdAt:-1})
    .limit(10);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                restaurant,
                totalFoods,
                totalOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                todayOrders,
                todayRevenue,
                totalRevenue,
                monthlyRevenue,
                recentOrders
            },
            "Dashboard fetched successfully"
        )
    );

});


const getOwnerAnalytics = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const { year = new Date().getFullYear() } = req.query;

    const restaurant = await Restaurant.findOne({
        owner: ownerId,
        isDeleted: false,
    });

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${Number(year) + 1}-01-01`);

    const analytics = await Order.aggregate([
        {
            $match: {
                restaurant: new mongoose.Types.ObjectId(restaurant._id),
                paymentStatus: "SUCCESS", // or orderStatus: "DELIVERED"
                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                },
                totalOrders: {
                    $sum: 1,
                },
                totalRevenue: {
                    $sum: "$totalAmount",
                },
            },
        },
        {
            $sort: {
                "_id.month": 1,
            },
        },
    ]);

    // Month names
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Create all 12 months with default values
    const monthlyAnalytics = months.map((month, index) => ({
        month,
        totalOrders: 0,
        totalRevenue: 0,
    }));

    // Fill actual data
    analytics.forEach((item) => {
        const monthIndex = item._id.month - 1;

        monthlyAnalytics[monthIndex] = {
            month: months[monthIndex],
            totalOrders: item.totalOrders,
            totalRevenue: item.totalRevenue,
        };
    });

    const totalOrders = monthlyAnalytics.reduce(
        (sum, month) => sum + month.totalOrders,
        0
    );

    const totalRevenue = monthlyAnalytics.reduce(
        (sum, month) => sum + month.totalRevenue,
        0
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                year: Number(year),
                totalOrders,
                totalRevenue,
                monthlyAnalytics,
            },
            "Owner analytics fetched successfully"
        )
    );
});


export {
  createRestaurant,
  updateRestaurantDetails,
  getMyRestaurant,
  toggleOpen,
  deleteRestaurant,
  getOwnerDashboard,
  getOwnerAnalytics
};
