import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axios";
import {
  FiSearch,
  FiTrash2,
  FiStar,
  FiPlus,
  FiLock,
  FiUnlock,
  FiShoppingBag,
  FiCheckCircle,
  FiSlash,
} from "react-icons/fi";

import AddRestaurantModal from "../../components/admin/AddRestaurantModel";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // restaurant object
  const [busyId, setBusyId] = useState(null); // id currently mid-action
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const getRestaurants = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/restaurants");

      setRestaurants(res.data.data.restaurants);
    } catch (error) {
      console.log(error);
      showToast("error", "Could not load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) =>
      `${restaurant.name} ${restaurant.owner?.fullName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [restaurants, search]);

  const stats = useMemo(() => {
    const total = restaurants.length;
    const open = restaurants.filter((r) => r.isOpen).length;
    const blocked = restaurants.filter((r) => r.isBlocked).length;
    return { total, open, blocked };
  }, [restaurants]);

  const handleToggleBlock = async (restaurant) => {
    const willBlock = !restaurant.isBlocked;
    const endpoint = willBlock
      ? `/admin/block-restaurant/${restaurant._id}`
      : `/admin/unblock-restaurant/${restaurant._id}`;

    try {
      setBusyId(restaurant._id);
      await axiosInstance.patch(endpoint);

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurant._id ? { ...r, isBlocked: willBlock } : r
        )
      );

      showToast(
        "success",
        `${restaurant.name} was ${willBlock ? "blocked" : "unblocked"}.`
      );
    } catch (error) {
      console.log(error);
      showToast("error", "Could not update restaurant status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(`/admin/delete-restaurant/${deleteTarget._id}`);

      setRestaurants((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      showToast("success", `${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
      showToast("error", "Could not delete this restaurant.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreated = (restaurant) => {
    if (restaurant) {
      setRestaurants((prev) => [restaurant, ...prev]);
    } else {
      getRestaurants();
    }
    showToast("success", "Restaurant created successfully.");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-lg font-semibold">
        Loading Restaurants...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-60 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Restaurant Management
          </h1>

          <p className="mt-1 text-gray-500">
            Total Restaurants : {restaurants.length}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search restaurant..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-orange-500 md:w-72"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-600"
          >
            <FiPlus />
            Add Restaurant
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<FiShoppingBag size={22} />}
          label="Total Restaurants"
          value={stats.total}
          accent="bg-orange-100 text-orange-600"
        />
        <StatCard
          icon={<FiCheckCircle size={22} />}
          label="Currently Open"
          value={stats.open}
          accent="bg-green-100 text-green-600"
        />
        <StatCard
          icon={<FiSlash size={22} />}
          label="Blocked"
          value={stats.blocked}
          accent="bg-red-100 text-red-600"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-250">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Restaurant</th>
                <th className="px-6 py-4 text-left">Owner</th>
                <th className="px-6 py-4 text-left">Rating</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRestaurants.map((restaurant) => (
                <tr
                  key={restaurant._id}
                  className="border-b last:border-none hover:bg-orange-50"
                >
                  {/* Restaurant */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {restaurant.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {restaurant.city}, {restaurant.state}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Owner */}

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        {restaurant.owner?.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {restaurant.owner?.email}
                      </p>
                    </div>
                  </td>

                  {/* Rating */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-yellow-500" />

                      <span>{restaurant.rating || 0}</span>
                    </div>
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold text-white ${
                          restaurant.isOpen ? "bg-green-500" : "bg-gray-400"
                        }`}
                      >
                        {restaurant.isOpen ? "Open" : "Closed"}
                      </span>

                      {restaurant.isBlocked && (
                        <span className="w-fit rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                          Blocked
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleToggleBlock(restaurant)}
                        disabled={busyId === restaurant._id}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition disabled:opacity-50 ${
                          restaurant.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {restaurant.isBlocked ? <FiUnlock /> : <FiLock />}
                        {restaurant.isBlocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        onClick={() => setDeleteTarget(restaurant)}
                        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredRestaurants.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    No restaurants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add restaurant modal */}
      <AddRestaurantModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={handleCreated}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this restaurant?"
        message={`This will permanently remove "${deleteTarget?.name}" from the platform. This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow">
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default Restaurants;