"use client";
import React, { useState } from "react";
import { FaCog, FaSearch, FaPlus, FaSpinner, FaBell } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerOption3 = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // Dummy data for demonstration
  const settings = [
    { id: 1, category: "Notifications", setting: "Email Notifications", status: "Enabled", description: "Receive email updates about customer activities" },
    { id: 2, category: "Notifications", setting: "SMS Alerts", status: "Disabled", description: "Get SMS notifications for urgent matters" },
    { id: 3, category: "Privacy", setting: "Data Retention", status: "Enabled", description: "Store customer data for 2 years" },
    { id: 4, category: "Privacy", setting: "GDPR Compliance", status: "Enabled", description: "Ensure GDPR compliance for EU customers" },
    { id: 5, category: "Security", setting: "Two-Factor Authentication", status: "Enabled", description: "Require 2FA for admin access" },
    { id: 6, category: "Security", setting: "Session Timeout", status: "Enabled", description: "Auto-logout after 30 minutes of inactivity" },
    { id: 7, category: "Integration", setting: "API Access", status: "Disabled", description: "Allow third-party API integrations" },
    { id: 8, category: "Integration", setting: "Webhook Notifications", status: "Enabled", description: "Send webhook notifications to external services" },
  ];

  const filtered = settings.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.category.toLowerCase().includes(q) ||
      item.setting.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const categories = [...new Set(settings.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Customer Settings
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Configure customer management preferences and system settings
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search settings..."
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
                <FaPlus />
                Add Setting
              </button>
            </div>
          </div>
        </div>

        {/* Settings Cards by Category */}
        {categories.map((category) => {
          const categorySettings = filtered.filter(item => item.category === category);
          if (categorySettings.length === 0) return null;
          
          return (
            <div key={category} className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <FaCog className="mr-3" />
                    {category}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {categorySettings.map((setting) => (
                      <div key={setting.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{setting.setting}</h3>
                            <p className="text-gray-600 text-sm">{setting.description}</p>
                          </div>
                          <div className="ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              setting.status === 'Enabled' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {setting.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            setting.status === 'Enabled'
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}>
                            {setting.status === 'Enabled' ? 'Disable' : 'Enable'}
                          </button>
                          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors">
                            Configure
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaBell className="mr-3" />
              Quick Actions
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                <div className="text-center">
                  <FaBell className="text-blue-500 text-2xl mx-auto mb-2" />
                  <p className="font-medium text-blue-800">Notification Settings</p>
                </div>
              </button>
              
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                <div className="text-center">
                  <FaCog className="text-green-500 text-2xl mx-auto mb-2" />
                  <p className="font-medium text-green-800">Privacy Settings</p>
                </div>
              </button>
              
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                <div className="text-center">
                  <FaCog className="text-purple-500 text-2xl mx-auto mb-2" />
                  <p className="font-medium text-purple-800">Security Settings</p>
                </div>
              </button>
              
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
                <div className="text-center">
                  <FaCog className="text-orange-500 text-2xl mx-auto mb-2" />
                  <p className="font-medium text-orange-800">Integration Settings</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CustomerOption3;
