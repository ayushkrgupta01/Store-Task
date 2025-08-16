"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaUsers, FaDollarSign, FaShoppingCart, FaSyncAlt, FaStore, FaChartBar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";


const AdminHome = () => {
  const [salesData] = useState([
    { month: "Jan", sales: 4000, revenue: 2400 },
    { month: "Feb", sales: 3000, revenue: 1398 },
    { month: "Mar", sales: 2000, revenue: 9800 },
    { month: "Apr", sales: 2780, revenue: 3908 },
    { month: "May", sales: 1890, revenue: 4800 },
    { month: "Jun", sales: 2390, revenue: 3800 },
    { month: "Jul", sales: 3490, revenue: 4300 },
  ]);

  const [totalStores, setTotalStores] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`
      );
      setStores(res.data);
      setTotalStores(res.data.length);
    } catch (err) {
      console.error("Failed to load stores:", err);
      toast.error("Failed to load store data for dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const domainData = [
    { name: 'gmail.com', count: 12 },
    { name: 'yahoo.com', count: 8 },
    { name: 'outlook.com', count: 5 },
    { name: 'example.com', count: 3 },
  ];

  if (loading) {
    return <LoadingSpinner size="xl" text="Loading Dashboard..." fullScreen={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Monitor your store performance and analytics
              </p>
            </div>
            <button
              onClick={fetchStores}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaSyncAlt /> Refresh Data
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaStore className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600">Total Stores</h2>
                <p className="text-3xl font-bold text-gray-900">{totalStores}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600">Total Customers</h2>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600">Total Sales</h2>
                <p className="text-3xl font-bold text-gray-900">$0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Overview Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-indigo-500" />
              Sales Overview
            </h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Email Domains Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-indigo-500" />
              Top Store Email Domains
            </h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={domainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#facc15"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Number of Stores"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Stores Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaStore className="mr-3" />
              Recent Stores
            </h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Store Name</th>
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Email</th>
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">Phone</th>
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">City</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.length > 0 ? (
                    stores.slice(0, 5).map((store, index) => (
                      <tr key={store.StoreId || index} className="hover:bg-gray-50 text-sm sm:text-[15px] border-t">
                        <td className="p-3">{store.StoreName || "N/A"}</td>
                        <td className="p-3">{store.Email || "N/A"}</td>
                        <td className="p-3">{store.Phone || "N/A"}</td>
                        <td className="p-3">{store.CityName || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 border-t">
                        <div className="flex flex-col items-center gap-2">
                          <FaStore className="text-4xl text-gray-300" />
                          <p>No recent stores found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
