import { FaStar, FaShoppingBag, FaRupeeSign } from "react-icons/fa";

const TopRestaurants = ({ restaurants = [] }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            🏆 Top Restaurants
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Highest earning restaurants
          </p>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="flex h-60 items-center justify-center text-slate-400">
          No restaurant data found.
        </div>
      ) : (
        <div className="space-y-5">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:shadow-md"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    restaurant.image ||
                    "https://placehold.co/80x80?text=Restaurant"
                  }
                  alt={restaurant.restaurantName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {restaurant.restaurantName}
                  </h3>

                  <div className="mt-1 flex items-center gap-1">
                    <FaStar className="text-yellow-500" />

                    <span className="text-sm text-slate-600">
                      {restaurant.rating || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <FaRupeeSign />
                    <span className="font-bold">
                      {Number(
                        restaurant.revenue || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Revenue
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-indigo-600">
                    <FaShoppingBag />

                    <span className="font-bold">
                      {restaurant.totalOrders}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Orders
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopRestaurants;