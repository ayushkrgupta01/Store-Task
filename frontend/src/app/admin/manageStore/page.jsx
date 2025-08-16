"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaInfoCircle, FaStore } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteStorePopup from "@/components/DeleteStorePopup";

const ManageStores = () => {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

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

  const confirmDelete = (store) => {
    setSelectedStore(store);
    setShowDeletePopup(true);
  };

  const handleDelete = async (storeId) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_STORE_URL}/DeleteStore`,
        {
          data: { StoreID: storeId, ActionMode: "DELETE" },
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data[0].status == "1") {
        toast.success(res.data[0].message);
        fetchStores();
      } else {
        toast.error(res.data[0].message);
      }
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setShowDeletePopup(false);
      setSelectedStore(null);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(s.StoreName || "")
        .toLowerCase()
        .includes(q) ||
      String(s.Email || "")
        .toLowerCase()
        .includes(q) ||
      String(s.Phone || "")
        .toLowerCase()
        .includes(q) ||
      String(s.StateName || s.State || "")
        .toLowerCase()
        .includes(q) ||
      String(s.CityName || s.City || "")
        .toLowerCase()
        .includes(q) ||
      String(s.PAN || s.PanNumber || s.PanNo || "")
        .toLowerCase()
        .includes(q) ||
      String(s.Aadhar || s.AadharNumber || s.AadharNo || "")
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
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Manage Stores
          </h1>
          <p className="text-gray-500 mt-1">
            Create, edit and manage your stores
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, state, city, PAN or Aadhar..."
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
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaStore className="mr-3" />
              Store Details{" "}
            </h2>
          </div>
          <div className="p-6">
            <table className="w-full border-collapse min-w-[1024px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
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
                {filtered.length > 0 ? (
                  filtered.map((store, index) => (
                    <tr
                      key={store.StoreID || index}
                      className="hover:bg-gray-50 text-sm sm:text-[15px]"
                    >
                      <td className="p-3 border-t">
                        {getValue(store, ["StoreName"])}
                      </td>
                      <td className="p-3 border-t">
                        {getValue(store, ["Email"])}
                      </td>
                      <td className="p-3 border-t">
                        {getValue(store, ["Phone"])}
                      </td>
                      <td className="p-3 border-t">
                        {getValue(store, ["StateName", "State", "state"])}
                      </td>
                      <td className="p-3 border-t">
                        {getValue(store, ["CityName", "City", "city"])}
                      </td>
                      <td className="p-3 border-t font-mono">
                        {getValue(store, ["PAN", "PANNumber", "PanNo"])}
                      </td>
                      <td className="p-3 border-t font-mono">
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
                              router.push(`/admin/editStore/${store.StoreId}`)
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(store)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                          >
                            <FaTrash /> Delete
                          </button>
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/singleStoreDetails/${store.StoreID}`
                              )
                            }
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
                    <td
                      colSpan={8}
                      className="p-4 text-center text-gray-500 border"
                    >
                      No stores found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDeletePopup && selectedStore && (
        <DeleteStorePopup
          storeId={selectedStore.StoreID}
          storeName={selectedStore.StoreName}
          onConfirm={handleDelete}
          onClose={() => setShowDeletePopup(false)}
        />
      )}

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

export default ManageStores;
