import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";

const MenuItem = ({ item }) => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const handleAddToCart = () => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      );

      setCartItems(updatedCart);

      toast.success(`${item.name} quantity increased!`);
    } else {
      setCartItems([
        ...cartItems,
        {
          ...item,
          quantity: 1,
        },
      ]);

      toast.success(`${item.name} added to cart!`);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">
        <h3 className="text-2xl font-bold">{item.name}</h3>

        <p className="text-gray-500 mt-2">{item.description}</p>

        <div className="flex justify-between items-center mt-6">
          <span className="text-2xl font-bold text-orange-500">
            ₹{item.price}
          </span>

          <button
            onClick={handleAddToCart}
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
