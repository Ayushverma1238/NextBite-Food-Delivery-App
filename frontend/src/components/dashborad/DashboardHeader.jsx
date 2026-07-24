import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const DashboardHeader = ({ restaurant }) => {
  if (!restaurant) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-orange-400 to-amber-400 p-8 shadow-xl text-white">
      {/* Background Decorations */}
      <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-20 left-20 h-40 w-40 rounded-full bg-white/10"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Section */}
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white/30 bg-white shadow-lg">
            <img
              src={
                restaurant.image ||
                "https://placehold.co/300x300?text=Restaurant"
              }
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                {restaurant.name}
              </h1>

              <MdVerified className="text-blue-200 text-2xl" />
            </div>

            <p className="mt-2 max-w-xl text-sm text-orange-100">
              {restaurant.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>
                  {restaurant.city}, {restaurant.state}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaPhoneAlt />
                <span>{restaurant.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaStore />
                <span>
                  {restaurant.isOpen ? "Open Now" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/15 backdrop-blur-md px-6 py-5 text-center">
            <div className="flex justify-center text-yellow-300">
              <FaStar size={24} />
            </div>

            <h3 className="mt-2 text-3xl font-bold">
              {restaurant.rating || 0}
            </h3>

            <p className="text-sm text-orange-100">
              Average Rating
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 backdrop-blur-md px-6 py-5 text-center">
            <div className="text-3xl font-bold">
              {restaurant.totalReviews || 0}
            </div>

            <p className="mt-2 text-sm text-orange-100">
              Total Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Greeting */}
      <div className="relative z-10 mt-8 border-t border-white/20 pt-5 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Welcome back 👋
          </h2>

          <p className="text-orange-100 mt-1">
            Here's what's happening with your restaurant today.
          </p>
        </div>

        <div className="mt-4 md:mt-0 rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur">
          {restaurant.isOpen ? "🟢 Accepting Orders" : "🔴 Restaurant Closed"}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;