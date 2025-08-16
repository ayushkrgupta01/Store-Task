"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import StoreInfo from "@/components/StoreInfo";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";


const StoreDetailsPage = () => {
  const { id } = useParams(); // dynamic id from URL
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch store details by ID
  const fetchStoreDetails = async (StoreID) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStoreById`,
        {
          params: { id: StoreID }, // ✅ pass as query param
        }
      );
      setStoreData(res.data);
    } catch (err) {
      console.error("Error fetching store details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStoreDetails(id);
    }
  }, [id]);

  if (loading) return <p className="p-4">Loading store details...</p>;
  if (!storeData) return <p className="p-4 text-red-500">Store not found</p>;

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
            Store Profile
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Detailed information about the selected store.
          </p>
        </div>
        <StoreInfo storeId={id} readOnly={true} />
      </div>
    </div>
  );
};

export default StoreDetailsPage;
