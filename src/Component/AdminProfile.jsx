
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import axiosInstance from "../Api/axios";

export const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get(
          `/admin/profile/${encodeURIComponent(user.email)}`,
          {
            signal: controller.signal,
          }
        );

        setAdminData(res.data);

      } catch (err) {
        if (
          err.code === "ERR_CANCELED" ||
          err.name === "CanceledError"
        ) {
          return;
        }

        console.error(
          "Admin Profile Error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
          (err.response
            ? `Server Error: ${err.response.status}`
            : "Unable to connect to server. Please check your internet connection.")
        );

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAdminProfile();

    return () => {
      controller.abort();
    };

  }, [user?.email, retry]);

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-center text-gray-500 dark:text-gray-300 font-medium">
          Loading profile...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md">

        <h3 className="text-xl font-bold text-red-500 mb-3">
          Failed to Load Profile
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-5">
          {error}
        </p>

        <button
          onClick={() => setRetry((prev) => prev + 1)}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          Try Again
        </button>

      </div>
    );
  }

  if (!adminData) {
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Admin profile not found.
      </p>
    );
  }

  const badgeLabel = adminData.role || "Admin";

  const badgeClass = {
    Admin: "bg-indigo-600 dark:bg-indigo-500",
    admin: "bg-indigo-600 dark:bg-indigo-500",
    SuperAdmin: "bg-purple-700 dark:bg-purple-600",
    superadmin: "bg-purple-700 dark:bg-purple-600",
  }[badgeLabel] || "bg-indigo-600 dark:bg-indigo-500";

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 space-y-6">

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">
        My Profile
      </h2>

      {/* Profile Card */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-white to-cyan-100 dark:from-indigo-900 dark:via-gray-800 dark:to-cyan-900 opacity-20 rounded-xl pointer-events-none" />

        {/* Profile Image */}
        <img
          src={
            adminData.image ||
            user?.photoURL ||
            "https://via.placeholder.com/96"
          }
          alt={adminData.name || user?.displayName || "Admin"}
          className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 mb-4 md:mb-0 z-10"
        />

        {/* Profile Information */}
        <div className="text-center md:text-left space-y-3 z-10">

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {adminData.name || user?.displayName || "Admin"}
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            📧 {adminData.email || user?.email}
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            📞 {adminData.phoneNumber || "No Phone"}
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            🏠 {adminData.address || "No Address"}
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            🗓 Member since:{" "}
            {adminData.createdAt
              ? new Date(adminData.createdAt).toLocaleDateString()
              : "N/A"}
          </p>

          {/* Role Badge */}
          <span
            className={`inline-block px-5 py-1 rounded-full text-white font-semibold ${badgeClass} text-sm`}
          >
            {badgeLabel}
          </span>

          {/* Meals Added */}
          <div className="mt-4 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-4 py-2 rounded-full font-semibold text-base sm:text-lg shadow-sm">
            Meals Added: {adminData.mealsAddedCount ?? 0}
          </div>

        </div>
      </div>
    </div>
  );
};
