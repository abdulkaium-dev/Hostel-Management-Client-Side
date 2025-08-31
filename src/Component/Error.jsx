import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({
  title = 'Oops! Page Not Found',
  message = 'The page you are looking for does not exist or an error occurred.',
  showHomeButton = true,
  errorCode = '404',
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6 transition-colors duration-300">
      {/* Big error code with subtle pulse */}
      <div className="text-indigo-600 dark:text-indigo-400 text-9xl font-extrabold mb-8 select-none animate-pulse drop-shadow-lg transition-colors duration-300">
        {errorCode}
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 text-center drop-shadow transition-colors duration-300">
        {title}
      </h1>

      <p className="max-w-xl text-center text-gray-600 dark:text-gray-300 text-lg mb-10 px-4 leading-relaxed transition-colors duration-300">
        {message}
      </p>

      {showHomeButton && (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Filled primary button */}
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
          >
            Go to Home
          </button>

          {/* Outline secondary button */}
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-lg hover:bg-cyan-400 dark:hover:bg-cyan-500 hover:text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
