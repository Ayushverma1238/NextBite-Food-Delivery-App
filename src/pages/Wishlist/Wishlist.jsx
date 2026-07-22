import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import RestaurantCard from "../../components/restaurant/RestaurantCard";

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);

  if (wishlist.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h1 className="text-4xl font-bold">❤️ Your Wishlist is Empty</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {wishlist.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
