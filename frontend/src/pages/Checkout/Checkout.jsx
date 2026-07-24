import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useDispatch } from "react-redux";
import AddressList from "./AddressList";
import OrderSummary from "./OrderSummary";
import PaymentMethod from "./PaymentMethod";
import CouponSection from "./CoupanSection";
import { totalCartItem } from "../../feature/cart/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -----------------------------
  // State
  // -----------------------------

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  const [discount, setDiscount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  // -----------------------------
  // Fetch Checkout Data
  // -----------------------------

  const getCheckoutData = async () => {
    try {
      setPageLoading(true);

      const [cartRes, addressRes] = await Promise.all([
        axiosInstance.get("/cart"),
        axiosInstance.get("/address"),
      ]);

      const cart = cartRes.data.data;
      const address = addressRes.data.data;

      setCartItems(cart?.items || []);

      setAddresses(address || []);

      if (address.length > 0) {
        const defaultAddress = address.find((a) => a.isDefault) || address[0];

        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getCheckoutData();
  }, []);

  // -----------------------------
  // Price Calculation
  // -----------------------------

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryFee = subtotal === 0 ? 0 : 40;

  const gst = Math.round(subtotal * 0.05);

  const total = subtotal + deliveryFee + gst - discount;

  // -----------------------------
  // Place Order
  // -----------------------------

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Order
      const orderRes = await axiosInstance.post("/order", {
        addressId: selectedAddress._id,
      });

      const orderId = orderRes.data.data._id;

      // Step 2: Create Payment
      const paymentRes = await axiosInstance.post("/payment", {
        orderId,
        paymentMethod,
      });

      // COD
      if (paymentMethod === "COD") {
        dispatch(totalCartItem(0));
        navigate("/orders");
        return;
      }

      // Razorpay
      const paymentData = paymentRes.data.data;
      console.log("Payment options", paymentData);

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.orderId,

        handler: async (response) => {
          try {
            await axiosInstance.post("/payment/verify-payment", {
              paymentId: paymentData.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(totalCartItem(0));
            navigate("/orders");
          } catch (error) {
            console.log(error);
          }
        },

        theme: {
          color: "#f97316",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (pageLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // -----------------------------
  // Empty Cart
  // -----------------------------

  if (cartItems.length === 0) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <img src="/empty-cart.png" alt="Empty Cart" className="mb-6 w-60" />

        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>

        <p className="mt-3 text-gray-500">
          Add delicious food before checkout.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 bg-gray-100">
      {/* Hero */}

      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>

            <p className="mt-2 text-gray-500">
              Confirm your delivery details and complete payment.
            </p>
          </div>

          <div className="hidden rounded-xl bg-orange-50 p-4 md:block">
            <p className="text-sm text-gray-500">Total Payable</p>

            <h2 className="text-3xl font-bold text-orange-500">₹{total}</h2>
          </div>
        </div>
      </div>

      {/* Main Container */}

      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-6 lg:grid-cols-3">
        {/* LEFT SECTION */}

        <div className="space-y-6 lg:col-span-2">
          {/* Address Section */}
          <AddressList
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            refreshAddresses={getCheckoutData}
          />

          {/* Payment Method */}
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          {/* Coupon */}
          <CouponSection
            subtotal={subtotal}
            discount={discount}
            setDiscount={setDiscount}
          />
        </div>

        {/* RIGHT SECTION */}

        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            gst={gst}
            discount={discount}
            total={total}
            loading={loading}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
