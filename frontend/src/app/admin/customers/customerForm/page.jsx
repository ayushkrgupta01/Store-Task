'use client';


import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaMoneyBill, FaUpload } from 'react-icons/fa';


const UPLOAD_URL = 'http://122.160.25.202/micron/app/api/api/store/PostUserImage';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_SERVICES_URL || 'http://122.160.25.202/micron/app/api/api/CustomerDetails';


export default function CustomerForm() {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [aadharFileName, setAadharFileName] = useState('');
  const [panFileName, setPanFileName] = useState('');


  // File upload handler
  const handleFileUpload = async (e, uploadtype, setPreview, setUploading, setFileName) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, GIF allowed.");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File too large. Max size is 1MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const formDataPayload = new FormData();
    formDataPayload.append("file", file);
    formDataPayload.append("uploadtype", uploadtype);
    try {
      const res = await axios.post(UPLOAD_URL, formDataPayload);
      if (res.data?.success && res.data?.fileName) {
        setFileName(res.data.fileName);
        toast.success(`${uploadtype} image uploaded successfully!`);
      } else {
        toast.error(res.data?.error || "Upload failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };


  useEffect(() => {
    const fetchProductServices = async () => {
      try {
        const response = await axios.get(`${BACKEND_BASE_URL}/GetProductService`);
        setProduct(response.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchProductServices();
  }, []);


  // Yup validation schema
  const validationSchema = Yup.object().shape({
    Productservices_Id: Yup.string().required('Service is required'),
    customer_name: Yup.string().required('Name is required'),
    customer_email: Yup.string().email('Invalid email').required('Email is required'),
    customer_phone: Yup.string().required('Phone is required'),
    customer_aadhar_number: Yup.string().required('Aadhar number is required'),
    customer_pan_number: Yup.string().required('PAN number is required'),
    customer_product_amount: Yup.number().typeError('Amount must be a number').required('Amount is required'),
  });

  // Formik initial values
  const initialValues = {
    Productservices_Id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_aadhar_number: '',
    customer_pan_number: '',
    customer_product_amount: '',
  };

  // Formik submit handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!aadharFileName || !panFileName) {
      toast.error('Please upload both Aadhar and PAN images.');
      setSubmitting(false);
      return;
    }
    const payload = {
      ...values,
      customer_aadhar: aadharFileName,
      customer_pancard: panFileName,
    };
    try {
      const response = await axios.post(`${BACKEND_BASE_URL}/CreateCustomer`, payload);
      toast.success('Form submitted successfully!');
      resetForm();
      setAadharPreview(null);
      setPanPreview(null);
      setAadharFileName('');
      setPanFileName('');
      router.push('/customers/manageCustomers');
    } catch (error) {
      toast.error('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-8">
      <h1 className="w-full h-20 bg-blue-600 text-white font-extrabold text-3xl flex items-center justify-center rounded-xl mb-8">
        Fill All Details
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
            <div className="flex flex-col mb-6">
              <label htmlFor="Productservices_Id" className="text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <Field
                as="select"
                id="Productservices_Id"
                name="Productservices_Id"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select a Service --</option>
                {product.map((service) => (
                  <option key={service.Productservices_Id} value={service.Productservices_Id}>
                    {service.service_name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="Productservices_Id" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <label className="mb-3 text-base font-semibold text-slate-900 block">Customer Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser /></span>
                  <Field
                    type="text"
                    name="customer_name"
                    placeholder="Enter Customer Name"
                    className="w-full pl-10 pr-5 py-4 bg-[#f0f1f2] focus:bg-white text-black text-base border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage name="customer_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="mb-3 text-base font-semibold text-slate-900 block">Customer Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope /></span>
                  <Field
                    type="email"
                    name="customer_email"
                    placeholder="Enter Customer Email"
                    className="w-full pl-10 pr-5 py-4 bg-[#f0f1f2] focus:bg-white text-black text-base border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage name="customer_email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="mb-3 text-base font-semibold text-slate-900 block">Customer Phone</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaPhone /></span>
                  <Field
                    type="tel"
                    name="customer_phone"
                    placeholder="Enter Customer Phone"
                    className="w-full pl-10 pr-5 py-4 bg-[#f0f1f2] focus:bg-white text-black text-base border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage name="customer_phone" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="mb-3 text-base font-semibold text-slate-900 block">Customer Aadhar Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaIdCard /></span>
                  <Field
                    type="text"
                    name="customer_aadhar_number"
                    placeholder="Enter Aadhar Number"
                    className="w-full pl-10 pr-5 py-4 bg-[#f0f1f2] focus:bg-white text-black text-base border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage name="customer_aadhar_number" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="mb-3 text-base font-semibold text-slate-900 block">Customer PAN Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaIdCard /></span>
                  <Field
                    type="text"
                    name="customer_pan_number"
                    placeholder="Enter PAN Number"
                    className="w-full pl-10 pr-5 py-4 bg-[#f0f1f2] focus:bg-white text-black text-base border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage name="customer_pan_number" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="mb-3 text-base font-semibold text-slate-900 block">Customer Product Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaMoneyBill /></span>
                  <Field
                    type="number"
                    name="customer_product_amount"
                    placeholder="Enter Amount"
                    min={0}
                    step="any"
                    className="w-full pl-10 pr-5 py-4 bg-[#f0f1f2] focus:bg-white text-black text-base border border-gray-300 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage name="customer_product_amount" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* File Uploads */}
              <div className="flex flex-col items-start">
                <label className="mb-2 text-base font-semibold text-slate-900">Upload Aadhar</label>
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'Aadhar', setAadharPreview, setUploadingAadhar, setAadharFileName)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:border-blue-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"><FaUpload /></span>
                </div>
                {uploadingAadhar && <p className="text-blue-500 mt-1">Uploading...</p>}
                {aadharPreview && (
                  <img
                    src={aadharPreview}
                    alt="Aadhar preview"
                    className="mt-2 w-48 h-32 object-contain border rounded-md shadow-sm"
                  />
                )}
              </div>
              <div className="flex flex-col items-start">
                <label className="mb-2 text-base font-semibold text-slate-900">Upload PAN Card</label>
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'Pan', setPanPreview, setUploadingPan, setPanFileName)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:border-blue-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"><FaUpload /></span>
                </div>
                {uploadingPan && <p className="text-blue-500 mt-1">Uploading...</p>}
                {panPreview && (
                  <img
                    src={panPreview}
                    alt="PAN preview"
                    className="mt-2 w-48 h-32 object-contain border rounded-md shadow-sm"
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-12 px-8 py-3 text-lg font-semibold w-full max-w-[160px] mx-auto block bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
