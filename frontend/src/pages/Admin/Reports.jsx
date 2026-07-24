import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

import SummaryCards from "./Report/SummaryCards";
import RevenueCards from "./Report/RevenueCards";
import TopRestaurantsTable from "./Report/TopRestaurantTable";
import TopCustomersTable from "./Report/TopCustomerTable";
import StatisticsCards from "./Report/StatisticsCards";

const Reports = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({});
  const [revenue, setRevenue] = useState({});
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [statistics, setStatistics] = useState({});

  const getReports = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/report");

      const data = res.data.data;

      setSummary(data.summary);
      setRevenue(data.revenue);
      setTopRestaurants(data.topRestaurants);
      setTopCustomers(data.topCustomers);
      setStatistics(data.statistics);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-gray-500">
            View business performance and overall statistics.
          </p>
        </div>

        <button
          onClick={getReports}
          className="rounded-xl bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-600"
        >
          Refresh Report
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Revenue Cards */}
      <RevenueCards revenue={revenue} />

      {/* Top Restaurants */}
      <TopRestaurantsTable restaurants={topRestaurants} />

      {/* Top Customers */}
      <TopCustomersTable customers={topCustomers} />

      {/* Statistics */}
      <StatisticsCards statistics={statistics} />
    </div>
  );
};

export default Reports;