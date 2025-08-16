"use client";
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaSearch,
  FaSyncAlt,
  FaSpinner,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetCustomers`
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to load customers:", error);
      toast.error("Failed to load customer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((customer) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(customer.CustomerName || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.Email || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.Phone || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.StateName || customer.State || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.CityName || customer.City || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.PAN || customer.PanNumber || customer.PanNo || "")
        .toLowerCase()
        .includes(q) ||
      String(
        customer.Aadhar || customer.AadharNumber || customer.AadharNo || ""
      )
        .toLowerCase()
        .includes(q)
    );
  });

  const getValue = (obj, keys) => {
    for (const key of keys) {
      const value = obj && obj[key];
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return value;
      }
    }
    return "-";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <FaArrowLeft />
        Back
      </button>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Customers
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage and view all registered customers
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
                onClick={fetchCustomers}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSpinner className={`${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => router.push("/admin/customers/add")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaUsers />
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
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Customer Name
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Email
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Phone
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        State
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        City
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        PAN
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Aadhar
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((customer, index) => (
                        <tr
                          key={customer.CustomerId || index}
                          className="hover:bg-gray-50 text-sm sm:text-[15px]"
                        >
                          <td className="p-3 border-t truncate">
                            {getValue(customer, ["CustomerName"])}
                          </td>
                          <td className="p-3 border-t truncate">
                            {getValue(customer, ["Email"])}
                          </td>
                          <td className="p-3 border-t truncate">
                            {getValue(customer, ["Phone"])}
                          </td>
                          <td className="p-3 border-t truncate">
                            {getValue(customer, [
                              "StateName",
                              "State",
                              "state",
                            ])}
                          </td>
                          <td className="p-3 border-t truncate">
                            {getValue(customer, ["CityName", "City", "city"])}
                          </td>
                          <td className="p-3 border-t font-mono truncate">
                            {getValue(customer, ["PAN", "PANNumber", "PanNo"])}
                          </td>
                          <td className="p-3 border-t font-mono truncate">
                            {getValue(customer, [
                              "Aadhar",
                              "AadharNumber",
                              "AadharNo",
                            ])}
                          </td>
                          <td className="p-3 border-t">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/customers/${customer.CustomerId}`
                                  )
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaEye /> View
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/customers/edit/${customer.CustomerId}`
                                  )
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaEdit /> Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-8 text-center text-gray-500 border-t"
                        >
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AllCustomers;
