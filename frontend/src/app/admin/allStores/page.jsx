"use client";
import React, { useState, useEffect } from "react";
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

const AllStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const customersPerPage = 10;
  const router = useRouter();
  const [filters, setFilters] = useState({
    state: "",
    city: "",
  });
  const [uniqueStates, setUniqueStates] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`
      );
      setStores(response.data);
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

  const handleAddCustomer = (storeId) => {
    router.push(`/admin/customers/customerForm/${storeId}`);
  };

  const confirmDelete = (store) => {
    setSelectedStore(store);
    setShowDeletePopup(true);
  };

  const handleDelete = async () => {
    if (!selectedStore) {
      return;
    }

    try {
      const storeObject = {
        StoreID: selectedStore.StoreID,
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
        toast.error(res.data[0].message);
      }
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setShowDeletePopup(false);
      setSelectedStore(null);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

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

  const filtered = stores.filter((store) => {
    const q = query.trim().toLowerCase();
    const stateFilter = filters.state.toLowerCase();
    const cityFilter = filters.city.toLowerCase();

    const matchesQuery =
      !q ||
      String(getValue(store, ["StoreName"]))
        .toLowerCase()
        .includes(q) ||
      String(getValue(store, ["Email"]))
        .toLowerCase()
        .includes(q) ||
      String(getValue(store, ["Phone"]))
        .toLowerCase()
        .includes(q) ||
      String(getValue(store, ["StateName", "State", "state"]))
        .toLowerCase()
        .includes(q) ||
      String(getValue(store, ["CityName", "City", "city"]))
        .toLowerCase()
        .includes(q) ||
      String(getValue(store, ["PAN", "PANNumber", "PanNo"]))
        .toLowerCase()
        .includes(q) ||
      String(getValue(store, ["Aadhar", "AadharNumber", "AadharNo"]))
        .toLowerCase()
        .includes(q);

    const matchesFilters =
      (!stateFilter ||
        String(getValue(store, ["StateName", "State", "state"]))
          .toLowerCase()
          .includes(stateFilter)) &&
      (!cityFilter ||
        String(getValue(store, ["CityName", "City", "city"]))
          .toLowerCase()
          .includes(cityFilter));

    return matchesQuery && matchesFilters;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return <FaSort className="text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="text-indigo-600" />
    ) : (
      <FaSortDown className="text-indigo-600" />
    );
  };

  const sortedData = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case "storeId":
        aValue = getValue(a, ["GeneratedStoreID"]);
        bValue = getValue(b, ["GeneratedStoreID"]);
        break;
      case "storeName":
        aValue = getValue(a, ["StoreName"]);
        bValue = getValue(b, ["StoreName"]);
        break;
      case "email":
        aValue = getValue(a, ["Email"]);
        bValue = getValue(b, ["Email"]);
        break;
      case "phone":
        aValue = getValue(a, ["Phone"]);
        bValue = getValue(b, ["Phone"]);
        break;
      case "state":
        aValue = getValue(a, ["StateName", "State", "state"]);
        bValue = getValue(b, ["StateName", "State", "state"]);
        break;
      case "city":
        aValue = getValue(a, ["CityName", "City", "city"]);
        bValue = getValue(b, ["CityName", "City", "city"]);
        break;
      case "totalCustomers":
        aValue = parseInt(getValue(a, ["TotalCustomers"])) || 0;
        bValue = parseInt(getValue(b, ["TotalCustomers"])) || 0;
        break;
      case "totalSales":
        aValue = parseFloat(getValue(a, ["TotalSales"])) || 0;
        bValue = parseFloat(getValue(b, ["TotalSales"])) || 0;
        break;
      case "createdAt":
        aValue = new Date(getValue(a, ["CreatedAt"])).getTime() || 0;
        bValue = new Date(getValue(b, ["CreatedAt"])).getTime() || 0;
        break;
      case "pan":
        aValue = getValue(a, ["PAN", "PANNumber", "PanNo"]);
        bValue = getValue(b, ["PAN", "PANNumber", "PanNo"]);
        break;
      case "aadhar":
        aValue = getValue(a, ["Aadhar", "AadharNumber", "AadharNo"]);
        bValue = getValue(b, ["Aadhar", "AadharNumber", "AadharNo"]);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const exportToExcel = () => {
    const dataToExport = sortedData.map((store) => ({
      "Store ID": getValue(store, ["StoreID"]),
      "Store Name": getValue(store, ["StoreName"]),
      Email: getValue(store, ["Email"]),
      Phone: getValue(store, ["Phone"]),
      State: getValue(store, ["StateName", "State", "state"]),
      City: getValue(store, ["CityName", "City", "city"]),
      PAN: getValue(store, ["PAN", "PANNumber", "PanNo"]),
      Aadhar: getValue(store, ["Aadhar", "AadharNumber", "AadharNo"]),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Stores");
    XLSX.writeFile(workbook, "all_stores_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("All Stores List", 14, 20);

    const tableColumn = [
      "Store ID",
      "Name",
      "Email",
      "Phone",
      "State",
      "City",
      "Customers",
      "Total Sales",
      "Date & Time",
      "PAN",
      "Aadhar",
    ];
    const tableRows = sortedData.map((store) => [
      getValue(store, ["GeneratedStoreID"]),
      getValue(store, ["StoreName"]),
      getValue(store, ["Email"]),
      getValue(store, ["Phone"]),
      getValue(store, ["StateName", "State", "state"]),
      getValue(store, ["CityName", "City", "city"]),
      getValue(store, ["TotalCustomers"]),
      getValue(store, ["TotalSales"]),
      (() => {
        const dateStr = getValue(store, ["CreatedAt"]);
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `${formattedDate}\n${formattedTime}`;
      })(),
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
      columnStyles: {
        8: { cellWidth: "auto" },
      },
    });

    doc.save("all_stores_data.pdf");
  };

  const totalPages = Math.ceil(sortedData.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = sortedData.slice(indexOfFirst, indexOfLast);

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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Stores
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage and view all registered stores
          </p>
        </div>

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
          </div>
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
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("storeId")}
                      >
                        <div className="flex items-center gap-1">
                          Store ID
                          {getSortIcon("storeId")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("storeName")}
                      >
                        <div className="flex items-center gap-1">
                          Store Name
                          {getSortIcon("storeName")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-1">
                          Email
                          {getSortIcon("email")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("phone")}
                      >
                        <div className="flex items-center gap-1">
                          Phone
                          {getSortIcon("phone")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("state")}
                      >
                        <div className="flex items-center gap-1">
                          State
                          {getSortIcon("state")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("city")}
                      >
                        <div className="flex items-center gap-1">
                          City
                          {getSortIcon("city")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("totalCustomers")}
                      >
                        <div className="flex items-center gap-1">
                          Customers
                          {getSortIcon("totalCustomers")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("totalSales")}
                      >
                        <div className="flex items-center gap-1">
                          Total Sales
                          {getSortIcon("totalSales")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center gap-1">
                          Date & Time
                          {getSortIcon("createdAt")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("pan")}
                      >
                        <div className="flex items-center gap-1">
                          PAN
                          {getSortIcon("pan")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handleSort("aadhar")}
                      >
                        <div className="flex items-center gap-1">
                          Aadhar
                          {getSortIcon("aadhar")}
                        </div>
                      </th>
                      <th className="min-w-[250px] p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Actions
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
                            {getValue(store, ["GeneratedStoreID"])}
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
                          <td className="p-3 text-sm border-t">
                            {(() => {
                              const dateStr = getValue(store, ["CreatedAt"]);
                              if (!dateStr) return "N/A";

                              const date = new Date(dateStr);

                              const formattedDate = date.toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
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
                                <FaUserFriends />
                                Total Customers
                              </button>
                              <button
                                onClick={() => confirmDelete(store)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
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
                          colSpan={11}
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
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AllStores;
