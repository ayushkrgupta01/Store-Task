"use client";
import React, { useState, useEffect } from "react";
import {
  FaStore,
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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllServices = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10; // 👈 Change this number for page size
  const router = useRouter();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVICES_URL}/GetProductService`
      );
      setStores(response.data);
    } catch (error) {
      console.error("Failed to load stores:", error);
      toast.error("Failed to load store data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter((store) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(store.service_name || "").toLowerCase().includes(q);
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

  // Export to Excel function
  const exportToExcel = () => {
    const dataToExport = filtered.map((store) => ({
      "Service ID": store.service_id,
      "Service Name": store.service_name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Services");
    XLSX.writeFile(workbook, "all_services_data.xlsx");
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("All Services List", 14, 20);

    const tableColumn = ["ID", "Service Name"];
    const tableRows = filtered.map((store) => [
      store.service_id,
      store.service_name,
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

    doc.save("all_services_data.pdf");
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
            All Services
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Clear and concise name of the service.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full rounded-full border border-gray-300 pl-12 pr-10 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchStores}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSpinner className={`${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => router.push("/admin/storeForm")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaStore />
                Add Store
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

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaStore className="mr-3" />
              Services List
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
                        Services Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map((store, index) => (
                        <tr
                          key={store.StoreId || index}
                          className="hover:bg-gray-50 text-sm sm:text-[15px]"
                        >
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["service_name"])}
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
                            <FaStore className="text-4xl text-gray-300" />
                            <p>No stores found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

export default AllServices;