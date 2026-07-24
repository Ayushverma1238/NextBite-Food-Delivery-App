import {
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";

const StatisticsCards = ({ statistics }) => {
  const cards = [
    {
      title: "Average Order Value",
      value: `₹${Number(
        statistics?.averageOrderValue || 0,
      ).toLocaleString()}`,
      icon: <FiTrendingUp size={24} />,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Highest Order Value",
      value: `₹${Number(
        statistics?.highestOrder || 0,
      ).toLocaleString()}`,
      icon: <FiAward size={24} />,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: "Active Restaurants",
      value: Number(
        statistics?.activeRestaurants || 0,
      ).toLocaleString(),
      icon: <FiCheckCircle size={24} />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Inactive Restaurants",
      value: Number(
        statistics?.inactiveRestaurants || 0,
      ).toLocaleString(),
      icon: <FiXCircle size={24} />,
      bg: "bg-red-100",
      text: "text-red-600",
    },
    {
      title: "COD Orders",
      value: Number(
        statistics?.codOrders || 0,
      ).toLocaleString(),
      icon: <FiDollarSign size={24} />,
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    {
      title: "Online Payments",
      value: Number(
        statistics?.onlinePayments || 0,
      ).toLocaleString(),
      icon: <FiCreditCard size={24} />,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Business Statistics
        </h2>

        <p className="mt-1 text-gray-500">
          Overall business performance overview.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-800">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg} ${card.text} transition-transform duration-300 group-hover:scale-110`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;