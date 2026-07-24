import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyCart from "../../components/cart/EmptyCart";
import axiosInstance from "../../api/axios";
import { Plus, Minus } from "lucide-react";
import { useDispatch } from "react-redux";
import { totalCartItem } from "../../feature/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatcher = useDispatch()

  const getCart = async () => {
    try {
      const res = await axiosInstance.get("/cart", {
        withCredentials: true,
      });

      dispatcher(totalCartItem(res.data.data.items.length))
      // Change this according to your API response
      setCartItems(res.data.data.items || []);
    } catch (error) {
      console.log(error);
      toast.success("Please add food into the cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const increaseQuantity = async (foodId, quantity) => {
    try {
      await axiosInstance.patch(
        `/cart/${foodId}`,
        {
          quantity: quantity + 1,
        },
        {
          withCredentials: true,
        },
      );

      getCart();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const decreaseQuantity = async (foodId, quantity) => {
    if (quantity === 1) {
      removeItem(foodId);
      return;
    }

    try {
      await axiosInstance.patch(
        `/cart/${foodId}`,
        {
          quantity: quantity - 1,
        },
        {
          withCredentials: true,
        },
      );
      getCart()
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const removeItem = async (foodId) => {
    try {
      await axiosInstance.delete(`/cart/${foodId}/delete`, {
        withCredentials: true,
      });

      toast.success("Item removed");
      getCart();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete("/cart", {
        withCredentials: true,
      });

      toast.success("Cart cleared");
      getCart();
    } catch (error) {
      console.log(error.response.message);
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex py-10 items-center justify-between px-10">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <button
          onClick={() => clearCart}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.foodId}
            className="flex items-center justify-between border rounded-xl p-4 shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>

                <p className="text-gray-500">₹{item.price}</p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => decreaseQuantity(item.foodId, item.quantity)}
                    className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    <Minus />
                  </button>

                  <span className="font-bold text-lg">{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.foodId, item.quantity)}
                    className="bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => removeItem(item.foodId)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Bill Summary</h2>

        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>Delivery Fee</span>
          <span>₹40</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>GST (5%)</span>
          <span>₹{Math.round(subtotal * 0.05)}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹{subtotal + 40 + Math.round(subtotal * 0.05)}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
