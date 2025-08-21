"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserFriends, FaSearch, FaSpinner, FaEye, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_SERVICES_URL;

const AllCustomersDashboard = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BACKEND_BASE_URL}/GetAllCustomer`);
        if (response.data) {
          setCustomers(response.data);
        } else {
          setCustomers([]);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to fetch customer data. Please try again later.");
        toast.error("Failed to load customer list.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleViewCustomer = (customerId) => {
    router.push(`/admin/customers/customerDetails/${customerId}`);
  };

  const filteredCustomers = customers.filter((customer) => {
    const nameMatch = customer.Customer_Name?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = customer.Customer_Email?.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = customer.Customer_Phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-4"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          All Customers Overview
        </h1>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 font-medium">Total Customers</p>
              <h2 className="text-3xl font-bold mt-1">
                {customers.length.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full text-purple-600">
              <FaUserFriends className="text-2xl" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 font-medium">Total Sales</p>
              <h2 className="text-3xl font-bold mt-1">
                {customers.length.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full text-purple-600">
              <FaUserFriends className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Search Bar and Customer List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Customer List</h2>
            <div className="relative w-full md:w-80 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-indigo-500" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <FaExclamationTriangle className="text-5xl mx-auto mb-4" />
              <p className="font-semibold">{error}</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No customers found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Product/Service ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.CustomerID} className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.CustomerID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.Customer_Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.Customer_Email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.Customer_Phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.Productservices_Id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleViewCustomer(customer.CustomerID)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCustomersDashboard;