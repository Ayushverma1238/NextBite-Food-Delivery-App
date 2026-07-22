import User from "../models/user.model.js";
import Restaurant from "../models/restaurant.model.js";
import Food from "../models/food.model.js";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCustomers,
    totalOwners,
    totalRestaurants,
    totalFoods,
    totalOrders,

    revenue,

    todayOrders,

    orderStatus,

    monthlyRevenue,

    topRestaurants,

    topFoods,

    recentOrders,
  ] = await Promise.all([
    // Total Users
    User.countDocuments(),

    // Customers
    User.countDocuments({
      role: "USER",
    }),

    // Restaurant Owners
    User.countDocuments({
      role: "OWNER",
    }),

    // Restaurants
    Restaurant.countDocuments(),

    // Foods
    Food.countDocuments(),

    // Orders
    Order.countDocuments(),

    // Total Revenue
    Order.aggregate([
      {
        $match: {
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
    ]),

    // Today's Orders
    Order.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    }),

    // Order Status
    Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    // Monthly Revenue
    Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]),

    // Top Restaurants
    Order.aggregate([
      {
        $group: {
          _id: "$restaurant",
          totalOrders: {
            $sum: 1,
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: "$restaurant",
      },
      {
        $project: {
          _id: 0,
          restaurantName: "$restaurant.name",
          totalOrders: 1,
          revenue: 1,
        },
      },
    ]),

    // Top Selling Foods
    Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.food",
          sold: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          sold: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "food",
        },
      },
      {
        $unwind: "$food",
      },
      {
        $project: {
          _id: 0,
          foodName: "$food.name",
          sold: 1,
        },
      },
    ]),

    // Recent Orders
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner", "name")
      .populate("restaurant", "name"),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        cards: {
          totalUsers,
          totalCustomers,
          totalOwners,
          totalRestaurants,
          totalFoods,
          totalOrders,
          totalRevenue: revenue[0]?.totalRevenue || 0,
          todayOrders,
        },

        charts: {
          monthlyRevenue,
          orderStatus,
        },

        topRestaurants,

        topFoods,

        recentOrders,
      },
      "Dashboard analytics fetched successfully",
    ),
  );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    User.find({})
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
      },
      "Users fetched successfully",
    ),
  );
});

const getUserDetail = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully"));
});

const blockUser = asyncHandler(async (req, res) => {
  const userId = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.isActive = "UNACTIVE";
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, "User blocked"));
});

const unblockUser = asyncHandler(async (req, res) => {
  const userId = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.isActive = "ACTIVE";
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, "User blocked"));
});

const getPlateformAnalytics = asyncHandler(async (req, res) => {
  const [monthlyRevenue, monthlyOrder, monthlyUser] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]),

    Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },
    ]),
    User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalUsers: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { monthlyOrder, monthlyRevenue, monthlyUser },
        "Plateform data fetch successfully",
      ),
    );
});

const getRecentActivities = asyncHandler(async (req, res) => {
  const [users, restaurants, orders] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(5).select("name createdAt"),

    Restaurant.find().sort({ createdAt: -1 }).limit(5).select("name createdAt"),

    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner", "name")
      .populate("restaurant", "name"),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        recentUsers: users,
        recentRestaurants: restaurants,
        recentOrders: orders,
      },
      "Recent activities fetched successfully",
    ),
  );
});

const getAdminProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const admin = await User.findById(userId).select("-password -refreshToken");
  if (!admin) {
    throw new ApiError(404, "Admin is not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Admin data fetched successfully"));
});

const getAllPayment = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [payments, totalPayments] = await Promise.all([
    Payment.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Payment.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        payments,
        totalPayments,
        currentPage: page,
        totalPages: Math.ceil(totalPayments / limit),
      },
      "Payment fetched successfully",
    ),
  );
});

const getAllRestaurant = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [restaurants, totalRestaurants] = await Promise.all([
    Restaurant.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Restaurant.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        restaurants,
        totalRestaurants,
        currentPage: page,
        totalPages: Math.ceil(totalRestaurants / limit),
      },
      "Restaurant fetched successfully",
    ),
  );
});


const getAllOrder = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, totalOrders] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Order.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
      },
      "Orders fetched successfully",
    ),
  );
});



export {
  getDashboardAnalytics,
  getAllUsers,
  getUserDetail,
  blockUser,
  unblockUser,
  getPlateformAnalytics,
  getRecentActivities,
  getAdminProfile,
  getAllPayment,
  getAllRestaurant,
  getAllOrder,
};
