import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../Api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { AuthContext } from '../Auth/AuthContext';

const ITEMS_PER_PAGE = 10;

const RequestedMeals = () => {
  const { user } = useContext(AuthContext);

  const [requestedMeals, setRequestedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequestedMeals = async (page = 1) => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const { data } = await axiosInstance.get(`/requested-meals/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: ITEMS_PER_PAGE },
      });

      setRequestedMeals(data.requests);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch requested meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestedMeals(currentPage);
  }, [user?.email, currentPage]);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this meal request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5', // Indigo
      cancelButtonColor: '#06B6D4', // Cyan
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await axiosInstance.delete(`/meal-requests/${id}`);
      toast.success('Meal request cancelled');
      fetchRequestedMeals(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel meal request');
    } finally {
      setDeletingId(null);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300 font-medium">
        Loading your requested meals...
      </p>
    );

  if (requestedMeals.length === 0)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300 font-medium">
        No requested meals found.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left">
        Your Requested Meals
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                Meal Title
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Likes
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Reviews
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                Requested At
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {requestedMeals.map(({ _id, mealTitle, likes, reviewCount, status, requestedAt }) => (
              <tr key={_id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">{mealTitle}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">{likes}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">{reviewCount}</td>
                <td className="py-3 px-4 text-center text-sm capitalize text-gray-600 dark:text-gray-400">{status}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{new Date(requestedAt).toLocaleString()}</td>
                <td className="py-3 px-4 text-center text-sm">
                  <button
                    onClick={() => handleCancel(_id)}
                    disabled={deletingId === _id}
                    className={`inline-block px-3 py-1 rounded text-white font-medium transition-colors ${
                      deletingId === _id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {deletingId === _id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <span className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestedMeals;
