import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  PENDING: "#f59e0b",
  PREPARING: "#3b82f6",
  OUT_FOR_DELIVERY: "#06b6d4",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const OrderStatusChart = ({ analytics }) => {
  if (!analytics || analytics.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Order Status Analytics
        </h2>

        <div className="h-95 flex items-center justify-center text-gray-400">
          No order data available
        </div>
      </div>
    );
  }

  const chartData = analytics.map((item) => ({
    name: STATUS_LABELS[item._id] || item._id,
    value: item.count,
    color: COLORS[item._id] || "#9ca3af",
  }));

  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Order Status
          </h2>

          <p className="text-gray-500 mt-1">
            Distribution of restaurant orders
          </p>
        </div>

        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-semibold">
          {totalOrders} Orders
        </div>
      </div>

      {/* Chart */}

      <div className="h-90">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Cards */}

      <div className="grid md:grid-cols-5 gap-4 mt-8">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background: item.color,
                }}
              />

              <span className="text-sm font-medium text-gray-600">
                {item.name}
              </span>
            </div>

            <h3 className="text-2xl font-bold">
              {item.value}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {(
                (item.value / totalOrders) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusChart;