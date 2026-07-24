import { useState } from "react";

const Categories = () => {
  const [categories] = useState([
    {
      id: 1,
      name: "Pizza",
      items: 18,
    },
    {
      id: 2,
      name: "Burger",
      items: 14,
    },
    {
      id: 3,
      name: "Biryani",
      items: 10,
    },
    {
      id: 4,
      name: "Chinese",
      items: 16,
    },
    {
      id: 5,
      name: "Desserts",
      items: 12,
    },
    {
      id: 6,
      name: "Beverages",
      items: 20,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">📂 Category Management</h1>

        <button className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
          + Add Category
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search category..."
          className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-orange-500 md:w-96"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
        <table className="min-w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-5 py-4 text-left">Category</th>
              <th className="px-5 py-4 text-left">Food Items</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold">{category.name}</td>

                <td className="px-5 py-4">{category.items}</td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                      Edit
                    </button>

                    <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
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

export default Categories;
