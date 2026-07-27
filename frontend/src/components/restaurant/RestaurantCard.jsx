import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WishlistContext } from "../../context/WishlistContext";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

function RestaurantCard({ restaurant }) {
  const { toggleWishlist, isFavourite } = useContext(WishlistContext);

  const favourite = isFavourite(restaurant.id);

  const handleWishlist = (e) => {
    e.preventDefault();

    toggleWishlist(restaurant);

    if (favourite) {
      toast.error("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist");
    }
  };

  return (
    <Link key={restaurant?._id} to={`/restaurant/${restaurant._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        <div className="relative overflow-hidden">
          <motion.img
            src={restaurant.image}
            alt={restaurant.name}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-52 w-full object-cover"
          />

          <motion.div
            className="absolute left-3 top-3 flex flex-col gap-2"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          >
            {restaurant.rating >= 4.8 && (
              <motion.span
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white"
              >
                ⭐ Top Rated
              </motion.span>
            )}

            {restaurant.deliveryFee === "Free Delivery" && (
              <motion.span
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white"
              >
                🚚 Free Delivery
              </motion.span>
            )}
          </motion.div>

          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.85 }}
            className="absolute right-3 top-3 bg-green-500 rounded-full p-2 shadow-md transition"
          >
            {/* AnimatePresence + key swap gives the heart a little pop
                whenever it toggles, instead of an instant icon swap. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={favourite ? "filled" : "empty"}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {favourite ? <FaHeart className="text-red-500" /> : <Heart />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="p-5">
          <h2 className="mt-2 text-xl font-bold text-gray-800">
            {restaurant.name}
          </h2>

          <p className="mt-2 text-gray-500">🍽️ {restaurant.description}</p>

          <p className="mt-2 text-sm text-gray-500">📍 {restaurant.address}</p>

          <div className="mt-5 flex items-center justify-between">
            <span className="rounded-lg bg-green-600 px-3 py-1 text-sm font-semibold text-white">
              ⭐ {restaurant.rating}
            </span>

            <span className="font-medium text-gray-600">
              ⏱ {restaurant.time}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default RestaurantCard;