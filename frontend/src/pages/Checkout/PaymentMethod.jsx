import { FaMoneyBillWave, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  const methods = [
    {
      id: "RAZORPAY",
      title: "Online Payment",
      subtitle: "Pay securely using Razorpay",
      icon: <FaCreditCard className="text-2xl text-blue-600" />,
    },
    {
      id: "COD",
      title: "Cash on Delivery",
      subtitle: "Pay when your order arrives",
      icon: <FaMoneyBillWave className="text-2xl text-green-600" />,
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold text-gray-800">
        Payment Method
      </h2>

      <div className="space-y-4">
        {methods.map((method) => {
          const selected = paymentMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                selected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {method.icon}

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {method.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {method.subtitle}
                    </p>
                  </div>
                </div>

                {selected ? (
                  <FaCheckCircle className="text-2xl text-green-600" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Payment Info */}
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        {paymentMethod === "RAZORPAY" ? (
          <>
            <p className="font-medium text-gray-800">
              💳 Online Payment
            </p>

            <p className="mt-1 text-sm text-gray-600">
              You'll be redirected to Razorpay's secure payment page
              after clicking <strong>Place Order</strong>.
            </p>
          </>
        ) : (
          <>
            <p className="font-medium text-gray-800">
              💵 Cash on Delivery
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Please keep the exact amount ready when your order is
              delivered.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;