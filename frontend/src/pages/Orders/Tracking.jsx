import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  FaStore,
  FaHome,
  FaCheckCircle,
  FaMotorcycle,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";

import axiosInstance from "../../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const restaurantIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3595/3595455.png",
  iconSize: [42, 42],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  iconSize: [40, 40],
});

const TrackOrder = () => {

  const { orderId } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState([])

  const getOrderDetails = async () => {
    try {
      const res = await axiosInstance.get(`/order/${orderId}/detail`);
      setRestaurantLocation(res.data.data.restaurant.location.coordinates)
      setOrder(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-xl font-semibold animate-pulse">
          Loading Order...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex justify-center items-center">
        Order not found
      </div>
    );
  }

  const restaurant = {
    lat: restaurantLocation[1],
    lng: restaurantLocation[0],
  };

  const user = {
    lat: order?.deliveryAddress.latitude,
    lng: order?.deliveryAddress.longitude,
  };

  const center = [
    (restaurant?.lat + user.lat) / 2,
    (restaurant?.lng + user.lng) / 2,
  ];

  const route = [
    [restaurant?.lat, restaurant?.lng],
    [user?.lat, user?.lng],
  ];

  const steps = [
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const currentIndex = steps.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-linear-to-r from-orange-500 to-red-500 text-white py-8 px-8 shadow-lg">

        <h1 className="text-4xl font-bold">
          Track Your Order
        </h1>

        <p className="mt-2 text-lg">
          Sit back and relax while we deliver your food 🍕
        </p>

      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Restaurant Card */}

        <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center mb-6">

          <div className="flex gap-5">

            <img
              src={order.restaurant.image}
              alt=""
              className="w-32 h-32 rounded-xl object-cover"
            />

            <div>

              <h2 className="text-3xl font-bold flex items-center gap-2">
                <FaStore />
                {order.restaurant.name}
              </h2>

              <p className="text-gray-500 mt-2">

                {order.restaurant.address}

              </p>

              <div className="mt-4 flex gap-3">

                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">

                  {order.paymentStatus}

                </span>

                <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full">

                  {order.paymentMethod}

                </span>

              </div>

            </div>

          </div>

          <div className="text-right">

            <h2 className="text-gray-500">
              Order Status
            </h2>

            <div className="text-2xl font-bold text-orange-600 mt-2">
              {order.orderStatus.replaceAll("_", " ")}
            </div>

            <div className="mt-4 text-3xl font-bold">
              ₹{order.totalAmount}
            </div>

          </div>

        </div>

        {/* Map */}

        <div className="rounded-2xl overflow-hidden shadow-lg">

          <MapContainer
            center={center}
            zoom={13}
            style={{
              height: "550px",
              width: "100%",
            }}
          >

            <TileLayer
              attribution="OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[restaurant?.lat, restaurant?.lng]}
              icon={restaurantIcon}
            >
              <Popup>

                🍕 {order?.restaurant.name}

              </Popup>
            </Marker>

            <Marker
              position={[user.lat, user.lng]}
              icon={userIcon}
            >
              <Popup>

                {order.deliveryAddress.fullName}

              </Popup>
            </Marker>

            <Polyline
              positions={route}
              color="orange"
              weight={7}
            />

          </MapContainer>

        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">

          {/* Timeline */}

          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">

            <h2 className="text-2xl font-bold mb-8">
              Delivery Progress
            </h2>

            {steps.map((step, index) => {

              const active = index <= currentIndex;

              return (
                <div
                  key={step}
                  className="flex gap-4 mb-8"
                >

                  <div
                    className={`w-6 h-6 rounded-full ${
                      active
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>

                  <div>

                    <h3 className="font-bold">

                      {step.replaceAll("_", " ")}

                    </h3>

                    <p className="text-gray-500">

                      {active
                        ? "Completed"
                        : "Waiting..."}

                    </p>

                  </div>

                </div>
              );
            })}

          </div>

          {/* Order Summary */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">

              {order.items.map((item) => (

                <div
                  key={item._id}
                  className="flex justify-between"
                >

                  <div>

                    <p className="font-semibold">

                      {item.food.name}

                    </p>

                    <p className="text-sm text-gray-500">

                      Qty : {item.quantity}

                    </p>

                  </div>

                  <p>

                    ₹{item.food.price * item.quantity}

                  </p>

                </div>

              ))}

              <hr />

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>

                  ₹{order.itemTotal}

                </span>

              </div>

              <div className="flex justify-between">

                <span>Delivery Fee</span>

                <span>

                  ₹{order.deliveryFee}

                </span>

              </div>

              <div className="flex justify-between">

                <span>Tax</span>

                <span>

                  ₹{order.tax}

                </span>

              </div>

              <div className="flex justify-between font-bold text-xl">

                <span>Total</span>

                <span>

                  ₹{order.totalAmount}

                </span>

              </div>

              <hr />

              <div>

                <div className="flex items-center gap-2 font-semibold mb-2">

                  <FaMapMarkerAlt />

                  Delivery Address

                </div>

                <p className="text-gray-600">

                  {order.deliveryAddress.houseNo},{" "}

                  {order.deliveryAddress.street},

                  {order.deliveryAddress.landmark},

                  {order.deliveryAddress.city},

                  {order.deliveryAddress.state}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default TrackOrder;