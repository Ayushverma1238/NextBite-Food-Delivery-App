import { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
  getPaymentDetails,
  updatePaymentStatus,
  getAllPayments,
  getOrderDetail,
} from "../controllers/payment.controller.js";

import {
  verifyJWT,
  verifyAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Customer
router.post("/", verifyJWT, createPaymentOrder);

router.post("/verify", verifyJWT, verifyPayment);

router.get("/", verifyJWT, getMyPayments);

router.get("/:paymentId", verifyJWT, getPaymentDetails);

router.get("/:orderId/order-payment", verifyJWT , getOrderDetail)

// Admin
router.get("/admin", verifyJWT, verifyAdmin, getAllPayments);

router.patch(
  "/:paymentId/status",
  verifyJWT,
  verifyAdmin,
  updatePaymentStatus
);

export default router;