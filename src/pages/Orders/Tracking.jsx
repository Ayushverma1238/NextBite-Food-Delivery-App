const Tracking = () => {
  const order = {
    id: "#NB1025",
    restaurant: "Pizza Palace",
    estimatedTime: "20 mins",
    status: "Preparing",
  };

  const steps = [
    "Order Placed",
    "Restaurant Accepted",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStep = 2;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">Track Order</h1>

      <div className="border rounded-xl shadow-lg p-6 bg-white">
        <h2 className="text-2xl font-semibold">🍕 {order.restaurant}</h2>

        <p className="text-gray-500 mt-2">Order ID: {order.id}</p>

        <p className="mt-2">
          Estimated Delivery:{" "}
          <span className="font-semibold">{order.estimatedTime}</span>
        </p>

        <div className="mt-8 space-y-5">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded-full ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>

              <p
                className={`${
                  index <= currentStep
                    ? "font-semibold text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
