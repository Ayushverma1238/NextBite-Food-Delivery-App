import { format } from "date-fns";

const RecentOrders = ({ orders = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACCEPTED":
        return "bg-blue-100 text-blue-700";

      case "PREPARING":
        return "bg-purple-100 text-purple-700";

      case "PICKED_UP":
        return "bg-cyan-100 text-cyan-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-orange-100 text-orange-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            📦 Recent Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest customer orders
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Order ID
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Customer
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Restaurant
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Payment
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-medium">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="px-4 py-4">
                    {order.owner?.name}
                  </td>

                  <td className="px-4 py-4">
                    {order.restaurant?.name}
                  </td>

                  <td className="px-4 py-4 font-semibold text-green-600">
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {format(
                      new Date(order.createdAt),
                      "dd MMM yyyy"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-slate-400"
                >
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;