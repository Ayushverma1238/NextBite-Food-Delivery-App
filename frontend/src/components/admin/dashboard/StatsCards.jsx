import {
  FaUsers,
  FaUserFriends,
  FaStore,
  FaUtensils,
  FaShoppingBag,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHamburger,
} from "react-icons/fa";

import StatCard from "./StatCard";

const StatsCards = ({ cards }) => {
  if (!cards) return null;

  const stats = [
    {
      title: "Total Users",
      value: cards.totalUsers,
      icon: <FaUsers />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Customers",
      value: cards.totalCustomers,
      icon: <FaUserFriends />,
      gradient: "from-sky-500 to-blue-500",
    },
    {
      title: "Restaurant Owners",
      value: cards.totalOwners,
      icon: <FaStore />,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Restaurants",
      value: cards.totalRestaurants,
      icon: <FaStore />,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Foods",
      value: cards.totalFoods,
      icon: <FaHamburger />,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Orders",
      value: cards.totalOrders,
      icon: <FaShoppingBag />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Revenue",
      value: `₹${Number(cards.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: <FaMoneyBillWave />,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Today's Revenue",
      value: `₹${Number(cards.todayRevenue || 0).toLocaleString("en-IN")}`,
      icon: <FaMoneyBillWave />,
      gradient: "from-emerald-500 to-lime-500",
    },
    {
      title: "Today's Orders",
      value: cards.todayOrders,
      icon: <FaClock />,
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      title: "Pending Orders",
      value: cards.pendingOrders,
      icon: <FaClock />,
      gradient: "from-yellow-500 to-amber-600",
    },
    {
      title: "Delivered",
      value: cards.deliveredOrders,
      icon: <FaCheckCircle />,
      gradient: "from-green-500 to-teal-600",
    },
    {
      title: "Cancelled",
      value: cards.cancelledOrders,
      icon: <FaTimesCircle />,
      gradient: "from-red-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          gradient={item.gradient}
        />
      ))}
    </div>
  );
};

export default StatsCards;