import { useParams } from "react-router-dom";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import MenuItem from "../../components/restaurant/MenuItem";
import restaurants from "../../data/restaurants";
import reviews from "../../data/reviews";

function RestaurantDetails() {
  const { id } = useParams();

  const restaurant = restaurants.find(
    (restaurant) => restaurant.id === Number(id),
  );

  const restaurantReviews = reviews.filter(
    (review) => review.restaurantId === restaurant?.id,
  );

  if (!restaurant) {
    return <h1 className="text-center text-3xl mt-20">Restaurant Not Found</h1>;
  }

  return (
    <>
      <RestaurantHeader restaurant={restaurant} />

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold mb-10">Our Menu</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurant.menu.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <h2 className="text-4xl font-bold mb-8">Customer Reviews</h2>

        <div className="space-y-6">
          {restaurantReviews.length > 0 ? (
            restaurantReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{review.user}</h3>

                  <span className="text-gray-500">{review.date}</span>
                </div>

                <p className="text-yellow-500 text-lg mb-2">
                  {"⭐".repeat(review.rating)}
                </p>

                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default RestaurantDetails;
