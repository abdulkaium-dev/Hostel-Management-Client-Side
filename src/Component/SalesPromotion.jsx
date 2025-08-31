import React from 'react';

const SalesPromotion = () => {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-900 py-16 px-6 sm:px-10 lg:px-16 rounded-2xl overflow-hidden max-w-7xl mx-auto shadow-2xl transition-colors">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-600/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl"></div>

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
            Limited Time Offer!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto lg:mx-0 transition-colors">
            Enjoy <span className="font-bold underline decoration-indigo-500/50 dark:decoration-indigo-400/50">20% off</span> on all premium meals this week.
            Upgrade your badge now and get exclusive access to top-rated meals and rewards!
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button className="bg-indigo-600 dark:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-cyan-400 dark:hover:bg-cyan-500 transition duration-300">
              Claim Offer
            </button>
            <button className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image Card */}
        <div className="flex-1 relative max-w-sm w-full mx-auto lg:mx-0">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition duration-500">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=crop&w=800&h=500"
              alt="Premium Meal"
              className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
            />
            <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 dark:text-gray-900 font-bold px-3 py-1 rounded-full text-sm shadow-md">
              20% OFF
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 font-semibold px-3 py-1 rounded-lg text-sm shadow-sm">
              Premium Meal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPromotion;
