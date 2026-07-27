import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import axiosInstance from "../../api/axios";
import CategoryGrid from "../CategoryFood/CategoryGrid";

// Reusable motion presets — keep them in one place so every section
// animates in with the same rhythm instead of scattered one-off effects.
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

const sectionViewport = { once: true, margin: "-80px" };

function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const details = async () => {
      try {
        const res = await axiosInstance("/user/restaurants", {
          withCredentials: true,
        });
        setRestaurants(res.data.data);
      } catch (error) {
        console.log("Error fetching restaurant data");
      }
    };
    details();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-linear-to-br from-orange-50 via-amber-50 to-orange-100">
        {/* Ambient floating food emoji — signature touch, kept subtle */}
        <motion.span
          className="pointer-events-none absolute text-6xl select-none opacity-20 left-[8%] top-[18%]"
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🍕
        </motion.span>
        <motion.span
          className="pointer-events-none absolute text-5xl select-none opacity-20 right-[12%] top-[12%]"
          animate={{ y: [0, 16, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          🥗
        </motion.span>
        <motion.span
          className="pointer-events-none absolute text-5xl select-none opacity-20 right-[22%] bottom-[16%]"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        >
          🍔
        </motion.span>

        <div className="relative max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10 w-full">
          {/* Left Side */}
          <motion.div
            className="flex-1"
            initial="hidden"
            animate="show"
            variants={stagger(0.12)}
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight tracking-tight"
            >
              Delicious Food
              <br />
              Delivered To Your
              <span className="text-orange-500"> Doorstep</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-gray-600 text-lg max-w-md">
              Order from your favourite restaurants with fast delivery, exciting
              offers and fresh meals every day.
            </motion.p>

            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 30px -8px rgba(249,115,22,0.55)" }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-xl shadow-lg transition-colors duration-300 hover:bg-orange-600"
            >
              🍔 Order Now
            </motion.button>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              whileHover={{ scale: 1.03, rotate: -1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
              alt="Pizza"
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* POPULAR RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <motion.h2
          className="text-4xl font-bold mb-10"
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          variants={fadeUp}
        >
          Popular Restaurants
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          variants={stagger(0.08)}
        >
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant._id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <RestaurantCard restaurant={restaurant} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-linear-to-br from-orange-200 via-orange-100 to-amber-200">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            variants={stagger(0.1)}
          >
            <motion.h2 variants={fadeUp} className="text-5xl font-extrabold text-gray-800">
              Explore Categories
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500">
              Discover delicious cuisines from your favourite restaurants.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            variants={fadeUp}
          >
            <CategoryGrid />
          </motion.div>
        </div>
      </section>

      {/* TODAY'S OFFERS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="mb-14"
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            variants={stagger(0.1)}
          >
            <motion.h2 variants={fadeUp} className="text-5xl font-extrabold text-gray-800">
              🔥 Today's Best Offers
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-3 text-lg text-gray-500">
              Don't miss these exclusive deals.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            variants={stagger(0.15)}
          >
            {/* Offer 1 */}
            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative overflow-hidden rounded-[35px] bg-linear-to-r from-orange-500 via-orange-400 to-yellow-400 p-10 shadow-2xl"
            >
              <motion.div
                className="absolute -right-10 -top-10 text-[170px] opacity-10"
                animate={{ rotate: [0, 8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                🍕
              </motion.div>

              <h3 className="text-4xl font-black text-white">Flat 50% OFF</h3>

              <p className="mt-3 text-orange-100 text-lg">
                On your first order above ₹499
              </p>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="mt-8 bg-white text-orange-500 px-7 py-3 rounded-full font-bold transition hover:bg-gray-100"
              >
                Order Now →
              </motion.button>
            </motion.div>

            {/* Offer 2 */}
            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative overflow-hidden rounded-[35px] bg-linear-to-r from-red-500 via-pink-500 to-rose-500 p-10 shadow-2xl"
            >
              <motion.div
                className="absolute -right-6 -top-6 text-[180px] opacity-70 rotate-12"
                animate={{ rotate: [12, 20, 12] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                🍔
              </motion.div>
              <h3 className="text-4xl font-black text-white">Buy 1 Get 1</h3>

              <p className="mt-3 text-pink-100 text-lg">
                Valid on selected restaurants.
              </p>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="mt-8 bg-white text-rose-500 px-7 py-3 rounded-full font-bold transition hover:bg-gray-100"
              >
                Explore →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TOP RATED */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            variants={stagger(0.1)}
          >
            <div>
              <motion.h2 variants={fadeUp} className="text-5xl font-extrabold text-gray-800">
                ⭐ Top Rated Restaurants
              </motion.h2>

              <motion.p variants={fadeUp} className="mt-3 text-lg text-gray-500">
                Loved by thousands of food lovers.
              </motion.p>
            </div>

            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:block border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-orange-500 hover:text-white"
            >
              View All →
            </motion.button>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            variants={stagger(0.08)}
          >
            {restaurants.slice(0, 4).map((restaurant) => (
              <motion.div
                key={restaurant._id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="bg-linear-to-r from-orange-500 via-orange-400 to-amber-400 rounded-[40px] overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={sectionViewport}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid lg:grid-cols-2 items-center gap-12 p-10 lg:p-16">
              {/* Left Side */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={sectionViewport}
                variants={stagger(0.1)}
              >
                <motion.h2 variants={fadeUp} className="text-5xl font-black text-white leading-tight">
                  Download the
                  <br />
                  NextBite App
                </motion.h2>

                <motion.p variants={fadeUp} className="mt-6 text-orange-100 text-lg leading-8">
                  Order your favourite food anytime, anywhere. Faster delivery,
                  exclusive app-only offers, and real-time order tracking.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="bg-black text-white px-7 py-4 rounded-2xl transition"
                  >
                    📱 Google Play
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="bg-white text-black px-7 py-4 rounded-2xl transition"
                  >
                    🍎 App Store
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Side */}
              <div className="flex justify-center">
                <motion.div
                  className="w-64 h-130 rounded-[45px] bg-white shadow-2xl border-8 border-gray-900 flex items-center justify-center"
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-8xl">📱</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <motion.footer
        className="bg-gray-900 text-gray-300 pt-16 pb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={sectionViewport}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo */}
            <div>
              <h2 className="text-3xl font-black text-orange-500">NextBite</h2>

              <p className="mt-5 leading-7 text-gray-400">
                Delicious food delivered fast to your doorstep. Fresh meals,
                exclusive offers, and an amazing experience.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-xl mb-5">Quick Links</h3>

              <ul className="space-y-3">
                <li>
                  <a href="/" className="hover:text-orange-400 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/restaurants"
                    className="hover:text-orange-400 transition"
                  >
                    Restaurants
                  </a>
                </li>
                <li>
                  <a href="/cart" className="hover:text-orange-400 transition">
                    Cart
                  </a>
                </li>
                <li>
                  <a
                    href="/orders"
                    className="hover:text-orange-400 transition"
                  >
                    Orders
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-bold text-xl mb-5">Support</h3>

              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-orange-400 transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-bold text-xl mb-5">
                Stay Updated
              </h3>

              <p className="text-gray-400 mb-4">
                Get the latest offers delivered to your inbox.
              </p>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-orange-500"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl text-white font-semibold transition"
              >
                Subscribe
              </motion.button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500">
            © 2026 NextBite. All rights reserved.
          </div>
        </div>
      </motion.footer>
    </>
  );
}

export default Home;