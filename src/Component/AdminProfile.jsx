import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";

export const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchAdminProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://hotel-server-side-beta.vercel.app/admin/profile/${user.email}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch admin profile");
        }
        const data = await res.json();
        setAdminData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [user?.email]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-300 font-medium">
        Loading profile...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
    );

  if (!adminData) return null;

  const badgeLabel = adminData.role || "Admin";
  const badgeClass = {
    Admin: "bg-indigo-600 dark:bg-indigo-500",
    SuperAdmin: "bg-purple-700 dark:bg-purple-600",
  }[badgeLabel] || "bg-indigo-600 dark:bg-indigo-500";

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">
        My Profile
      </h2>

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-white to-cyan-100 dark:from-indigo-900 dark:via-gray-800 dark:to-cyan-900 opacity-20 rounded-xl pointer-events-none" />

        {/* Profile Image */}
        <img
          src={adminData.image || user.photoURL || "https://via.placeholder.com/96"}
          alt={adminData.name || user.displayName || "Admin"}
          className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 mb-4 md:mb-0 z-10"
        />

        {/* Profile Info */}
        <div className="text-center md:text-left space-y-2 z-10">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {adminData.name || user.displayName}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">📧 {adminData.email || user.email}</p>
          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">📞 {adminData.phoneNumber || "No Phone"}</p>
          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">🏠 {adminData.address || "No Address"}</p>
          <p className="text-gray-600 dark:text-gray-300">
            🗓 Member since: {adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : "N/A"}
          </p>

          <span className={`inline-block px-5 py-1 rounded-full text-white font-semibold ${badgeClass} text-sm`}>
            {badgeLabel}
          </span>

          <div className="mt-4 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-4 py-2 rounded-full font-semibold text-base sm:text-lg shadow-sm">
            Meals Added: {adminData.mealsAddedCount ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};
