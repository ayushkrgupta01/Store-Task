"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";

const CustomersByStore = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const filtered = customers.filter((customer) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    return (
      String(customer.Customer_Name || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.Customer_Email || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.Customer_Phone || "")
        .toLowerCase()
        .includes(q) ||
      String(customer.service_name || "")
        .toLowerCase()
        .includes(q)
    );
  });

  // 📌 Pagination logic
  const totalPages = Math.ceil(filtered.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filtered.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                // value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1); // reset to page 1 on search
                }}
                placeholder="Search by name, email, phone, or service..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                // onClick={allCustomers}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <FaSpinner className={`${loading ? "animate-spin" : ""}`} />
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
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Customer ID
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Name
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
                      </tr>
                    </thead>
                    {/* <tbody>
                      {currentCustomers.length > 0 ? (
                        currentCustomers.map((customer) => (
                          <tr
                            key={customer.CustomerID}
                            className="hover:bg-gray-50 text-sm sm:text-[15px] border-t"
                          >
                            <td className="p-3">{customer.CustomerID}</td>
                            <td className="p-3">{customer.Customer_Name}</td>
                            <td className="p-3">{customer.Customer_Email}</td>
                            <td className="p-3">{customer.Customer_Phone}</td>
                            <td className="p-3">{customer.service_name}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-gray-500 border-t"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <FaUsers className="text-4xl text-gray-300" />
                              <p>No customers found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody> */}
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 border rounded-lg ${
                          currentPage === index + 1
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
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
      <ToastContainer />
    </div>
  );
};

export default CustomersByStore;
