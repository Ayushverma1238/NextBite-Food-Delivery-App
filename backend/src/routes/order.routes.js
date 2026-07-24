import { Router }from "express";
import {
  cancelOrder,
  changeOrderStatus,
  createOrder,
  deleteOrder,
  getAllPlacedOrder,
  getOrderDetails,
  getOwnerOrder,
} from "../controllers/order.controller.js";
import { verifyJWT, verifyOwner } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.post("/", createOrder)

router.get("/", getAllPlacedOrder);
router.patch("/:orderId/cancel", cancelOrder);
router.patch("/:orderId/delete", deleteOrder);
router.patch("/:orderId/status", verifyJWT, verifyOwner, changeOrderStatus)
router.get("/:orderId/detail", getOrderDetails);
router.get("/owner-order", verifyJWT, verifyOwner, getOwnerOrder)



export default router;
