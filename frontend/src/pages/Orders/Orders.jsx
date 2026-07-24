import axiosInstance from "../../api/axios";
import { useEffect, useState } from "react";
import {
  FaStore,
  FaClock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const getAllOrder = async () => {
    try {
      const res = await axiosInstance("/order");
      setOrders(res.data.data);
      console.log("Order res", res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrder();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "PREPARING":
        return "bg-orange-100 text-orange-700";

      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const cancelOrder = async (id) => {
    try {
      // await axiosInstance.patch(`/order/${id}/cancel`);
      alert("Cancel Order API Here");
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-5">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">🍽️ My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              className="w-40 mx-auto"
              alt=""
            />

            <h2 className="text-2xl font-bold mt-6">No Orders Yet</h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven't ordered anything.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Header */}

                <div className="flex justify-between items-center bg-orange-500 text-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FaStore size={22} />
                    <div>
                      <h2 className="text-xl font-bold">
                        {order.restaurant.name}
                      </h2>

                      <p className="text-sm opacity-90">Order #{index + 1}</p>
                    </div>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold bg-white ${getStatusColor(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus.replaceAll("_", " ")}
                  </span>
                </div>

                {/* Body */}

                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Ordered Items</h3>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.food}
                        className="flex justify-between border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>

                          <p className="text-sm text-gray-500">
                            Quantity : {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">₹{item.price}</p>
                      </div>
                    ))}
                  </div>

                  {/* Details */}

                  <div className="grid md:grid-cols-2 gap-5 mt-6">
                    <div className="flex items-center gap-3">
                      <FaMoneyBillWave className="text-green-600" />
                      <div>
                        <p className="text-gray-500 text-sm">Total Amount</p>

                        <h4 className="font-bold text-lg">
                          ₹{order.totalAmount}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-orange-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Ordered On</p>

                        <h4 className="font-medium">
                          {formatDate(order.createdAt)}
                        </h4>
                      </div>
                    </div>

                    {order.address && (
                      <div className="flex items-center gap-3 md:col-span-2">
                        <FaMapMarkerAlt className="text-red-500" />

                        <div>
                          <p className="text-gray-500 text-sm">
                            Delivery Address
                          </p>

                          <p>
                            {order.address.houseNo}, {order.address.landmark},{" "}
                            {order.address.street}, {order.address.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button onClick={() => navigate(`/track-order/${order._id}`)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition font-semibold">
                      Track Order
                    </button>

                    <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-lg transition font-semibold">
                      Reorder
                    </button>

                    {(order.orderStatus === "PENDING" ||
                      order.orderStatus === "CONFIRMED" ||
                      order.orderStatus === "PREPARING") && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition font-semibold"
                      >
                        <FaTimesCircle />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
