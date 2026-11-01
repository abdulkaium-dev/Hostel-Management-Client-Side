
import React, { useEffect, useState, useContext } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import axiosInstance from "../Api/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { AuthContext } from "../Auth/AuthContext";

const ITEMS_PER_PAGE = 10;

const RequestedMeals = () => {
  const { user } = useContext(AuthContext);

  const [requestedMeals, setRequestedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Requested Meals
  const fetchRequestedMeals = async (page = 1) => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get Firebase current user
      const firebaseUser = getAuth().currentUser;

      if (!firebaseUser) {
        toast.error("Please login again.");
        return;
      }

      // Get Firebase ID Token
      const token = await firebaseUser.getIdToken();

      const { data } = await axiosInstance.get(
        `/requested-meals/${encodeURIComponent(user.email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit: ITEMS_PER_PAGE,
          },
        }
      );

      setRequestedMeals(data.requests || []);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);

    } catch (err) {
      console.error(
        "Fetch Requested Meals Error:",
        err.response?.data || err.message
      );

      toast.error("Failed to fetch requested meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestedMeals(currentPage);
  }, [user?.email, currentPage]);

  // Cancel Requested Meal
  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this meal request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#06B6D4",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);

      const firebaseUser = getAuth().currentUser;

      if (!firebaseUser) {
        toast.error("Please login again.");
        return;
      }

      const token = await firebaseUser.getIdToken();

      await axiosInstance.delete(`/meal-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Meal request cancelled");

      await fetchRequestedMeals(currentPage);

    } catch (err) {
      console.error(
        "Cancel Meal Error:",
        err.response?.data || err.message
      );

      toast.error("Failed to cancel meal request");
    } finally {
      setDeletingId(null);
    }
  };

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          Loading your requested meals...
        </p>
      </div>
    );
  }

  // Empty State
  if (requestedMeals.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            No Requested Meals Found
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't requested any meals yet.
          </p>

          <Link
            to="/meals"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Explore Meals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Your Requested Meals
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Manage and track your requested meals.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                Meal Title
              </th>

              <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Likes
              </th>

              <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Reviews
              </th>

              <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Status
              </th>

              <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                Requested At
              </th>

              <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">

            {requestedMeals.map((meal) => (
              <tr
                key={meal._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >

                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {meal.mealTitle}
                </td>

                <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  {meal.likes ?? 0}
                </td>

                <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  {meal.reviewCount ?? 0}
                </td>

                <td className="py-4 px-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    meal.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : meal.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {meal.status || "Pending"}
                  </span>
                </td>

                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {meal.requestedAt
                    ? new Date(meal.requestedAt).toLocaleString()
                    : "N/A"}
                </td>

                <td className="py-4 px-4 text-center">

                  <button
                    onClick={() => handleCancel(meal._id)}
                    disabled={deletingId === meal._id}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition ${
                      deletingId === meal._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deletingId === meal._id
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>

                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8">

          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:text-white disabled:opacity-40"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
};

export default RequestedMeals;
