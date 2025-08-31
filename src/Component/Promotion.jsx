import React from "react";
import { Link } from "react-router-dom";

const Promotion = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] dark:from-[#3730A3] dark:to-[#0891B2] text-white dark:text-white/90 py-10 sm:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-20 rounded-xl shadow-lg max-w-7xl mx-auto overflow-hidden transition-colors duration-300">

      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-28 h-28 sm:w-36 sm:h-36 bg-white/10 dark:bg-white/20 rounded-full -translate-x-10 -translate-y-10 sm:-translate-x-16 sm:-translate-y-16 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-56 sm:h-56 bg-white/10 dark:bg-white/20 rounded-full translate-x-10 translate-y-10 sm:translate-x-16 sm:translate-y-16 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
        {/* Text Content */}
        <div className="w-full lg:max-w-lg text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 drop-shadow-lg">
            🌟 Special Promotion!
          </h2>
          <p className="text-sm sm:text-base lg:text-lg mb-5 sm:mb-6 text-white/90 dark:text-white/80 drop-shadow-sm">
            Taste the best meals at exclusive discounts this week. Hurry before it’s gone!
          </p>
          <Link
            to="/featured-meals"
            className="inline-block bg-white text-[#4F46E5] dark:text-[#1E3A8A] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Explore Now
          </Link>
        </div>

        {/* Image */}
        <div className="w-full max-w-sm lg:max-w-md mx-auto lg:mx-0">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
            alt="Delicious Meal Promotion"
            className="w-full h-auto object-cover rounded-xl shadow-2xl border-4 border-white/20 dark:border-white/10 transition-all"
          />
        </div>
      </div>
    </section>
  );
};

export default Promotion;
