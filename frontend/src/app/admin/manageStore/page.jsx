"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  FaStore,
  FaSearch,
  FaSpinner,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaUserFriends,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DeleteStorePopup from "@/components/DeleteStorePopup";

const ManageStores = () => {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 10; // 👈 Change this number for page size
  const [filters, setFilters] = useState({
    state: "",
    city: "",
  });
  const [uniqueStates, setUniqueStates] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`
      );
      setStores(response.data);
      // Extract unique states and cities
      const states = [
        ...new Set(
          response.data
            .map((store) => getValue(store, ["StateName", "State", "state"]))
            .filter(Boolean)
        ),
      ].sort();
      const cities = [
        ...new Set(
          response.data
            .map((store) => getValue(store, ["CityName", "City", "city"]))
            .filter(Boolean)
        ),
      ].sort();
      setUniqueStates(states);
      setUniqueCities(cities);
    } catch (error) {
      console.error("Failed to load stores:", error);
      toast.error("Failed to load store data.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (store) => {
    setSelectedStore(store);
    setShowDeletePopup(true);
  };

  const handleDelete = async (storeId) => {
    try {
      const storeObject = {
        StoreID: storeId,
        ActionMode: "DELETE",
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STORE_URL}/DeleteStore`,
        storeObject,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data[0].status === "1") {
        toast.success(res.data[0].message);
        fetchStores();
      } else {
        toast.success(res.data[0].message);
        fetchStores();
      }
    } catch (err) {
      toast.error(err.message || "Delete failed");
      fetchStores();
    } finally {
      setShowDeletePopup(false);
      setSelectedStore(null);
    }
  };

  const handleAddCustomer = (storeId) => {
    router.push(`/admin/customers/customerForm/${storeId}`);
  };

  // 📌 Fetch data on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // 📌 Reset page to 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters, sortConfig]);

  const sortedAndFilteredStores = useMemo(() => {
    // Start with all stores
    let filteredItems = [...stores];

    // Apply search query filter
    const q = query.trim().toLowerCase();
    if (q) {
      filteredItems = filteredItems.filter((store) =>
        Object.values(store).some((value) =>
          String(value).toLowerCase().includes(q)
        )
      );
    }

    // Apply state and city filters
    if (filters.state) {
      filteredItems = filteredItems.filter(
        (store) =>
          getValue(store, ["StateName", "State", "state"]).toLowerCase() ===
          filters.state.toLowerCase()
      );
    }

    if (filters.city) {
      filteredItems = filteredItems.filter(
        (store) =>
          getValue(store, ["CityName", "City", "city"]).toLowerCase() ===
          filters.city.toLowerCase()
      );
    }

    // Apply sorting
    if (sortConfig.key !== null) {
      filteredItems.sort((a, b) => {
        const aValue = getValue(a, [sortConfig.key]);
        const bValue = getValue(b, [sortConfig.key]);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredItems;
  }, [stores, query, filters, sortConfig]);

  // 📌 Pagination logic
  const totalPages = Math.ceil(sortedAndFilteredStores.length / storesPerPage);
  const indexOfLast = currentPage * storesPerPage;
  const indexOfFirst = indexOfLast - storesPerPage;
  const currentStores = sortedAndFilteredStores.slice(
    indexOfFirst,
    indexOfLast
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 📌 Export to Excel function
  const exportToExcel = () => {
    const dataToExport = sortedAndFilteredStores.map((store) => ({
      "Store ID": getValue(store, ["StoreID"]),
      "Store Name": getValue(store, ["StoreName"]),
      Email: getValue(store, ["Email"]),
      Phone: getValue(store, ["Phone"]),
      State: getValue(store, ["StateName", "State", "state"]),
      City: getValue(store, ["CityName", "City", "city"]),
      TotalCustomers: getValue(store, ["TotalCustomers"]),
      TotalSales: getValue(store, ["TotalSales"]),
      "Date & Time": getValue(store, ["CreatedAt"]),
      PAN: getValue(store, ["PAN", "PANNumber", "PanNo"]),
      Aadhar: getValue(store, ["Aadhar", "AadharNumber", "AadharNo"]),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Stores");
    XLSX.writeFile(workbook, "all_stores_data.xlsx");
  };

  // 📌 Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("All Stores List", 14, 20);

    const tableColumn = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "State",
      "City",
      "Customers",
      "Sales",
      "Date & Time",
      "PAN",
      "Aadhar",
    ];
    const tableRows = sortedAndFilteredStores.map((store) => [
      getValue(store, ["StoreID"]),
      getValue(store, ["StoreName"]),
      getValue(store, ["Email"]),
      getValue(store, ["Phone"]),
      getValue(store, ["StateName", "State", "state"]),
      getValue(store, ["CityName", "City", "city"]),
      getValue(store, ["TotalCustomers"]),
      getValue(store, ["TotalSales"]),
      getValue(store, ["CreatedAt"]),
      getValue(store, ["PAN", "PANNumber", "PanNo"]),
      getValue(store, ["Aadhar", "AadharNumber", "AadharNo"]),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        cellPadding: 3,
        fontSize: 8,
        valign: "middle",
        halign: "left",
        textColor: [0, 0, 0],
        lineColor: [180, 180, 180],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 58, 64],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
    });

    doc.save("all_stores_data.pdf");
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
            Manage Stores
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            View, search, and manage all registered stores
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stores..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          {/* Filter Controls and Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 w-full lg:w-auto">
            <select
              value={filters.state}
              onChange={(e) =>
                setFilters({ ...filters, state: e.target.value })
              }
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All States</option>
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
              Store List
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-indigo-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("StoreID")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Store ID</span>
                          {sortConfig.key === "StoreID" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("StoreName")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Store Name</span>
                          {sortConfig.key === "StoreName" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("Email")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Email</span>
                          {sortConfig.key === "Email" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("Phone")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Phone</span>
                          {sortConfig.key === "Phone" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("StateName")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>State</span>
                          {sortConfig.key === "StateName" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("CityName")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>City</span>
                          {sortConfig.key === "CityName" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("TotalCustomers")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Total Customers</span>
                          {sortConfig.key === "TotalCustomers" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("TotalSales")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Total Sales</span>
                          {sortConfig.key === "TotalSales" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("CreatedAt")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Date & Time</span>
                          {sortConfig.key === "CreatedAt" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("PAN")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>PAN</span>
                          {sortConfig.key === "PAN" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0"
                        onClick={() => handleSort("Aadhar")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Aadhar</span>
                          {sortConfig.key === "Aadhar" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStores.length > 0 ? (
                      currentStores.map((store, index) => (
                        <tr
                          key={store.StoreID || index}
                          className="hover:bg-gray-50 text-sm sm:text-[15px]"
                        >
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["GeneratedStoreID", "StoreID"])}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["StoreName"])}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["Email"])}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["Phone"])}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["StateName", "State", "state"])}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["CityName", "City", "city"])}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["TotalCustomers"])}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["TotalSales"])}
                          </td>
                          <td className="p-3 text-sm border-t min-w-[150px]">
                            {(() => {
                              const dateStr = getValue(store, ["CreatedAt"]);
                              if (!dateStr) return "N/A";
                              const date = new Date(dateStr);
                              const formattedDate = date.toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "long",
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
                          <td className="p-3 text-sm border-t font-mono truncate">
                            {getValue(store, ["PAN", "PANNumber", "PanNo"])}
                          </td>
                          <td className="p-3 text-sm border-t font-mono truncate">
                            {getValue(store, [
                              "Aadhar",
                              "AadharNumber",
                              "AadharNo",
                            ])}
                          </td>
                          <td className="p-3 border-t min-w-[250px]">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/singleStoreDetails/${store.StoreID}`
                                  )
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaEye /> View
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/editStore/${store.StoreID}`
                                  )
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/customersByStore/${store.StoreID}`
                                  )
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaUserFriends /> Customers
                              </button>
                              <button
                                onClick={() => confirmDelete(store)}
                                className={`px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors ${
                                  store.StoreID == 1048
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                                disabled={store.StoreID == 1048}
                              >
                                <FaTrash /> Delete
                              </button>
                              <button
                                onClick={() => handleAddCustomer(store.StoreID)}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaPlus />
                                Add New Customer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={12}
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
      {showDeletePopup && (
        <DeleteStorePopup
          onClose={() => setShowDeletePopup(false)}
          onConfirm={() => handleDelete(selectedStore.StoreID)}
        />
      )}
    </div>
  );
};

export default ManageStores;
