import React from 'react';
import { FaStore, FaLock, FaTimes } from 'react-icons/fa';

const StoreInfoPopup = ({ storeId, password, onClose }) => {
  if (!storeId || !password) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-sm md:max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center mb-4 text-green-500">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Store Created!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your new store has been successfully created. Please save these credentials.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <FaStore className="text-lg text-indigo-500" />
              <span className="font-semibold text-sm sm:text-base">Store ID</span>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm sm:text-lg">
              {storeId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <FaLock className="text-lg text-indigo-500" />
              <span className="font-semibold text-sm sm:text-base">Password</span>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm sm:text-lg">
              {password}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoPopup;