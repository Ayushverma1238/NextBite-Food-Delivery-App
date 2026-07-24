import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import {
  FiEye,
  FiXCircle,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const getOrders = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/admin/orders?page=${page}&limit=10`
      );

      console.log(res)

      setOrders(res.data.data.orders);
      setCurrentPage(res.data.data.currentPage);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders(currentPage);
  }, [currentPage]);

  const filteredOrders = orders.filter((order) => {
    const customer = order?.owner?.fullName || "";
    const restaurant = order?.restaurant?.name || "";
    const orderId = order?._id || "";

    return (
      customer.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.toLowerCase().includes(search.toLowerCase()) ||
      orderId.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paymentColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const orderColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "PREPARING":
        return "bg-blue-100 text-blue-700";

      case "CONFIRMED":
        return "bg-purple-100 text-purple-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Order Management
            </h2>

            <p className="text-gray-500">
              Manage all customer orders
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border py-2 pr-4 pl-10 outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={() => getOrders(currentPage)}
              className="rounded-xl bg-orange-500 p-3 text-white hover:bg-orange-600"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left">Order</th>
                <th className="px-5 py-4 text-left">Customer</th>
                <th className="px-5 py-4 text-left">Restaurant</th>
                <th className="px-5 py-4 text-left">Items</th>
                <th className="px-5 py-4 text-left">Amount</th>
                <th className="px-5 py-4 text-left">Payment</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-gray-500"
                  >
                    No Orders Found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b transition hover:bg-orange-50"
                  >
                    <td className="px-5 py-5 font-semibold">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-5 py-5">
                      <div className="font-medium">
                        {order.deliveryAddress?.fullName}
                      </div>

                      <div className="text-sm text-gray-500">
                        {order.owner?.email}
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      {order.restaurant?.name}
                    </td>

                    <td className="px-5 py-5">
                      {order.items?.length}
                    </td>

                    <td className="px-5 py-5 font-semibold text-orange-600">
                      ₹{order.totalAmount}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${orderColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex justify-center gap-2">
                        <button className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600">
                          <FiEye size={18} />
                        </button>

                        <button className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600">
                          <FiXCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded-lg bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <p className="font-medium">
            Page {currentPage} of {totalPages}
          </p>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;