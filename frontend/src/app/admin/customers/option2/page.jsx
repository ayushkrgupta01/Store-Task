"use client";
import React, { useState } from "react";
import { FaChartBar, FaSearch, FaDownload, FaSpinner } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerOption2 = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // Dummy data for demonstration
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
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
                onClick={() => setLoading(true)}
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
                    <span className={`text-sm font-medium ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  item.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.trend === 'up' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    )}
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaChartBar className="mr-3" />
              Customer Performance Overview
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-indigo-500" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Performing Segments</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Premium Customers</span>
                        <span className="font-semibold text-green-600">+15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Regular Customers</span>
                        <span className="font-semibold text-blue-600">+8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">New Customers</span>
                        <span className="font-semibold text-purple-600">+23%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Satisfaction</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Very Satisfied</span>
                        <span className="font-semibold text-green-600">65%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Satisfied</span>
                        <span className="font-semibold text-blue-600">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Neutral</span>
                        <span className="font-semibold text-yellow-600">8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Dissatisfied</span>
                        <span className="font-semibold text-red-600">2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• 156 new customers registered this month</p>
                    <p>• Customer satisfaction score improved by 2%</p>
                    <p>• Average response time reduced to 2.3 hours</p>
                    <p>• 87% customer retention rate achieved</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CustomerOption2;
