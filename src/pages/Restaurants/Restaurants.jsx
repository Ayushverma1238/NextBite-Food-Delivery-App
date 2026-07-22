import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import restaurants from "../../data/restaurants";

const Restaurants = () => {
  const categories = ["All", "Italian", "Fast Food", "Japanese", "Indian"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || restaurant.cuisine === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "time") {
        return parseInt(a.time) - parseInt(b.time);
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-8 py-14">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-gray-800">
            🍽️ Explore Restaurants
          </h1>

          <p className="mt-4 text-lg text-gray-500">
            Find your favourite restaurants and delicious meals near you.
          </p>
        </div>

        {/* Search */}
        <div className="mt-10 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-6 py-4 pr-16 text-lg shadow-md outline-none transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />

            <button className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg">
              <FiSearch size={20} />
            </button>
          </div>
        </div>

        {/* Filter + Sort */}
        <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 font-semibold transition ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "border border-gray-300 bg-white hover:bg-orange-500 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm outline-none focus:border-orange-500"
          >
            <option value="">Sort By</option>
            <option value="rating">⭐ Rating (High → Low)</option>
            <option value="time">⏱ Delivery Time</option>
            <option value="name">🔤 Name (A → Z)</option>
          </select>
        </div>

        {/* Restaurant Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <h2 className="text-3xl font-bold text-gray-700">
                No Restaurants Found 😔
              </h2>

              <p className="mt-3 text-gray-500">
                Try another search or category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
