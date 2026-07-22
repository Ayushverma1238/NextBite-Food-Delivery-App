import orders from "../../data/orders";

const Orders = () => {
  const orders = [
    {
      id: "#NB1025",
      restaurant: "Pizza Palace",
      items: [
        { name: "Margherita Pizza", quantity: 2 },
        { name: "Garlic Bread", quantity: 1 },
      ],
      total: 640,
      status: "Preparing",
      date: "21 July 2026 | 11:45 PM",
    },
    {
      id: "#NB1026",
      restaurant: "Burger Hub",
      items: [
        { name: "Cheese Burger", quantity: 2 },
        { name: "French Fries", quantity: 1 },
      ],
      total: 520,
      status: "Delivered",
      date: "20 July 2026 | 8:30 PM",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl shadow-lg p-6 bg-white"
          >
            <h2 className="text-2xl font-semibold">🍴 {order.restaurant}</h2>

            <p className="text-gray-500 mt-2">
              Order ID: <span className="font-medium">{order.id}</span>
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items</h3>

              <ul className="list-disc ml-6">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-orange-500">{order.status}</span>
              </p>

              <p>
                <strong>Total:</strong> ₹{order.total}
              </p>

              <p>
                <strong>Ordered On:</strong> {order.date}
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg transition">
                Track Order
              </button>

              <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-5 py-2 rounded-lg transition">
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
