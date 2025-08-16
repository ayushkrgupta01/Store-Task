"use client";
import React from "react";
import {
  FaStore,
  FaCheckCircle,
  FaCopy,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";

const StoreInfoPopup = ({ storeId, password, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const router = useRouter();

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleClose = () => {
    router.push("/admin/allStores"); // ✅ redirect on close
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Store Created Successfully!
                </h2>
                <p className="text-green-100 text-sm">
                  Your store has been registered
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-100 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaStore className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Store Credentials
            </h3>
            <p className="text-gray-600 text-sm">
              Please save these credentials securely. You'll need them to access
              your store.
            </p>
          </div>

          {/* Store ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={storeId}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(storeId, "storeId")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaCopy
                  className={`text-sm ${
                    copiedField === "storeId" ? "text-green-500" : ""
                  }`}
                />
              </button>
            </div>
            {copiedField === "storeId" && (
              <p className="text-green-600 text-xs mt-1">
                Copied to clipboard!
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-sm" />
                  ) : (
                    <FaEye className="text-sm" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(password, "password")}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaCopy
                    className={`text-sm ${
                      copiedField === "password" ? "text-green-500" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
            {copiedField === "password" && (
              <p className="text-green-600 text-xs mt-1">
                Copied to clipboard!
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please save these credentials in a secure location. You
                    won't be able to see the password again.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                copyToClipboard(
                  `Store ID: ${storeId}\nPassword: ${password}`,
                  "both"
                );
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Copy All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoPopup;
