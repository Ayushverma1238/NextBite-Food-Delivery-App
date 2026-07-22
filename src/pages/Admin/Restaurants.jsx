import { useState } from "react";

const Restaurants = () => {
  const [restaurants] = useState([
    {
      id: 1,
      name: "Pizza Hub",
      owner: "Rahul Sharma",
      rating: 4.8,
      status: "Pending",
    },
    {
      id: 2,
      name: "Burger Point",
      owner: "Priya Singh",
      rating: 4.5,
      status: "Approved",
    },
    {
      id: 3,
      name: "Biryani House",
      owner: "Amit Verma",
      rating: 4.7,
      status: "Pending",
    },
    {
      id: 4,
      name: "Coffee Corner",
      owner: "Sneha Gupta",
      rating: 4.4,
      status: "Rejected",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">🍽 Restaurant Management</h1>

        <input
          type="text"
          placeholder="Search restaurants..."
          className="w-72 rounded-lg border bg-white px-4 py-2 outline-none focus:border-orange-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
        <table className="min-w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-5 py-4 text-left">Restaurant</th>
              <th className="px-5 py-4 text-left">Owner</th>
              <th className="px-5 py-4 text-left">Rating</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold">{restaurant.name}</td>

                <td className="px-5 py-4">{restaurant.owner}</td>

                <td className="px-5 py-4">⭐ {restaurant.rating}</td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                      restaurant.status === "Approved"
                        ? "bg-green-500"
                        : restaurant.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  >
                    {restaurant.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
                      Approve
                    </button>

                    <button className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600">
                      Reject
                    </button>

                    <button className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Restaurants;
