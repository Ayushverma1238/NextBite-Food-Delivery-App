import { createContext, useState } from "react";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (restaurant) => {
    setWishlist((prev) => [...prev, restaurant]);
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavourite = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // ⭐ Missing Function
  const toggleWishlist = (restaurant) => {
    if (isFavourite(restaurant.id)) {
      removeFromWishlist(restaurant.id);
    } else {
      addToWishlist(restaurant);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isFavourite,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
