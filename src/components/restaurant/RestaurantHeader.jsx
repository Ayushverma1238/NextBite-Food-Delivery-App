const RestaurantHeader = ({ restaurant }) => {
  return (
    <section className="relative h-105">
      <img
        src={restaurant.coverImage}
        alt={restaurant.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="absolute bottom-10 left-10 text-white">
        <h1 className="text-5xl font-bold">{restaurant.name}</h1>

        <p className="mt-3 text-lg">{restaurant.cuisine}</p>

        <div className="flex gap-6 mt-5 text-lg">
          <span>⭐ {restaurant.rating}</span>
          <span>🕒 {restaurant.time}</span>
          <span>🚚 {restaurant.deliveryFee}</span>
        </div>

        <p className="mt-4">📍 {restaurant.location}</p>
      </div>
    </section>
  );
};

export default RestaurantHeader;
