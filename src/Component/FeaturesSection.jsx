import React from "react";

const features = [
  {
    icon: "🍽️",
    title: "Nutritious & Balanced",
    description:
      "Meals prepared with nutrition in mind to keep you healthy and energized.",
    bgColor: "from-[#4F46E5] to-[#06B6D4]",
  },
  {
    icon: "⏰",
    title: "On-Time Service",
    description:
      "Enjoy your meals fresh and on time every day with reliable service.",
    bgColor: "from-[#06B6D4] to-[#4F46E5]",
  },
  {
    icon: "🌿",
    title: "Fresh Ingredients",
    description:
      "We use only fresh, locally sourced ingredients for great taste.",
    bgColor: "from-[#4F46E5]/80 to-[#06B6D4]/80",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-20 xl:py-24 mb-8 sm:mb-12 lg:mb-16 transition-colors duration-300 overflow-hidden">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 lg:mb-14 transition-colors duration-300">
          Why Choose Our Hostel Meals?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map(({ icon, title, description, bgColor }, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Gradient Glow Border */}
              <div
                className={`absolute -inset-0.5 sm:-inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${bgColor} opacity-60 blur-xl sm:blur-2xl`}
                aria-hidden="true"
              />

              {/* Card Content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Icon Circle */}
                <div
                  className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br ${bgColor} text-2xl sm:text-3xl lg:text-4xl drop-shadow-lg mb-4 sm:mb-5 lg:mb-6`}
                >
                  {icon}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-[280px] sm:max-w-xs lg:max-w-sm">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
