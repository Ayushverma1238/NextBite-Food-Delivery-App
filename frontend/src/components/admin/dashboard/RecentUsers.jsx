import { formatDistanceToNow } from "date-fns";
import {
  FaUserCircle,
  FaEnvelope,
  FaUserTag,
} from "react-icons/fa";

const RecentUsers = ({ users = [] }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          👥 Recent Users
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Newly registered users
        </p>
      </div>

      {users.length === 0 ? (
        <div className="flex h-60 items-center justify-center text-slate-400">
          No users found.
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:shadow-md"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                {user.profile ? (
                  <img
                    src={user.profile}
                    alt={user.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <FaUserCircle className="text-4xl text-slate-500" />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {user.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <FaEnvelope />
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <FaUserTag />
                  {user.role || "USER"}
                </span>

                <p className="mt-2 text-xs text-slate-500">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentUsers;