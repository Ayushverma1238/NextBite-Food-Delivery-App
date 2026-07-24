import {
  FiSun,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

const RevenueCards = ({ revenue }) => {
  const cards = [
    {
      title: "Today's Revenue",
      value: revenue?.daily || 0,
      icon: <FiSun size={26} />,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
      border: "border-orange-200",
      subtitle: "Revenue generated today",
    },
    {
      title: "Weekly Revenue",
      value: revenue?.weekly || 0,
      icon: <FiCalendar size={26} />,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      subtitle: "Revenue from last 7 days",
    },
    {
      title: "Monthly Revenue",
      value: revenue?.monthly || 0,
      icon: <FiTrendingUp size={26} />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      border: "border-green-200",
      subtitle: "Revenue for current month",
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Revenue Summary
        </h2>

        <p className="mt-1 text-gray-500">
          Quick overview of business revenue.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`group rounded-2xl border ${card.border} bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.bg} ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}
              >
                {card.icon}
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                Live
              </span>
            </div>

            <h3 className="mt-6 text-lg font-semibold text-gray-700">
              {card.title}
            </h3>

            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              ₹{Number(card.value).toLocaleString()}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueCards;