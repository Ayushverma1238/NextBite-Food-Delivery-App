import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const nextAction = {
    PENDING: {
      label: "Confirm Order",
      status: "CONFIRMED",
    },
    CONFIRMED: {
      label: "Start Preparing",
      status: "PREPARING",
    },
    PREPARING: {
      label: "Out For Delivery",
      status: "OUT_FOR_DELIVERY",
    },
    OUT_FOR_DELIVERY: {
      label: "Mark Delivered",
      status: "DELIVERED",
    },
  };

  const getOrders = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/order/owner-order");

      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/order/${orderId}/status`, {
        orderStatus: status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: status,
              }
            : order
        )
      );

      toast.success("Order status updated");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Restaurant Orders
        </h1>

        <p className="mt-2 text-gray-500">
          Manage all incoming orders
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <table className="w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-5 py-4 text-left">Customer</th>
              <th className="px-5 py-4 text-left">Phone</th>
              <th className="px-5 py-4 text-left">Items</th>
              <th className="px-5 py-4 text-left">Total</th>
              <th className="px-5 py-4 text-left">Payment</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-left">Date</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const action = nextAction[order.orderStatus];

              return (
                <tr
                  key={order._id}
                  className="border-b transition hover:bg-orange-50"
                >
                  <td className="px-5 py-4 font-semibold">
                    {order.deliveryAddress?.fullName}
                  </td>

                  <td className="px-5 py-4">
                    {order.deliveryAddress?.phone}
                  </td>

                  <td className="px-5 py-4">
                    {order.items.map((item) => (
                      <div key={item._id}>
                        {item.quantity} × {item.name}
                      </div>
                    ))}
                  </td>

                  <td className="px-5 py-4 font-bold text-orange-500">
                    ₹{order.totalAmount}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                        order.paymentStatus === "SUCCESS"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                        order.orderStatus === "PENDING"
                          ? "bg-yellow-500"
                          : order.orderStatus === "CONFIRMED"
                          ? "bg-blue-500"
                          : order.orderStatus === "PREPARING"
                          ? "bg-indigo-500"
                          : order.orderStatus === "OUT_FOR_DELIVERY"
                          ? "bg-purple-500"
                          : "bg-green-600"
                      }`}
                    >
                      {order.orderStatus.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {format(
                      new Date(order.createdAt),
                      "dd MMM yyyy hh:mm a"
                    )}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {action ? (
                      <button
                        onClick={() =>
                          updateStatus(order._id, action.status)
                        }
                        className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600"
                      >
                        {action.label}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="cursor-not-allowed rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
                      >
                        Delivered
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-lg text-gray-500"
                >
                  No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;