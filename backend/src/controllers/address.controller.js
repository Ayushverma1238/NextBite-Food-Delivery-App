import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Address from "../models/address.model.js";

const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    label,
    fullName,
    phone,
    houseNo,
    street,
    landmark,
    city,
    state,
    pincode,
    latitude,
    longitude,
    isDefault,
  } = req.body;

  if (
    !fullName ||
    !phone ||
    !city ||
    !houseNo ||
    !street ||
    !state ||
    !pincode ||
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new ApiError(400, "All field is required");
  }

  if (isDefault) {
    await Address.updateMany(
      { user: userId },
      {
        $set: {
          isDefault: false,
        },
      },
    );
  }

  const count = await Address.countDocuments({ user: userId });

  if (count >= 10) {
    throw new ApiError(400, "You can save a maximum of 10 addresses.");
  }

  const address = await Address.create({
    user: userId,
    label,
    fullName,
    phone,
    houseNo,
    street,
    landmark,
    city,
    state,
    pincode,
    latitude,
    longitude,
    label,
    isDefault,
  });

  if (!address) {
    throw new ApiError(400, "Error adding a address");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, address, "New address added"));
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const address = await Address.findOne({
    _id: addressId,
    user: req.user._id,
  });

  console.log("Body:", req.body);
  console.log("Params:", req.params);
  console.log("Headers:", req.headers["content-type"]);
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  const allowedFields = [
    "label",
    "fullName",
    "phone",
    "houseNo",
    "street",
    "landmark",
    "city",
    "state",
    "pincode",
    "latitude",
    "longitude",
  ];

  // Update only allowed fields
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      address[field] = req.body[field];
    }
  });

  // Handle default address
  if (req.body.isDefault === true) {
    await Address.updateMany(
      {
        user: req.user._id,
        _id: { $ne: addressId }, // Exclude current address
      },
      {
        $set: { isDefault: false },
      },
    );

    address.isDefault = true;
  }

  await address.save();

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});

const getAllAddresses = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const addresses = await Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addresses,
        `${
          addresses.length !== 0
            ? "Addresses fetched successfully"
            : "No addresses found"
        }`,
      ),
    );
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;

  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "No address found at this id");
  }
  if (address?.isDefault) {
    const anotherAddress = await Address.findOne({
      user: userId,
    });

    if (anotherAddress) {
      anotherAddress.isDefault = true;
      await anotherAddress.save();
    }
  }

  return res.status(200).json(new ApiResponse(200, {}, "Address deleted"));
});

const getAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized. Please login again.");
  }

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address fetched successfully"));
});

const makeAddressDefault = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;

  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  await Address.updateMany(
    {
      user: userId,
    },
    {
      $set: {
        isDefault: false,
      },
    },
  );

  address.isDefault = true;

  await address.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, address, "Default address updated successfully"),
    );
});

export {
  addAddress,
  updateAddress,
  getAllAddresses,
  deleteAddress,
  getAddress,
  makeAddressDefault,
};
