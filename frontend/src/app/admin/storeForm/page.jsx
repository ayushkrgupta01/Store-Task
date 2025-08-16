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
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreInfoPopup from "@/components/StoreInfoPopup";

const StoreForm = () => {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [aadharCard, setaadharCard] = useState("");
  const [panCard, setpanCard] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [popupData, setPopupData] = useState({ storeId: null, password: null });
  const [showPopup, setShowPopup] = useState(false);

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
      storeName: Yup.string()
        .min(2, "Store name must be at least 2 characters")
        .max(100, "Store name must be less than 100 characters")
        .required("Store name is required"),
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      phone: Yup.string()
        .matches(/^[+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be less than 15 digits")
        .required("Phone number is required"),
      address: Yup.string()
        .min(10, "Address must be at least 10 characters")
        .max(500, "Address must be less than 500 characters")
        .required("Complete address is required"),
      country: Yup.string().required("Please select a country"),
      state: Yup.string().required("Please select a state"),
      city: Yup.string().required("Please select a city"),
      panNumber: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number (e.g., ABCDE1234F)")
        .required("PAN number is required"),
      panNumberAttachment: Yup.mixed().required("PAN card image is required"),
      aadharNumber: Yup.string()
        .matches(/^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/, "Please enter a valid Aadhar number (e.g., 1234 5678 9012)")
        .required("Aadhar number is required"),
      aadharNumberAttachment: Yup.mixed().required("Aadhar card image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        var storeObject = {
          StoreName: values.storeName,
          Email: values.email,
          Phone: values.phone,
          Address: values.address,
          CountryId: values.country,
          StateId: values.state,
          CityId: values.city,
          PanNumber: values.panNumber,
          PanNumberAttachment: panCard,
          AadharNumber: values.aadharNumber,
          AadharNumberAttachment: aadharCard,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_STORE_URL}/ManageStore`,
          storeObject
        );
        
        if (response.data[0].status == "1") {
          toast.success(response.data[0].message);
          
          // Show store credentials if provided in response
          if (response.data[0].NewStoreId && response.data[0].StorePassword) {
            setPopupData({
              storeId: response.data[0].NewStoreId,
              password: response.data[0].StorePassword,
            });
            setShowPopup(true);
          }
          
          resetForm();
          setaadharCard("");
          setpanCard("");
          
          // Redirect to stores list after 2 seconds
          // {showPopup === false && setTimeout(() => {
          //   router.push("/admin/allStores");
          // }, 2000);}
        } else {
          toast.error(response.data[0].message);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error(
          `Submission failed: ${error.response?.data?.message || error.message}`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupData({ storeId: null, password: null });
  };

  // Effect to fetch countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_COUNTRIES_URL);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries.");
      }
    };
    fetchCountries();
  }, []);

  // Effect to fetch states when a country is selected
  useEffect(() => {
    const countryId = formik.values.country;
    if (countryId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_STATES_URL}?CountryId=${countryId}`)
        .then((response) => {
          setStates(response.data);
          formik.setFieldValue("state", "");
          formik.setFieldValue("city", "");
          setCities([]);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
          toast.error("Failed to load states.");
        });
    } else {
      setStates([]);
      setCities([]);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
    }
  }, [formik.values.country]);

  // Effect to fetch cities when a state is selected
  useEffect(() => {
    const stateId = formik.values.state;
    if (stateId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_CITIES_URL}?StateId=${stateId}`)
        .then((response) => {
          setCities(response.data);
          formik.setFieldValue("city", "");
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
          toast.error("Failed to load cities.");
        });
    } else {
      setCities([]);
      formik.setFieldValue("city", "");
    }
  }, [formik.values.state]);

  const handleFileUploadChange = async (e, uploadtype) => {
    const file = e.target.files[0] || null;
    const field =
      uploadtype === "Pan" ? "panNumberAttachment" : "aadharNumberAttachment";
    
    // Make Formik aware this field has been interacted with
    formik.setFieldTouched(field, true, false);
    
    // No file selected
    if (!file) {
      formik.setFieldError(field, "Please select an image file.");
      return;
    }

    // Frontend validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      formik.setFieldError(
        field,
        "Invalid file type. Only JPG, PNG, GIF allowed."
      );
      e.target.value = "";
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      // 1MB
      formik.setFieldError(field, "File too large. Max size is 1MB.");
      e.target.value = "";
      return;
    }

    // Clear any previous error before uploading
    formik.setFieldError(field, undefined);

    // Set uploading state
    if (uploadtype === "Pan") {
      setUploadingPan(true);
    } else {
      setUploadingAadhar(true);
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
        // Save server file name to both local state (if you need it) and Formik
        if (uploadtype === "Aadhar") {
          setaadharCard(res.data.fileName);
        } else {
          setpanCard(res.data.fileName);
        }
        // Store the filename so Yup .required() passes and errors disappear
        formik.setFieldValue(field, res.data.fileName, true);
        toast.success(`${uploadtype} image uploaded successfully!`);
      } else {
        formik.setFieldError(field, res.data?.error || "Upload failed.");
      }
    } catch (err) {
      formik.setFieldError(
        field,
        err?.response?.data?.error || err.message || "Upload failed."
      );
    } finally {
      if (uploadtype === "Pan") {
        setUploadingPan(false);
      } else {
        setUploadingAadhar(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add New Store
          </h1>
          <p className="text-gray-500 mt-1">
            Create a new store account with all required information
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaStore className="mr-3" />
              Store Information
            </h2>
          </div>
          
          <div className="p-6 md:p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                    id="storeName"
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
                    id="email"
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
                    type="tel"
                    name="phone"
                    id="phone"
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
                  id="address"
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
                    id="country"
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
                    {countries.map((country) => (
                      <option
                        key={country.CountryId}
                        value={country.CountryId}
                      >
                        {country.CountryName}
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
                    id="state"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.state}
                    disabled={!formik.values.country}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.state && formik.errors.state
                        ? "border-red-300"
                        : "border-gray-300"
                    } ${!formik.values.country ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option
                        key={state.StateId}
                        value={state.StateId}
                      >
                        {state.StateName}
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
                    id="city"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                    disabled={!formik.values.state}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      formik.touched.city && formik.errors.city
                        ? "border-red-300"
                        : "border-gray-300"
                    } ${!formik.values.state ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option
                        key={city.CityId}
                        value={city.CityId}
                      >
                        {city.CityName}
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
                    id="panNumber"
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
                      className="hidden"
                      id="panNumberAttachment"
                    />
                    <label
                      htmlFor="panNumberAttachment"
                      className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                        formik.touched.panNumberAttachment && formik.errors.panNumberAttachment
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      }`}
                    >
                      {uploadingPan ? (
                        <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                      ) : (
                        <FaUpload className="mr-2 text-indigo-500" />
                      )}
                      {panCard ? "PAN Card Uploaded ✓" : "Upload PAN Card"}
                    </label>
                  </div>
                  {formik.touched.panNumberAttachment && formik.errors.panNumberAttachment && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.panNumberAttachment}
                    </div>
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
                    id="aadharNumber"
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
                  {formik.touched.aadharNumber && formik.errors.aadharNumber && (
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
                      className="hidden"
                      id="aadharNumberAttachment"
                    />
                    <label
                      htmlFor="aadharNumberAttachment"
                      className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                        formik.touched.aadharNumberAttachment && formik.errors.aadharNumberAttachment
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      }`}
                    >
                      {uploadingAadhar ? (
                        <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                      ) : (
                        <FaUpload className="mr-2 text-indigo-500" />
                      )}
                      {aadharCard ? "Aadhar Card Uploaded ✓" : "Upload Aadhar Card"}
                    </label>
                  </div>
                  {formik.touched.aadharNumberAttachment && formik.errors.aadharNumberAttachment && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {formik.errors.aadharNumberAttachment}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      Creating Store...
                    </>
                  ) : (
                    <>
                      <FaStore className="mr-3" />
                      Create Store
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        {showPopup && (
          <StoreInfoPopup
            storeId={popupData.storeId}
            password={popupData.password}
            onClose={handleClosePopup}
          />
        )}
      </div>
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

export default StoreForm;
