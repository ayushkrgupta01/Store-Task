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
  FaUserFriends,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const AllStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5; // 👈 Change this number for page size
  const router = useRouter();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`
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
    return (
      String(store.StoreName || "")
        .toLowerCase()
        .includes(q) ||
      String(store.Email || "")
        .toLowerCase()
        .includes(q) ||
      String(store.Phone || "")
        .toLowerCase()
        .includes(q) ||
      String(store.StateName || store.State || "")
        .toLowerCase()
        .includes(q) ||
      String(store.CityName || store.City || "")
        .toLowerCase()
        .includes(q) ||
      String(store.PAN || store.PanNumber || store.PanNo || "")
        .toLowerCase()
        .includes(q) ||
      String(store.Aadhar || store.AadharNumber || store.AadharNo || "")
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
            All Stores
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage and view all registered stores
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
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Store ID
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        Store Name
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
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map((store, index) => (
                        <tr
                          key={store.StoreId || index}
                          className="hover:bg-gray-50 text-sm sm:text-[15px]"
                        >
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["StoreID"])}
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
                          <td className="p-3 border-t">
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

export default AllStores;
