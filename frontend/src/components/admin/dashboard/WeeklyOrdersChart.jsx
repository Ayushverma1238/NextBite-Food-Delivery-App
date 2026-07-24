import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FaShoppingBag } from "react-icons/fa";

const WeeklyOrdersChart = ({ data = [] }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <FaShoppingBag className="text-indigo-500" />
            Weekly Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Orders received throughout the week
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis
            dataKey="day"
            tick={{ fill: "#64748b", fontSize: 12 }}
          />

          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
          />

          <Tooltip
            formatter={(value) => [value, "Orders"]}
          />

          <Bar
            dataKey="orders"
            radius={[8, 8, 0, 0]}
            fill="#6366f1"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyOrdersChart;