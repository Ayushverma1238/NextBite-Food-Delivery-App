import {
  FiAward,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi";

const TopRestaurantsTable = ({ restaurants }) => {
  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
            🥇
          </span>
        );

      case 1:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-700">
            🥈
          </span>
        );

      case 2:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
            🥉
          </span>
        );

      default:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            #{index + 1}
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Top Performing Restaurants
          </h2>

          <p className="mt-1 text-gray-500">
            Restaurants ranked by total revenue.
          </p>
        </div>

        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
          <FiAward size={24} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-left">Rank</th>

              <th className="px-5 py-4 text-left">
                Restaurant
              </th>

              <th className="px-5 py-4 text-left">
                Total Orders
              </th>

              <th className="px-5 py-4 text-left">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody>
            {restaurants.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-500"
                >
                  No restaurant data available.
                </td>
              </tr>
            ) : (
              restaurants.map((restaurant, index) => (
                <tr
                  key={restaurant._id}
                  className="border-b transition hover:bg-orange-50"
                >
                  <td className="px-5 py-5">
                    {getRankBadge(index)}
                  </td>

                  <td className="px-5 py-5">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {restaurant.restaurant}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Top Seller
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                      <FiShoppingBag className="text-blue-500" />

                      {restaurant.totalOrders.toLocaleString()}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2 font-bold text-green-600">
                      <FiDollarSign />

                      ₹
                      {restaurant.revenue.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {restaurants.length > 0 && (
        <div className="mt-5 flex items-center justify-between border-t pt-5 text-sm text-gray-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {restaurants.length}
            </span>{" "}
            top restaurants
          </p>

          <p>Ranked by highest revenue</p>
        </div>
      )}
    </div>
  );
};

export default TopRestaurantsTable;