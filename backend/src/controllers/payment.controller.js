import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import razorpay from "../utils/razorpay.js";

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;
  const userId = req.user._id;

  // Validate payment method
  if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
    throw new ApiError(400, "Invalid payment method");
  }

  // Find order
  const order = await Order.findOne({
    _id: orderId,
    owner: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Prevent payment for cancelled/delivered orders
  if (
    ["CANCELLED", "DELIVERED"].includes(order.orderStatus)
  ) {
    throw new ApiError(
      400,
      `Payment cannot be created for a ${order.orderStatus.toLowerCase()} order`
    );
  }

  // Prevent duplicate payment if already paid
  if (order.paymentStatus === "PAID") {
    throw new ApiError(400, "Order is already paid");
  }

  // Check existing payment
  const existingPayment = await Payment.findOne({
    order: orderId,
  });

  if (existingPayment) {
    throw new ApiError(400, "Payment already exists for this order");
  }

  // ==================== COD ====================

  if (paymentMethod === "COD") {
    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: order.totalAmount,
      currency: "INR",
      paymentMethod: "COD",
      status: "PENDING",
    });

    // Update order
    order.paymentStatus = "PENDING";
    order.paymentMethod = "COD"
    // Uncomment below if your business logic auto-confirms orders
    // order.orderStatus = "CONFIRMED";

    await order.save();

    return res.status(201).json(
      new ApiResponse(
        201,
        payment,
        "Cash on Delivery selected successfully"
      )
    );
  }

  // ==================== Razorpay ====================

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100), // paise
      currency: "INR",
      receipt: `order_${order._id.toString().slice(-10)}`,
    });

    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: order.totalAmount,
      currency: "INR",
      paymentMethod: "RAZORPAY",
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "PENDING",
    });

    // Update order payment status
    order.paymentStatus = "PENDING";
    order.paymentMethod = "RAZORPAY"
    await order.save();

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID,
          paymentId: payment._id,
        },
        "Payment order created successfully"
      )
    );
  } catch (error) {
    console.error("Razorpay Error:", error);

    throw new ApiError(
      500,
      "Failed to create Razorpay payment order"
    );
  }
});


const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // Validate request
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new ApiError(400, "All payment details are required");
  }

  // Verify Razorpay signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    // Update payment as failed if payment record exists
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: "FAILED",
        failureReason: "Invalid payment signature",
      }
    );

    throw new ApiError(400, "Invalid payment signature");
  }

  // Find payment
  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  // Prevent duplicate verification
  if (payment.paymentStatus === "SUCCESS") {
    return res.status(200).json(
      new ApiResponse(200, payment, "Payment already verified")
    );
  }

  // Update payment
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.paymentStatus = "SUCCESS";
  payment.paidAt = new Date();

  await payment.save();

  // Update order
  const order = await Order.findById(payment.order);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = "PAID";
  order.orderStatus = "CONFIRMED";

  await order.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        payment,
        order,
      },
      "Payment verified successfully"
    )
  );
});

const getPaymentDetails = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId)
    .populate({
      path: "order",
      populate: {
        path: "restaurant owner",
      },
    })
    .populate("user", "name email phone");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment fetched successfully"));
});

const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    user: req.user._id,
  })
    .populate("order")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "Payments fetched successfully"));
});

// FOR ADMIN TO UPDATE ORDER STATUS
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { status } = req.body;

  const allowedStatus = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid payment status");
  }

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  payment.status = status;

  if (status === "SUCCESS") {
    payment.paidAt = new Date();
  }

  await payment.save();

  const orderUpdate = {};

  switch (status) {
    case "SUCCESS":
      orderUpdate.paymentStatus = "SUCCESS";
      orderUpdate.orderStatus = "CONFIRMED";
      break;

    case "FAILED":
      orderUpdate.paymentStatus = "FAILED";
      orderUpdate.orderStatus = "PENDING";
      break;

    case "REFUNDED":
      orderUpdate.paymentStatus = "REFUNDED";
      orderUpdate.orderStatus = "CANCELLED";
      break;

    case "PENDING":
      orderUpdate.paymentStatus = "PENDING";
      orderUpdate.orderStatus = "PENDING";
      break;
  }

  await Order.findByIdAndUpdate(payment.order, orderUpdate);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        payment,
        `Payment status updated to ${status} successfully`,
      ),
    );
});

const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("order")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "All payments fetched successfully"));
});

const getOrderDetail = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const paymentDetail = await Payment.findOne({
    order: orderId,
    user: userId,
  });

  if (!paymentDetail) {
    throw new ApiError(404, "Payment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, paymentDetail, "Payment detail fetched"));
});

export {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
  getPaymentDetails,
  updatePaymentStatus,
  getAllPayments,
  getOrderDetail,
};
