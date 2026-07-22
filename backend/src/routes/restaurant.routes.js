import { Router } from "express";
import {createRestaurant, updateRestaurantDetails, getMyRestaurant, toggleOpen, deleteRestaurant, getOwnerAnalytics, getOwnerDashboard} from "../controllers/restaurant.controller.js"
import { verifyAdmin, verifyJWT, verifyOwner } from "../middlewares/auth.middleware.js"
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()
router.use(verifyJWT)

router.post("/", verifyAdmin, upload.single("restaurantImage"), createRestaurant);
router.patch("/", verifyOwner,upload.single("restaurantImage") ,updateRestaurantDetails)
router.get("/", verifyOwner, getMyRestaurant)
router.patch("/toggle-open", verifyOwner, toggleOpen)
router.patch("/:restaurantId/delete", deleteRestaurant)
router.get("/dashboard", verifyOwner, getOwnerDashboard)
router.get("/analytics", verifyOwner ,getOwnerAnalytics)

export default router