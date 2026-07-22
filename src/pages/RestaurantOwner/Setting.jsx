import { useState } from "react";

const Setting = () => {
  const [restaurant, setRestaurant] = useState({
    restaurantName: "NextBite Kitchen",
    ownerName: "Divyanshu Mishra",
    email: "owner@nextbite.com",
    phone: "9876543210",
    address: "Lucknow, Uttar Pradesh",
    openingTime: "09:00",
    closingTime: "23:00",
  });

  const handleChange = (e) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-4xl font-bold text-center">
          ⚙️ Restaurant Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={restaurant.restaurantName}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={restaurant.ownerName}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={restaurant.email}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={restaurant.phone}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Restaurant Address
            </label>
            <textarea
              rows="4"
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Opening Time</label>
              <input
                type="time"
                name="openingTime"
                value={restaurant.openingTime}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Closing Time</label>
              <input
                type="time"
                name="closingTime"
                value={restaurant.closingTime}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 py-3 text-lg font-semibold text-white transition hover:bg-orange-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
