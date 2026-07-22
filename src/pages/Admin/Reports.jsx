const Reports = () => {
  const reportCards = [
    {
      title: "Total Revenue",
      value: "₹18,45,200",
      icon: "💰",
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "12,845",
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "Cancelled Orders",
      value: "186",
      icon: "❌",
      color: "bg-red-500",
    },
    {
      title: "Refund Requests",
      value: "42",
      icon: "🔄",
      color: "bg-yellow-500",
    },
  ];

  const topRestaurants = [
    {
      id: 1,
      name: "Pizza Hub",
      orders: 1450,
      revenue: "₹4,85,000",
    },
    {
      id: 2,
      name: "Burger Point",
      orders: 1210,
      revenue: "₹3,95,000",
    },
    {
      id: 3,
      name: "Biryani House",
      orders: 1080,
      revenue: "₹3,42,000",
    },
    {
      id: 4,
      name: "Coffee Corner",
      orders: 950,
      revenue: "₹2,75,000",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">📊 Reports</h1>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card, index) => (
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

      {/* Top Restaurants */}
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">
          🏆 Top Performing Restaurants
        </h2>

        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="py-3 text-left">Restaurant</th>
              <th className="py-3 text-left">Orders</th>
              <th className="py-3 text-left">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {topRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="border-b hover:bg-gray-50">
                <td className="py-4 font-semibold">{restaurant.name}</td>

                <td>{restaurant.orders}</td>

                <td className="font-bold text-green-600">
                  {restaurant.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Summary */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">Daily Revenue</h3>

          <p className="mt-3 text-3xl font-bold text-green-600">₹68,500</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Weekly Revenue
          </h3>

          <p className="mt-3 text-3xl font-bold text-blue-600">₹4,72,300</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Monthly Revenue
          </h3>

          <p className="mt-3 text-3xl font-bold text-orange-500">₹18,45,200</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
