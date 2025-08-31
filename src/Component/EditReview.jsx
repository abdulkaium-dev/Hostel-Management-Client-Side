import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/reviews/${id}`)
      .then((res) => {
        setComment(res.data.comment || '');
      })
      .catch(() => {
        toast.error('Failed to load review.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setUpdating(true);

    axiosInstance.put(`/reviews/${id}`, { comment })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your review has been updated successfully.',
          confirmButtonColor: '#4F46E5',
        }).then(() => {
          navigate('/dashboard/my-reviews');
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Could not update the review. Please try again.',
          confirmButtonColor: '#4F46E5',
        });
      })
      .finally(() => setUpdating(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <p className="text-gray-900 dark:text-gray-100 text-lg font-medium transition-colors duration-300">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-6 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center transition-colors duration-300">
          Edit Your Review
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1 transition-colors duration-300">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-300"
            placeholder="Update your review..."
          />

          <button
            type="submit"
            disabled={updating}
            className={`w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 ${
              updating ? 'cursor-not-allowed bg-gray-400 dark:bg-gray-600' : ''
            }`}
          >
            {updating ? 'Updating...' : 'Update Review'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard/my-reviews')}
            className="w-full py-3 border border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReview;
