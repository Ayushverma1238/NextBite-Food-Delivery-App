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
  console.log(req.body);
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
    owner: user?._id,
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
    owner: user?._id,
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

  const restaurant = await Restaurant.findOne({
    owner: ownerId,
    isDeleted: false,
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
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const restaurantId = restaurant._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 6);
  lastWeek.setHours(0, 0, 0, 0);

  // =============================
  // Dashboard Statistics
  // =============================

  const [
    totalFoods,
    totalOrders,
    pendingOrders,
    preparingOrders,
    outForDeliveryOrders,
    completedOrders,
    cancelledOrders,
    todayOrders,
  ] = await Promise.all([
    Food.countDocuments({
      restaurant: restaurantId,
      isDeleted: false,
    }),

    Order.countDocuments({
      restaurant: restaurantId,
    }),

    Order.countDocuments({
      restaurant: restaurantId,
      orderStatus: "PENDING",
    }),

    Order.countDocuments({
      restaurant: restaurantId,
      orderStatus: "PREPARING",
    }),

    Order.countDocuments({
      restaurant: restaurantId,
      orderStatus: "OUT_FOR_DELIVERY",
    }),

    Order.countDocuments({
      restaurant: restaurantId,
      orderStatus: "DELIVERED",
    }),

    Order.countDocuments({
      restaurant: restaurantId,
      orderStatus: "CANCELLED",
    }),

    Order.countDocuments({
      restaurant: restaurantId,
      createdAt: {
        $gte: today,
      },
    }),
  ]);

  // =============================
  // Revenue
  // =============================

  const revenueData = await Order.aggregate([
    {
      $match: {
        restaurant: restaurantId,
        paymentStatus: "PAID",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  const todayRevenueData = await Order.aggregate([
    {
      $match: {
        restaurant: restaurantId,
        paymentStatus: "PAID",
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  const todayRevenue =
    todayRevenueData.length > 0 ? todayRevenueData[0].revenue : 0;

  // =============================
  // Monthly Revenue
  // =============================

  const monthlyRevenueDB = await Order.aggregate([
    {
      $match: {
        restaurant: restaurantId,
        paymentStatus: "PAID",
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: "$createdAt",
          },
        },
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

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

  const monthlyRevenue = months.map((month, index) => {
    const found = monthlyRevenueDB.find((item) => item._id.month === index + 1);

    return {
      month,
      revenue: found ? found.revenue : 0,
    };
  });

  // =============================
  // Weekly Revenue
  // =============================

  const weeklyRevenue = await Order.aggregate([
    {
      $match: {
        restaurant: restaurantId,
        paymentStatus: "PAID",
        createdAt: {
          $gte: lastWeek,
        },
      },
    },
    {
      $group: {
        _id: {
          day: {
            $dayOfWeek: "$createdAt",
          },
        },
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
    {
      $sort: {
        "_id.day": 1,
      },
    },
  ]);

  // =============================
  // Order Status Analytics
  // =============================

  const orderStatusAnalytics = await Order.aggregate([
    {
      $match: {
        restaurant: restaurantId,
      },
    },
    {
      $group: {
        _id: "$orderStatus",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // =============================
  // Top Selling Foods
  // =============================

  const topFoods = await Order.aggregate([
    {
      $match: {
        restaurant: restaurantId,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.food",
        name: {
          $first: "$items.name",
        },
        image: {
          $first: "$items.image",
        },
        totalSold: {
          $sum: "$items.quantity",
        },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  // =============================
  // Recent Orders
  // =============================

  const recentOrders = await Order.find({
    restaurant: restaurantId,
  })
    .populate("owner", "name avatar")
    .populate("address")
    .sort({
      createdAt: -1,
    })
    .limit(10);

  // =============================
  // Response
  // =============================

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        restaurant,

        statistics: {
          totalFoods,
          totalOrders,
          todayOrders,
          pendingOrders,
          preparingOrders,
          outForDeliveryOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
          todayRevenue,
        },

        monthlyRevenue,

        weeklyRevenue,

        orderStatusAnalytics,

        topFoods,

        recentOrders,
      },
      "Dashboard analytics fetched successfully",
    ),
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
        paymentStatus: "PAID", // or orderStatus: "DELIVERED"
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
    0,
  );

  const totalRevenue = monthlyAnalytics.reduce(
    (sum, month) => sum + month.totalRevenue,
    0,
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
      "Owner analytics fetched successfully",
    ),
  );
});

const getRestaurantDetails = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant detail fetched"));
});

export const blockRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  restaurant.isOpen = false;

  await restaurant.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant blocked successfully"));
});

export const unblockRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  restaurant.isOpen = true;

  await restaurant.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, restaurant, "Restaurant unblocked successfully"),
    );
});

export {
  createRestaurant,
  updateRestaurantDetails,
  getMyRestaurant,
  toggleOpen,
  deleteRestaurant,
  getOwnerDashboard,
  getOwnerAnalytics,
};
