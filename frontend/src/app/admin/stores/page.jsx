'use client';

import React, { useState, useMemo } from "react";
import { FaStore, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StoreListPage = () => {
  const [stores] = useState([
    { id: 1, name: "FreshMart", owner: "John Doe", email: "john@freshmart.com", phone: "+1 555-1234", status: "Active" },
    { id: 2, name: "TechWorld", owner: "Jane Smith", email: "jane@techworld.com", phone: "+1 555-5678", status: "Inactive" },
    { id: 3, name: "StyleHub", owner: "Mike Johnson", email: "mike@stylehub.com", phone: "+1 555-9876", status: "Active" },
    { id: 4, name: "HomeDeco", owner: "Sarah Williams", email: "sarah@homedeco.com", phone: "+1 555-4321", status: "Pending" },
  ]);

  const [search, setSearch] = useState("");

  const filteredStores = useMemo(() => {
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.owner.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, stores]);

  const totalStores = stores.length;
  const activeStores = stores.filter((s) => s.status === "Active").length;
  const inactiveStores = stores.filter((s) => s.status === "Inactive").length;

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Stores</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Total Stores */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition duration-300">
          <FaStore className="text-4xl opacity-90" />
          <div>
            <h2 className="text-sm uppercase font-semibold opacity-90">Total Stores</h2>
            <p className="text-3xl font-bold">{totalStores}</p>
          </div>
        </div>

        {/* Active Stores */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition duration-300">
          <FaCheckCircle className="text-4xl opacity-90" />
          <div>
            <h2 className="text-sm uppercase font-semibold opacity-90">Active Stores</h2>
            <p className="text-3xl font-bold">{activeStores}</p>
          </div>
        </div>

        {/* Inactive Stores */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition duration-300">
          <FaTimesCircle className="text-4xl opacity-90" />
          <div>
            <h2 className="text-sm uppercase font-semibold opacity-90">Inactive Stores</h2>
            <p className="text-3xl font-bold">{inactiveStores}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search by store name or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm md:text-base">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Store Name</th>
              <th className="p-3 border">Owner</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm md:text-base">
            {filteredStores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="p-3 border">{store.id}</td>
                <td className="p-3 border">{store.name}</td>
                <td className="p-3 border">{store.owner}</td>
                <td className="p-3 border">{store.email}</td>
                <td className="p-3 border">{store.phone}</td>
                <td
                  className={`p-3 border font-semibold ${
                    store.status === "Active"
                      ? "text-green-600"
                      : store.status === "Inactive"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {store.status}
                </td>
              </tr>
            ))}
            {filteredStores.length === 0 && (
              <tr>
                <td colSpan="6" className="p-3 border text-center text-gray-500">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreListPage;
