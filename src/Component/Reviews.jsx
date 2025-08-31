import React from 'react';

const sampleReviews = [
  { id: 1, name: 'Alice', text: 'The meals are fresh and delicious! Highly recommended.' },
  { id: 2, name: 'Bob', text: 'Excellent service and great variety every day.' },
  { id: 3, name: 'Charlie', text: 'Love the premium badge meals. Totally worth it!' },
];

const Reviews = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white transition-colors">
        What Our Users Say
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleReviews.map((review) => (
          <div
            key={review.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <p className="text-gray-700 dark:text-gray-200 mb-4 transition-colors">
              "{review.text}"
            </p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 transition-colors">
              {review.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
