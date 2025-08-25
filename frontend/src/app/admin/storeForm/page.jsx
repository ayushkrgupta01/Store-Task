"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaStore,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaCity,
  FaFlag,
  FaInfoCircle,
  FaFileAlt,
  FaUpload,
  FaSpinner,
  FaArrowLeft,
  FaEye,
  FaTimesCircle,
  FaExclamationCircle, // Added for the error message icon
} from "react-icons/fa";

// Assuming StoreInfoPopup.jsx is in the same directory or adjust the path
import StoreInfoPopup from "@/components/StoreInfoPopup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable Image Preview Component
const ImagePreview = ({ imageUrl, handleClear, loading, label }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="relative mt-4 group">
      <img
        src={imageUrl}
        alt={`${label} Preview`}
        className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200 shadow-md"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <button
          type="button"
          onClick={handleClear}
          className="text-white hover:text-red-400 transition-colors mx-2 p-2 rounded-full bg-red-600 bg-opacity-75 hover:bg-opacity-100"
        >
          <FaTimesCircle className="text-2xl" />
        </button>
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-indigo-400 transition-colors mx-2 p-2 rounded-full bg-indigo-600 bg-opacity-75 hover:bg-opacity-100"
        >
          <FaEye className="text-2xl" />
        </a>
      </div>
    </div>
  );
};

