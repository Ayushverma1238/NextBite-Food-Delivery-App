import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axios";

import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import MenuItem from "../../components/restaurant/MenuItem";
import reviews from "../../data/reviews";

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState({
    restaurant: {},
    menu: [],
  });

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const getRestaurantDetail = async () => {
      try {
        const res = await axiosInstance.get(`/food/${id}/menu`);

        const data = res.data.data;

        setRestaurant(data);

        if (data.menu.length > 0) {
          setSelectedCategory(data.menu[0].category);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRestaurantDetail();
  }, [id]);

  const selectedMenu = useMemo(() => {
    return restaurant.menu.find((item) => item.category === selectedCategory);
  }, [restaurant, selectedCategory]);

  return (
    <>
      <RestaurantHeader restaurant={restaurant.restaurant} />

      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-4xl font-bold mb-8">Browse By Category</h2>

        <div className="flex gap-5 overflow-x-auto pb-5 scrollbar-hide">
          {restaurant.menu.map((item) => {
            const firstFood = item.foods?.[0];

            return (
              <div
                key={item.category}
                onClick={() => setSelectedCategory(item.category)}
                className={`min-w-70 rounded-3xl overflow-hidden my-5 mx-5 cursor-pointer shadow-lg transition-all duration-300
                ${
                  selectedCategory === item.category
                    ? "ring-4 ring-gray-500 scale-105"
                    : "hover:scale-105"
                }`}
              >
                <img
                  src={firstFood?.image}
                  alt={firstFood?.name}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5 bg-white">
                  <h3 className="text-2xl font-bold">{item.category}</h3>

                  <p className="text-gray-500 mt-2 line-clamp-2">
                    {firstFood?.description}
                  </p>

                  <div className="mt-4 text-orange-500 font-bold text-lg">
                    Starting ₹{firstFood?.price}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">{selectedCategory}</h2>

          <span className="text-gray-500">
            {selectedMenu?.foods?.length || 0} Items
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedMenu?.foods?.map((food) => (
            
              <MenuItem key={food._id} item={food} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold mb-8">Customer Reviews</h2>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between">
                <h3 className="font-bold text-xl">{review.user}</h3>

                <span className="text-gray-400">{review.date}</span>
              </div>

              <p className="text-yellow-500 mt-2">
                {"⭐".repeat(review.rating)}
              </p>

              <p className="text-gray-600 mt-3">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default RestaurantDetails;
