import { Router }from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  getAllAddresses,
  makeAddressDefault,
  updateAddress,
} from "../controllers/address.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.post("/", addAddress);
router.patch("/:addressId/update", updateAddress);
router.get("/", getAllAddresses);
router.delete("/:addressId/delete", deleteAddress);
router.get("/:addressId", getAddress);
router.patch("/:addressId/make-default", makeAddressDefault);

export default router;
