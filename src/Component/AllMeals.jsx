import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../Api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../Auth/AuthContext";

const AllMeals = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("likes");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/all-meals?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`
      );
      setMeals(response.data.meals);
      setTotal(response.data.total);
    } catch (err) {
      setError("Failed to load meals");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeals();
  }, [sortBy, order, page]);

  const handleDelete = async (mealId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#06B6D4",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.delete(`/meals/${mealId}`, {
        headers: { "x-admin-email": user?.email || "" },
      });
      if (res.data.success) {
        Swal.fire("Deleted!", "The meal has been deleted.", "success");
        fetchMeals();
      } else {
        Swal.fire("Error", res.data.message || "Deletion failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to delete meal.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg mt-10 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-8">
        All Meals
      </h2>

      {/* Sorting Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 text-gray-800 dark:text-gray-100 font-semibold">
        <label className="flex items-center space-x-2">
          <span>Sort by:</span>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] bg-white dark:bg-gray-800 dark:text-gray-100"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="likes">Likes</option>
            <option value="reviewCount">Reviews Count</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        <label className="flex items-center space-x-2">
          <span>Order:</span>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] bg-white dark:bg-gray-800 dark:text-gray-100"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {loading && <p className="text-center text-gray-600 dark:text-gray-300 py-8">Loading meals...</p>}
      {error && <p className="text-center text-red-600 py-8 font-semibold">{error}</p>}
      {!loading && meals.length === 0 && (
        <p className="text-center italic text-gray-600 dark:text-gray-300 py-8">No meals found.</p>
      )}

      {/* Table / Cards */}
      {!loading && meals.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <table className="w-full min-w-[700px] table-auto border-collapse">
              <thead>
                <tr className="bg-indigo-600 dark:bg-indigo-700 text-white select-none">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-center">Likes</th>
                  <th className="px-4 py-3 text-center">Reviews</th>
                  <th className="px-4 py-3 text-center">Rating</th>
                  <th className="px-4 py-3 text-left">Distributor</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal, i) => (
                  <tr
                    key={meal._id}
                    className={
                      i % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }
                  >
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{meal.title}</td>
                    <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{meal.likes}</td>
                    <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{meal.reviewCount}</td>
                    <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{meal.rating?.toFixed(1) ?? "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{meal.distributorName || "N/A"}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/meals/update/${meal._id}`)}
                        className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-md text-xs sm:text-sm transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => navigate(`/meal/${meal._id}`)}
                        className="bg-secondary hover:bg-secondary/90 text-white px-3 py-1 rounded-md text-xs sm:text-sm transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(meal._id)}
                        className="border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-700/20 px-3 py-1 rounded-md text-xs sm:text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{meal.title}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Likes:</span> {meal.likes}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Reviews:</span> {meal.reviewCount}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Rating:</span> {meal.rating?.toFixed(1) ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Distributor:</span> {meal.distributorName || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/meals/update/${meal._id}`)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-700/20 px-3 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            page === 1
              ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-2 border-primary text-primary hover:bg-primary/10"
          }`}
        >
          Prev
        </button>
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            page >= totalPages
              ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-2 border-primary text-primary hover:bg-primary/10"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllMeals;
