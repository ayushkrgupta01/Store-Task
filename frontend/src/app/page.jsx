'use client';
import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome to Our Platform
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Please select your login portal below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Admin Portal</h2>
            <p className="text-gray-600 text-center mb-6">
              Access the admin dashboard to manage stores, customers, and more.
            </p>
            <Link
              href="/adminLogin"
              className="py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Admin Login
            </Link>
          </div>

          <div className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Customer Portal</h2>
            <p className="text-gray-600 text-center mb-6">
              Access your customer account to view stores, make purchases, and more.
            </p>
            <Link
              href="/customerLogin"
              className="py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
