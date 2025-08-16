"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import StoreInfo from "@/components/StoreInfo";
import { useParams } from "next/navigation";

const StoreDetailsPage = () => {
  const { id } = useParams(); // dynamic id from URL
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Store Profile</h1>
        <p className="mt-2 text-xl text-gray-600">
          Detailed information about the selected store.
        </p>
      </header>

      {/* ✅ Pass the fetched data into your StoreInfo component */}
      <StoreInfo storeId={id} readOnly={true} />

      {/* <footer className="mt-12 text-center text-gray-500">
        <p>&copy; 2025 Your App. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default StoreDetailsPage;
