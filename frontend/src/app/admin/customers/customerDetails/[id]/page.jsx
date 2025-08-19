'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CustomerDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  // Base URL for images
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/uploads';

  useEffect(() => {
    if (!id) return;
    const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

    fetch(`${BACKEND_BASE_URL}/GetById/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Data is not fetching");
        return response.json();
      })
      .then((data) => {
        setUser(data[0]);
        console.log("Fetched data:", data);
      })
      .catch((error) => {
        console.error("Error fetching customer:", error);
      });
  }, [id]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-12 bg-gray-900 min-h-screen text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400">
            Customer Details
          </h1>
          <div className="overflow-hidden rounded-xl border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <tbody className="divide-y divide-gray-700">
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-8 py-5 text-gray-200 font-medium">Name</td>
                  <td className="px-8 py-5 text-gray-400">{user.Customer_Name}</td>
                  <td className="px-8 py-5 text-gray-200 font-medium">Email</td>
                  <td className="px-8 py-5 text-gray-400">{user.Customer_Email}</td>
                </tr>
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-8 py-5 text-gray-200 font-medium">Phone</td>
                  <td className="px-8 py-5 text-gray-400">{user.Customer_Phone}</td>
                  <td className="px-8 py-5 text-gray-200 font-medium">Aadhar</td>
                  <td className="px-8 py-5 text-gray-400">{user.Customer_AadharNumber ?? "N/A"}</td>
                </tr>
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-8 py-5 text-gray-200 font-medium">PAN</td>
                  <td className="px-8 py-5 text-gray-400">{user.Customer_PanNumber ?? "N/A"}</td>
                  <td className="px-8 py-5 text-gray-200 font-medium">Product Amount</td>
                  <td className="px-8 py-5 text-gray-400">₹{user.Customer_ProductAmount}</td>
                </tr>
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-8 py-5 text-gray-200 font-medium">Service</td>
                  <td className="px-8 py-5 text-gray-400">{user.service_name}</td>
                  <td className="px-8 py-5 text-gray-200 font-medium">Date</td>
                  <td className="px-8 py-5 text-gray-400">{new Date(user.Customer_Date).toLocaleDateString()}</td>
                </tr>
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-8 py-5 text-gray-200 font-medium">Aadhar Card</td>
                  <td className="px-8 py-5 text-gray-400">
                    {user.Customer_Aadhar && (
                      <img
                        src={`${IMAGE_BASE_URL}/${user.Customer_Aadhar}`}
                        alt="Customer Aadhar"
                        width={200}
                        className="rounded-lg"
                      />
                    )}
                  </td>
                  <td className="px-8 py-5 text-gray-200 font-medium">Pan Card</td>
                  <td className="px-8 py-5 text-gray-400">
                    {user.Customer_PanCard && (
                      <img
                        src={`${IMAGE_BASE_URL}/${user.Customer_PanCard}`}
                        alt="Customer Pan"
                        width={200}
                        className="rounded-lg"
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => window.history.back()}
              className="px-10 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}