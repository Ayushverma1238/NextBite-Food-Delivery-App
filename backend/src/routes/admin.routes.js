import { Router }from "express";
const router = Router();
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  blockUser,
  getAdminProfile,
  getAllPayment,
  getAllUsers,
  getDashboardAnalytics,
  getPlateformAnalytics,
  getRecentActivities,
  getUserDetail,
  getAllRestaurant,
  unblockUser,
  getAllOrder,
} from "../controllers/admin.controller.js";

import {
  createRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";

router.use(verifyJWT, verifyAdmin);

router.get("/dashboard-analytics", getDashboardAnalytics);
router.get("/users", getAllUsers);
router.get("/:userId/user-detail", getUserDetail);
router.patch("/block-user/:userId", blockUser);
router.patch("/unblock-user/:userId", unblockUser);
router.get("/plateform-analytics", getPlateformAnalytics);
router.get("/recent-activities", getRecentActivities);
router.get("/", getAdminProfile);
router.get("/all-payments", getAllPayment);
router.get("/all-restaurant", getAllRestaurant);
router.get("/all-order", getAllOrder);

router.post("/create-restaurant", createRestaurant);
router.delete("/delete-restaurant/:restaurantId", deleteRestaurant);

export default router;
