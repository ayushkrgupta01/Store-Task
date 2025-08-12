"use client";
import React, { useState } from "react";
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
import { FaUsers, FaDollarSign, FaShoppingCart } from "react-icons/fa";

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

  return (
    <div className="space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:scale-105 transform transition">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-4xl" />
            <div>
              <h2 className="text-sm font-medium opacity-80">Total Users</h2>
              <p className="text-2xl font-bold">1,245</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 transform transition">
          <div className="flex items-center space-x-4">
            <FaDollarSign className="text-4xl" />
            <div>
              <h2 className="text-sm font-medium opacity-80">Monthly Sales</h2>
              <p className="text-2xl font-bold">$12,450</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:scale-105 transform transition">
          <div className="flex items-center space-x-4">
            <FaShoppingCart className="text-4xl" />
            <div>
              <h2 className="text-sm font-medium opacity-80">Pending Orders</h2>
              <p className="text-2xl font-bold">32</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
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

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Orders
        </h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Amount</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 transition">
              <td className="p-3 border-b">#1001</td>
              <td className="p-3 border-b">John Doe</td>
              <td className="p-3 border-b">$120.00</td>
              <td className="p-3 border-b">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  Completed
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition">
              <td className="p-3 border-b">#1002</td>
              <td className="p-3 border-b">Jane Smith</td>
              <td className="p-3 border-b">$85.00</td>
              <td className="p-3 border-b">
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                  Pending
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition">
              <td className="p-3 border-b">#1003</td>
              <td className="p-3 border-b">Mike Johnson</td>
              <td className="p-3 border-b">$45.00</td>
              <td className="p-3 border-b">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                  Cancelled
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;
