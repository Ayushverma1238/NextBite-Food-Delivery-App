import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Restaurants", path: "/admin/restaurants", icon: "🍽️" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Reports", path: "/admin/reports", icon: "📋" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gray-900 text-white transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">NextBite</h1>
            <p className="mt-2 text-sm text-gray-400">Admin Panel</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X size={26} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-800"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-700 p-4">
          <button className="w-full rounded-lg bg-red-500 py-3 font-semibold transition hover:bg-red-600">
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-6 py-5 shadow">
          <div className="flex items-center gap-4">
            {/* Hamburger */}
            <button
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={28} />
            </button>

            <h2 className="text-xl font-bold md:text-2xl">
              Welcome Admin 👋
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              A
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold">Admin</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;