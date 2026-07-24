import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const currentYear = new Date().getFullYear();

  const getAnalytics = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/restaurant/analytics?year=${currentYear}`
      );

      console.log("Analytics response", res)
      setAnalytics(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-2xl font-semibold text-orange-500">
          Loading Analytics...
        </div>
      </div>
    );
  }

  const monthlyData = analytics?.monthlyAnalytics || [];

  const highestMonth = [...monthlyData].sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  )[0];

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Restaurant Analytics
        </h1>

        <p className="mt-2 text-gray-500">
          Revenue & Orders Report ({analytics.year})
        </p>
      </div>

      {/* Cards */}

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl bg-linear-to-r from-orange-500 to-red-500 p-6 text-white shadow-xl">

          <p>Total Revenue</p>

          <h2 className="mt-4 text-4xl font-bold">
            ₹{analytics.totalRevenue.toLocaleString()}
          </h2>

        </div>

        <div className="rounded-3xl bg-linear-to-r from-blue-500 to-cyan-500 p-6 text-white shadow-xl">

          <p>Total Orders</p>

          <h2 className="mt-4 text-4xl font-bold">
            {analytics.totalOrders}
          </h2>

        </div>

        <div className="rounded-3xl bg-linear-to-r from-green-500 to-emerald-600 p-6 text-white shadow-xl">

          <p>Best Revenue Month</p>

          <h2 className="mt-4 text-4xl font-bold">
            {highestMonth?.month}
          </h2>

          <p className="mt-2 text-lg">
            ₹{highestMonth?.totalRevenue.toLocaleString()}
          </p>

        </div>

      </div>

      {/* Revenue Area Chart */}

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

        <h2 className="mb-6 text-2xl font-bold">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={400}>

          <AreaChart data={monthlyData}>

            <defs>

              <linearlinear id="colorRevenue" x1="0" y1="0" x2="0" y2="1">

                <stop
                  offset="5%"
                  stopColor="#fb923c"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#fb923c"
                  stopOpacity={0}
                />

              </linearlinear>

            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="totalRevenue"
              stroke="#ea580c"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      {/* Orders */}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h2 className="mb-6 text-2xl font-bold">
            Monthly Orders
          </h2>

          <ResponsiveContainer width="100%" height={350}>

            <BarChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="totalOrders"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h2 className="mb-6 text-2xl font-bold">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={350}>

            <LineChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#22c55e"
                strokeWidth={4}
                dot={{ r: 5 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Revenue Table */}

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

        <h2 className="mb-6 text-2xl font-bold">
          Monthly Summary
        </h2>

        <table className="w-full">

          <thead className="border-b">

            <tr className="text-left text-gray-500">

              <th className="py-4">Month</th>

              <th>Orders</th>

              <th>Revenue</th>

            </tr>

          </thead>

          <tbody>

            {monthlyData.map((month) => (

              <tr
                key={month.month}
                className="border-b hover:bg-orange-50"
              >

                <td className="py-4 font-semibold">
                  {month.month}
                </td>

                <td>{month.totalOrders}</td>

                <td className="font-bold text-green-600">
                  ₹{month.totalRevenue.toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Analytics;