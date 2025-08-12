'use client';

import React, { useState } from "react";

const Customers = () => {
  const [customers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 555-1234", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 555-5678", status: "Inactive" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 555-9876", status: "Active" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "+1 555-4321", status: "Pending" },
  ]);

  return (
    <div className="p-4 md:p-6  min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Customers</h1>

      {/* Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm md:text-base">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm md:text-base">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="p-3 border">{customer.id}</td>
                <td className="p-3 border">{customer.name}</td>
                <td className="p-3 border">{customer.email}</td>
                <td className="p-3 border">{customer.phone}</td>
                <td
                  className={`p-3 border font-semibold ${
                    customer.status === "Active"
                      ? "text-green-600"
                      : customer.status === "Inactive"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {customer.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
