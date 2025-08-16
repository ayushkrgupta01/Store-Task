"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Services = () => {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`
      );
      setStores(res.data);
    } catch (err) {
      toast.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (StoreID) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_STORE_URL}/DeleteStore`,
        { StoreId: StoreID, ActionMode: "Delete" }
      );
      if (res.data[0].status == "1") {
        toast.success(res.data[0].message);
        fetchStores();
      } else {
        toast.error(res.data[0].message);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(s.StoreName || "").toLowerCase().includes(q) ||
      String(s.Email || "").toLowerCase().includes(q) ||
      String(s.Phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">All Services</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchStores}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push("/admin/storeForm")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Add Store
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow p-6 text-gray-600">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-gray-100 text-sm sm:text-base">
                <th className="p-2 sm:p-3 border">Store Name</th>
                <th className="p-2 sm:p-3 border">Email</th>
                <th className="p-2 sm:p-3 border">Phone</th>
                <th className="p-2 sm:p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((store, index) => (
                  <tr key={store.StoreId || index} className="hover:bg-gray-50 text-sm sm:text-base">
                    <td className="p-2 sm:p-3 border">{store.StoreName}</td>
                    <td className="p-2 sm:p-3 border">{store.Email}</td>
                    <td className="p-2 sm:p-3 border">{store.Phone}</td>
                    {/* <td className="p-2 sm:p-3 border">{store.CityName}</td> */}
                    <td className="p-2 sm:p-3 border">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          onClick={() => router.push(`/admin/editStore/${store.StoreId}`)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(store.StoreId)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                        >
                          <FaTrash /> Delete
                        </button>
                        <button
                          onClick={() => router.push(`/admin/storeDetails/${store.StoreId}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                        >
                          <FaInfoCircle /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500 border">
                    No stores found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Services;
