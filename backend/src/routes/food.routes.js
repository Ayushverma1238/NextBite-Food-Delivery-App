import { Router } from "express";
import {
  addFoodIntoRestaurant,
  changeAvailabilityFood,
  deleteFood,
  getAllFood,
  getFoodDetail,
  getRestaurantMenu,
  updateFoodDetail,
} from "../controllers/food.controller.js";
import { verifyJWT, verifyOwner } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.post(
  "/",
  verifyJWT,
  verifyOwner,
  upload.single("foodImage"),
  addFoodIntoRestaurant,
);

router.patch(
  "/:foodId/update",
  verifyJWT,
  verifyOwner,
  upload.single("foodImage"),
  updateFoodDetail,
);

router.patch(
  "/:foodId/available",
  verifyJWT,
  verifyOwner,
  changeAvailabilityFood,
);

router.delete("/delete-food/:foodId", verifyJWT, verifyOwner, deleteFood);

router.get("/", getAllFood);
router.get("/:foodId/detail", getFoodDetail);

router.get("/:restaurantId/menu", getRestaurantMenu);

export default router;
