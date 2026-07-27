import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";

// Same motion vocabulary used across Home, CategoryGrid, and
// RestaurantDetails, so this page feels like part of the same app.
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (staggerChildren = 0.06) => ({
  hidden: {},
  show: { transition: { staggerChildren } },
});

const Restaurants = () => {
  const categories = ["All", "Pizza", "Burger", "Fast Food", "Biryani"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || restaurant.description === selectedCategory;

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

  useEffect(() => {
    const getAllRestaurant = async () => {
      try {
        const res = await axiosInstance("/user/restaurants");
        if (res.data.success) {
          toast.success("All restaurants");
          setRestaurants(res.data.data);
        }
      } catch (error) {
        console.log("Error fetching restaurant");
      }
    };
    getAllRestaurant();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-8 py-14">
        {/* Heading */}
        <motion.div
          className="text-center"
          initial="hidden"
          animate="show"
          variants={stagger(0.1)}
        >
          <motion.h1 variants={fadeUp} className="text-5xl font-black text-gray-800">
            🍽️ Explore Restaurants
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500">
            Find your favourite restaurants and delicious meals near you.
          </motion.p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-6 py-4 pr-16 text-lg shadow-md outline-none transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg"
            >
              <FiSearch size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Filter + Sort */}
        <motion.div
          className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative rounded-full px-5 py-2 font-semibold transition-colors ${
                    isSelected
                      ? "text-white"
                      : "border border-gray-300 bg-white hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {/* layoutId lets the orange pill glide between buttons
                      instead of popping between them instantly. */}
                  {isSelected && (
                    <motion.span
                      layoutId="categoryPill"
                      className="absolute inset-0 rounded-full bg-orange-500"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">{category}</span>
                </motion.button>
              );
            })}
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
        </motion.div>

        {/* Restaurant Cards */}
        <motion.div layout className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-16 text-center"
              >
                <h2 className="text-3xl font-bold text-gray-700">
                  No Restaurants Found 😔
                </h2>

                <p className="mt-3 text-gray-500">
                  Try another search or category.
                </p>
              </motion.div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default Restaurants;