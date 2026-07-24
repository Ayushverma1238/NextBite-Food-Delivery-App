import User from "../models/user.model.js";
import Restaurant from "../models/restaurant.model.js";
import Food from "../models/food.model.js";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthNames = [
    "",
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

  const [
    totalUsers,
    totalCustomers,
    totalOwners,
    totalRestaurants,
    totalFoods,
    totalOrders,

    revenue,

    todayRevenue,

    todayOrders,

    pendingOrders,

    deliveredOrders,

    cancelledOrders,

    orderStatus,

    monthlyRevenue,

    weeklyOrders,

    topRestaurants,

    topFoods,

    recentOrders,

    recentUsers,

    recentRestaurants,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({ role: "USER" }),

    User.countDocuments({ role: "OWNER" }),

    Restaurant.countDocuments(),

    Food.countDocuments(),

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

    // Today's Revenue
    Order.aggregate([
      {
        $match: {
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
    ]),

    // Today's Orders
    Order.countDocuments({
      createdAt: {
        $gte: today,
      },
    }),

    Order.countDocuments({
      orderStatus: "PENDING",
    }),

    Order.countDocuments({
      orderStatus: "DELIVERED",
    }),

    Order.countDocuments({
      orderStatus: "CANCELLED",
    }),

    // Order Status Chart
    Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    // Monthly Revenue Chart
    Order.aggregate([
      {
        $match: {
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
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    // Weekly Orders Chart
    Order.aggregate([
      {
        $group: {
          _id: {
            $dayOfWeek: "$createdAt",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
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
          image: "$restaurant.image",
          rating: "$restaurant.rating",
          totalOrders: 1,
          revenue: 1,
        },
      },
    ]),

    // Top Foods
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
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
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
          foodId: "$food._id",
          foodName: "$food.name",
          image: "$food.image",
          category: "$food.category",
          price: "$food.price",
          sold: 1,
          revenue: 1,
          isAvailable: "$food.isAvailable",
        },
      },
    ]),
    // Recent Orders
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id owner restaurant totalAmount status paymentStatus createdAt")
      .populate({
        path: "owner",
        select: "name avatar email",
      })
      .populate({
        path: "restaurant",
        select: "name image rating city",
      }),

    // Recent Users
    User.find({
      role: { $ne: "ADMIN" },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email profile role createdAt"),

    // Recent Restaurants
    Restaurant.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner", "name avatar")
      .select("name image rating city state isOpen createdAt owner"),
  ]);

  const formattedRevenue = monthlyRevenue.map((item) => ({
    month: monthNames[item._id.month],
    revenue: item.revenue,
  }));

  const weekNames = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formattedWeeklyOrders = weeklyOrders.map((item) => ({
    day: weekNames[item._id],
    orders: item.orders,
  }));

  const orderStatusObject = {
    PENDING: 0,
    CONFIRMED: 0,
    PREPARING: 0,
    OUT_FOR_DELIVERY: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  orderStatus.forEach((item) => {
    orderStatusObject[item._id] = item.count;
  });

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

          todayRevenue: todayRevenue[0]?.revenue || 0,

          todayOrders,

          pendingOrders,

          deliveredOrders,

          cancelledOrders,
        },

        charts: {
          monthlyRevenue: formattedRevenue,

          weeklyOrders: formattedWeeklyOrders,

          orderStatus: orderStatusObject,
        },

        topRestaurants,

        topFoods,

        recentOrders,

        recentUsers,

        recentRestaurants,
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
    User.find({
      role: { $ne: "ADMIN" },
    })
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

export const getAnalytics = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();

  const [
    totalUsers,
    totalRestaurants,
    totalOrders,
    totalRevenue,
    activeRestaurants,
    cancelledOrders,
    deliveredOrders,
    monthlyAnalytics,
  ] = await Promise.all([
    User.countDocuments(),

    Restaurant.countDocuments({
      isDeleted: false,
    }),

    Order.countDocuments(),

    Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
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
    ]),

    Restaurant.countDocuments({
      isOpen: true,
      isDeleted: false,
    }),

    Order.countDocuments({
      orderStatus: "CANCELLED",
    }),

    Order.countDocuments({
      orderStatus: "DELIVERED",
    }),

    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          orders: {
            $sum: 1,
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),
  ]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyPerformance = months.map((month, index) => {
    const found = monthlyAnalytics.find((item) => item._id.month === index + 1);

    return {
      month,
      orders: found?.orders || 0,
      revenue: found?.revenue || 0,
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      cards: {
        users: totalUsers,
        restaurants: totalRestaurants,
        orders: totalOrders,
        revenue: totalRevenue[0]?.revenue || 0,
      },

      overview: {
        activeRestaurants,
        cancelledOrders,
        deliveredOrders,
        successRate:
          totalOrders === 0
            ? 0
            : Number(((deliveredOrders / totalOrders) * 100).toFixed(1)),
      },

      monthlyPerformance,
    }),
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
    Restaurant.find({
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

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
    Order.find({})
      .populate("owner", "fullName email")
      .populate("restaurant", "name")
      .populate("address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

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

const getReports = asyncHandler(async (req, res) => {
  const [
    totalRevenue,
    totalOrders,
    cancelledOrders,
    totalRestaurants,
    totalCustomers,
    topRestaurants,
    topCustomers,
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,

    deliveredOrders,
    pendingOrders,
    refundRequests,

    averageOrderValue,
    highestOrder,

    activeRestaurants,
    inactiveRestaurants,

    codOrders,
    onlinePayments,
  ] = await Promise.all([
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
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]),

    // Total Orders
    Order.countDocuments(),

    // Cancelled Orders
    Order.countDocuments({
      orderStatus: "CANCELLED",
    }),

    // Total Restaurants
    Restaurant.countDocuments(),

    // Total Customers
    User.countDocuments({
      role: "USER",
    }),

    // Top Restaurants
    Order.aggregate([
      {
        $match: {
          isDeleted: false,
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
          _id: "$restaurant._id",
          restaurant: {
            $first: "$restaurant.name",
          },
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
    ]),

    // Top Customers
    Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $group: {
          _id: "$customer._id",
          name: {
            $first: "$customer.name",
          },
          email: {
            $first: "$customer.email",
          },
          profile: {
            $first: "$customer.profile",
          },
          totalOrders: {
            $sum: 1,
          },
          totalSpent: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          totalSpent: -1,
        },
      },
      {
        $limit: 5,
      },
    ]),

    // Daily Revenue
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          paymentStatus: "PAID",
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
    ]),

    // Weekly Revenue
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          paymentStatus: "PAID",
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
    ]),

    // Monthly Revenue
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          paymentStatus: "PAID",
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
    ]),

    // Delivered Orders
    Order.countDocuments({
      orderStatus: "DELIVERED",
    }),

    // Pending Orders
    Order.countDocuments({
      orderStatus: "PENDING",
    }),

    // Refund Requests
    Order.countDocuments({
      paymentStatus: "REFUNDED",
    }),

    // Average Order Value
    Order.aggregate([
      {
        $group: {
          _id: null,
          averageOrderValue: {
            $avg: "$totalAmount",
          },
        },
      },
    ]),

    // Highest Order
    Order.aggregate([
      {
        $group: {
          _id: null,
          highestOrder: {
            $max: "$totalAmount",
          },
        },
      },
    ]),

    // Active Restaurants
    Restaurant.countDocuments({
      isDeleted: false,
      isOpen: true,
    }),

    // Inactive Restaurants
    Restaurant.countDocuments({
      $or: [
        {
          isDeleted: true,
        },
        {
          isOpen: false,
        },
      ],
    }),

    // COD Orders
    Order.countDocuments({
      paymentMethod: "COD",
    }),

    // Online Payments
    Order.countDocuments({
      paymentMethod: "RAZORPAY",
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalRevenue: totalRevenue[0]?.revenue || 0,
          totalOrders,
          totalRestaurants,
          totalCustomers,
          deliveredOrders,
          pendingOrders,
          cancelledOrders,
          refundRequests,
        },

        revenue: {
          today: dailyRevenue[0]?.revenue || 0,
          weekly: weeklyRevenue[0]?.revenue || 0,
          monthly: monthlyRevenue[0]?.revenue || 0,
        },

        topRestaurants,

        topCustomers,

        statistics: {
          averageOrderValue: Math.round(
            averageOrderValue[0]?.averageOrderValue || 0,
          ),

          highestOrder: highestOrder[0]?.highestOrder || 0,

          activeRestaurants,

          inactiveRestaurants,

          codOrders,

          onlinePayments,
        },
      },
      "Reports fetched successfully",
    ),
  );
});

export {
  getDashboardAnalytics,
  getAllUsers,
  blockUser,
  unblockUser,
  getRecentActivities,
  getAdminProfile,
  getAllPayment,
  getAllRestaurant,
  getAllOrder,
  getReports,
};
