import {
  FaHamburger,
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign,
} from "react-icons/fa";

import { MdToday } from "react-icons/md";
import { GiCookingPot } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";

const StatsCards = ({ statistics }) => {
  if (!statistics) return null;

  const cards = [
    {
      title: "Total Foods",
      value: statistics.totalFoods,
      icon: <FaHamburger size={28} />,
      bg: "from-orange-500 to-orange-400",
    },
    {
      title: "Total Orders",
      value: statistics.totalOrders,
      icon: <FaBoxOpen size={28} />,
      bg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Today's Orders",
      value: statistics.todayOrders,
      icon: <MdToday size={30} />,
      bg: "from-purple-500 to-indigo-500",
    },
    {
      title: "Pending Orders",
      value: statistics.pendingOrders,
      icon: <FaClock size={28} />,
      bg: "from-yellow-500 to-orange-400",
    },
    {
      title: "Preparing",
      value: statistics.preparingOrders,
      icon: <GiCookingPot size={30} />,
      bg: "from-pink-500 to-rose-500",
    },
    {
      title: "Out For Delivery",
      value: statistics.outForDeliveryOrders,
      icon: <TbTruckDelivery size={30} />,
      bg: "from-sky-500 to-cyan-400",
    },
    {
      title: "Delivered",
      value: statistics.completedOrders,
      icon: <FaCheckCircle size={28} />,
      bg: "from-green-500 to-emerald-500",
    },
    {
      title: "Cancelled",
      value: statistics.cancelledOrders,
      icon: <FaTimesCircle size={28} />,
      bg: "from-red-500 to-red-400",
    },
    {
      title: "Today's Revenue",
      value: `₹${statistics.todayRevenue.toLocaleString()}`,
      icon: <FaRupeeSign size={28} />,
      bg: "from-teal-500 to-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `₹${statistics.totalRevenue.toLocaleString()}`,
      icon: <FaRupeeSign size={28} />,
      bg: "from-green-600 to-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-linear-to-r ${card.bg} rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              {card.icon}
            </div>

            <div className="text-right">
              <h3 className="text-3xl font-bold">
                {card.value}
              </h3>

              <p className="text-white/90 text-sm mt-1">
                {card.title}
              </p>
            </div>
          </div>

          <div className="mt-5 h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{
                width: `${Math.min((index + 2) * 10, 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;