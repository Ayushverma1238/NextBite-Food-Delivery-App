import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { FaClipboardCheck } from "react-icons/fa";

const COLORS = [
  "#f59e0b", // Pending
  "#3b82f6", // Accepted
  "#8b5cf6", // Preparing
  "#06b6d4", // Picked Up
  "#22c55e", // Delivered
  "#ef4444", // Cancelled
];

const OrderStatusChart = ({ data }) => {
  const chartData = [
    {
      name: "Pending",
      value: data?.PENDING || 0,
      color: COLORS[0],
    },
    {
      name: "Confirm",
      value: data?.CONFIRMED || 0,
      color: COLORS[1],
    },
    {
      name: "Preparing",
      value: data?.PREPARING || 0,
      color: COLORS[2],
    },
    {
      name: "Picked Up",
      value: data?.OUT_FOR_DELIVERY || 0,
      color: COLORS[3],
    },
    {
      name: "Delivered",
      value: data?.DELIVERED || 0,
      color: COLORS[4],
    },
    {
      name: "Cancelled",
      value: data?.CANCELLED || 0,
      color: COLORS[5],
    },
  ];

  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <FaClipboardCheck className="text-green-500" />
          Order Status
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of all order statuses
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
        <div className="relative h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-slate-500">
              Total Orders
            </p>

            <h2 className="text-4xl font-bold text-slate-800">
              {totalOrders}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{
                    background: item.color,
                  }}
                />

                <span className="font-medium text-slate-700">
                  {item.name}
                </span>
              </div>

              <span className="text-lg font-bold text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;