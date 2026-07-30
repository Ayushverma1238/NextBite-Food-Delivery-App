import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { FiSearch, FiTrash2, FiLock, FiUnlock } from "react-icons/fi";
import toast from 'react-toastify'
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users?.filter((user) =>
    `${user.fullName} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-lg font-semibold">Loading users...</div>
      </div>
    );
  }



  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            User Management
          </h1>

          <p className="mt-1 text-gray-500">
            Total Users : {users.length}
          </p>
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-orange-500 md:w-80"
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-none hover:bg-orange-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.avatar ||
                          "https://ui-avatars.com/api/?name=" + user.fullName
                        }
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.fullName}
                        </p>

                        <p className="text-sm text-gray-500">
                          {user.phone || "No Phone"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                        user.isBlocked
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                      onClick={()=> blockUser(user?._id)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                          user.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {user.isBlocked ? (
                          <>
                            <FiUnlock />
                            Unblock
                          </>
                        ) : (
                          <>
                            <FiLock />
                            Block
                          </>
                        )}
                      </button>

                      <button
                      onClick={() => handleDelete(user?._id)}
                      className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredUsers.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;