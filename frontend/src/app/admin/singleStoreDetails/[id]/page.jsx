"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFileAlt,
} from "react-icons/fa";

const StoreDetailsPage = () => {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // ✅ Fetch store details by ID
  const fetchStoreDetails = async (StoreID) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`,
        { params: { StoreID } }
      );
      if (res.data && res.data.length > 0) {
        setStoreData(res.data[0]);
      } else {
        setError("Store not found.");
      }
    } catch (err) {
      console.error("Error fetching store details", err);
      setError("Failed to fetch store details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStoreDetails(id);
    }
  }, [id]);

  // Function to render a single data field
  const renderDataField = (label, value, icon) => (
    <div className="flex items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {icon && <span className="text-indigo-500 text-lg">{icon}</span>}
      <div className="flex flex-col sm:flex-row sm:items-center w-full">
        <span className="font-semibold text-gray-600 sm:w-1/3">{label}:</span>
        <span className="text-gray-900 mt-1 sm:mt-0 sm:w-2/3 break-words">
          {value || "N/A"}
        </span>
      </div>
    </div>
  );

  // UI states
  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="mt-4 text-gray-700 font-medium">Loading store details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center h-64 text-red-500 font-medium">
        <p>{error}</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="p-4 flex items-center justify-center h-64 text-gray-500">
        <p>No store data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-2">
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
            Store Profile
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Detailed information about the selected store.
          </p>
        </div>

        {/* Store Info Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaStore /> {storeData.StoreName}
            </h1>
            <p className="text-gray-200 text-sm mt-1">
              Details for {storeData.StoreName}
            </p>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderDataField("Store ID", storeData.StoreID, <FaStore />)}
              {renderDataField("Store Name", storeData.StoreName, <FaStore />)}
              {renderDataField("Email", storeData.Email, <FaEnvelope />)}
              {renderDataField("Phone", storeData.Phone, <FaPhone />)}
              {renderDataField("Address", storeData.Address, <FaMapMarkerAlt />)}
              {renderDataField(
                "Created At",
                new Date(storeData.CreatedAt).toLocaleDateString(),
                <FaFileAlt />
              )}
            </div>

            <div className="space-y-4">
              {renderDataField("Country", storeData.CountryName, <FaMapMarkerAlt />)}
              {renderDataField("State", storeData.StateName, <FaMapMarkerAlt />)}
              {renderDataField("City", storeData.CityName, <FaMapMarkerAlt />)}
              {renderDataField("PAN Number", storeData.PANNumber, <FaFileAlt />)}
              {renderDataField("Aadhar Number", storeData.AadharNumber, <FaFileAlt />)}

              {/* Attachments */}
              {storeData.PANNumberAttachment && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="font-semibold text-gray-600">
                    PAN Attachment:
                  </span>
                  <a
                    href={storeData.PANNumberAttachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    View
                  </a>
                </div>
              )}

              {storeData.AadharNumberAttachment && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="font-semibold text-gray-600">
                    Aadhar Attachment:
                  </span>
                  <a
                    href={storeData.AadharNumberAttachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsPage;
