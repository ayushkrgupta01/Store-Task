"use client";
import React, { useState } from "react";
import { FaChartBar, FaSearch, FaDownload, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerList = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  // Dummy analytics data
  const analytics = [
    { id: 1, metric: "Total Customers", value: "1,234", change: "+12%", trend: "up" },
    { id: 2, metric: "Active Customers", value: "987", change: "+8%", trend: "up" },
    { id: 3, metric: "New Customers (This Month)", value: "156", change: "+23%", trend: "up" },
    { id: 4, metric: "Customer Satisfaction", value: "4.8/5", change: "+2%", trend: "up" },
    { id: 5, metric: "Average Order Value", value: "₹2,450", change: "-5%", trend: "down" },
    { id: 6, metric: "Customer Retention Rate", value: "87%", change: "+3%", trend: "up" },
  ];
  const filtered = analytics.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return item.metric.toLowerCase().includes(q);
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Customer Analytics
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Customer insights and performance metrics
          </p>
        </div>
        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search metrics..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); toast.info('Refreshed!'); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FaDownload />
                Export Report
              </button>
            </div>
          </div>
        </div>
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.metric}</h3>
                <FaChartBar className="text-indigo-500 text-xl" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{item.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

