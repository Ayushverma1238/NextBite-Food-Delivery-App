import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default:0
    }
    
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

// POST /cart/add – Add an item (includes the restaurant check)
// GET /cart – Get the current cart
// PATCH /cart/update/:foodId – Update item quantity
// DELETE /cart/remove/:foodId – Remove a single item
// DELETE /cart/clear – Clear the entire cart
// POST /order – Place the order (and clear the cart after a successful order)
