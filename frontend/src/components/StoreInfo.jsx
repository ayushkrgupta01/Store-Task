import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoreInfo = ({ storeId }) => {
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (storeId) {
            const fetchStoreDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_STORE_URL}/GetStores`,
                        {
                            params: { StoreID: storeId },
                        }
                    );
                    if (res.data && res.data.length > 0) {
                        setStoreData(res.data[0]);
                    } else {
                        setError("Store not found.");
                    }
                } catch (err) {
                    console.error("Error fetching store details:", err);
                    setError("Failed to fetch store details. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };

            fetchStoreDetails();
        } else {
            setLoading(false);
        }
    }, [storeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-4 text-gray-700">Loading store details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (!storeData) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No store data available.</p>
            </div>
        );
    }

    // Function to render a single data field
    const renderDataField = (label, value) => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
            <span className="font-semibold text-gray-600 sm:w-1/3">{label}:</span>
            <span className="text-gray-900 mt-1 sm:mt-0 sm:w-2/3">{value || "N/A"}</span>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01] border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <h1 className="text-3xl font-bold text-white">Store Information</h1>
                    <p className="text-gray-200 text-sm mt-1">Details for {storeData.StoreName}</p>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {renderDataField("Store ID", storeData.StoreID)}
                            {renderDataField("Store Name", storeData.StoreName)}
                            {renderDataField("Email", storeData.Email)}
                            {renderDataField("Phone", storeData.Phone)}
                            {renderDataField("Address", storeData.Address)}
                            {renderDataField("Created At", new Date(storeData.CreatedAt).toLocaleDateString())}
                        </div>
                        <div className="space-y-4">
                            {renderDataField("Country", storeData.CountryName)}
                            {renderDataField("State", storeData.StateName)}
                            {renderDataField("City", storeData.CityName)}
                            {renderDataField("PAN Number", storeData.PANNumber)}
                            {renderDataField("Aadhar Number", storeData.AadharNumber)}
                            {/* Render attachments as links if available */}
                            {storeData.PANNumberAttachment && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                                    <span className="font-semibold text-gray-600 sm:w-1/3">PAN Attachment:</span>
                                    <a href={storeData.PANNumberAttachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-1 sm:mt-0 sm:w-2/3">View Attachment</a>
                                </div>
                            )}
                            {storeData.AadharNumberAttachment && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                                    <span className="font-semibold text-gray-600 sm:w-1/3">Aadhar Attachment:</span>
                                    <a href={storeData.AadharNumberAttachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-1 sm:mt-0 sm:w-2/3">View Attachment</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfo;