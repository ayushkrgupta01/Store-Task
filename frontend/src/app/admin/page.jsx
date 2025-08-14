"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaStore, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminHome = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`
      );
      setStores(res.data || []);
    } catch (err) {
      toast.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const metrics = useMemo(() => {
    const totalStores = stores.length;
    const storesWithEmail = stores.filter(s => s.Email && String(s.Email).trim() !== "").length;
    const storesWithPhone = stores.filter(s => s.Phone && String(s.Phone).trim() !== "").length;
    return { totalStores, storesWithEmail, storesWithPhone };
  }, [stores]);

  const domainChartData = useMemo(() => {
    const domainCountMap = new Map();
    for (const s of stores) {
      const email = s.Email || "";
      const parts = String(email).split("@");
      if (parts.length === 2) {
        const domain = parts[1].toLowerCase();
        domainCountMap.set(domain, (domainCountMap.get(domain) || 0) + 1);
      }
    }
    const arr = Array.from(domainCountMap.entries()).map(([domain, count]) => ({ domain, count }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 7);
  }, [stores]);

  if (loading) {
    return <LoadingSpinner fullScreen={true} size="xl" text="Loading dashboard..." />;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
      <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-500 mt-1">All your tasks, in one view.</p>
        </div>
        <button
          onClick={fetchStores}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center space-x-4">
            <FaStore className="text-4xl" />
            <div>
              <h2 className="text-sm font-medium opacity-80">Total Stores</h2>
              <p className="text-3xl font-bold">{metrics.totalStores}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-4xl" />
            <div>
              <h2 className="text-sm font-medium opacity-80">Stores With Email</h2>
              <p className="text-3xl font-bold">{metrics.storesWithEmail}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center space-x-4">
            <FaPhone className="text-4xl" />
            <div>
              <h2 className="text-sm font-medium opacity-80">Stores With Phone</h2>
              <p className="text-3xl font-bold">{metrics.storesWithPhone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Email Domains</h2>
        {domainChartData.length === 0 ? (
          <p className="text-gray-500">No email data available.</p>
        ) : (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="domain" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" name="Stores" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Stores</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 border-b">Store Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Phone</th>
            </tr>
          </thead>
          <tbody>
            {(stores || []).slice(0, 8).map((s, idx) => (
              <tr key={s.StoreId || idx} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">{s.StoreName || "-"}</td>
                <td className="p-3 border-b">{s.Email || "-"}</td>
                <td className="p-3 border-b">{s.Phone || "-"}</td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500 border">No stores found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;
