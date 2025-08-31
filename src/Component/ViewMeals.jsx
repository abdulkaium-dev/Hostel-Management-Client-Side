import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';
import axiosInstance from '../Api/axios';

const ViewMeals = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMeal(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load meal');
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300 text-lg">
        Loading meal details...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-600 dark:text-red-400 text-lg">
        {error}
      </p>
    );

  if (!meal)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300 text-lg">
        Meal not found
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md transition-colors">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">
        {meal.title}
      </h1>

      <div className="w-full h-64 sm:h-80 md:h-96 mb-6 overflow-hidden rounded-lg shadow-lg">
        <img
          src={meal.image}
          alt={meal.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="space-y-3 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
        <p>
          <span className="font-semibold">Category:</span> {meal.category}
        </p>
        <p>
          <span className="font-semibold">Ingredients:</span> {meal.ingredients}
        </p>
        <p>
          <span className="font-semibold">Description:</span> {meal.description}
        </p>
        <p>
          <span className="font-semibold">Distributor:</span> {meal.distributorName}
        </p>
        <p>
          <span className="font-semibold">Price:</span> ${meal.price.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Post Time:</span>{' '}
          {new Date(meal.postTime).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Likes:</span> {meal.likes || 0}
        </p>
        <p>
          <span className="font-semibold">Reviews Count:</span> {meal.reviewCount || 0}
        </p>
        <p>
          <span className="font-semibold">Rating:</span> {meal.rating?.toFixed(1) || 0}
        </p>
      </div>

      {/* Optional buttons for like/review/etc */}
      {/* <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition">
          Like
        </button>
        <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition">
          Add Review
        </button>
      </div> */}
    </div>
  );
};

export default ViewMeals;
