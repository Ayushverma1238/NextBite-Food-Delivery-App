import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useContext } from "react";
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
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl">
        <div className="relative overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-52 w-full object-cover transition-transform duration-500 hover:scale-110"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {restaurant.rating >= 4.8 && (
              <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                ⭐ Top Rated
              </span>
            )}

            {restaurant.deliveryFee === "Free Delivery" && (
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                🚚 Free Delivery
              </span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            className={`absolute right-3 top-3 bg-green-500 rounded-full p-2 shadow-md transition`}
          >
            {favourite ? <FaHeart className="text-red-500" /> : <Heart />}
          </button>
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
      </div>
    </Link>
  );
}

export default RestaurantCard;
