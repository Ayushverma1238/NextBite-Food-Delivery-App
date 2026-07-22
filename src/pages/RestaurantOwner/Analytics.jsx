const Analytics = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,24,580",
      icon: "💰",
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "856",
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "Food Items Sold",
      value: "2,145",
      icon: "🍔",
      color: "bg-orange-500",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: "⭐",
      color: "bg-yellow-500",
    },
  ];

  const topFoods = [
    {
      id: 1,
      name: "Margherita Pizza",
      sold: 420,
      revenue: "₹1,04,580",
    },
    {
      id: 2,
      name: "Chicken Burger",
      sold: 310,
      revenue: "₹61,690",
    },
    {
      id: 3,
      name: "Chocolate Cake",
      sold: 260,
      revenue: "₹46,540",
    },
    {
      id: 4,
      name: "Cold Coffee",
      sold: 180,
      revenue: "₹26,820",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <h1 className="mb-8 text-4xl font-bold">📈 Restaurant Analytics</h1>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`${item.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="text-5xl">{item.icon}</div>

            <h2 className="mt-4 text-lg">{item.title}</h2>

            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Top Selling Foods */}
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">🏆 Top Selling Foods</h2>

        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="py-3 text-left">Food Item</th>
              <th className="py-3 text-left">Units Sold</th>
              <th className="py-3 text-left">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {topFoods.map((food) => (
              <tr key={food.id} className="border-b hover:bg-orange-50">
                <td className="py-4 font-semibold">{food.name}</td>

                <td>{food.sold}</td>

                <td className="font-bold text-green-600">{food.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue Summary */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Today's Revenue
          </h3>
          <p className="mt-3 text-3xl font-bold text-green-600">₹12,540</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Weekly Revenue
          </h3>
          <p className="mt-3 text-3xl font-bold text-blue-600">₹72,450</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Monthly Revenue
          </h3>
          <p className="mt-3 text-3xl font-bold text-orange-600">₹1,24,580</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
