import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RevenueChart = ({ monthlyRevenue }) => {
  if (!monthlyRevenue || monthlyRevenue.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Monthly Revenue</h2>

        <div className="flex items-center justify-center h-80 text-gray-400">
          No revenue data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Monthly Revenue
          </h2>

          <p className="text-gray-500 mt-1">
            Revenue generated month by month
          </p>
        </div>

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
          Revenue Analytics
        </div>
      </div>

      {/* Chart */}

      <div className="h-95">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#f97316"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#f97316"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280" }}
            />

            <YAxis
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={4}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Stats */}

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="bg-orange-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Highest Month
          </p>

          <h3 className="text-xl font-bold mt-2">
            {
              monthlyRevenue.reduce((a, b) =>
                a.revenue > b.revenue ? a : b
              ).month
            }
          </h3>
        </div>

        <div className="bg-green-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Highest Revenue
          </p>

          <h3 className="text-xl font-bold mt-2">
            ₹
            {Math.max(
              ...monthlyRevenue.map((m) => m.revenue)
            ).toLocaleString()}
          </h3>
        </div>

        <div className="bg-blue-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Total Revenue
          </p>

          <h3 className="text-xl font-bold mt-2">
            ₹
            {monthlyRevenue
              .reduce((sum, item) => sum + item.revenue, 0)
              .toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;