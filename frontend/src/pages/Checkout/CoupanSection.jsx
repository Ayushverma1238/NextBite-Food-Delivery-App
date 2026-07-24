import { useState } from "react";
import { FaTag, FaCheckCircle } from "react-icons/fa";

const CouponSection = ({
  subtotal,
  discount,
  setDiscount,
}) => {
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [message, setMessage] = useState("");

  // Demo Coupons
  const coupons = {
    SAVE50: 50,
    WELCOME100: 100,
    NEXTBITE10: Math.round(subtotal * 0.1),
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (!code) {
      setMessage("Please enter a coupon code.");
      return;
    }

    if (coupons[code]) {
      setDiscount(coupons[code]);
      setAppliedCoupon(code);
      setMessage("Coupon applied successfully 🎉");
    } else {
      setDiscount(0);
      setAppliedCoupon("");
      setMessage("Invalid coupon code.");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setAppliedCoupon("");
    setDiscount(0);
    setMessage("");
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-md">
      <div className="flex items-center gap-3">
        <FaTag className="text-xl text-orange-500" />
        <h2 className="text-xl font-bold">
          Apply Coupon
        </h2>
      </div>

      <div className="mt-5 flex gap-3">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
        />

        <button
          onClick={applyCoupon}
          className="rounded-xl bg-orange-500 px-5 text-white transition hover:bg-orange-600"
        >
          Apply
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-sm ${
            appliedCoupon
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {appliedCoupon && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-600" />

              <div>
                <h3 className="font-semibold text-green-700">
                  {appliedCoupon}
                </h3>

                <p className="text-sm text-gray-600">
                  Discount Applied
                </p>
              </div>
            </div>

            <button
              onClick={removeCoupon}
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <p className="font-semibold text-gray-700">
          Available Coupons
        </p>

        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>SAVE50</span>
            <span>₹50 OFF</span>
          </div>

          <div className="flex justify-between">
            <span>WELCOME100</span>
            <span>₹100 OFF</span>
          </div>

          <div className="flex justify-between">
            <span>NEXTBITE10</span>
            <span>10% OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponSection;