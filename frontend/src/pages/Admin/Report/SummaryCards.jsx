import {
  FiDollarSign,
  FiShoppingBag,
  FiHome,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${summary?.totalRevenue?.toLocaleString() || 0}`,
      icon: <FiDollarSign size={28} />,
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200",
    },
    {
      title: "Total Orders",
      value: summary?.totalOrders?.toLocaleString() || 0,
      icon: <FiShoppingBag size={28} />,
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    {
      title: "Restaurants",
      value: summary?.totalRestaurants?.toLocaleString() || 0,
      icon: <FiHome size={28} />,
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    {
      title: "Customers",
      value: summary?.totalCustomers?.toLocaleString() || 0,
      icon: <FiUsers size={28} />,
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-200",
    },
    {
      title: "Delivered Orders",
      value: summary?.deliveredOrders?.toLocaleString() || 0,
      icon: <FiCheckCircle size={28} />,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    {
      title: "Pending Orders",
      value: summary?.pendingOrders?.toLocaleString() || 0,
      icon: <FiClock size={28} />,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
    {
      title: "Cancelled Orders",
      value: summary?.cancelledOrders?.toLocaleString() || 0,
      icon: <FiXCircle size={28} />,
      bg: "bg-red-100",
      text: "text-red-600",
      border: "border-red-200",
    },
    {
      title: "Refund Requests",
      value: summary?.refundRequests?.toLocaleString() || 0,
      icon: <FiRefreshCw size={28} />,
      bg: "bg-cyan-100",
      text: "text-cyan-600",
      border: "border-cyan-200",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group rounded-2xl border ${card.border} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                {card.value}
              </h2>
            </div>

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.bg} ${card.text} transition-transform duration-300 group-hover:scale-110`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${
                card.text.replace("text", "bg")
              }`}
              style={{ width: "70%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;