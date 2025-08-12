"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
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
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoreForm = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

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

  useEffect(() => {
    const fetchStates = async () => {
      
      if (selectedCountry) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_STATES_URL}?CountryId=${selectedCountry}`
          );
          setStates(response.data);
        } catch (error) {
          console.error("Error fetching states:", error);
          toast.error("Failed to load states.");
        }
      }
    };
    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_CITIES_URL}?StateId=${selectedState}`
          );
          setCities(response.data);
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("Failed to load cities.");
        }
      }
    };
    fetchCities();
  }, [selectedState]);

  const formik = useFormik({
    initialValues: {
      storeName: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      panNumber: "",
      panNumberAttachment: null,
      aadharNumber: "",
      aadharNumberAttachment: null,
    },
    validationSchema: Yup.object({
      storeName: Yup.string().required("Store name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      address: Yup.string().required("Address is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      zipCode: Yup.string().required("Zip code is required"),
      panNumber: Yup.string().required("PAN number is required"),
      panNumberAttachment: Yup.mixed().required(
        "PAN number attachment is required"
      ),
      aadharNumber: Yup.string().required("Aadhar number is required"),
      aadharNumberAttachment: Yup.mixed().required(
        "Aadhar number attachment is required"
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        const response = await axios.post(
          process.env.NEXT_PUBLIC_STORE_URL,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Form submitted successfully!");
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit form. Please try again.");
      }
    },
  });

  const handleFileChange = (e, fieldName) => {
    formik.setFieldValue(fieldName, e.currentTarget.files[0]);
  };

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Open a New Store</h1>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="storeName"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaStore className="mr-2" /> Store Name
              </label>
              <input
                type="text"
                name="storeName"
                id="storeName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.storeName}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              {formik.touched.storeName && formik.errors.storeName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.storeName}
                </div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaEnvelope className="mr-2" /> Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaPhone className="mr-2" /> Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <FaMapMarkerAlt className="mr-2" /> Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="text-red-500 text-sm">
                {formik.errors.address}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="country"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <FaFlag className="mr-2" /> Country
            </label>
            <select
              name="country"
              id="country"
              onChange={(e) => {
                const country = e.target.value;
                setSelectedCountry(country);
                formik.setFieldValue("country", country);
                formik.setFieldValue("state", "");
                formik.setFieldValue("city", "");
                setSelectedState("");
              }}
              onBlur={formik.handleBlur}
              value={formik.values.country}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
            >
              <option value="" label="Select a country" />
              {countries.map((country) => (
                <option
                  key={country.CountryId}
                  value={country.CountryId}
                  label={country.CountryName}
                />
              ))}
            </select>
            {formik.touched.country && formik.errors.country ? (
              <div className="text-red-500 text-sm">
                {formik.errors.country}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="state"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <FaBuilding className="mr-2" /> State
            </label>
            <select
              name="state"
              id="state"
              onChange={(e) => {
                const state = e.target.value;
                setSelectedState(state);
                formik.setFieldValue("state", state);
                formik.setFieldValue("city", "");
              }}
              onBlur={formik.handleBlur}
              value={formik.values.state}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              disabled={!formik.values.country}
            >
              <option value="" label="Select a state" />
              {states.map((state) => (
                <option
                  key={state.StateId}
                  value={state.StateId}
                  label={state.StateName}
                />
              ))}
            </select>
            {formik.touched.state && formik.errors.state ? (
              <div className="text-red-500 text-sm">{formik.errors.state}</div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="city"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <FaCity className="mr-2" /> City
            </label>
            <select
              name="city"
              id="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              disabled={!formik.values.state}
            >
              <option value="" label="Select a city" />
              {cities.map((city) => (
                <option
                  key={city.CityId}
                  value={city.CityId}
                  label={city.CityName}
                />
              ))}
            </select>
            {formik.touched.city && formik.errors.city ? (
              <div className="text-red-500 text-sm">{formik.errors.city}</div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="panNumber"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaInfoCircle className="mr-2" /> PAN Number
              </label>
              <input
                type="text"
                name="panNumber"
                id="panNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.panNumber}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              {formik.touched.panNumber && formik.errors.panNumber ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.panNumber}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="panNumberAttachment"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaFileAlt className="mr-2" /> PAN Number Attachment
              </label>
              <input
                type="file"
                name="panNumberAttachment"
                id="panNumberAttachment"
                onChange={(e) => handleFileChange(e, "panNumberAttachment")}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              {formik.touched.panNumberAttachment &&
              formik.errors.panNumberAttachment ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.panNumberAttachment}
                </div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="aadharNumber"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaInfoCircle className="mr-2" /> Aadhar Number
              </label>
              <input
                type="text"
                name="aadharNumber"
                id="aadharNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.aadharNumber}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              {formik.touched.aadharNumber && formik.errors.aadharNumber ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.aadharNumber}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="aadharNumberAttachment"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaFileAlt className="mr-2" /> Aadhar Number Attachment
              </label>
              <input
                type="file"
                name="aadharNumberAttachment"
                id="aadharNumberAttachment"
                onChange={(e) => handleFileChange(e, "aadharNumberAttachment")}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              {formik.touched.aadharNumberAttachment &&
              formik.errors.aadharNumberAttachment ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.aadharNumberAttachment}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StoreForm;
