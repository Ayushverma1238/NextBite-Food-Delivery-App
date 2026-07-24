import { useState } from "react";

const Orders = () => {
  const [orders] = useState([
    {
      id: "#ORD1001",
      customer: "Rahul Sharma",
      restaurant: "Pizza Hub",
      amount: 549,
      payment: "Paid",
      status: "Delivered",
    },
    {
      id: "#ORD1002",
      customer: "Priya Singh",
      restaurant: "Burger Point",
      amount: 299,
      payment: "Pending",
      status: "Preparing",
    },
    {
      id: "#ORD1003",
      customer: "Amit Verma",
      restaurant: "Biryani House",
      amount: 799,
      payment: "Paid",
      status: "Pending",
    },
    {
      id: "#ORD1004",
      customer: "Sneha Gupta",
      restaurant: "Coffee Corner",
      amount: 189,
      payment: "Paid",
      status: "Cancelled",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">📦 Order Management</h1>

        <input
          type="text"
          placeholder="Search orders..."
          className="w-72 rounded-lg border bg-white px-4 py-2 outline-none focus:border-orange-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
        <table className="min-w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-5 py-4 text-left">Order ID</th>
              <th className="px-5 py-4 text-left">Customer</th>
              <th className="px-5 py-4 text-left">Restaurant</th>
              <th className="px-5 py-4 text-left">Amount</th>
              <th className="px-5 py-4 text-left">Payment</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold">{order.id}</td>

                <td className="px-5 py-4">{order.customer}</td>

                <td className="px-5 py-4">{order.restaurant}</td>

                <td className="px-5 py-4 font-bold text-orange-500">
                  ₹{order.amount}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                      order.payment === "Paid"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {order.payment}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                      order.status === "Delivered"
                        ? "bg-green-500"
                        : order.status === "Preparing"
                          ? "bg-blue-500"
                          : order.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                      View
                    </button>

                    <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
