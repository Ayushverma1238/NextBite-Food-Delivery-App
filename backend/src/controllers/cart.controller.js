import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Cart from "../models/cart.model.js";
import Restaurant from "../models/restaurant.model.js";
import Food from "../models/food.model.js";

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.aggregate([
    {
      $match: {
        owner: userId,
      },
    },

    // Restaurant Details
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant",
        pipeline: [
          {
            $project: {
              name: 1,
              logo: 1,
              coverImage: 1,
              address: 1,
              deliveryTime: 1,
              rating: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: "$restaurant",
    },

    // Food Details
    {
      $lookup: {
        from: "foods",
        localField: "items.food",
        foreignField: "_id",
        as: "foodDetails",
      },
    },

    // Merge quantity with food
    {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              $let: {
                vars: {
                  food: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$foodDetails",
                          as: "food",
                          cond: {
                            $eq: ["$$food._id", "$$item.food"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  foodId: "$$food._id",
                  name: "$$food.name",
                  image: "$$food.image",
                  price: "$$food.price",
                  discountPrice: "$$food.discountPrice",
                  quantity: "$$item.quantity",
                  subtotal: {
                    $multiply: ["$$food.price", "$$item.quantity"],
                  },
                },
              },
            },
          },
        },
      },
    },

    // Cart Totals
    {
      $addFields: {
        totalItems: {
          $sum: "$items.quantity",
        },
        totalPrice: {
          $sum: "$items.subtotal",
        },
      },
    },

    {
      $project: {
        foodDetails: 0,
        owner: 0,
        __v: 0,
      },
    },
  ]);

  if (!cart.length) {
    throw new ApiError(404, "Cart is empty");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart[0], "Cart fetched successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
  const { quantity = 1 } = req.body;
  const { foodId } = req.params;
  const userId = req.user._id;

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // Find food
  const food = await Food.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  // Find user's cart
  let cart = await Cart.findOne({ owner: userId });

  // No cart -> Create one
  if (!cart) {
    cart = await Cart.create({
      owner: userId,
      restaurant: food.restaurant,
      items: [
        {
          food: food._id,
          quantity,
        },
      ],
      totalAmount: food.price * quantity,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, cart, "Item added to cart"));
  }

  // Different restaurant
  if (cart.restaurant.toString() !== food.restaurant.toString()) {
    throw new ApiError(
      400,
      "Your cart contains items from another restaurant. Please clear your cart or place your current order first.",
    );
  }

  // Check if item already exists
  const item = cart.items.find((item) => item.food.toString() === foodId);

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({
      food: food._id,
      quantity,
    });
  }

  // Recalculate total amount
  await cart.populate("items.food");

  cart.totalAmount = cart.items.reduce((total, item) => {
    return total + item.food.price * item.quantity;
  }, 0);

  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  const userId = req.user._id;

  const cart = await Cart.findOne({ owner: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find the item before removing it
  const item = cart.items.find(
    (item) => item.food.toString() === foodId
  );

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Get food price
  const food = await Food.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  // Subtract its total from cart
  cart.totalAmount -= food.price * item.quantity;

  // Remove item
  cart.items = cart.items.filter(
    (item) => item.food.toString() !== foodId
  );

  // Delete cart if empty
  if (cart.items.length === 0) {
    await Cart.findByIdAndDelete(cart._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Cart is empty and removed"));
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed successfully"));
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const deletedCart = await Cart.findOneAndDelete({
    owner: userId,
  });

  if (!deletedCart) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Cart cleared successfully"));
});

const updateCartQuantity = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({
    owner: req.user._id,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find(
    (item) => item.food.toString() === foodId
  );

  if (!item) {
    throw new ApiError(404, "Food not found in cart");
  }

  const food = await Food.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  // Store old quantity
  const oldQuantity = item.quantity;

  // Update quantity
  item.quantity = Number(quantity);

  // Update total amount
  cart.totalAmount += (item.quantity - oldQuantity) * food.price;

  await cart.save();

  return res.status(200).json(
    new ApiResponse(200, cart, "Quantity updated")
  );
});

export { getCart, addToCart, removeCartItem, clearCart, updateCartQuantity };
