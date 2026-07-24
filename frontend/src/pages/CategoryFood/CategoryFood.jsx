import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Plus, UtensilsCrossed } from "lucide-react";
import axiosInstance from "../../api/axios";

export default function CategoryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryName = searchParams.get("name") || "";

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryName) return;

    const controller = new AbortController();

    const fetchFoodsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance(`/food/${categoryName}/category-food`, {
          signal: controller.signal,
        });

        setFoods(res.data.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Something went wrong while loading food items.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFoodsByCategory();

    return () => controller.abort();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header banner */}
      <div className="bg-linear-to-br from-orange-400 via-orange-500 to-amber-500 px-6 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-white/10" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to categories
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                {categoryName || "Category"}
              </h1>
              <p className="text-white/80 mt-1">
                {loading
                  ? "Finding the best dishes for you..."
                  : `${foods.length} dish${foods.length === 1 ? "" : "es"} available`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-16">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-sm overflow-hidden"
              >
                <div className="h-36 bg-slate-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2 animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-red-100 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-red-600 font-semibold">
              Couldn't load {categoryName} items
            </p>
            <p className="text-slate-500 text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && foods.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-7 h-7 text-orange-400" />
            </div>
            <p className="text-slate-700 font-semibold">
              No dishes found in {categoryName}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Check back later or browse another category.
            </p>
          </div>
        )}

        {!loading && !error && foods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed className="w-8 h-8 text-slate-300" />
                    </div>
                  )}

                  {food.rating != null && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-slate-700">
                        {food.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 leading-snug line-clamp-1">
                    {food.name}
                  </h3>
                  {food.restaurant.name && (
                    <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">
                      {food.restaurant.name}
                    </p>
                  )}
                  <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">
                      {food.description}
                    </p>

                  <div className="flex items-center justify-between mt-auto pt-4">
                    {food.price != null && (
                      <span className="text-orange-500 font-extrabold text-lg">
                        ${food.price}
                      </span>
                    )}
                    <button
                      className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 flex items-center justify-center transition-colors shadow-sm shadow-orange-200"
                      aria-label={`Add ${food.name} to cart`}
                    >
                      <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}