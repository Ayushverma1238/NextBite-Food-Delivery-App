import { Router } from "express";
const router = Router();

import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

import {
  blockUser,
  unblockUser,
  getAdminProfile,
  getAllPayment,
  getAllUsers,
  getDashboardAnalytics,
  getRecentActivities,
  getAllRestaurant,
  getAllOrder,
  getReports,
  getAnalytics,
} from "../controllers/admin.controller.js";

import {
  createRestaurant,
  deleteRestaurant,
  blockRestaurant,
  unblockRestaurant,
} from "../controllers/restaurant.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

router.use(verifyJWT, verifyAdmin);

// ================= Dashboard =================
router.get("/dashboard-analytics", getDashboardAnalytics);
router.get("/recent-activities", getRecentActivities);
router.get("/", getAdminProfile);
router.get("/analytics", verifyJWT, verifyAdmin, getAnalytics);

// ================= Users =================
router.get("/users", getAllUsers);
router.patch("/block-user/:userId", blockUser);
router.patch("/unblock-user/:userId", unblockUser);

// ================= Payments =================
router.get("/payments", getAllPayment);

// ================= Orders =================
router.get("/orders", getAllOrder);

// ================= Restaurants =================
router.get("/restaurants", getAllRestaurant);

router.post("/create-restaurant", upload.single("image"), createRestaurant);

router.patch("/block-restaurant/:restaurantId", blockRestaurant);

router.patch("/unblock-restaurant/:restaurantId", unblockRestaurant);

router.delete("/delete-restaurant/:restaurantId", deleteRestaurant);

router.get("/report", getReports);

export default router;
