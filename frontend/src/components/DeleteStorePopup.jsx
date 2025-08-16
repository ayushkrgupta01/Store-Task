"use client";
import React from "react";
import { FaTimes, FaExclamationTriangle, FaTrashAlt } from "react-icons/fa";

const DeleteStorePopup = ({ storeId, storeName, onConfirm, onClose }) => {

  const handleDelete = () => {
    // Call the provided onConfirm function with the storeId
    onConfirm(storeId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-100 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrashAlt className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to delete this store?
            </h3>
            <p className="text-gray-600 text-sm">
              You are about to permanently delete <strong className="font-semibold">{storeName}</strong> (ID: {storeId}).
              All associated data will be lost.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteStorePopup;