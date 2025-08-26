// AdminHome.jsx

"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaSyncAlt,
  FaStore,
  FaChartBar,
  FaRupeeSign,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import { processDataByTimeFrame } from "@/utils/chartUtils";

const AdminHome = () => {
  const [customers, setCustomers] = useState([]);
  const [stores, setStores] = useState([]);
  const [totalStores, setTotalStores] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  const [storesChartData, setStoresChartData] = useState([]);
  const [customersChartData, setCustomersChartData] = useState([]);
  const [storesTimeFrame, setStoresTimeFrame] = useState("month");
  const [customersTimeFrame, setCustomersTimeFrame] = useState("month");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [storesRes, customersRes, salesRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVICES_URL}/GetAllCustomer`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVICES_URL}/Customertotalbalce`),
      ]);

      const storesData = storesRes.data || [];
      const customersData = customersRes.data || [];

      setStores(storesData);
      setCustomers(customersData);
      setTotalStores(storesData.length);
      setTotalSales(salesRes.data[0]?.TotalBalance || 0);

      // Pass the correct date field name for each dataset
      setStoresChartData(processDataByTimeFrame(storesData, storesTimeFrame, "CreatedAt"));
      setCustomersChartData(processDataByTimeFrame(customersData, customersTimeFrame, "Customer_Date"));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Pass the correct date field name
    setStoresChartData(processDataByTimeFrame(stores, storesTimeFrame, "CreatedAt"));
  }, [stores, storesTimeFrame]);

  useEffect(() => {
    // Pass the correct date field name
    setCustomersChartData(processDataByTimeFrame(customers, customersTimeFrame, "Customer_Date"));
  }, [customers, customersTimeFrame]);

  const handleStoresTimeFrameChange = (timeFrame) => {
    setStoresTimeFrame(timeFrame);
  };

  const handleCustomersTimeFrameChange = (timeFrame) => {
    setCustomersTimeFrame(timeFrame);
  };

  if (loading) {
    return (
      <LoadingSpinner size="xl" text="Loading Dashboard..." fullScreen={true} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-2">
      <div className="max-w-6xl mx-auto">
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
              onClick={fetchData}
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
                <h2 className="text-lg font-medium text-gray-600">
                  Total Stores
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {totalStores}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600">
                  Total Customers
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <FaRupeeSign className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600">
                  Total Sales
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {totalSales.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stores Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-indigo-500" />
              Stores Overview
            </h2>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handleStoresTimeFrameChange("day")}
                className={`px-4 py-2 text-sm rounded-l-lg ${
                  storesTimeFrame === "day"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => handleStoresTimeFrameChange("month")}
                className={`px-4 py-2 text-sm ${
                  storesTimeFrame === "month"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleStoresTimeFrameChange("year")}
                className={`px-4 py-2 text-sm rounded-r-lg ${
                  storesTimeFrame === "year"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Yearly
              </button>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip cursor={{ fill: "#f3f4f6" }} />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="New Stores"
                    fill="#6366f1"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customers Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-green-500" />
              Customers Overview
            </h2>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handleCustomersTimeFrameChange("day")}
                className={`px-4 py-2 text-sm rounded-l-lg ${
                  customersTimeFrame === "day"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => handleCustomersTimeFrameChange("month")}
                className={`px-4 py-2 text-sm ${
                  customersTimeFrame === "month"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleCustomersTimeFrameChange("year")}
                className={`px-4 py-2 text-sm rounded-r-lg ${
                  customersTimeFrame === "year"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Yearly
              </button>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customersChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip cursor={{ fill: "#f3f4f6" }} />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="New Customers"
                    fill="#10b981"
                    barSize={20}
                  />
                </BarChart>
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
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                      Store Name
                    </th>
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                      Email
                    </th>
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                      Phone
                    </th>
                    <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                      City
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stores.length > 0 ? (
                    stores.slice(0, 5).map((store, index) => (
                      <tr
                        key={store.StoreId || index}
                        className="hover:bg-gray-50 text-sm sm:text-[15px] border-t"
                      >
                        <td className="p-3">{store.StoreName || "N/A"}</td>
                        <td className="p-3">{store.Email || "N/A"}</td>
                        <td className="p-3">{store.Phone || "N/A"}</td>
                        <td className="p-3">{store.CityName || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-gray-500 border-t"
                      >
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