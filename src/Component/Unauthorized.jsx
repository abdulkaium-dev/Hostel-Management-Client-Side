import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-neutralBg dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 md:p-16 max-w-lg text-center transition-colors">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-indigo-400 mb-4 drop-shadow-sm">
          Unauthorized Access
        </h2>
        <p className="text-darkText/80 dark:text-gray-300 text-lg md:text-xl mb-8 transition-colors">
          You don't have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary dark:bg-indigo-600 hover:bg-secondary dark:hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          aria-label="Go back to homepage"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
