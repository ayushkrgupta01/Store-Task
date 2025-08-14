"use client";
import React, { useState } from "react";
import { FaUsers, FaSearch, FaPlus, FaSpinner } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerOption1 = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // Dummy data for demonstration
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+91 98765 43210", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+91 98765 43211", status: "Inactive" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+91 98765 43212", status: "Active" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", phone: "+91 98765 43213", status: "Active" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", phone: "+91 98765 43214", status: "Inactive" },
  ];

  const filtered = customers.filter((customer) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Customer Management
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage customer information and preferences
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers..."
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
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaUsers className="mr-3" />
              Customer List
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-indigo-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Name</th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Email</th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Phone</th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Status</th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50 text-sm sm:text-[15px] border-t">
                          <td className="p-3">{customer.name}</td>
                          <td className="p-3">{customer.email}</td>
                          <td className="p-3">{customer.phone}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              customer.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {customer.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-2">
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                View
                              </button>
                              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                Edit
                              </button>
                              <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500 border-t">
                          <div className="flex flex-col items-center gap-2">
                            <FaUsers className="text-4xl text-gray-300" />
                            <p>No customers found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CustomerOption1;
