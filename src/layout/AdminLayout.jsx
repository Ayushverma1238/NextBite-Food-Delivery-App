import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Restaurants", path: "/admin/restaurants", icon: "🍽️" },
    { name: "Categories", path: "/admin/categories", icon: "📂" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Reports", path: "/admin/reports", icon: "📋" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col">
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-3xl font-bold text-orange-500">NextBite</h1>

          <p className="mt-2 text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive ? "bg-orange-500 text-white" : "hover:bg-gray-800"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-700 p-4">
          <button className="w-full rounded-lg bg-red-500 py-3 font-semibold hover:bg-red-600">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="flex items-center justify-between bg-white px-8 py-5 shadow">
          <h2 className="text-2xl font-bold">Welcome Admin 👋</h2>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              A
            </div>

            <div>
              <p className="font-semibold">Admin</p>
              <p className="text-sm text-gray-500">admin@nextbite.com</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
