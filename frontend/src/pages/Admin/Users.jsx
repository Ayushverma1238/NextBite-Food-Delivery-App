import { useState } from "react";

const Users = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@gmail.com",
      role: "Restaurant Owner",
      status: "Blocked",
    },
    {
      id: 3,
      name: "Amit Verma",
      email: "amit@gmail.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: 4,
      name: "Sneha Gupta",
      email: "sneha@gmail.com",
      role: "Customer",
      status: "Active",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">👥 User Management</h1>

        <input
          type="text"
          placeholder="Search users..."
          className="w-72 rounded-lg border bg-white px-4 py-2 outline-none focus:border-orange-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
        <table className="min-w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Role</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold">{user.name}</td>

                <td className="px-5 py-4">{user.email}</td>

                <td className="px-5 py-4">{user.role}</td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                      user.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
                      {user.status === "Active" ? "Block" : "Unblock"}
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

export default Users;
