"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaSyncAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function manageCustomers() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const customersPerPage = 10;
  const router = useRouter();

  const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_SERVICES_URL;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/GetAllCustomer`);
      if (!response.ok) throw new Error("Server is not fetching data");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [BACKEND_BASE_URL]);

  const handleRefresh = () => {
    setQuery("");
    setDateRange({ startDate: "", endDate: "" });
    fetchCustomers();
  };

  const handleView = (id) =>
    router.push(`/admin/customers/customerDetails/${id}`);
  const updateCustomer = (id) =>
    router.push(`/admin/customers/editCustomer/${id}`);

  const handleDeleteInitiate = (id) => {
    setCustomerToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDeleteId === null) return;

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/DeleteCustomer?id=${customerToDeleteId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete customer.");

      setUser(user.filter((item) => item.CustomerID !== customerToDeleteId));
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An error occurred during deletion.");
    } finally {
      setShowConfirmModal(false);
      setCustomerToDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
    setCustomerToDeleteId(null);
  };

  const filtered = user.filter((customer) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      customer.Customer_Name?.toLowerCase().includes(q) ||
      customer.Customer_Email?.toLowerCase().includes(q) ||
      customer.Customer_Phone?.toLowerCase().includes(q) ||
      customer.GeneratedStoreID?.toString().includes(q) ||
      customer.CustomerID?.toString().includes(q);

    const customerDate = customer.Customer_Date
      ? new Date(customer.Customer_Date)
      : null;
    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

    const matchesDate =
      !start ||
      (customerDate && customerDate >= start && (!end || customerDate <= end));

    return matchesQuery && matchesDate;
  });

  // Reset to page 1 whenever search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, dateRange]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <FaArrowLeft />
        Back
      </button>
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

        {/* Controls and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 w-full lg:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Date Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <span className="text-gray-600 hidden md:block">
              <FaCalendarAlt className="inline mr-2" />
              Filter by Date:
            </span>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              title="Start Date"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              title="End Date"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleRefresh}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none flex items-center justify-center gap-2 transition-colors"
            >
              <FaSyncAlt className={`${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href={"/admin/customers/customerForm"}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none flex items-center justify-center gap-2 transition-colors"
            >
              <FaPlus />
              Add Customer
            </Link>
          </div>
        </div>

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

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
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Customer ID
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Store ID
                        </th>
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
                          Service
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Amount
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Date & Time
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCustomers.length > 0 ? (
                        currentCustomers.map((item) => (
                          <tr
                            key={item.CustomerID}
                            className="hover:bg-gray-50 text-sm sm:text-[15px] border-t"
                          >
                            <td className="p-3">{item.CustomerID}</td>
                            <td className="p-3">{item.GeneratedStoreID}</td>
                            <td className="p-3">{item.Customer_Name}</td>
                            <td className="p-3">{item.Customer_Email}</td>
                            <td className="p-3">{item.Customer_Phone}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.Customer_Status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.service_name}
                              </span>
                            </td>
                            <td className="p-3">
                              {item.Customer_ProductAmount}
                            </td>
                            <td className="p-3">
                              {(() => {
                                const dateStr = item.Customer_Date;
                                if (!dateStr) return "N/A";
                                const date = new Date(dateStr);
                                const formattedDate = date.toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                );
                                const formattedTime = date.toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                );
                                return (
                                  <div className="flex flex-col">
                                    <span>{formattedDate}</span>
                                    <span className="text-gray-500">
                                      {formattedTime}
                                    </span>
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleView(item.CustomerID)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                >
                                  <FaEye />
                                  View
                                </button>
                                <button
                                  onClick={() =>
                                    updateCustomer(item.CustomerID)
                                  }
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                >
                                  <FaEdit />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteInitiate(item.CustomerID)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                >
                                  <FaTrashAlt />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={9}
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded border ${
                          currentPage === i + 1
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center border-t-4 border-red-500 transform transition-all duration-300 scale-95 md:scale-100">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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
}