const AddStore = () => {
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);

  // State variables for image previews (local URLs) and filenames
  const [panPreviewUrl, setPanPreviewUrl] = useState(null);
  const [aadharPreviewUrl, setAadharPreviewUrl] = useState(null);
  const [panFileName, setPanFileName] = useState("");
  const [aadharFileName, setAadharFileName] = useState("");

  // State for popup and credentials
  const [showPopup, setShowPopup] = useState(false);
  const [storeCredentials, setStoreCredentials] = useState(null);

  // Formik with validation schema
  const formik = useFormik({
    initialValues: {
      storeName: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      panNumber: "",
      panNumberAttachment: null,
      aadharNumber: "",
      aadharNumberAttachment: null,
    },
    validationSchema: Yup.object({
      storeName: Yup.string().required("Store name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      address: Yup.string().required("Address is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      panNumber: Yup.string().required("PAN number is required"),
      panNumberAttachment: Yup.mixed().required("PAN Card Image is required."),
      aadharNumber: Yup.string().required("Aadhar number is required"),
      aadharNumberAttachment: Yup.mixed().required(
        "Aadhar Card Image is required."
      ),
    }),
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      setStatus(null); // Clear any previous status message
      setIsSubmitting(true);
      try {
        const storeObject = {
          StoreName: values.storeName,
          Email: values.email,
          Phone: values.phone,
          Address: values.address,
          CountryId: values.country,
          StateId: values.state,
          CityId: values.city,
          PANNumber: values.panNumber,
          PANNumberAttachment: panFileName,
          AadharNumber: values.aadharNumber,
          AadharNumberAttachment: aadharFileName,
          ActionMode: "INSERT",
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_STORE_URL}/ManageStore`,
          storeObject
        );

        const responseData = response.data[0];

        if (responseData.status === 1 || responseData.status === "1") {
          setStoreCredentials({
            storeId: responseData.NewStoreId,
            password: responseData.StorePassword,
          });
          setShowPopup(true);
          toast.success(responseData.message);

          resetForm();
          setPanPreviewUrl(null);
          setAadharPreviewUrl(null);
          setPanFileName("");
          setAadharFileName("");
        } else {
          // Use Formik's setStatus for general backend errors
          toast.error(responseData.message);
          setStatus(responseData.message || "An unknown error occurred.");
        }
      } catch (err) {
        console.error("Submission Error:", err.response?.data || err.message);
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred.";
        toast.error(errorMessage);
        setStatus(errorMessage); // Use setStatus for network/server errors
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Load countries on component mount
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_COUNTRIES_URL)
      .then((res) => setCountries(res.data))
      .catch(() => formik.setStatus("Failed to load countries."));
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formik.values.country) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_STATES_URL}?CountryId=${formik.values.country}`
        )
        .then((res) => setStates(res.data))
        .catch(() => formik.setStatus("Failed to load states."));
    }
  }, [formik.values.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formik.values.state) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_CITIES_URL}?StateId=${formik.values.state}`
        )
        .then((res) => setCities(res.data))
        .catch(() => formik.setStatus("Failed to load cities."));
    }
  }, [formik.values.state]);

  // File upload handler
  const handleFileUploadChange = async (e, uploadtype) => {
    const file = e.target.files[0] || null;
    if (!file) {
      // If no file is selected, clear the field value in formik
      if (uploadtype === "Pan") {
        formik.setFieldValue("panNumberAttachment", null);
      } else {
        formik.setFieldValue("aadharNumberAttachment", null);
      }
      return;
    }

    // Set the file object in Formik state
    const fieldName =
      uploadtype === "Pan" ? "panNumberAttachment" : "aadharNumberAttachment";
    formik.setFieldValue(fieldName, file);
    formik.setFieldTouched(fieldName, true, false);

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      formik.setStatus("Invalid file type. Only JPG, PNG, GIF allowed.");
      e.target.value = null; // Clear the input
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      formik.setStatus("File too large (max 1MB).");
      e.target.value = null; // Clear the input
      return;
    }

    if (uploadtype === "Pan") {
      setUploadingPan(true);
    } else {
      setUploadingAadhar(true);
    }

    const fileUrl = URL.createObjectURL(file);
    if (uploadtype === "Pan") {
      setPanPreviewUrl(fileUrl);
    } else {
      setAadharPreviewUrl(fileUrl);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadtype", uploadtype);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STORE_URL}/PostUserImage`,
        formData
      );
      if (res.data?.success && res.data?.fileName) {
        if (uploadtype === "Pan") {
          setPanFileName(res.data.fileName);
          formik.setStatus("PAN image uploaded successfully!");
        } else {
          setAadharFileName(res.data.fileName);
          formik.setStatus("Aadhar image uploaded successfully!");
        }
      } else {
        formik.setStatus("Upload failed");
      }
    } catch {
      formik.setStatus("Upload error");
    } finally {
      if (uploadtype === "Pan") {
        setUploadingPan(false);
      } else {
        setUploadingAadhar(false);
      }
      e.target.value = null; // Clear input to allow re-uploading the same file
    }
  };

  const clearImage = (type) => {
    if (type === "pan") {
      setPanFileName("");
      setPanPreviewUrl(null);
      formik.setFieldValue("panNumberAttachment", null);
    } else if (type === "aadhar") {
      setAadharFileName("");
      setAadharPreviewUrl(null);
      formik.setFieldValue("aadharNumberAttachment", null);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setStoreCredentials(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <FaArrowLeft />
        Back
      </button>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add New Store
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Create a new store entry by filling out the details below.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaStore className="mr-3" />
              Store Information
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* --- New: General Form Status Message --- */}
              {formik.status && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center gap-2">
                  <FaExclamationCircle className="text-lg" />
                  <span className="block sm:inline">{formik.status}</span>
                </div>
              )}
              {/* --- End New --- */}

              {/* Store Name */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label
                    htmlFor="storeName"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaStore className="mr-2 text-indigo-500" />
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.storeName}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.storeName && formik.errors.storeName
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter store name"
                  />
                  {formik.touched.storeName && formik.errors.storeName && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.storeName}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaEnvelope className="mr-2 text-indigo-500" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="store@example.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaPhone className="mr-2 text-indigo-500" />
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                  Complete Address *
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    formik.touched.address && formik.errors.address
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter complete address"
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <FaInfoCircle className="mr-1" />
                    {formik.errors.address}
                  </div>
                )}
              </div>

              {/* Location Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaFlag className="mr-2 text-indigo-500" />
                    Country *
                  </label>
                  <select
                    name="country"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.country && formik.errors.country
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.CountryId} value={c.CountryId}>
                        {c.CountryName}
                      </option>
                    ))}
                  </select>
                  {formik.touched.country && formik.errors.country && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.country}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaBuilding className="mr-2 text-indigo-500" />
                    State *
                  </label>
                  <select
                    name="state"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.state}
                    disabled={!formik.values.country}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.state && formik.errors.state
                        ? "border-red-300"
                        : "border-gray-300"
                    } ${
                      !formik.values.country
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value="">Select</option>
                    {states.map((s) => (
                      <option key={s.StateId} value={s.StateId}>
                        {s.StateName}
                      </option>
                    ))}
                  </select>
                  {formik.touched.state && formik.errors.state && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.state}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaCity className="mr-2 text-indigo-500" />
                    City *
                  </label>
                  <select
                    name="city"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                    disabled={!formik.values.state}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.city && formik.errors.city
                        ? "border-red-300"
                        : "border-gray-300"
                    } ${
                      !formik.values.state
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value="">Select</option>
                    {cities.map((c) => (
                      <option key={c.CityId} value={c.CityId}>
                        {c.CityName}
                      </option>
                    ))}
                  </select>
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.city}
                    </div>
                  )}
                </div>
              </div>

              {/* PAN Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="panNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaInfoCircle className="mr-2 text-indigo-500" />
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.panNumber}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono ${
                      formik.touched.panNumber && formik.errors.panNumber
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="ABCDE1234F"
                  />
                  {formik.touched.panNumber && formik.errors.panNumber && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.panNumber}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="panNumberAttachment"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaFileAlt className="mr-2 text-indigo-500" />
                    PAN Card Image *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUploadChange(e, "Pan")}
                      onBlur={() =>
                        formik.setFieldTouched("panNumberAttachment", true)
                      }
                      className="hidden"
                      id="panNumberAttachment"
                    />
                    <label
                      htmlFor="panNumberAttachment"
                      className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                        panPreviewUrl
                          ? "bg-green-100 border-green-400"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      } ${
                        formik.touched.panNumberAttachment &&
                        formik.errors.panNumberAttachment
                          ? "border-red-300"
                          : ""
                      }`}
                    >
                      {uploadingPan ? (
                        <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                      ) : (
                        <FaUpload className="mr-2 text-indigo-500" />
                      )}
                      {panFileName || "Choose File"}
                    </label>
                  </div>
                  {formik.touched.panNumberAttachment &&
                    formik.errors.panNumberAttachment && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <FaInfoCircle className="mr-1" />
                        {formik.errors.panNumberAttachment}
                      </div>
                    )}
                  {panPreviewUrl && (
                    <ImagePreview
                      imageUrl={panPreviewUrl}
                      handleClear={() => clearImage("pan")}
                      loading={uploadingPan}
                      label="PAN Card"
                    />
                  )}
                </div>
              </div>

              {/* Aadhar Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="aadharNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaInfoCircle className="mr-2 text-indigo-500" />
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    name="aadharNumber"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.aadharNumber}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono ${
                      formik.touched.aadharNumber && formik.errors.aadharNumber
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="1234 5678 9012"
                  />
                  {formik.touched.aadharNumber &&
                    formik.errors.aadharNumber && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <FaInfoCircle className="mr-1" />
                        {formik.errors.aadharNumber}
                      </div>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="aadharNumberAttachment"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <FaFileAlt className="mr-2 text-indigo-500" />
                    Aadhar Card Image *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUploadChange(e, "Aadhar")}
                      onBlur={() =>
                        formik.setFieldTouched("aadharNumberAttachment", true)
                      }
                      className="hidden"
                      id="aadharNumberAttachment"
                    />
                    <label
                      htmlFor="aadharNumberAttachment"
                      className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                        aadharPreviewUrl
                          ? "bg-green-100 border-green-400"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      } ${
                        formik.touched.aadharNumberAttachment &&
                        formik.errors.aadharNumberAttachment
                          ? "border-red-300"
                          : ""
                      }`}
                    >
                      {uploadingAadhar ? (
                        <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                      ) : (
                        <FaUpload className="mr-2 text-indigo-500" />
                      )}
                      {aadharFileName || "Choose File"}
                    </label>
                  </div>
                  {formik.touched.aadharNumberAttachment &&
                    formik.errors.aadharNumberAttachment && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <FaInfoCircle className="mr-1" />
                        {formik.errors.aadharNumberAttachment}
                      </div>
                    )}
                  {aadharPreviewUrl && (
                    <ImagePreview
                      imageUrl={aadharPreviewUrl}
                      handleClear={() => clearImage("aadhar")}
                      loading={uploadingAadhar}
                      label="Aadhar Card"
                    />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white transition-all duration-200 ${
                    isSubmitting || uploadingPan || uploadingAadhar
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" /> Submitting...
                    </span>
                  ) : (
                    "Create Store"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showPopup && storeCredentials && (
        <StoreInfoPopup
          storeId={storeCredentials.storeId}
          password={storeCredentials.password}
          onClose={handleClosePopup}
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

export default AddStore;
