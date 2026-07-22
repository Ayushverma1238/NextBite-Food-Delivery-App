const Dashboard = () => {
  const stats = [
    {
      title: "Total Food Items",
      value: 18,
      icon: "🍔",
      color: "bg-orange-500",
    },
    {
      title: "Today's Orders",
      value: 34,
      icon: "📦",
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "₹24,500",
      icon: "💰",
      color: "bg-blue-500",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: "⭐",
      color: "bg-yellow-500",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      customer: "Rahul Sharma",
      item: "Margherita Pizza",
      total: "₹249",
      status: "Preparing",
    },
    {
      id: 2,
      customer: "Priya Singh",
      item: "Veg Burger",
      total: "₹199",
      status: "Delivered",
    },
    {
      id: 3,
      customer: "Amit Verma",
      item: "Chicken Biryani",
      total: "₹299",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <h1 className="text-4xl font-bold mb-8">🍽 Restaurant Owner Dashboard</h1>

      {/* Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="text-5xl">{card.icon}</div>

            <h2 className="mt-4 text-lg">{card.title}</h2>

            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}

      <div className="bg-white rounded-2xl shadow-lg mt-10 p-6">
        <h2 className="text-2xl font-bold mb-5">Recent Orders</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">Customer</th>
              <th className="py-3 text-left">Food</th>
              <th className="py-3 text-left">Total</th>
              <th className="py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-orange-50">
                <td className="py-4">{order.customer}</td>

                <td>{order.item}</td>

                <td>{order.total}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      order.status === "Delivered"
                        ? "bg-green-500"
                        : order.status === "Preparing"
                          ? "bg-orange-500"
                          : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
