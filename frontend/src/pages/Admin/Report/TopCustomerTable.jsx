import { FiUser, FiShoppingBag, FiDollarSign } from "react-icons/fi";

const TopCustomersTable = ({ customers }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Top Customers
          </h2>

          <p className="mt-1 text-gray-500">
            Customers with the highest spending.
          </p>
        </div>

        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
          <FiUser size={24} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-left">Rank</th>

              <th className="px-5 py-4 text-left">
                Customer
              </th>

              <th className="px-5 py-4 text-left">
                Orders
              </th>

              <th className="px-5 py-4 text-left">
                Total Spent
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-500"
                >
                  No customer data available.
                </td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr
                  key={customer._id}
                  className="border-b transition hover:bg-indigo-50"
                >
                  <td className="px-5 py-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                      #{index + 1}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                        <img src={customer.profile} className="w-full h-full object-contain rounded-full" alt={customer.name} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {customer.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                      <FiShoppingBag className="text-blue-500" />

                      {customer.totalOrders.toLocaleString()}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2 font-bold text-green-600">
                      <FiDollarSign />

                      ₹{customer.totalSpent.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {customers.length > 0 && (
        <div className="mt-5 flex items-center justify-between border-t pt-5 text-sm text-gray-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {customers.length}
            </span>{" "}
            top customers
          </p>

          <p>Ranked by highest spending</p>
        </div>
      )}
    </div>
  );
};

export default TopCustomersTable;