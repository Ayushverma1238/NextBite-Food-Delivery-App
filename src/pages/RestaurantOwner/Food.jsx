const Food = () => {
  const foodItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 249,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600",
      veg: true,
      bestseller: true,
    },
    {
      id: 2,
      name: "Chicken Burger",
      price: 199,
      category: "Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
      veg: false,
      bestseller: false,
    },
    {
      id: 3,
      name: "Cold Coffee",
      price: 149,
      category: "Beverage",
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600",
      veg: true,
      bestseller: false,
    },
    {
      id: 4,
      name: "Chocolate Cake",
      price: 179,
      category: "Dessert",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
      veg: true,
      bestseller: true,
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">🍔 Manage Food</h1>

        <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
          + Add Food
        </button>
      </div>

      {/* Food Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {foodItems.map((food) => (
          <div
            key={food.id}
            className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              src={food.image}
              alt={food.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                    food.veg ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {food.veg ? "Veg" : "Non-Veg"}
                </span>

                {food.bestseller && (
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
                    Bestseller
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold">{food.name}</h2>

              <p className="mt-2 text-gray-500">Category: {food.category}</p>

              <p className="mt-2 text-lg font-semibold text-orange-500">
                ₹{food.price}
              </p>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-lg bg-blue-500 py-2 font-semibold text-white transition hover:bg-blue-600">
                  Edit
                </button>

                <button className="flex-1 rounded-lg bg-red-500 py-2 font-semibold text-white transition hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
