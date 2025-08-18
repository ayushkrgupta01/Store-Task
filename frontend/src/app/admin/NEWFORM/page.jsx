'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Make sure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';

// Ensure this is your actual API endpoint for posting images
const UPLOAD_URL ='http://122.160.25.202/micron/app/api/api/store/PostUserImage';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://122.160.25.202/micron/app/api/api/CustomerDetails';

export default function CustomerForm() {
  // All state declarations must be inside the component function
  const [product, setProduct] = useState([]);
  const [panFile, setPanFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [panError, setPanError] = useState('');
  const [aadharError, setAadharError] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_aadhar_number: '',
    customer_pan_number: '',
    customer_product_amount: '',
    customer_aadhar: null, // This will store the uploaded Aadhar filename from the server
    customer_pancard: null, // This will store the uploaded PAN filename from the server
    Productservices_Id: '',
  });

  const [previews, setPreviews] = useState({
    customer_aadhar: null,
    customer_pancard: null,
  });

  // --- Input Change Handler ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- File Upload Handler ---
  const handleFileUploadChange = async (e, uploadtype) => {
    const file = e.target.files[0] || null;

    // Use a single state object to manage file uploads for better organization
    const setFile = uploadtype === "Pan" ? setPanFile : setAadharFile;
    const setError = uploadtype === "Pan" ? setPanError : setAadharError;
    const setUploading = uploadtype === "Pan" ? setUploadingPan : setUploadingAadhar;
    const setPreview = (url) => setPreviews(prev => ({ ...prev, [uploadtype === "Pan" ? "customer_pancard" : "customer_aadhar"]: url }));
    const formKey = uploadtype === "Pan" ? "customer_pancard" : "customer_aadhar";

    setError(''); // Clear any previous error
    setPreview(null); // Clear previous preview

    if (!file) {
      setError("Please select a file.");
      return;
    }

    // Frontend validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, GIF allowed.");
      e.target.value = ""; // Reset the file input
      return;
    }

    if (file.size > 1 * 1024 * 1024) { // 1MB
      setError("File too large. Max size is 1MB.");
      e.target.value = ""; // Reset the file input
      return;
    }

    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setUploading(true);
    const formDataPayload = new FormData();
    formDataPayload.append("file", file);
    formDataPayload.append("uploadtype", uploadtype); // Assuming the backend uses this

    try {
      const res = await axios.post(UPLOAD_URL, formDataPayload);

      if (res.data?.success && res.data?.fileName) {
        // Update the main form data state with the uploaded file name
        setFormData(prev => ({ ...prev, [formKey]: res.data.fileName }));
        setFile(res.data.fileName);
        toast.success(`${uploadtype} image uploaded successfully!`);
      } else {
        setError(res.data?.error || "Upload failed.");
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProductServices = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/GetProductService`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchProductServices();
  }, []);

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    if (!panFile || !aadharFile) {
        toast.error("Please upload both Aadhar and PAN images.");
        setPanError(panFile ? '' : "PAN image is required.");
        setAadharError(aadharFile ? '' : "Aadhar image is required.");
        return;
    }

    // Now, the payload uses the filenames from the state
    const payload = {
        ...formData,
        customer_aadhar: aadharFile,
        customer_pancard: panFile,
    };

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/CreateCustomer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      const data = await response.json();
      console.log('Form submitted successfully:', data);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form. Please try again.');
    }
  };

  return (
    <>
      <h1 className="max-w-5xl mx-auto w-full h-24 bg-blue-600 text-white font-extrabold text-4xl flex items-center justify-center rounded-xl mt-12 mb-6">
        Fill All Details
      </h1>

      <form
        className="max-w-5xl mx-auto p-10 bg-white rounded-xl shadow-xl border border-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col mb-6">
          <label htmlFor="services" className="text-sm font-medium text-gray-700 mb-2">
            Services
          </label>
          <select
            id="services"
            name="Productservices_Id"
            value={formData.Productservices_Id}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select a Service --</option>
            {product.map((service) => (
              <option key={service.Productservices_Id} value={service.Productservices_Id}>
                {service.service_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          {/* Customer Info Inputs */}
          {[
            { label: 'Customer Name', name: 'customer_name', type: 'text', placeholder: 'Enter Customer Name' },
            { label: 'Customer Email', name: 'customer_email', type: 'email', placeholder: 'Enter Customer Email' },
            { label: 'Customer Phone', name: 'customer_phone', type: 'tel', placeholder: 'Enter Customer Phone' },
            { label: 'Customer Aadhar Number', name: 'customer_aadhar_number', type: 'text', placeholder: 'Enter Aadhar Number' },
            { label: 'Customer PAN Number', name: 'customer_pan_number', type: 'text', placeholder: 'Enter PAN Number' },
            { label: 'Customer Product Amount', name: 'customer_product_amount', type: 'number', placeholder: 'Enter Amount', min: 0, step: 'any' },
          ].map(({ label, name, type, placeholder, min, step }) => (
            <div key={name}>
              <label className="mb-3 text-base font-semibold text-slate-900 block">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-5 py-4 bg-[#f0f1f2] focus:bg-white text-black text-base border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={min}
                step={step}
              />
            </div>
          ))}

          {/* File Uploads */}
          {[
            { label: 'Upload Aadhar', uploadtype: 'Aadhar', name: 'customer_aadhar', preview: previews.customer_aadhar, error: aadharError, isUploading: uploadingAadhar },
            { label: 'Upload PAN Card', uploadtype: 'Pan', name: 'customer_pancard', preview: previews.customer_pancard, error: panError, isUploading: uploadingPan },
          ].map(({ label, uploadtype, name, preview, error, isUploading }) => (
            <div key={name} className="flex flex-col items-start">
              <label className="mb-2 text-base font-semibold text-slate-900">{label}</label>
              <input
                type="file"
                name={name}
                accept="image/*"
                onChange={(e) => handleFileUploadChange(e, uploadtype)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:border-blue-500 transition"
                required
              />
              {isUploading && <p className="text-blue-500 mt-1">Uploading...</p>}
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              {preview && (
                <img
                  src={preview}
                  alt={`${name} preview`}
                  className="mt-2 w-48 h-32 object-contain border rounded-md shadow-sm"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-12 px-8 py-3 text-lg font-semibold w-full max-w-[160px] mx-auto block bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
        >
          Submit
        </button>
      </form>
    </>
  );
}