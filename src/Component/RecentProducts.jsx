import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axios';
import { useNavigate } from 'react-router-dom';

const RecentProducts = () => {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data } = await axiosInstance.get('/meals', { params: { limit: 4, sortBy: 'createdAt', order: 'desc' } });
        setMeals(data.meals || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecent();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-gray-50 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Recently Added Meals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <div key={meal._id} className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer" onClick={() => navigate(`/meal/${meal._id}`)}>
            <img src={meal.image || 'https://via.placeholder.com/400x240'} alt={meal.title} className="w-full h-48 object-cover"/>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-lg">{meal.title}</h3>
              <p className="text-gray-600 mt-1 truncate">{meal.description || 'Delicious meal to enjoy'}</p>
              <p className="font-bold mt-2">${meal.price?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentProducts;
