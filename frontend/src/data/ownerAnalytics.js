const ownerAnalytics = {
  stats: {
    todayRevenue: 12580,
    monthlyRevenue: 345000,
    totalOrders: 840,
    averageRating: 4.8,
  },

  revenue: [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 70000 },
    { month: "Jun", revenue: 69000 },
  ],

  categories: [
    { name: "Pizza", sales: 35 },
    { name: "Burger", sales: 20 },
    { name: "Biryani", sales: 25 },
    { name: "Chinese", sales: 10 },
    { name: "Desserts", sales: 10 },
  ],

  topFoods: [
    {
      name: "Margherita Pizza",
      orders: 220,
    },
    {
      name: "Chicken Biryani",
      orders: 185,
    },
    {
      name: "Veg Burger",
      orders: 160,
    },
    {
      name: "Paneer Pizza",
      orders: 145,
    },
    {
      name: "French Fries",
      orders: 120,
    },
  ],
};

export default ownerAnalytics;
