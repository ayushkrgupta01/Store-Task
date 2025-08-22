"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
  FaCalendar,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'last10days', 'custom'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const router = useRouter();

  // New state for delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);

  const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_SERVICES_URL;

  const allCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/GetAllCustomer`);
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Failed to load customers:", error);
      toast.error("Failed to load customer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allCustomers();
  }, []);

  // New action handlers
  const handleView = (id) =>
    router.push(`/admin/customers/customerDetails/${id}`);
  const handleEdit = (id) => router.push(`/admin/customers/editCustomer/${id}`);

  const handleDeleteInitiate = (id) => {
    setCustomerToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDeleteId === null) return;

    try {
      const response = await axios.delete(
        `${BACKEND_BASE_URL}/DeleteCustomer?id=${customerToDeleteId}`
      );
      if (response.status === 200) {
        // Optimistically update the UI by removing the deleted customer
        setCustomers(
          customers.filter((c) => c.CustomerID !== customerToDeleteId)
        );
        toast.success("Customer deleted successfully!");
      } else {
        throw new Error("Failed to delete customer.");
      }
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

  // 🔎 Advanced Search and Date Filter
  const filtered = customers.filter((customer) => {
    const q = query.trim().toLowerCase();
    const customerDate = new Date(customer.Customer_Date);

    // --- Date filtering logic ---
    let dateMatch = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === "today") {
      const customerDay = new Date(customerDate);
      customerDay.setHours(0, 0, 0, 0);
      dateMatch = customerDay.getTime() === today.getTime();
    } else if (dateFilter === "last10days") {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 10);
      dateMatch = customerDate >= tenDaysAgo && customerDate <= today;
    } else if (dateFilter === "custom") {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the whole end day
        dateMatch = customerDate >= start && customerDate <= end;
      } else {
        dateMatch = false; // No range selected, so no match
      }
    }

    // --- Text search logic (Updated to include all columns) ---
    const textMatch =
      !q ||
      Object.values(customer).some((value) =>
        String(value).toLowerCase().includes(q)
      );

    return dateMatch && textMatch;
  });

  // Export to Excel function
  const exportToExcel = () => {
    const dataToExport = filtered.map((customer) => ({
      "Customer ID": customer.CustomerID,
      "Store ID": customer.GeneratedStoreID,
      "Store Name": customer.StoreName,
      "Customer Name": customer.Customer_Name,
      Email: customer.Customer_Email,
      Phone: customer.Customer_Phone,
      Service: customer.service_name,
      Amount: customer.Customer_ProductAmount,
      "Date & Time": new Date(customer.Customer_Date).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Customers");
    XLSX.writeFile(workbook, "all_customers_data.xlsx");
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("All Customers List", 14, 20);

    const tableColumn = [
      "Customer ID",
      "Store ID",
      "Store Name",
      "Customer Name",
      "Email",
      "Phone",
      "Service",
      "Amount",
      "Date & Time",
    ];
    const tableRows = filtered.map((customer) => [
      customer.CustomerID,
      customer.GeneratedStoreID,
      customer.StoreName,
      customer.Customer_Name,
      customer.Customer_Email,
      customer.Customer_Phone,
      customer.service_name,
      customer.Customer_ProductAmount,
      new Date(customer.Customer_Date).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle",
        halign: "left",
        textColor: [0, 0, 0],
        lineColor: [180, 180, 180],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 58, 64],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
      },
    });

    doc.save("all_customers_data.pdf");
  };

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

  // Function to handle filter changes and reset page
  const handleFilterChange = (filter) => {
    setDateFilter(filter);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  // 🔄 New function to reset all filters
  const handleResetFilters = () => {
    setQuery("");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
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
        <div className="mb-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Customers
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage and view all registered customers with powerful search and
            filter options.
          </p>
        </div>

        {/* Control and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-2 lg:col-span-4">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by any field (ID, Name, Email, Phone...)"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Date Filter Buttons */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-wrap gap-2 overflow-x-auto pb-2">
              <span className="flex items-center text-gray-600 font-medium">
                <FaCalendar className="mr-2" /> Date Filter:
              </span>
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                  dateFilter === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("today")}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                  dateFilter === "today"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => handleFilterChange("last10days")}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                  dateFilter === "last10days"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Last 10 Days
              </button>
              <button
                onClick={() => handleFilterChange("custom")}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                  dateFilter === "custom"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Custom Range
              </button>
            </div>

            {/* Custom Date Range Inputs (conditionally rendered) */}
            {dateFilter === "custom" && (
              <div className="flex flex-col sm:flex-row gap-4 lg:col-span-2 transition-all duration-300 ease-in-out">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="End Date"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-end gap-2 w-full mt-4 border-t pt-4">
            <button
              onClick={handleResetFilters}
              className="flex-1 lg:flex-none bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaTimesCircle />
              Reset Filters
            </button>
            <button
              onClick={allCustomers}
              disabled={loading}
              className="flex-1 lg:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <FaSpinner className={`${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href={"/admin/customers/customerForm"}
              className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaPlus />
              Add Customer
            </Link>
            <button
              onClick={exportToPDF}
              className="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Export to Excel
            </button>
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
                        {/* RESTRUCTURED COLUMN HEADERS */}
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Customer Name
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Store
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Contact
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Service
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                          Date
                        </th>
                        <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCustomers.length > 0 ? (
                        currentCustomers.map((customer) => (
                          <tr
                            key={customer.CustomerID}
                            className="hover:bg-gray-50 text-sm sm:text-[15px] border-t"
                          >
                            {/* RESTRUCTURED DATA CELLS */}
                            <td className="p-3 font-semibold text-gray-800">
                              {customer.Customer_Name}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="text-gray-900">
                                  {customer.StoreName}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  ID: {customer.GeneratedStoreID}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="text-gray-900">
                                  {customer.Customer_Phone}
                                </span>
                                <span className="text-gray-500 text-xs truncate max-w-[150px]">
                                  {customer.Customer_Email}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="text-gray-900">
                                  {customer.service_name}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  Amount: ${customer.Customer_ProductAmount}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              {new Date(
                                customer.Customer_Date
                              ).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-2 justify-center">
                                <button
                                  onClick={() =>
                                    handleView(customer.CustomerID)
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full text-sm transition-colors"
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  onClick={() =>
                                    handleEdit(customer.CustomerID)
                                  }
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full text-sm transition-colors"
                                  title="Edit Customer"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteInitiate(customer.CustomerID)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-sm transition-colors"
                                  title="Delete Customer"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
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
};

export default AllCustomers;
