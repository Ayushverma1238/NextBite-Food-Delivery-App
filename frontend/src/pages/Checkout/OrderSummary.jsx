import { FaClock } from "react-icons/fa";

const OrderSummary = ({
  cartItems = [],
  subtotal = 0,
  deliveryFee = 40,
  gst = 0,
  discount = 0,
  total = 0,
  loading = false,
  onPlaceOrder,
}) => {
    
  return (
    <div className="sticky top-6 rounded-2xl border bg-white p-6 shadow-lg">
      {/* Heading */}
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Order Summary
      </h2>

      {/* Food Items */}
      <div className="max-h-80 space-y-4 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div
            key={item.foodId}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div>
                <h3 className="font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.quantity}
                </p>
              </div>
            </div>

            <p className="font-semibold">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="mt-6 space-y-3">

        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal
          </span>

          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">
            Delivery Fee
          </span>

          <span>₹{deliveryFee}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">
            GST (5%)
          </span>

          <span>₹{gst}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>

            <span>- ₹{discount}</span>
          </div>
        )}

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>₹{total}</span>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="mt-6 rounded-xl bg-orange-50 p-4">
        <div className="flex items-center gap-3">
          <FaClock className="text-orange-500" />

          <div>
            <p className="font-semibold">
              Estimated Delivery
            </p>

            <p className="text-sm text-gray-600">
              25 - 35 Minutes
            </p>
          </div>
        </div>
      </div>

      {/* Place Order */}
      <button
        disabled={loading || cartItems.length === 0}
        onClick={onPlaceOrder}
        className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;