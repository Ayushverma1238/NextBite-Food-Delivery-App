import { Router }from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartQuantity,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.get("/", getCart);

router.post("/:foodId", addToCart);

router.patch("/:foodId", updateCartQuantity);

router.delete("/:foodId/delete", removeCartItem);

router.delete("/", clearCart);

export default router;
