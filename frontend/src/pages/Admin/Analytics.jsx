const Analytics = () => {
  const analyticsCards = [
    {
      title: "User Growth",
      value: "+18%",
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Restaurant Growth",
      value: "+12%",
      icon: "🍽️",
      color: "bg-orange-500",
    },
    {
      title: "Order Growth",
      value: "+25%",
      icon: "📦",
      color: "bg-green-500",
    },
    {
      title: "Revenue Growth",
      value: "+31%",
      icon: "💰",
      color: "bg-purple-500",
    },
  ];

  const monthlyData = [
    { month: "January", orders: 820, revenue: "₹1,82,000" },
    { month: "February", orders: 910, revenue: "₹2,05,000" },
    { month: "March", orders: 1080, revenue: "₹2,48,000" },
    { month: "April", orders: 1235, revenue: "₹2,85,000" },
    { month: "May", orders: 1400, revenue: "₹3,12,000" },
    { month: "June", orders: 1580, revenue: "₹3,55,000" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">📈 Platform Analytics</h1>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="text-5xl">{card.icon}</div>

            <h2 className="mt-4 text-lg">{card.title}</h2>

            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Analytics */}
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">Monthly Performance</h2>

        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="py-3 text-left">Month</th>
              <th className="py-3 text-left">Orders</th>
              <th className="py-3 text-left">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {monthlyData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4 font-semibold">{item.month}</td>

                <td>{item.orders}</td>

                <td className="font-bold text-green-600">{item.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Platform Overview */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Customer Satisfaction
          </h3>

          <p className="mt-3 text-3xl font-bold text-green-500">96%</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Delivery Success
          </h3>

          <p className="mt-3 text-3xl font-bold text-blue-500">98%</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Active Restaurants
          </h3>

          <p className="mt-3 text-3xl font-bold text-orange-500">128</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
