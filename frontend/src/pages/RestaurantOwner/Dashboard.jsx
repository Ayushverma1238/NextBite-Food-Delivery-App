import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

import DashboardHeader from "../../components/dashborad/DashboardHeader";
import StatsCards from "../../components/dashborad/StatsCards";
import RevenueChart from "../../components/dashborad/RevenueChart";
import OrderStatusChart from "../../components/dashborad/OrderStatusChart";
import TopFoods from "../../components/dashborad/TopFood";
import RecentOrdersTable from "../../components/dashborad/RecentOrdersTable";
import RestaurantInfoCard from "../../components/dashborad/RestaurantInfoCard";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/restaurant/dashboard");

      setDashboard(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h2 className="mt-6 text-xl font-semibold text-gray-700">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
          <h2 className="text-2xl font-bold text-red-500">
            Dashboard not found
          </h2>

          <p className="mt-3 text-gray-500">
            Unable to load dashboard data.
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <DashboardHeader restaurant={dashboard.restaurant} />

        {/* Statistics */}
        <StatsCards statistics={dashboard.statistics} />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RevenueChart
            monthlyRevenue={dashboard.monthlyRevenue}
          />

          <OrderStatusChart
            analytics={dashboard.orderStatusAnalytics}
          />
        </div>

        {/* Top Foods */}
        <TopFoods foods={dashboard.topFoods} />

        {/* Recent Orders */}
        <RecentOrdersTable
          orders={dashboard.recentOrders}
        />

        {/* Restaurant Information */}
        <RestaurantInfoCard
          restaurant={dashboard.restaurant}
        />
      </div>
    </div>
  );
};

export default OwnerDashboard;