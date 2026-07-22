import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryFee = 40;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Customer Details */}
        <div className="border rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Delivery Details</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

            <textarea
              placeholder="Delivery Address"
              rows="4"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" defaultChecked />
                  Cash on Delivery
                </label>

                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" />
                  UPI
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{gst}</span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={() => navigate("/order-success")}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
