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

const AllStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
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
    return String(store.service_name || "")
      .toLowerCase()
      .includes(q);
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
                    {filtered.length > 0 ? (
                      filtered.map((store, index) => (
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
