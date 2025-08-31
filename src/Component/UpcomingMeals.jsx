import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../Api/axios";
import { AuthContext } from "../Auth/AuthContext";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

const UpcomingMeals = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [userBadge, setUserBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingMeals = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      let headers = {};

      if (currentUser) {
        const token = await currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await axiosInstance.get("/upcoming-meals", { headers });
      setMeals(res.data);
    } catch (error) {
      toast.error("Failed to fetch upcoming meals");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBadge = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosInstance.get(`/users/${user.email}`);
      setUserBadge(res.data.badge || null);
    } catch {
      toast.error("Failed to fetch user badge");
      setUserBadge(null);
    }
  };

  const handleLike = async (mealId) => {
    if (!user?.email) {
      toast.error("Please login to like meals");
      return;
    }
    if (!["Silver", "Gold", "Platinum"].includes(userBadge)) {
      toast.error("Only premium users can like meals");
      return;
    }

    const meal = meals.find((m) => m._id === mealId);
    if (!meal) return;

    const alreadyLiked = meal.likedBy?.includes(user.email);
    if (alreadyLiked) {
      toast.error("You already liked this meal");
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("User not authenticated");
        return;
      }

      const token = await currentUser.getIdToken();
      const res = await axiosInstance.patch(
        `/upcoming-meals/${mealId}/like`,
        { userEmail: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Liked the meal!");
        setMeals((prevMeals) =>
          prevMeals.map((m) =>
            m._id === mealId
              ? {
                  ...m,
                  likes: (m.likes || 0) + 1,
                  likedBy: [...(m.likedBy || []), user.email],
                }
              : m
          )
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to like meal";
      toast.error(msg);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserBadge();
    fetchUpcomingMeals();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-700 dark:text-gray-300">
        Loading upcoming meals...
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-500 dark:text-gray-400">
        No upcoming meals found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-white drop-shadow-md">
        🌟 Upcoming Meals
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-10 text-center">
        Showing {meals.length} upcoming meal{meals.length > 1 ? "s" : ""}
      </p>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {meals.map((meal) => {
          const alreadyLiked = meal.likedBy?.includes(user?.email);
          const canLike =
            user &&
            userBadge &&
            ["Silver", "Gold", "Platinum"].includes(userBadge) &&
            !alreadyLiked;

          let formattedDate = "No date";
          if (meal.publishDate) {
            const dateObj = new Date(meal.publishDate);
            if (!isNaN(dateObj)) formattedDate = dateObj.toLocaleDateString();
          }

          return (
            <article
              key={meal._id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
              aria-label={`Upcoming meal: ${meal.title}`}
            >
              <div className="h-48 w-full relative">
                <img
                  src={meal.image}
                  alt={meal.title || "Upcoming meal"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {meal.likes > 0 && (
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    ❤️ {meal.likes}
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white truncate">
                  {meal.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-grow line-clamp-3">
                  {meal.description}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  📅 <span className="font-medium text-gray-700 dark:text-gray-200">Publish:</span>{" "}
                  {formattedDate}
                </p>

                {user ? (
                  ["Silver", "Gold", "Platinum"].includes(userBadge) ? (
                    <button
                      onClick={() => handleLike(meal._id)}
                      disabled={!canLike}
                      className={`w-full py-2 rounded-xl font-semibold text-white transition ${
                        !canLike
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                      }`}
                      aria-disabled={!canLike}
                    >
                      {alreadyLiked ? "Liked ❤️" : "Like ❤️"}
                    </button>
                  ) : (
                    <p className="text-xs text-red-500 font-semibold mt-auto text-center">
                      Only premium users can like
                    </p>
                  )
                ) : (
                  <p className="text-xs text-red-500 font-semibold mt-auto text-center">
                    Please login to like meals
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingMeals;
