import {
  FaFire,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";

const TopFoods = ({ foods = [] }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <FaFire className="text-orange-500" />
          Top Selling Foods
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Best performing menu items
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="flex h-60 items-center justify-center text-slate-400">
          No food data available.
        </div>
      ) : (
        <div className="space-y-5">
          {foods.map((food, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:shadow-md"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    food.image ||
                    "https://placehold.co/80x80?text=Food"
                  }
                  alt={food.foodName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {food.foodName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    ₹{Number(food.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-indigo-600">
                    <FaShoppingCart />

                    <span className="font-bold">
                      {food.sold}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Sold
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <FaRupeeSign />

                    <span className="font-bold">
                      {Number(food.revenue || 0).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Revenue
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

export default TopFoods;