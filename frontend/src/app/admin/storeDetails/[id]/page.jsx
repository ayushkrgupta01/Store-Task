// pages/store/[id]/details.js
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // if using app router
import axios from "axios";
// import StoreForm from "@/components/StoreForm"; // your reusable form

export default function StoreDetailsPage() {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStoreDetails();
    }
  }, [id]);

  const fetchStoreDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores/${id}`
      );
      setStoreData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching store details", err);
      setLoading(false);
    }
  };

  if (loading) return <p className="p-4">Loading store details...</p>;
  if (!storeData) return <p className="p-4 text-red-500">Store not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Store Details</h1>
      <StoreForm
        initialValues={storeData}
        readOnly={true} // custom prop to disable inputs
      />
    </div>
  );
}
