import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../api/axios";

import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import MenuItem from "../../components/restaurant/MenuItem";
import reviews from "../../data/reviews";

// Same motion vocabulary used on the Home page and CategoryGrid,
// so every screen in the app animates with the same rhythm.
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (staggerChildren = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren } },
});

const sectionViewport = { once: true, margin: "-80px" };

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

      {/* CATEGORY CAROUSEL */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <motion.h2
          className="text-4xl font-bold mb-8"
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          variants={fadeUp}
        >
          Browse By Category
        </motion.h2>

        <motion.div
          className="flex gap-5 overflow-x-auto pb-5 scrollbar-hide"
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          variants={stagger(0.08)}
        >
          {restaurant.menu.map((item) => {
            const firstFood = item.foods?.[0];
            const isActive = selectedCategory === item.category;

            return (
              <motion.div
                key={item.category}
                variants={fadeUp}
                onClick={() => setSelectedCategory(item.category)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`min-w-70 rounded-3xl overflow-hidden my-5 mx-5 cursor-pointer shadow-lg transition-shadow duration-300
                ${isActive ? "ring-4 ring-gray-500 shadow-xl" : ""}`}
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
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* MENU ITEMS FOR SELECTED CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            key={`title-${selectedCategory}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="text-4xl font-bold"
          >
            {selectedCategory}
          </motion.h2>

          <span className="text-gray-500">
            {selectedMenu?.foods?.length || 0} Items
          </span>
        </div>

        {/* AnimatePresence lets the grid fade/slide out before the next
            category's items fade/slide in, instead of an abrupt swap. */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            variants={stagger(0.06)}
          >
            {selectedMenu?.foods?.map((food) => (
              <motion.div
                key={food._id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <MenuItem item={food} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.h2
          className="text-4xl font-bold mb-8"
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          variants={fadeUp}
        >
          Customer Reviews
        </motion.h2>

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          variants={stagger(0.1)}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-xl">{review.user}</h3>

                <span className="text-gray-400">{review.date}</span>
              </div>

              <p className="text-yellow-500 mt-2">
                {"⭐".repeat(review.rating)}
              </p>

              <p className="text-gray-600 mt-3">{review.comment}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}

export default RestaurantDetails;