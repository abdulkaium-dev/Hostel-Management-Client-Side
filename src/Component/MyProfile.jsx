import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import axiosInstance from "../Api/axios";

const MyProfile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser?.email) {
      axiosInstance
        .get(`/users/${authUser.email}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [authUser]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-300 font-medium">
        Loading user info...
      </p>
    );

  if (!user)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">
        User not found
      </p>
    );

  const badgeLabel = user.badge || "Bronze";
  const badgeClass = {
    Bronze: "bg-orange-500",
    Silver: "bg-gray-400",
    Gold: "bg-yellow-500",
    Platinum: "bg-purple-700",
  }[badgeLabel] || "bg-orange-500";

  return (
    <div className="p-5 max-w-3xl mx-auto space-y-6 min-h-screen 
                    bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">
        My Profile
      </h2>

      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start md:gap-8 transition hover:shadow-2xl overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-white to-cyan-100 opacity-20 dark:from-indigo-800 dark:via-gray-800 dark:to-cyan-900 rounded-xl pointer-events-none" />

        <img
          src={user.photoURL || "https://via.placeholder.com/96"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 mb-4 md:mb-0 z-10"
        />

        <div className="text-center md:text-left space-y-2 z-10">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {user.displayName || "No Name"}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
            📧 {user.email || "No Email"}
          </p>
          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
            📞 {user.phoneNumber || "No Phone"}
          </p>
          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
            🏠 {user.address || "No Address"}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            🗓 Member since: {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <span
            className={`inline-block px-5 py-1 rounded-full text-white font-semibold ${badgeClass} text-sm`}
          >
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
