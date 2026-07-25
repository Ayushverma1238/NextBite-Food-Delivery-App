import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { totalCartItem } from "../../feature/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const MenuItem = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(item)
  const handleAddToCart = async (id) => {
    if (!isAuthenticated) {
      toast.success("You are not login! please Login");
      navigate("/login");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/cart/${id}`,
        { quantity },
        {
          withCredentials: true,
        },
      );

      const cartRes = await axiosInstance.get("/cart", {
        withCredentials: true,
      });
      // console.log(cartRes)
      dispatch(totalCartItem(cartRes.data.data.items.length));

      toast.success("Food added into cart");
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">
        <h3 className="text-2xl font-bold">{item.name}</h3>

        <p className="text-gray-500 mt-2 line-clamp-2">{item.description}</p>
        <div className="flex items-center py-4 gap-5">
          <label className="text-sm font-semibold" htmlFor="quantity">
            Quantity
          </label>
          <input
            type="Number"
            value={quantity}
            name="quantity"
            className="focus:outline-pink-500 ring-1 px-3 rounded-2xl ring-gray-300"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <span className="text-2xl font-bold text-orange-500">
            ₹{item.price}
          </span>

          <button
            onClick={() => handleAddToCart(item._id)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
