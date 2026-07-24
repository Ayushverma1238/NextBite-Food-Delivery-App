import { formatDistanceToNow } from "date-fns";
import {
  FaMapMarkerAlt,
  FaStar,
  FaStore,
  FaUserCircle,
} from "react-icons/fa";

const RecentRestaurants = ({ restaurants = [] }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      {/* Header */}

      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <FaStore className="text-orange-500" />
          Recent Restaurants
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Newly joined restaurants
        </p>
      </div>

      {restaurants.length === 0 ? (
        <div className="flex h-60 items-center justify-center text-slate-400">
          No restaurants found.
        </div>
      ) : (
        <div className="space-y-5">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:shadow-md"
            >
              {/* Left */}

              <div className="flex items-center gap-4">
                <img
                  src={
                    restaurant.image ||
                    "https://placehold.co/80x80?text=Restaurant"
                  }
                  alt={restaurant.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {restaurant.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <FaMapMarkerAlt />

                    {restaurant.city}, {restaurant.state}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <FaStar className="text-yellow-500" />

                    <span className="text-sm">
                      {restaurant.rating || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right */}

              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {restaurant.owner?.avatar ? (
                    <img
                      src={restaurant.owner.avatar}
                      alt={restaurant.owner.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-slate-400" />
                  )}

                  <span className="text-sm font-semibold">
                    {restaurant.owner?.name}
                  </span>
                </div>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    restaurant.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>

                <p className="mt-2 text-xs text-slate-500">
                  {formatDistanceToNow(
                    new Date(restaurant.createdAt),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRestaurants;