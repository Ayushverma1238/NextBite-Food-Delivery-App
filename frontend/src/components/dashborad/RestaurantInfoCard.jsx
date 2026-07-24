import {
  FaStore,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaEdit,
  FaUtensils,
  FaClipboardList,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const RestaurantInfoCard = ({ restaurant }) => {
  if (!restaurant) return null;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden mt-8">
      {/* Cover */}

      <div className="relative h-56">
        <img
          src={
            restaurant.image ||
            "https://placehold.co/1200x500?text=Restaurant"
          }
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="text-3xl font-bold">
            {restaurant.name}
          </h2>

          <p className="mt-2 text-white/90">
            {restaurant.description}
          </p>
        </div>

        <div
          className={`absolute top-5 right-5 px-4 py-2 rounded-full font-semibold ${
            restaurant.isOpen
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {restaurant.isOpen ? "Open" : "Closed"}
        </div>
      </div>

      {/* Content */}

      <div className="grid lg:grid-cols-2 gap-8 p-8">
        {/* Restaurant Details */}

        <div>
          <h3 className="text-xl font-bold mb-6">
            Restaurant Details
          </h3>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <FaStore className="text-orange-500 text-xl" />

              <div>
                <p className="text-sm text-gray-500">
                  Restaurant Name
                </p>

                <h4 className="font-semibold">
                  {restaurant.name}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-blue-500 text-xl" />

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <h4 className="font-semibold">
                  {restaurant.phone}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-green-500 text-xl" />

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <h4 className="font-semibold">
                  {restaurant.email}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-red-500 text-xl" />

              <div>
                <p className="text-sm text-gray-500">
                  Address
                </p>

                <h4 className="font-semibold">
                  {restaurant.address}, {restaurant.city},{" "}
                  {restaurant.state}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}

        <div>
          <h3 className="text-xl font-bold mb-6">
            Overview
          </h3>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-orange-50 rounded-2xl p-5">
              <FaStar className="text-yellow-500 text-2xl mb-3" />

              <p className="text-sm text-gray-500">
                Rating
              </p>

              <h3 className="text-3xl font-bold">
                {restaurant.rating || 0}
              </h3>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              <FaClock className="text-blue-500 text-2xl mb-3" />

              <p className="text-sm text-gray-500">
                Reviews
              </p>

              <h3 className="text-3xl font-bold">
                {restaurant.totalReviews || 0}
              </h3>
            </div>
          </div>

          {/* Quick Actions */}

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-5">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/owner/settings"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition"
              >
                <FaEdit />
                Edit
              </Link>

              <Link
                to="/owner/food"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition"
              >
                <FaUtensils />
                Menu
              </Link>

              <Link
                to="/owner/orders"
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition"
              >
                <FaClipboardList />
                Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfoCard;