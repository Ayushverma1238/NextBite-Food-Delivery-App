import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({
  title,
  value,
  icon,
  gradient = "from-indigo-500 to-blue-600",
  growth,
  isIncrease = true,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-linear-to-r ${gradient} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </h2>

          {growth !== undefined && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              {isIncrease ? (
                <FiTrendingUp className="text-green-200" />
              ) : (
                <FiTrendingDown className="text-red-200" />
              )}

              <span
                className={`font-semibold ${
                  isIncrease ? "text-green-100" : "text-red-100"
                }`}
              >
                {growth}%
              </span>

              <span className="text-white/80">vs last month</span>
            </div>
          )}
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {/* Decorative Circle */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl"></div>
    </div>
  );
};

export default StatCard;