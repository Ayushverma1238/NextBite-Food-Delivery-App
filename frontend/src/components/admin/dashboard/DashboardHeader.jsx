import { format } from "date-fns";
import {
  FiRefreshCw,
  FiDownload,
  FiBell,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import {useSelector} from "react-redux"

const DashboardHeader = ({ onRefresh }) => {
  const {user} = useSelector((state) => state.auth)
  return (
    <div className="mb-8 flex w- flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Welcome back 👋 Here's what's happening today.
        </p>

        <p className="mt-1 text-sm font-medium text-indigo-600">
          {format(new Date(), "EEEE, dd MMMM yyyy")}
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <FiRefreshCw size={18} />
          Refresh
        </button>

        {/* Export */}
        <button
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <FiDownload size={18} />
          Export
        </button>

        {/* Notification */}
        <button className="relative rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100">
          <FiBell size={20} className="text-slate-700" />

          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <img src={user.profile} alt={user.name} className="text-4xl h-10 w-10 ring-1 ring-gray-700 rounded-full object-contain text-indigo-600" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              System Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;