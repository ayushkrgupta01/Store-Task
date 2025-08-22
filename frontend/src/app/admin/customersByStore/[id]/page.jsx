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

  // 🔹 Fetch customers for the store
  const fetchCustomers = async (storeId) => {
    if (!storeId) return; // Prevent fetching if id is not available
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

  // 🔹 Filter customers by query
  // This memoizes the filtered list to prevent unnecessary re-renders.
  const filteredCustomers = React.useMemo(() => {
    if (!query.trim()) {
      return customers;
    }
    const q = query.trim().toLowerCase();
    return customers.filter(
      (customer) =>
        String(customer.Customer_Name || "")
          .toLowerCase()
          .includes(q) ||
        String(customer.Customer_Email || "")
          .toLowerCase()
          .includes(q) ||
        String(customer.Customer_phone || "")
          .toLowerCase()
          .includes(q) ||
        String(customer.service_name || "")
          .toLowerCase()
          .includes(q)
    );
  }, [customers, query]);

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);

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
    router.push(`/admin/customers/addCustomer/${id}`);

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

      // Update the customers list locally
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
    const dataToExport = filteredCustomers.map((customer) => ({
      "Customer ID": customer.CustomerID,
      "Customer Name": customer.Customer_Name,
      Email: customer.Customer_Email,
      Phone: customer.Customer_phone,
      "Service Name": customer.service_name,
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
    const tableRows = filteredCustomers.map((customer) => [
      customer.CustomerID,
      customer.StoreID,
      customer.StoreName,
      customer.Customer_Name,
      customer.Customer_Email,
      customer.Customer_phone,
      customer.Customer_Date,
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

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                placeholder="Search customers..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchCustomers(id)}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <FaSpinner className={`${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={handleAddCustomer}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus />
                Add Customer
              </button>
            </div>
          </div>
          {/* New Export Buttons */}
          <div className="flex justify-end gap-2 w-full lg:w-auto mt-4 lg:mt-0">
            <button
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
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
                        <th className="p-3 bg-gray-50">Customer ID</th>
                        <th className="p-3 bg-gray-50">Store ID</th>
                        <th className="p-3 bg-gray-50">Store Name</th>
                        <th className="p-3 bg-gray-50">Customer Name</th>
                        <th className="p-3 bg-gray-50">Email</th>
                        <th className="p-3 bg-gray-50">Phone</th>
                        <th className="p-3 bg-gray-50">Date & Time</th>
                        <th className="p-3 bg-gray-50">Service</th>
                        <th className="p-3 bg-gray-50">Amount</th>
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
                            <td className="p-3">{customer.StoreID}</td>
                            <td className="p-3">{customer.StoreName}</td>
                            <td className="p-3">{customer.Customer_Name}</td>
                            <td className="p-3">{customer.Customer_Email}</td>
                            <td className="p-3">{customer.Customer_phone}</td>
                            <td className="p-3">{customer.Customer_Date}</td>
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
