"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaArrowLeft,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFileAlt,
  FaStopCircle,
  FaUserSecret,
  FaDollarSign,
  FaCalendar,
  FaLink,
  FaImage,
} from "react-icons/fa";

// Component to display a single image attachment with preview and error handling
const ImageAttachmentPreview = ({ label, attachmentUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [attachmentUrl]);

  if (!attachmentUrl) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="text-gray-500">No image found.</span>
      </div>
    );
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_PREVIEW}/${attachmentUrl}`;

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <span className="font-semibold text-gray-600">{label}:</span>
      <div className="w-full relative min-h-[150px]">
        {!imageLoaded && !imageError && (
          <div className="flex items-center justify-center absolute inset-0 w-full h-full bg-gray-200 rounded-md animate-pulse">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        {imageError ? (
          <div className="flex items-center justify-center absolute inset-0 w-full h-full bg-gray-200 text-gray-500 rounded-md">
            Failed to load image
          </div>
        ) : (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={imageUrl}
              alt={label}
              className={`w-full h-auto rounded-md shadow-md transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
          </a>
        )}
      </div>
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition mt-2"
      >
        <FaLink /> View in new tab
      </a>
    </div>
  );
};

const StoreDetailsPage = () => {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchStoreDetails = async (StoreID) => {
        try {
          setLoading(true);
          setError(null);
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_STORE_URL}/GetStoreById`,
            { params: { id: StoreID } }
          );

          if (res.data && res.data.length > 0) {
            setStoreData(res.data[0]);
          } else {
            setError("Store not found.");
          }
        } catch (err) {
          console.error("Error fetching store details", err);
          setError("Failed to fetch store details. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchStoreDetails(id);
    }
  }, [id]);

  // Function to render a single data field
  const renderDataField = (label, value, icon) => (
    <div className="flex items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {icon && <span className="text-indigo-500 text-lg">{icon}</span>}
      <div className="flex flex-col sm:flex-row sm:items-center w-full">
        <span className="font-semibold text-gray-600 sm:w-1/3">{label}:</span>
        <span className="text-gray-900 mt-1 sm:mt-0 sm:w-2/3 break-words">
          {value || "N/A"}
        </span>
      </div>
    </div>
  );

  // UI states remain the same
  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="mt-4 text-gray-700 font-medium">
          Loading store details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center h-64 text-red-500 font-medium">
        <p>{error}</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="p-4 flex items-center justify-center h-64 text-gray-500">
        <p>No store data available.</p>
      </div>
    );
  }

  // Determine the image URL for the main store image
  const storeImage = storeData.StoreImageName
    ? `${process.env.NEXT_PUBLIC_IMAGE_PREVIEW}/uploads/${storeData.StoreImageName}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Store Profile
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Detailed information about the selected store.
          </p>
        </div>

        {/* Store Info Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaStore /> {storeData.StoreName}
            </h1>
            <p className="text-gray-200 text-sm mt-1">
              Details for {storeData.StoreName}
            </p>
          </div>

          {/* Main Store Image Preview Section */}
          {storeImage && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Store Image Preview
              </h3>
              <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src={storeImage}
                  alt={`Image for ${storeData.StoreName}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderDataField("Store ID", storeData.StoreID, <FaStore />)}
              {renderDataField("Store Name", storeData.StoreName, <FaStore />)}
              {renderDataField("Email", storeData.Email, <FaEnvelope />)}
              {renderDataField("Phone", storeData.Phone, <FaPhone />)}
              {renderDataField(
                "Address",
                storeData.Address,
                <FaMapMarkerAlt />
              )}
              {renderDataField(
                "Created At",
                new Date(storeData.CreatedAt).toLocaleDateString(),
                <FaCalendar />
              )}
              {renderDataField(
                "Generated Store ID",
                storeData.GeneratedStoreID,
                <FaStopCircle />
              )}
              {renderDataField(
                "Generated Store Password",
                storeData.StorePassword,
                <FaUserSecret />
              )}
            </div>

            <div className="space-y-4">
              {renderDataField(
                "Country",
                storeData.CountryName,
                <FaMapMarkerAlt />
              )}
              {renderDataField(
                "State",
                storeData.StateName,
                <FaMapMarkerAlt />
              )}
              {renderDataField("City", storeData.CityName, <FaMapMarkerAlt />)}
              {renderDataField("Total Sales", storeData.SalesByStore, <FaDollarSign />)}
              {renderDataField(
                "PAN Number",
                storeData.PANNumber,
                <FaFileAlt />
              )}
              {renderDataField(
                "Aadhar Number",
                storeData.AadharNumber,
                <FaFileAlt />
              )}
            </div>
          </div>
          
          {/* Attachments Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaImage className="text-indigo-500" />
              Attachment Previews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageAttachmentPreview
                label="PAN Card"
                attachmentUrl={storeData.PANNumberAttachment}
              />
              <ImageAttachmentPreview
                label="Aadhar Card"
                attachmentUrl={storeData.AadharNumberAttachment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsPage;