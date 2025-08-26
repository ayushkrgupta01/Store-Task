'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaFileAlt, FaLink, FaCalendarAlt, FaIdCard, FaStore, FaIdBadge, FaSpinner, FaRupeeSign } from 'react-icons/fa';

// Constants for backend and image URLs
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_SERVICES_URL;
const NEXT_PUBLIC_IMAGE_CUSTOMER = process.env.NEXT_PUBLIC_IMAGE_CUSTOMER;

export default function CustomerDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`${BACKEND_BASE_URL}/GetById/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Customer data not found.');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setUser(data[0]);
        } else {
          setError('Customer not found.');
        }
      })
      .catch((err) => {
        console.error('Error fetching customer:', err);
        setError('Failed to fetch customer details. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Function to render a single data field
  const renderDataField = (label, value, icon) => (
    <div className="flex items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {icon && <span className="text-indigo-500 text-lg">{icon}</span>}
      <div className="flex flex-col sm:flex-row sm:items-center w-full">
        <span className="font-semibold text-gray-600 sm:w-1/3">{label}:</span>
        <span className="text-gray-900 mt-1 sm:mt-0 sm:w-2/3 break-words">
          {value || 'N/A'}
        </span>
      </div>
    </div>
  );

  // UI states
  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-indigo-500 h-12 w-12" />
        <p className="mt-4 text-gray-700 font-medium">Loading customer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen text-red-500 font-medium">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen text-gray-500">
        <p>No customer data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Customer Profile
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Detailed information about the selected customer.
          </p>
        </div>

        {/* Customer Info Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaUser /> {user.Customer_Name}
            </h1>
            <p className="text-gray-200 text-sm mt-1">
              Details for {user.Customer_Name}
            </p>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderDataField('Customer ID', user.CustomerID, <FaIdCard />)}
              {renderDataField('Store ID', user.StoreID, <FaIdBadge />)}
              {renderDataField('Customer Name', user.Customer_Name, <FaUser />)}
              {renderDataField('Store Name', user.StoreName, <FaStore />)}
              {renderDataField('Email', user.Customer_Email, <FaEnvelope />)}
              {renderDataField('Phone', user.Customer_Phone, <FaPhone />)}
            </div>

            <div className="space-y-4">
              {renderDataField('Aadhar Number', user.Customer_AadharNumber, <FaFileAlt />)}
              {renderDataField('PAN Number', user.Customer_PanNumber, <FaFileAlt />)}
              {renderDataField('Product Amount', `₹${user.Customer_ProductAmount}`, <FaRupeeSign />)}
              {renderDataField('Date', user.Customer_Date ? new Date(user.Customer_Date).toLocaleDateString() : 'N/A', <FaCalendarAlt />)}
              {renderDataField('Service', user.service_name, <FaFileAlt />)}
              {renderDataField('Generated Store ID', user.GeneratedStoreID, <FaIdBadge />)}
            </div>
          </div>

          {/* Attachments Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Attachments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhar Attachment */}
              <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-600">Aadhar Card:</span>
                {user.Customer_Aadhar ? (
                  <>
                    <a
                      href={`${NEXT_PUBLIC_IMAGE_CUSTOMER}/${user.Customer_Aadhar}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={`${NEXT_PUBLIC_IMAGE_CUSTOMER}/${user.Customer_Aadhar}`}
                        alt="Aadhar Card Preview"
                        className="mt-2 rounded-md border border-gray-200 shadow-sm w-full h-auto object-contain"
                      />
                    </a>
                    <p className="text-sm text-center text-gray-500 mt-2">Click image to view full size.</p>
                  </>
                ) : (
                  <span className="text-gray-500">No Aadhar attachment found.</span>
                )}
              </div>

              {/* PAN Attachment */}
              <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-600">PAN Card:</span>
                {user.Customer_PanCard ? (
                  <>
                    <a
                      href={`${NEXT_PUBLIC_IMAGE_CUSTOMER}/${user.Customer_PanCard}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={`${NEXT_PUBLIC_IMAGE_CUSTOMER}/${user.Customer_PanCard}`}
                        alt="PAN Card Preview"
                        className="mt-2 rounded-md border border-gray-200 shadow-sm w-full h-auto object-contain"
                      />
                    </a>
                    <p className="text-sm text-center text-gray-500 mt-2">Click image to view full size.</p>
                  </>
                ) : (
                  <span className="text-gray-500">No PAN attachment found.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}