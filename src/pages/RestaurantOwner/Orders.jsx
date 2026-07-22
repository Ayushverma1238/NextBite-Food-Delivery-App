const Orders = () => {
  const orders = [
    {
      id: 1,
      customer: "Rahul Sharma",
      phone: "9876543210",
      items: "2x Margherita Pizza",
      total: 498,
      payment: "Paid",
      status: "Preparing",
    },
    {
      id: 2,
      customer: "Priya Singh",
      phone: "9123456780",
      items: "1x Chicken Burger",
      total: 199,
      payment: "Paid",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Amit Verma",
      phone: "9988776655",
      items: "1x Cold Coffee",
      total: 149,
      payment: "Cash",
      status: "Delivered",
    },
    {
      id: 4,
      customer: "Sneha Gupta",
      phone: "9012345678",
      items: "2x Chocolate Cake",
      total: 358,
      payment: "Paid",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <h1 className="mb-8 text-4xl font-bold">📦 Restaurant Orders</h1>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
        <table className="min-w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-5 py-4 text-left">Customer</th>
              <th className="px-5 py-4 text-left">Phone</th>
              <th className="px-5 py-4 text-left">Items</th>
              <th className="px-5 py-4 text-left">Total</th>
              <th className="px-5 py-4 text-left">Payment</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-orange-50">
                <td className="px-5 py-4 font-semibold">{order.customer}</td>

                <td className="px-5 py-4">{order.phone}</td>

                <td className="px-5 py-4">{order.items}</td>

                <td className="px-5 py-4 font-bold text-orange-500">
                  ₹{order.total}
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
                        ? "bg-green-600"
                        : order.status === "Preparing"
                          ? "bg-blue-500"
                          : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                      Accept
                    </button>

                    <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                      Reject
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
