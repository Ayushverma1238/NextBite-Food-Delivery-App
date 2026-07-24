import { format } from "date-fns";
import {
  FaCheckCircle,
  FaClock,
  FaMotorcycle,
  FaTimesCircle,
} from "react-icons/fa";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: <FaClock className="text-yellow-600" />,
  },

  PREPARING: {
    label: "Preparing",
    color: "bg-blue-100 text-blue-700",
    icon: <FaClock className="text-blue-600" />,
  },

  OUT_FOR_DELIVERY: {
    label: "Out For Delivery",
    color: "bg-cyan-100 text-cyan-700",
    icon: <FaMotorcycle className="text-cyan-600" />,
  },

  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: <FaCheckCircle className="text-green-600" />,
  },

  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: <FaTimesCircle className="text-red-600" />,
  },
};

const RecentOrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">
          Recent Orders
        </h2>

        <div className="h-60 flex items-center justify-center text-gray-400">
          No recent orders found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg mt-8 overflow-hidden">
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <p className="text-gray-500 mt-1">
            Latest customer orders
          </p>
        </div>

        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-semibold">
          {orders.length} Orders
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Items
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Payment
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Ordered On
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const status =
                statusConfig[order.orderStatus] ||
                statusConfig.PENDING;

              const total =
                order.totalAmount ??
                order.itemTotal ??
                0;

              return (
                <tr
                  key={order._id}
                  className="border-b last:border-none hover:bg-orange-50 transition"
                >
                  {/* Customer */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        {order.owner?.name?.charAt(0) || "U"}
                      </div>

                      <div>
                        <h4 className="font-semibold">
                          {order.owner?.name || "Customer"}
                        </h4>

                        <p className="text-sm text-gray-500">
                          #{order._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Items */}

                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      {order.items
                        ?.slice(0, 2)
                        .map((item) => (
                          <p
                            key={item._id}
                            className="text-sm"
                          >
                            {item.quantity} × {item.name}
                          </p>
                        ))}

                      {order.items?.length > 2 && (
                        <span className="text-xs text-orange-600">
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount */}

                  <td className="px-6 py-5 font-bold text-green-600">
                    ₹{Number(total).toLocaleString()}
                  </td>

                  {/* Payment */}

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Order Status */}

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </td>

                  {/* Date */}

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {format(
                      new Date(order.createdAt),
                      "dd MMM yyyy, hh:mm a"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;