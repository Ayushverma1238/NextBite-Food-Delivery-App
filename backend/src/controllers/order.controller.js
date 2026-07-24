import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Address from "../models/address.model.js";
import Restaurant from '../models/restaurant.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  const userId = req.user._id;

  if (!addressId) {
    throw new ApiError(400, "Address is required");
  }

  // Find user's cart
  const cart = await Cart.findOne({ owner: userId }).populate("items.food");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Find address
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Create item snapshot
  const orderItems = cart.items.map((item) => ({
    food: item.food._id,
    name: item.food.name,
    image: item.food.image,
    price: item.food.price,
    quantity: item.quantity,
  }));

  // Calculate totals
  const itemTotal = cart.totalAmount;

  const deliveryFee = 40;
  const tax = Math.round(itemTotal * 0.05);
  const discount = 0;

  const totalAmount = itemTotal + deliveryFee + tax - discount;

  // Create order
  const order = await Order.create({
    owner: userId,
    restaurant: cart.restaurant,
    address: address._id,

    deliveryAddress: {
      fullName: address.fullName,
      phone: address.phone,
      houseNo: address.houseNo,
      street: address.street,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      latitude: address.latitude,
      longitude: address.longitude,
    },

    items: orderItems,

    itemTotal,
    deliveryFee,
    tax,
    discount,
    totalAmount,
  });

  await Cart.findByIdAndDelete(cart._id);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getAllPlacedOrder = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const orders = await Order.aggregate([
    {
      $match: {
        owner: ownerId,
        isDeleted: false,
      },
    },

    // Address
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },

    {
      $unwind: "$address",
    },

    // Restaurant
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant",
        pipeline: [
          {
            $project: {
              name: 1,
              image: 1,
              description: 1,
              address: 1,
              city: 1,
              rating: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: "$restaurant",
    },

    // Total quantity of items
    {
      $addFields: {
        totalItems: {
          $sum: "$items.quantity",
        },
      },
    },

    // Final response
    {
      $project: {
        owner: 0,
        __v: 0,
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!["PENDING", "ACCEPTED"].includes(order.orderStatus)) {
    throw new ApiError(400, "This order can no longer be cancelled");
  }

  order.orderStatus = "CANCELLED";
  order.cancelledAt = new Date();

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findByIdAndUpdate(
    orderId,

    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  if (!order) {
    throw new ApiError(404, "Order is not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order deleted successfully"));
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  console.log("URL:", req.originalUrl);
console.log("Params:", req.params);

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id");
  }

  const order = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
        owner: req.user._id,
        isDeleted: false,
      },
    },

    // Order Owner
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "orderOwner",
        pipeline: [
          {
            $project: {
              name: 1,
              image: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$orderOwner",
    },

    // Address
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    {
      $unwind: "$address",
    },

    // Restaurant
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant",
        pipeline: [
          {
            $project: {
              name: 1,
              image: 1,
              phone: 1,
              address: 1,
              city: 1,
              state: 1,
              pincode: 1,
              location: 1,
              rating: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$restaurant",
    },

    // Calculate total quantity
    {
      $addFields: {
        totalItems: {
          $sum: "$items.quantity",
        },
      },
    },

    // Remove unwanted fields
    {
      $project: {
        __v: 0,
        owner: 0,
      },
    },
  ]);

  if (!order.length) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order[0], "Order details fetched successfully"));
});

const changeOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid Order ID");
  }

  const allowedStatus = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!allowedStatus.includes(orderStatus)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // ✅ Add this block HERE
  const nextStatus = {
    PENDING: "CONFIRMED",
    CONFIRMED: "PREPARING",
    PREPARING: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
    DELIVERED: null,
  };

  if (nextStatus[order.orderStatus] !== orderStatus) {
    throw new ApiError(
      400,
      `Order can only move from ${order.orderStatus} to ${nextStatus[order.orderStatus]}`
    );
  }

  // Update status
  order.orderStatus = orderStatus;

  switch (orderStatus) {
    case "CONFIRMED":
      order.acceptedAt = new Date();
      break;

    case "PREPARING":
      order.preparingAt = new Date();
      break;

    case "OUT_FOR_DELIVERY":
      order.outForDeliveryAt = new Date();
      break;

    case "DELIVERED":
      order.deliveredAt = new Date();
      break;

    default:
      break;
  }

  await order.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      order,
      "Order status updated successfully"
    )
  );
});

const getOwnerOrder = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const restaurant = await Restaurant.findOne({
    owner: ownerId,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const orders = await Order.find({
    restaurant: restaurant._id,
  })
    .populate("owner", "fullName phone email avatar")
    .populate("address")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, "Restaurant orders fetched successfully"),
    );
});

export {
  createOrder,
  getAllPlacedOrder,
  cancelOrder,
  deleteOrder,
  getOrderDetails,
  changeOrderStatus,
  getOwnerOrder,
};
