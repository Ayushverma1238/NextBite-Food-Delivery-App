import { useEffect, useState } from "react";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import restaurants from "../../data/restaurants";
import axiosInstance from "../../api/axios";
import CategoryGrid from "../CategoryFood/CategoryGrid";

const categories = [
  { id: 1, emoji: "🍕", name: "Pizza" },
  { id: 2, emoji: "🍔", name: "Burger" },
  { id: 3, emoji: "🍜", name: "Noodles" },
  { id: 4, emoji: "🍗", name: "Chicken" },
  { id: 5, emoji: "🥗", name: "Salad" },
  { id: 6, emoji: "🍰", name: "Desserts" },
];

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
      <section className="bg-orange-50 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Side */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              Delicious Food
              <br />
              Delivered To Your
              <span className="text-orange-500"> Doorstep</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg">
              Order from your favourite restaurants with fast delivery, exciting
              offers and fresh meals every day.
            </p>

            <button className="mt-8 bg-orange-500 hover:bg-orange-600 hover:scale-105 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300">
              🍔 Order Now
            </button>
          </div>

          {/* Right Side */}
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
              alt="Pizza"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold mb-10">Popular Restaurants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      </section>
      <section className="py-24 bg-linear-to-br from-orange-200 via-orange-100 to-amber-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-800">
              Explore Categories
            </h2>

            <p className="mt-4 text-lg text-gray-500">
              Discover delicious cuisines from your favourite restaurants.
            </p>
          </div>

          <CategoryGrid />
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-14">
            <h2 className="text-5xl font-extrabold text-gray-800">
              🔥 Today's Best Offers
            </h2>

            <p className="mt-3 text-lg text-gray-500">
              Don't miss these exclusive deals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Offer 1 */}
            <div className="relative overflow-hidden rounded-[35px] bg-linear-to-r from-orange-500 via-orange-400 to-yellow-400 p-10 shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="absolute -right-10 -top-10 text-[170px] opacity-10">
                🍕
              </div>

              <h3 className="text-4xl font-black text-white">Flat 50% OFF</h3>

              <p className="mt-3 text-orange-100 text-lg">
                On your first order above ₹499
              </p>

              <button className="mt-8 bg-white text-orange-500 px-7 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                Order Now →
              </button>
            </div>

            {/* Offer 2 */}

            <div className="relative overflow-hidden rounded-[35px] bg-linear-to-r from-red-500 via-pink-500 to-rose-500 p-10 shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="absolute -right-6 -top-6 text-[180px] opacity-70 rotate-12">
                🍔
              </div>
              <h3 className="text-4xl font-black text-white">Buy 1 Get 1</h3>

              <p className="mt-3 text-pink-100 text-lg">
                Valid on selected restaurants.
              </p>

              <button className="mt-8 bg-white text-rose-500 px-7 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                Explore →
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-5xl font-extrabold text-gray-800">
                ⭐ Top Rated Restaurants
              </h2>

              <p className="mt-3 text-lg text-gray-500">
                Loved by thousands of food lovers.
              </p>
            </div>

            <button className="hidden md:block border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300">
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.slice(0, 4).map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-linear-to-r from-orange-500 via-orange-400 to-amber-400 rounded-[40px] overflow-hidden">
            <div className="grid lg:grid-cols-2 items-center gap-12 p-10 lg:p-16">
              {/* Left Side */}
              <div>
                <h2 className="text-5xl font-black text-white leading-tight">
                  Download the
                  <br />
                  NextBite App
                </h2>

                <p className="mt-6 text-orange-100 text-lg leading-8">
                  Order your favourite food anytime, anywhere. Faster delivery,
                  exclusive app-only offers, and real-time order tracking.
                </p>

                <div className="flex flex-wrap gap-4 mt-10">
                  <button className="bg-black text-white px-7 py-4 rounded-2xl hover:scale-105 transition">
                    📱 Google Play
                  </button>

                  <button className="bg-white text-black px-7 py-4 rounded-2xl hover:scale-105 transition">
                    🍎 App Store
                  </button>
                </div>
              </div>

              {/* Right Side */}

              <div className="flex justify-center">
                <div className="w-64 h-130 rounded-[45px] bg-white shadow-2xl border-8 border-gray-900 flex items-center justify-center">
                  <span className="text-8xl">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
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

              <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl text-white font-semibold transition">
                Subscribe
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500">
            © 2026 NextBite. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
