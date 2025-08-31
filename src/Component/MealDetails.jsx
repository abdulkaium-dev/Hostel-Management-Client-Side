import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import axiosInstance from "../Api/axios";
import Swal from "sweetalert2";

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [postingReview, setPostingReview] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMeal(data);
        setLikeCount(data.likes || 0);
        setLiked(user?.email && data.likedBy?.includes(user.email));
      } catch {
        Swal.fire("Error", "Failed to fetch meal details.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id, user?.email]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/${id}`);
        setReviews(data);
        setReviewCount(data.length);
      } catch {
        Swal.fire("Error", "Failed to load reviews.", "error");
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (!user?.email || !id) return;

    let isMounted = true;

    const checkRequest = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/requested-meals/${user.email}?page=1&limit=100`
        );
        const alreadyRequested = data.requests?.some((req) => {
          if (typeof req.mealId === "string") return req.mealId === id;
          if (req.mealId?._id) return req.mealId._id === id;
          return false;
        });
        if (isMounted) setRequested(alreadyRequested);
      } catch (error) {
        console.error("Error checking meal request:", error);
      }
    };
    checkRequest();
    return () => {
      isMounted = false;
    };
  }, [user?.email, id]);

  const handleLike = async () => {
    if (!user) return Swal.fire("Login Required", "Please login to like meals.", "warning");
    if (liked) return;

    try {
      await axiosInstance.patch(`/meals/${id}/like`, { userEmail: user.email });
      setLikeCount((prev) => prev + 1);
      setLiked(true);
      Swal.fire("Liked!", "You liked the meal.", "success");
    } catch {
      Swal.fire("Error", "Failed to like the meal.", "error");
    }
  };

  const handleRequestMeal = async () => {
    if (!user) return Swal.fire("Login Required", "Please login to request meals.", "warning");

    try {
      const { data } = await axiosInstance.get(`/users/${user.email}`);
      if (!data.badge || data.badge === "Bronze") {
        return Swal.fire("Upgrade Required", "Only Silver, Gold, or Platinum users can request meals.", "info");
      }
      if (requested) return Swal.fire("Already Requested", "You have already requested this meal.", "info");

      setRequesting(true);
      await axiosInstance.post("/meal-requests", {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName || user.email,
      });
      setRequested(true);
      Swal.fire("Success!", "Meal request submitted successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.message || "Failed to request meal.", "error");
    } finally {
      setRequesting(false);
    }
  };

  const handlePostReview = async () => {
    if (!user) return Swal.fire("Login Required", "Please login to post reviews.", "warning");
    if (!newReview.trim()) return Swal.fire("Empty Comment", "Review cannot be empty.", "error");

    try {
      setPostingReview(true);
      await axiosInstance.post("/reviews", {
        mealId: id,
        userEmail: user.email,
        userName: user.displayName || user.email,
        comment: newReview.trim(),
      });
      setNewReview("");

      const { data } = await axiosInstance.get(`/reviews/${id}`);
      setReviews(data);
      setReviewCount(data.length);
      Swal.fire("Success!", "Review posted successfully.", "success");
    } catch {
      Swal.fire("Error", "Failed to post review.", "error");
    } finally {
      setPostingReview(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg font-medium dark:text-gray-200">Loading meal details...</p>;
  if (!meal)
    return <p className="text-center mt-10 text-lg font-medium dark:text-gray-200">Meal not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md my-10 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <img
          src={meal.image || "https://via.placeholder.com/600x400?text=No+Image"}
          alt={meal.title}
          className="w-full md:w-1/2 h-64 md:h-auto object-cover rounded-md"
        />
        <div className="mt-4 md:mt-0 md:flex-1 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{meal.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 mb-2">
            Distributor: <span className="font-semibold">{meal.distributor || "Unknown"}</span>
          </p>
          <p className="mb-2 text-gray-800 dark:text-gray-200">{meal.description || "No description available."}</p>
          <p className="mb-2 text-gray-800 dark:text-gray-200"><strong>Ingredients:</strong> {meal.ingredients || "N/A"}</p>
          <p className="text-sm text-gray-400 dark:text-gray-400 mb-2">Posted: {formatDate(meal.postedAt || meal.createdAt)}</p>

          <div className="text-yellow-500 text-xl mb-4">
            {"★".repeat(Math.round(meal.rating || 0))}
            {"☆".repeat(5 - Math.round(meal.rating || 0))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`w-full sm:w-auto px-5 py-2 rounded-md text-white ${
                liked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              👍 Like ({likeCount})
            </button>

            <button
              onClick={handleRequestMeal}
              disabled={requested || requesting}
              className={`w-full sm:w-auto px-5 py-2 rounded-md text-white ${
                requested || requesting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {requested ? "Requested" : requesting ? "Requesting..." : "Request Meal"}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Reviews ({reviewCount})</h2>
        {user ? (
          <div className="mb-6">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              rows={4}
              placeholder="Write your review..."
            />
            <button
              onClick={handlePostReview}
              disabled={postingReview}
              className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
            >
              {postingReview ? "Posting..." : "Post Review"}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 italic dark:text-gray-400">Login to post a review.</p>
        )}

        <ul className="space-y-4 max-h-96 overflow-y-auto">
          {reviews.length === 0 && <p className="text-gray-700 dark:text-gray-300">No reviews yet.</p>}
          {reviews.map((review) => (
            <li
              key={review._id}
              className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 transition"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">{review.userName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</p>
              <p className="mt-2 whitespace-pre-line text-gray-800 dark:text-gray-200">{review.comment}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MealDetails;
