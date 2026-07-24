import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

import {
  Users,
  Store,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Loader2,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    cards: {
      users: 0,
      restaurants: 0,
      orders: 0,
      revenue: 0,
    },
    overview: {
      activeRestaurants: 0,
      cancelledOrders: 0,
      deliveredOrders: 0,
      successRate: 0,
    },
    monthlyPerformance: [],
  });

  const getAnalytics = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/analytics");
      setAnalytics(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: analytics.cards.users.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Restaurants",
      value: analytics.cards.restaurants.toLocaleString(),
      icon: Store,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Orders",
      value: analytics.cards.orders.toLocaleString(),
      icon: ShoppingBag,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Revenue",
      value: `₹${analytics.cards.revenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const pieData = [
    {
      name: "Delivered",
      value: analytics.overview.deliveredOrders,
    },
    {
      name: "Cancelled",
      value: analytics.overview.cancelledOrders,
    },
  ];

  const pieColors = ["#22c55e", "#ef4444"];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Analytics Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor your food delivery platform performance.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-3 shadow">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-500" />

            <span className="font-semibold text-green-600">
              Platform Growing
            </span>
          </div>
        </div>
      </div>

      {/* Statistic Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className={`rounded-3xl bg-linear-to-r ${card.color} p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">{card.title}</p>

                  <h2 className="mt-3 text-3xl font-bold">{card.value}</h2>
                </div>

                <div className="rounded-2xl bg-white/20 p-4">
                  <Icon size={34} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-slate-700">
            Monthly Revenue
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Legend />

              <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-slate-700">
            Monthly Orders
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={analytics.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="orders"
                stroke="#22c55e"
                strokeWidth={4}
                dot={{
                  r: 5,
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overview Section */}

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Delivery Status */}

        <div className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-1">
          <h2 className="mb-6 text-xl font-bold text-slate-700">
            Order Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={4}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance Table */}

        <div className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold text-slate-700">
            Monthly Performance
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Month
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Orders
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Revenue
                  </th>
                </tr>
              </thead>

              <tbody>
                {analytics.monthlyPerformance.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {item.month}
                    </td>

                    <td className="px-5 py-4 text-center font-medium text-slate-600">
                      {item.orders.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-green-600">
                      ₹{Number(item.revenue).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {analytics.monthlyPerformance.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">
                      No analytics available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Platform Overview Cards */}

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {" "}
        {/* Delivery Success */}
        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Delivery Success
              </p>

              <h2 className="mt-3 text-4xl font-bold text-green-600">
                {analytics.overview.successRate}%
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Successfully delivered orders
              </p>
            </div>

            <div className="rounded-2xl bg-green-100 p-4">
              <TrendingUp className="text-green-600" size={34} />
            </div>
          </div>
        </div>
        {/* Active Restaurants */}
        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Restaurants
              </p>

              <h2 className="mt-3 text-4xl font-bold text-blue-600">
                {analytics.overview.activeRestaurants.toLocaleString()}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Restaurants currently accepting orders
              </p>
            </div>

            <div className="rounded-2xl bg-blue-100 p-4">
              <Store className="text-blue-600" size={34} />
            </div>
          </div>
        </div>
        {/* Cancelled Orders */}
        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Cancelled Orders
              </p>

              <h2 className="mt-3 text-4xl font-bold text-red-600">
                {analytics.overview.cancelledOrders.toLocaleString()}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Orders cancelled by users or restaurants
              </p>
            </div>

            <div className="rounded-2xl bg-red-100 p-4">
              <ShoppingBag className="text-red-600" size={34} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
