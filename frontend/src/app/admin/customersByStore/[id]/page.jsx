"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaTimesCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CustomersByStore = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [query, setQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // 🆕 New state for filtering and sorting
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // 🔹 Fetch customers for the store
  const fetchCustomers = async (storeId) => {
    if (!storeId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetCustomersByStoreId`,
        { params: { id: storeId } }
      );

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCustomers(res.data);
        setStoreName(res.data[0].StoreName);
      } else {
        toast.error("No customers found for this store");
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error fetching customers", err);
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomers(id);
    }
  }, [id]);

  // 🔹 Combined Filtering and Sorting Logic
  const filteredAndSortedCustomers = React.useMemo(() => {
    // 1. Filter customers
    let filtered = customers.filter((customer) => {
      const q = query.trim().toLowerCase();
      const customerDate = new Date(customer.Customer_Date);
      let dateMatch = true;

      // Date filtering logic
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
          end.setHours(23, 59, 59, 999);
          dateMatch = customerDate >= start && customerDate <= end;
        } else {
          dateMatch = false;
        }
      }

      // Text search logic
      const textMatch =
        !q ||
        Object.values(customer).some((value) =>
          String(value).toLowerCase().includes(q)
        );

      return dateMatch && textMatch;
    });

    // 2. Sort the filtered customers
    let sortableItems = [...filtered];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Handle date sorting
        if (sortConfig.key === "Customer_Date") {
          const dateA = new Date(a.Customer_Date).getTime();
          const dateB = new Date(b.Customer_Date).getTime();
          if (dateA < dateB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle string sorting (case-insensitive)
        if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue.toLowerCase() < bValue.toLowerCase()) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue.toLowerCase() > bValue.toLowerCase()) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }

        // Handle numeric sorting
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return sortableItems;
  }, [customers, query, dateFilter, startDate, endDate, sortConfig]);

  // 🆕 New sorting functions
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset page on sort change
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="ml-2 text-gray-400" />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp className="ml-2 text-indigo-600" />;
    }
    return <FaSortDown className="ml-2 text-indigo-600" />;
  };

  const handleFilterChange = (filter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setQuery("");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
    setSortConfig({ key: null, direction: "ascending" });
    setCurrentPage(1);
  };

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredAndSortedCustomers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleView = (customerId) =>
    router.push(`/admin/customers/customerDetails/${customerId}`);
  const handleUpdate = (customerId) =>
    router.push(`/admin/customers/editCustomer/${customerId}`);
  const handleAddCustomer = () =>
    router.push(`/admin/customers/customerForm`);

  const handleDeleteInitiate = (customerId) => {
    setCustomerToDeleteId(customerId);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDeleteId === null) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVICES_URL}/DeleteCustomer?id=${customerToDeleteId}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete customer.");
      }

      setCustomers(
        customers.filter((item) => item.CustomerID !== customerToDeleteId)
      );
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

  // Export to Excel function
  const exportToExcel = () => {
    const dataToExport = filteredAndSortedCustomers.map((customer) => ({
      "Customer ID": customer.CustomerID,
      "Customer Name": customer.Customer_Name,
      Email: customer.Customer_Email,
      Phone: customer.Customer_phone,
      "Service Name": customer.service_name,
      "Date & Time": new Date(customer.Customer_Date).toLocaleString(),
      Amount: customer.Customer_productamount,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, `customers_for_${storeName}_store.xlsx`);
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Customers for ${storeName} Store`, 14, 20);

    const tableColumn = [
      "Customer ID",
      "Store ID",
      "Store Name",
      "Customer Name",
      "Email",
      "Phone",
      "Date & Time",
      "Service",
      "Amount",
    ];
    const tableRows = filteredAndSortedCustomers.map((customer) => [
      customer.CustomerID,
      customer.GeneratedStoreID,
      customer.StoreName,
      customer.Customer_Name,
      customer.Customer_Email,
      customer.Customer_phone,
      new Date(customer.Customer_Date).toLocaleString(),
      customer.service_name,
      customer.Customer_productamount,
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

    doc.save(`customers_for_${storeName}_store.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-4"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Customers of {storeName || "Store"}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage and view all registered customers of this store
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
                placeholder="Search by any field (Name, Email, Phone...)"
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
              onClick={() => fetchCustomers(id)}
              disabled={loading}
              className="flex-1 lg:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <FaSpinner className={`${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleAddCustomer}
              className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaPlus />
              Add Customer
            </button>
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

        {/* Table */}
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
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("CustomerID")}
                        >
                          <div className="flex items-center">
                            Customer ID
                            {getSortIcon("CustomerID")}
                          </div>
                        </th>
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("StoreName")}
                        >
                          <div className="flex items-center">
                            Store Name
                            {getSortIcon("StoreName")}
                          </div>
                        </th>
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("Customer_Name")}
                        >
                          <div className="flex items-center">
                            Customer Name
                            {getSortIcon("Customer_Name")}
                          </div>
                        </th>
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("Customer_Email")}
                        >
                          <div className="flex items-center">
                            Email
                            {getSortIcon("Customer_Email")}
                          </div>
                        </th>
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("Customer_phone")}
                        >
                          <div className="flex items-center">
                            Phone
                            {getSortIcon("Customer_phone")}
                          </div>
                        </th>
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("Customer_Date")}
                        >
                          <div className="flex items-center">
                            Date & Time
                            {getSortIcon("Customer_Date")}
                          </div>
                        </th>
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("service_name")}
                        >
                          <div className="flex items-center">
                            Service
                            {getSortIcon("service_name")}
                          </div>
                        </th>
                        <th
                          className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => requestSort("Customer_productamount")}
                        >
                          <div className="flex items-center">
                            Amount
                            {getSortIcon("Customer_productamount")}
                          </div>
                        </th>
                        <th className="p-3 bg-gray-50 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCustomers.length > 0 ? (
                        currentCustomers.map((customer) => (
                          <tr
                            key={customer.CustomerID}
                            className="hover:bg-gray-50 text-sm border-t"
                          >
                            <td className="p-3">{customer.CustomerID}</td>
                            <td className="p-3">{customer.StoreName}</td>
                            <td className="p-3">{customer.Customer_Name}</td>
                            <td className="p-3">{customer.Customer_Email}</td>
                            <td className="p-3">{customer.Customer_phone}</td>
                            <td className="p-3">
                              {(() => {
                                const dateStr = customer.Customer_Date;
                                if (!dateStr) return "N/A";

                                const date = new Date(dateStr);
                                const formattedDate = date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                });
                                const formattedTime = date.toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                });

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
                            <td className="p-3">{customer.service_name}</td>
                            <td className="p-3">
                              {customer.Customer_productamount}
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex flex-wrap gap-2 justify-center">
                                <button
                                  onClick={() =>
                                    handleView(customer.CustomerID)
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                >
                                  <FaEye className="inline" /> View
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdate(customer.CustomerID)
                                  }
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                >
                                  <FaEdit className="inline" /> Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteInitiate(customer.CustomerID)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                >
                                  <FaTrash className="inline" /> Delete
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

                {/* Pagination */}
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

export default CustomersByStore;