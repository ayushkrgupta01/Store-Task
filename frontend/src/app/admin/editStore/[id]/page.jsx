"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
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
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStore = () => {
  const { id } = useParams();
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [aadharCard, setAadharCard] = useState("");
  const [panCard, setPanCard] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [loading, setLoading] = useState(true);

  // New state variables for image previews
  const [panPreviewUrl, setPanPreviewUrl] = useState(null);
  const [aadharPreviewUrl, setAadharPreviewUrl] = useState(null);

  // ✅ Fetch store details
  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_STORE_URL}/GetStoreById`, {
          params: { id: id }, // ✅ pass as query param
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const s = res.data[0];
            formik.setValues({
              storeName: s.StoreName || "",
              email: s.Email || "",
              phone: s.Phone || "",
              address: s.Address || "",
              country: s.CountryId || "",
              state: s.StateId || "",
              city: s.CityId || "",
              panNumber: s.PANNumber || "",
              panNumberAttachment: s.PANNumberAttachment || "",
              aadharNumber: s.AadharNumber || "",
              aadharNumberAttachment: s.AadharNumberAttachment || "",
            });
            setPanCard(s.PANNumberAttachment || "");
            setAadharCard(s.AadharNumberAttachment || "");

            // Set initial preview URLs if attachments exist
            if (s.PANNumberAttachment) {
              setPanPreviewUrl(
                `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${s.PANNumberAttachment}`
              );
            }
            if (s.AadharNumberAttachment) {
              setAadharPreviewUrl(
                `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${s.AadharNumberAttachment}`
              );
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load store data.");
          setLoading(false);
        });
    }
  }, [id]);

  // ✅ Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      storeName: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      panNumber: "",
      panNumberAttachment: "",
      aadharNumber: "",
      aadharNumberAttachment: "",
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
      aadharNumber: Yup.string().required("Aadhar number is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const storeObject = {
          StoreId: id,
          StoreName: values.storeName,
          Email: values.email,
          Phone: values.phone,
          Address: values.address,
          CountryId: values.country,
          StateId: values.state,
          CityId: values.city,
          PanNumber: values.panNumber,
          PANNumberAttachment: panCard,
          AadharNumber: values.aadharNumber,
          AadharNumberAttachment: aadharCard,
          ActionMode: "UPDATE",
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_STORE_URL}/EditStore`,
          storeObject
        );

        if (response.data[0].status == "1") {
          toast.success(response.data[0].message);
          setTimeout(() => router.push("/admin/allStores"), 1500);
        } else {
          toast.error(response.data[0].message);
        }
      } catch (err) {
        toast.error(err.message || "Update failed");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // ✅ Load countries
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_COUNTRIES_URL)
      .then((res) => setCountries(res.data))
      .catch(() => toast.error("Failed to load countries."));
  }, []);

  // ✅ Load states when country changes
  useEffect(() => {
    if (formik.values.country) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_STATES_URL}?CountryId=${formik.values.country}`
        )
        .then((res) => setStates(res.data))
        .catch(() => toast.error("Failed to load states."));
    }
  }, [formik.values.country]);

  // ✅ Load cities when state changes
  useEffect(() => {
    if (formik.values.state) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_CITIES_URL}?StateId=${formik.values.state}`
        )
        .then((res) => setCities(res.data))
        .catch(() => toast.error("Failed to load cities."));
    }
  }, [formik.values.state]);

  // ✅ File upload
  const handleFileUploadChange = async (e, uploadtype) => {
    const file = e.target.files[0] || null;
    const field =
      uploadtype === "Pan" ? "panNumberAttachment" : "aadharNumberAttachment";

    if (!file) {
      if (uploadtype === "Pan") {
        setPanPreviewUrl(null);
      } else {
        setAadharPreviewUrl(null);
      }
      return;
    }

    // Set file preview URL
    const fileUrl = URL.createObjectURL(file);
    if (uploadtype === "Pan") {
      setPanPreviewUrl(fileUrl);
    } else {
      setAadharPreviewUrl(fileUrl);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, GIF allowed.");
      if (uploadtype === "Pan") {
        setPanPreviewUrl(null);
      } else {
        setAadharPreviewUrl(null);
      }
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File too large (max 1MB).");
      if (uploadtype === "Pan") {
        setPanPreviewUrl(null);
      } else {
        setAadharPreviewUrl(null);
      }
      return;
    }

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
        if (uploadtype === "Pan") {
          setPanCard(res.data.fileName);
        } else {
          setAadharCard(res.data.fileName);
        }
        formik.setFieldValue(field, res.data.fileName);
        toast.success(`${uploadtype} image uploaded successfully!`);
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      if (uploadtype === "Pan") {
        setUploadingPan(false);
      } else {
        setUploadingAadhar(false);
      }
    }
  };

  const clearImage = (type) => {
    if (type === "pan") {
      setPanCard("");
      setPanPreviewUrl(null);
      formik.setFieldValue("panNumberAttachment", "");
    } else if (type === "aadhar") {
      setAadharCard("");
      setAadharPreviewUrl(null);
      formik.setFieldValue("aadharNumberAttachment", "");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

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
            Edit Store
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Update store information and details
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
                    PAN Card Image
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
                        panPreviewUrl
                          ? "bg-green-100 border-green-400"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      }`}
                    >
                      {uploadingPan ? (
                        <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                      ) : (
                        <FaUpload className="mr-2 text-indigo-500" />
                      )}
                      {panCard ? "Update PAN Card" : "Upload PAN Card"}
                    </label>
                  </div>
                  {panPreviewUrl && (
                    <div className="relative mt-4">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${formik.values.panNumberAttachment}`}
                        alt="PAN Card Preview"
                        className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => clearImage("pan")}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTimesCircle className="text-2xl" />
                      </button>
                    </div>
                  )}
                  {formik.touched.panNumberAttachment &&
                    formik.errors.panNumberAttachment && (
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
                    Aadhar Card Image
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
                        aadharPreviewUrl
                          ? "bg-green-100 border-green-400"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      }`}
                    >
                      {uploadingAadhar ? (
                        <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                      ) : (
                        <FaUpload className="mr-2 text-indigo-500" />
                      )}
                      {aadharCard ? "Update Aadhar Card" : "Upload Aadhar Card"}
                    </label>
                  </div>
                  {aadharPreviewUrl && (
                    <div className="relative mt-4">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${formik.values.aadharNumberAttachment}`}
                        alt="Aadhar Card Preview"
                        className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => clearImage("aadhar")}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTimesCircle className="text-2xl" />
                      </button>
                    </div>
                  )}
                  {formik.touched.aadharNumberAttachment &&
                    formik.errors.aadharNumberAttachment && (
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
                      Updating Store...
                    </>
                  ) : (
                    <>
                      <FaStore className="mr-3" />
                      Update Store
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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

export default EditStore;
