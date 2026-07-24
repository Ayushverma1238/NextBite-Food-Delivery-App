import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import StatsCards from "../../components/admin/dashboard/StatsCards";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import WeeklyOrdersChart from "../../components/admin/dashboard/WeeklyOrdersChart";
import OrderStatusChart from "../../components/admin/dashboard/OrderStatusChart";
import TopRestaurants from "../../components/admin/dashboard/TopRestaurants";
import TopFoods from "../../components/admin/dashboard/TopFoods";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import RecentUsers from "../../components/admin/dashboard/RecentUsers";
import RecentRestaurants from "../../components/admin/dashboard/RecentRestaurants";
import DashboardSkeleton from "../../components/admin/dashboard/DashboardSkeleton";
import EmptyState from "../../components/admin/dashboard/EmptyState";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/dashboard-analytics");
      console.log("Dashbaord res", res);
      setDashboard(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboard) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description="Something went wrong while loading analytics."
      />
    );
  }

  const cards = {
    totalUsers: dashboard.cards.totalUsers,
    totalCustomers: dashboard.cards.totalCustomers,
    totalOwners: dashboard.cards.totalOwners,
    totalRestaurants: dashboard.cards.totalRestaurants,
    totalFoods: dashboard.cards.totalFoods,
    totalOrders: dashboard.cards.totalOrders,
    totalRevenue: dashboard.cards.totalRevenue,
    todayRevenue: dashboard.cards.todayRevenue,
    todayOrders: dashboard.cards.todayOrders,
    pendingOrders: dashboard.cards.pendingOrders,
    deliveredOrders: dashboard.cards.deliveredOrders,
    cancelledOrders: dashboard.cards.cancelledOrders,
  };

  return (
    <div className="space-y-8 p-6 overflow-x-hidden bg-slate-100 min-h-screen ">
      {/* Header */}
      <DashboardHeader refreshDashboard={fetchDashboard} />

      {/* Stats */}
      <StatsCards cards={cards} />

      <RevenueChart data={dashboard.charts.monthlyRevenue || []} />
      {/* Charts */}
      {/* <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart
            data={dashboard.charts.monthlyRevenue || []}
          />
        </div>

        <OrderStatusChart
          data={dashboard.charts.orderStatus || {}}
        />
      </div> */}

      <OrderStatusChart data={dashboard.charts.orderStatus || {}} />
      {/* Weekly Orders */}
      <WeeklyOrdersChart data={dashboard.charts.weeklyOrders || []} />

      {/* Top Lists */}
      <div className="grid gap-6 xl:grid-cols-2 w-full">
        <TopRestaurants restaurants={dashboard.topRestaurants || []} />

        <TopFoods foods={dashboard.topFoods || []} />
      </div>

      {/* Recent Users & Restaurants */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders orders={dashboard.recentOrders || []} />

        <RecentRestaurants restaurants={dashboard.recentRestaurants || []} />
      </div>

      {/* Orders */}
      <RecentUsers users={dashboard.recentUsers || []} />
    </div>
  );
};

export default Dashboard;
