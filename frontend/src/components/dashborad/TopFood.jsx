import {
  FaFire,
  FaMedal,
  FaShoppingBag,
} from "react-icons/fa";

const TopFoods = ({ foods }) => {
  if (!foods || foods.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Top Selling Foods
        </h2>

        <div className="h-72 flex items-center justify-center text-gray-400">
          No food sales yet.
        </div>
      </div>
    );
  }

  const badgeColors = [
    "bg-yellow-400",
    "bg-gray-300",
    "bg-orange-400",
    "bg-blue-400",
    "bg-green-400",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Top Selling Foods
          </h2>

          <p className="text-gray-500 mt-1">
            Best performing menu items
          </p>
        </div>

        <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-semibold">
          <FaFire />
          Trending
        </div>
      </div>

      {/* Food Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {foods.map((food, index) => (
          <div
            key={food._id || index}
            className="group rounded-3xl overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Image */}

            <div className="relative h-52 overflow-hidden bg-gray-100">
              <img
                src={
                  food.image ||
                  "https://placehold.co/600x400?text=Food"
                }
                alt={food.name}
                className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* Rank */}

              <div
                className={`absolute top-4 left-4 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${badgeColors[index]}`}
              >
                #{index + 1}
              </div>
            </div>

            {/* Content */}

            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {food.name}
              </h3>

              <div className="flex items-center justify-between mt-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Total Sold
                  </p>

                  <h4 className="text-2xl font-bold text-orange-600">
                    {food.totalSold}
                  </h4>
                </div>

                <div className="bg-orange-100 rounded-full p-3">
                  <FaShoppingBag
                    size={22}
                    className="text-orange-600"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <FaMedal className="text-yellow-500" />

                <span className="text-sm font-medium text-gray-600">
                  Best Seller
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFoods;