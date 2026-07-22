import { Router }from "express";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllPlacedOrder,
  getOrderDetails,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.post("/", createOrder)

router.get("/", getAllPlacedOrder);
router.patch("/:orderId/cancel", cancelOrder);
router.patch("/:orderId/delete", deleteOrder);
router.get("/:orderId", getOrderDetails);

export default router;
