const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,450",
      icon: "👤",
      color: "bg-blue-500",
    },
    {
      title: "Restaurants",
      value: "128",
      icon: "🍽️",
      color: "bg-orange-500",
    },
    {
      title: "Orders",
      value: "8,925",
      icon: "📦",
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "₹12.8L",
      icon: "💰",
      color: "bg-purple-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      activity: "New restaurant registered",
      name: "Pizza Hub",
      time: "5 min ago",
    },
    {
      id: 2,
      activity: "New user joined",
      name: "Rahul Sharma",
      time: "12 min ago",
    },
    {
      id: 3,
      activity: "Restaurant approved",
      name: "Burger King",
      time: "25 min ago",
    },
    {
      id: 4,
      activity: "Order completed",
      name: "#ORD1025",
      time: "40 min ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">🛠️ Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((card, index) => (
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

      {/* Recent Activity */}
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">Recent Activity</h2>

        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="py-3 text-left">Activity</th>
              <th className="py-3 text-left">Details</th>
              <th className="py-3 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {recentActivities.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-4 font-semibold">{item.activity}</td>

                <td>{item.name}</td>

                <td className="text-gray-500">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Summary */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Pending Restaurant Approvals
          </h3>
          <p className="mt-3 text-3xl font-bold text-orange-500">12</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Active Users Today
          </h3>
          <p className="mt-3 text-3xl font-bold text-blue-500">1,845</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">
            Cancelled Orders
          </h3>
          <p className="mt-3 text-3xl font-bold text-red-500">23</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
