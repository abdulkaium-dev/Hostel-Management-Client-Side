import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from "react-icons/fa";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Student, Hostel Resident",
    review:
      "The meals are absolutely delicious and well-balanced! I never expected hostel food to be this good. Highly recommend!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "David Smith",
    role: "University Student",
    review:
      "Affordable, tasty, and hygienic! The best part is the variety in meals. Every day feels exciting!",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Premium Subscriber",
    review:
      "Their premium subscription was worth every penny. Exclusive meals, priority service, and healthy options!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

const StarRating = ({ value }) => {
  const full = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f-${i}`} className="text-yellow-400 text-base sm:text-lg" />
      ))}
      {hasHalf && <FaStarHalfAlt className="text-yellow-400 text-base sm:text-lg" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e-${i}`} className="text-yellow-400 text-base sm:text-lg" />
      ))}
    </div>
  );
};

const CustomerReviews = () => {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-2xl overflow-hidden mb-10 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14 lg:mb-16 px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          Loved by Our Students
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl mx-auto mb-5 sm:mb-6 text-sm sm:text-base">
          Real testimonials from happy customers. See why everyone loves our meals.
        </p>
        <span className="inline-block h-1 w-20 sm:w-28 rounded-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-indigo-600" />
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {TESTIMONIALS.map((t) => (
          <article
            key={t.id}
            className="group relative flex flex-col p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Quote Icon */}
            <FaQuoteLeft className="absolute -top-4 -left-4 text-cyan-400 dark:text-cyan-300 text-3xl sm:text-4xl opacity-20" />

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-indigo-600 dark:border-indigo-400 shadow-sm object-cover"
              />
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {t.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                  {t.role}
                </p>
              </div>
            </div>

            {/* Review */}
            <blockquote className="text-gray-700 dark:text-gray-200 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed flex-grow">
              “{t.review}”
            </blockquote>

            {/* Rating */}
            <div className="flex items-center justify-between mt-auto">
              <StarRating value={t.rating} />
              <span className="ml-3 inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-gray-900/70">
                {t.rating.toFixed(1)} / 5
              </span>
            </div>

            {/* Soft hover glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "radial-gradient(500px 150px at 20% 0%, rgba(79,70,229,0.06), transparent 60%)",
              }}
            />
          </article>
        ))}
      </div>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -bottom-28 sm:-bottom-32 -right-16 sm:-right-20 w-60 sm:w-72 lg:w-80 h-60 sm:h-72 lg:h-80 bg-gradient-to-tr from-indigo-600/10 to-cyan-400/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -top-28 sm:-top-32 -left-16 sm:-left-20 w-56 sm:w-72 lg:w-80 h-56 sm:h-72 lg:h-80 bg-gradient-to-tr from-cyan-400/10 to-indigo-600/10 rounded-full blur-3xl" />
    </section>
  );
};

export default CustomerReviews;
