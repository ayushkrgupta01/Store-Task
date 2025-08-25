"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMoneyBill,
  FaUpload,
  FaSpinner,
  FaFileAlt,
  FaArrowLeft,
  FaLaptop,
} from "react-icons/fa";

const UPLOAD_URL = `${process.env.NEXT_PUBLIC_STORE_URL}/PostUserImage`;
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_SERVICES_URL;

export default function CustomerFormForRandomStore() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id; // Correctly get the storeId from the URL
  const [product, setProduct] = useState([]);
  const [aadharFileName, setAadharFileName] = useState("");
  const [panFileName, setPanFileName] = useState("");
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  // State variables for image previews
  const [aadharPreview, setAadharPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);

  // File upload handler
  const handleFileUpload = async (e, uploadType, setUploading, setFileName, setFilePreview) => {
    const file = e.target.files[0] || null;
    if (!file) {
      toast.error("Please select an image file.");
      setFilePreview(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, GIF allowed.");
      setFilePreview(null);
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      // 1MB
      toast.error("File too large. Max size is 1MB.");
      setFilePreview(null);
      return;
    }

    // Create a local URL for the file preview
    setFilePreview(URL.createObjectURL(file));

    setUploading(true);
    const formDataPayload = new FormData();
    formDataPayload.append("file", file);
    formDataPayload.append("uploadtype", uploadType);

    try {
      const res = await axios.post(UPLOAD_URL, formDataPayload);
      if (res.data?.success && res.data?.fileName) {
        setFileName(res.data.fileName);
        toast.success(`${uploadType} image uploaded successfully!`);
      } else {
        toast.error(res.data?.error || "Upload failed.");
        setFilePreview(null);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err.message || "Upload failed."
      );
      setFilePreview(null);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // Only fetch services if storeId is present in the URL
    if (storeId) {
      const fetchProductServices = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_BASE_URL}/GetProductService`
          );
          setProduct(response.data || []);
        } catch (error) {
          console.error("Error fetching services:", error);
          toast.error("Failed to load services.");
        }
      };
      fetchProductServices();
    }
  }, [storeId]); // Depend on storeId

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    Productservices_Id: Yup.string().required("Service is required"),
    customer_name: Yup.string().required("Name is required"),
    customer_email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    customer_phone: Yup.string().required("Phone is required"),
    Customer_AadharNumber: Yup.string().required("Aadhar number is required"),
    Customer_PanNumber: Yup.string().required("PAN number is required"),
    Customer_ProductAmount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required"),
  });

  // Formik initial values
  const initialValues = {
    Productservices_Id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    Customer_AadharNumber: "",
    Customer_PanNumber: "",
    Customer_ProductAmount: "",
  };

  // Formik submit handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!aadharFileName || !panFileName) {
      toast.error("Please upload both Aadhar and PAN images.");
      setSubmitting(false);
      return;
    }

    // Now getting storeId from the URL params, not localStorage
    const payload = {
      ...values,
      customer_aadhar: aadharFileName,
      customer_pancard: panFileName,
      storeId: storeId, // Use the storeId from the URL
    };

    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/CreateCustomer`,
        payload
      );
      if (response.data[0].status == "1") {
        toast.success(response.data[0].message);
        resetForm();
        setAadharFileName("");
        setPanFileName("");
        setAadharPreview(null);
        setPanPreview(null);
        router.back();
      } else {
        toast.error(response.data[0].message);
      }
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add Customer To Random Store
          </h1>
          <p className="text-gray-500 mt-1">
            Add New Customer with all required information
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
              <FaUser className="mr-3" />
              Customer Information
            </h2>
          </div>
          <div className="p-6 md:p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="space-y-6">
                  {/* Services Dropdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label
                        htmlFor="Productservices_Id"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaLaptop className="mr-2 text-indigo-500" />
                        Services *
                      </label>
                      <Field
                        as="select"
                        id="Productservices_Id"
                        name="Productservices_Id"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                          touched.Productservices_Id &&
                          errors.Productservices_Id
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">-- Select a Service --</option>
                        {product.map((service) => (
                          <option
                            key={service.Productservices_Id}
                            value={service.Productservices_Id}
                          >
                            {service.service_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="Productservices_Id"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center"
                      />
                    </div>
                  </div>

                  {/* Customer Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Name */}
                    <div>
                      <label
                        htmlFor="customer_name"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaUser className="mr-2 text-indigo-500" />
                        Customer Name *
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="customer_name"
                          placeholder="Enter Customer Name"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            touched.customer_name && errors.customer_name
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaUser />
                        </span>
                      </div>
                      <ErrorMessage
                        name="customer_name"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center"
                      />
                    </div>

                    {/* Customer Email */}
                    <div>
                      <label
                        htmlFor="customer_email"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaEnvelope className="mr-2 text-indigo-500" />
                        Customer Email *
                      </label>
                      <div className="relative">
                        <Field
                          type="email"
                          name="customer_email"
                          placeholder="Enter Customer Email"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            touched.customer_email && errors.customer_email
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaEnvelope />
                        </span>
                      </div>
                      <ErrorMessage
                        name="customer_email"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center"
                      />
                    </div>

                    {/* Customer Phone */}
                    <div>
                      <label
                        htmlFor="customer_phone"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaPhone className="mr-2 text-indigo-500" />
                        Customer Phone *
                      </label>
                      <div className="relative">
                        <Field
                          type="tel"
                          name="customer_phone"
                          placeholder="Enter Customer Phone"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            touched.customer_phone && errors.customer_phone
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaPhone />
                        </span>
                      </div>
                      <ErrorMessage
                        name="customer_phone"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center"
                      />
                    </div>

                    {/* Customer Aadhar Number */}
                    <div>
                      <label
                        htmlFor="Customer_AadharNumber"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaIdCard className="mr-2 text-indigo-500" />
                        Aadhar Number *
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="Customer_AadharNumber"
                          placeholder="Enter Aadhar Number"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            touched.Customer_AadharNumber &&
                            errors.Customer_AadharNumber
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaIdCard />
                        </span>
                      </div>
                      <ErrorMessage
                        name="Customer_AadharNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center"
                      />
                    </div>

                    {/* Customer PAN Number */}
                    <div>
                      <label
                        htmlFor="Customer_PanNumber"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaIdCard className="mr-2 text-indigo-500" />
                        PAN Number *
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="Customer_PanNumber"
                          placeholder="Enter PAN Number"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            touched.Customer_PanNumber &&
                            errors.Customer_PanNumber
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaIdCard />
                        </span>
                      </div>
                      <ErrorMessage
                        name="Customer_PanNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center"
                      />
                    </div>

                    {/* Customer Product Amount */}
                    <div>
                      <label
                        htmlFor="Customer_ProductAmount"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaMoneyBill className="mr-2 text-indigo-500" />
                        Product Amount *
                      </label>
                      <div className="relative">
                        <Field
                          type="number"
                          name="Customer_ProductAmount"
                          placeholder="Enter Amount"
                          min={0}
                          step="any"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            touched.Customer_ProductAmount &&
                            errors.Customer_ProductAmount
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaMoneyBill />
                        </span>
                      </div>
                      <ErrorMessage
                        name="Customer_ProductAmount"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center"
                      />
                    </div>

                    {/* Aadhar Upload */}
                    <div>
                      <label
                        htmlFor="aadharUpload"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaFileAlt className="mr-2 text-indigo-500" />
                        Aadhar Card Image *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="aadharUpload"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "Aadhar",
                              setUploadingAadhar,
                              setAadharFileName,
                              setAadharPreview
                            )
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="aadharUpload"
                          className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                            aadharFileName && aadharFileName !== ""
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                          }`}
                        >
                          {uploadingAadhar ? (
                            <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                          ) : (
                            <FaUpload className="mr-2 text-indigo-500" />
                          )}
                          {aadharFileName
                            ? "Aadhar Card Uploaded ✓"
                            : "Upload Aadhar Card"}
                        </label>
                      </div>
                      {/* Aadhar Preview */}
                      {aadharPreview && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-600 mb-2">Aadhar Preview:</h3>
                          <img
                            src={aadharPreview}
                            alt="Aadhar Card Preview"
                            className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                            style={{ maxWidth: '300px' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* PAN Upload */}
                    <div>
                      <label
                        htmlFor="panUpload"
                        className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                      >
                        <FaFileAlt className="mr-2 text-indigo-500" />
                        PAN Card Image *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="panUpload"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              "Pan",
                              setUploadingPan,
                              setPanFileName,
                              setPanPreview
                            )
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="panUpload"
                          className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                            panFileName && panFileName !== ""
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                          }`}
                        >
                          {uploadingPan ? (
                            <FaSpinner className="animate-spin mr-2 text-indigo-500" />
                          ) : (
                            <FaUpload className="mr-2 text-indigo-500" />
                          )}
                          {panFileName
                            ? "PAN Card Uploaded ✓"
                            : "Upload PAN Card"}
                        </label>
                      </div>
                      {/* PAN Preview */}
                      {panPreview && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-600 mb-2">PAN Preview:</h3>
                          <img
                            src={panPreview}
                            alt="PAN Card Preview"
                            className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                            style={{ maxWidth: '300px' }}
                          />
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaUser className="mr-3" />
                          Submit Customer
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
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
}