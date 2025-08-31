import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "https://hotel-server-side-beta.vercel.app",
});

const AllReviews = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchAllReviews = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/all-reviews?page=${page}&limit=${limit}`);
      const data = res.data;
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews(currentPage);
  }, [currentPage]);

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#06B6D4",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/reviews/${reviewId}`);
        Swal.fire("Deleted!", "Review has been deleted.", "success");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (error) {
        console.error("Delete review error:", error);
        Swal.fire("Error", "Failed to delete review.", "error");
      }
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-800 dark:text-gray-200 py-8 text-lg">
        Loading reviews...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg mt-10 transition-colors duration-300">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center sm:text-left">
        All Reviews
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-[700px] w-full table-auto border-collapse">
          <thead className="bg-indigo-600 dark:bg-indigo-700 text-white">
            <tr>
              <th className="p-3 text-left text-sm sm:text-base whitespace-nowrap">Meal Title</th>
              <th className="p-3 text-center text-sm sm:text-base whitespace-nowrap">Likes</th>
              <th className="p-3 text-left text-sm sm:text-base">Review Text</th>
              <th className="p-3 text-center text-sm sm:text-base whitespace-nowrap">Review Count</th>
              <th className="p-3 text-center text-sm sm:text-base whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review, i) => (
                <tr
                  key={review._id}
                  className={`hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors duration-150 ${
                    i % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <td className="p-3 text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    {review.mealTitle}
                  </td>
                  <td className="p-3 text-center text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    {review.mealLikes ?? 0}
                  </td>
                  <td className="p-3 text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    {review.comment || "No review text"}
                  </td>
                  <td className="p-3 text-center text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    {review.mealReviewCount ?? 0}
                  </td>
                  <td className="p-3 text-center space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center items-center">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-primary hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/meal/${review.mealId}`)}
                      className="bg-secondary hover:bg-cyan-500 text-white px-3 py-1 rounded text-xs sm:text-sm w-full sm:w-auto"
                    >
                      View Meal
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-800 dark:text-gray-200 italic">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-indigo-700"
          }`}
        >
          Prev
        </button>
        <span className="text-gray-800 dark:text-gray-100 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-indigo-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllReviews;
