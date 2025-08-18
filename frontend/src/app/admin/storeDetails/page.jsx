"use client";
import React, { useState, useEffect } from "react";
import {
  FaStore,
  FaSearch,
  FaSpinner,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFileAlt,
  FaInfoCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const StoreDetails = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchStores();
  }, []);

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
            Store Details
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            View detailed information about all stores
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
            </div>
          </div>
        </div>

        {/* Store Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-4xl text-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.length > 0 ? (
              filtered.map((store, index) => (
                <div
                  key={store.StoreId || index}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <FaStore className="mr-3" />
                      {getValue(store, ["StoreName"])}
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Contact Information */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FaEnvelope className="mr-2 text-indigo-500" />
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-3">
                            <FaEnvelope className="text-gray-400" />
                            <span className="text-gray-700">
                              {getValue(store, ["Email"])}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <FaPhone className="text-gray-400" />
                            <span className="text-gray-700">
                              {getValue(store, ["Phone"])}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Location Information */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                          Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-3">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span className="text-gray-700">
                              {getValue(store, ["StateName", "State", "state"])}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span className="text-gray-700">
                              {getValue(store, ["CityName", "City", "city"])}
                            </span>
                          </div>
                        </div>
                        {store.Address && (
                          <div className="flex items-start space-x-3">
                            <FaMapMarkerAlt className="text-gray-400 mt-1" />
                            <span className="text-gray-700">
                              {store.Address}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Document Information */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FaFileAlt className="mr-2 text-indigo-500" />
                          Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-3">
                            <FaInfoCircle className="text-gray-400" />
                            <span className="text-gray-700 font-mono">
                              {getValue(store, ["PAN", "PANNumber", "PanNo"])}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <FaInfoCircle className="text-gray-400" />
                            <span className="text-gray-700 font-mono">
                              {getValue(store, [
                                "Aadhar",
                                "AadharNumber",
                                "AadharNo",
                              ])}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Store ID */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Store ID:
                          </span>
                          <span className="text-sm font-mono text-gray-700">
                            {store.StoreID || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/singleStoreDetails/${store.StoreID}`
                              )
                            }
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            View Full Details
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/admin/editStore/${store.StoreID}`)
                            }
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit Store
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                  <FaStore className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No stores found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or add a new store.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StoreDetails;
