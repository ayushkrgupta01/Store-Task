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
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStore = () => {
  const { id } = useParams(); // /edit-store/[id]
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [aadharCard, setaadharCard] = useState("");
  const [panCard, setpanCard] = useState("");

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
      aadharNumber: Yup.string().required("Aadhar number is required"),
    }),
    onSubmit: async (values) => {
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
          PanNumberAttachment: panCard, // keep old if not updated
          AadharNumber: values.aadharNumber,
          AadharNumberAttachment: aadharCard, // keep old if not updated
          ActionMode: "Update",
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_STORE_URL}/ManageStore`,
          storeObject
        );

        if (response.data[0].status == "1") {
          toast.success(response.data[0].message);
          setTimeout(() => router.push("/stores"), 1500);
        } else {
          toast.error(response.data[0].message);
        }
      } catch (err) {
        toast.error(err.message || "Update failed");
      }
    },
  });

  // Load countries
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_COUNTRIES_URL)
      .then((res) => setCountries(res.data))
      .catch(() => toast.error("Failed to load countries."));
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formik.values.country) {
      axios
        .get(`${process.env.NEXT_PUBLIC_STATES_URL}?CountryId=${formik.values.country}`)
        .then((res) => setStates(res.data))
        .catch(() => toast.error("Failed to load states."));
    }
  }, [formik.values.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formik.values.state) {
      axios
        .get(`${process.env.NEXT_PUBLIC_CITIES_URL}?StateId=${formik.values.state}`)
        .then((res) => setCities(res.data))
        .catch(() => toast.error("Failed to load cities."));
    }
  }, [formik.values.state]);

  // Load existing store data
  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_STORE_URL}/GetStoreById?StoreId=${id}`)
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
              panNumber: s.PanNumber || "",
              panNumberAttachment: s.PanNumberAttachment || "",
              aadharNumber: s.AadharNumber || "",
              aadharNumberAttachment: s.AadharNumberAttachment || "",
            });
            setpanCard(s.PanNumberAttachment || "");
            setaadharCard(s.AadharNumberAttachment || "");
          }
        })
        .catch(() => toast.error("Failed to load store data."));
    }
  }, [id]);

  const handleFileUploadChange = async (e, uploadtype) => {
    const file = e.target.files[0] || null;
    const field =
      uploadtype === "Pan" ? "panNumberAttachment" : "aadharNumberAttachment";
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type.");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File too large (max 1MB).");
      return;
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
          setpanCard(res.data.fileName);
        } else {
          setaadharCard(res.data.fileName);
        }
        formik.setFieldValue(field, res.data.fileName);
        toast.success(`${uploadtype} uploaded`);
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Store</h1>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Store Name */}
          <div>
            <label className="flex items-center">
              <FaStore className="mr-2" /> Store Name
            </label>
            <input
              type="text"
              name="storeName"
              value={formik.values.storeName}
              onChange={formik.handleChange}
              className="border w-full rounded px-3 py-2"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label><FaEnvelope className="mr-2 inline" /> Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="border w-full rounded px-3 py-2"
              />
            </div>
            <div>
              <label><FaPhone className="mr-2 inline" /> Phone</label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                className="border w-full rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label><FaMapMarkerAlt className="mr-2 inline" /> Address</label>
            <input
              type="text"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              className="border w-full rounded px-3 py-2"
            />
          </div>

          {/* Country, State, City */}
          <div className="grid grid-cols-3 gap-4">
            <select name="country" value={formik.values.country} onChange={formik.handleChange}>
              <option value="">Select Country</option>
              {countries.map(c => (
                <option key={c.CountryId} value={c.CountryId}>{c.CountryName}</option>
              ))}
            </select>
            <select name="state" value={formik.values.state} onChange={formik.handleChange}>
              <option value="">Select State</option>
              {states.map(s => (
                <option key={s.StateId} value={s.StateId}>{s.StateName}</option>
              ))}
            </select>
            <select name="city" value={formik.values.city} onChange={formik.handleChange}>
              <option value="">Select City</option>
              {cities.map(c => (
                <option key={c.CityId} value={c.CityId}>{c.CityName}</option>
              ))}
            </select>
          </div>

          {/* PAN & Aadhar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formik.values.panNumber}
                onChange={formik.handleChange}
                className="border w-full rounded px-3 py-2"
              />
              {panCard && <p className="text-sm text-gray-500">Current: {panCard}</p>}
              <input type="file" onChange={(e) => handleFileUploadChange(e, "Pan")} />
            </div>
            <div>
              <label>Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formik.values.aadharNumber}
                onChange={formik.handleChange}
                className="border w-full rounded px-3 py-2"
              />
              {aadharCard && <p className="text-sm text-gray-500">Current: {aadharCard}</p>}
              <input type="file" onChange={(e) => handleFileUploadChange(e, "Aadhar")} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Store
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditStore;
