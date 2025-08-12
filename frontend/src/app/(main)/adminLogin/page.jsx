"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaUserShield, FaLock } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";

const AdminLoginForm = () => {
  const initialValues = {
    adminId: "",
    password: "",
  };

  const validationSchema = Yup.object({
    adminId: Yup.string().required("Admin ID is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await axios.post("/api/admin/login", values);
      alert("Admin login successful!");
      resetForm();
    } catch (error) {
      alert("Admin login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center shadow-2xl min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <FaUserShield className="text-indigo-600" />
          Admin Login
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-5">
            {/* Admin ID */}
            <div className="relative">
              <FaUserShield className="absolute left-3 top-3 text-gray-400" />
              <Field
                name="adminId"
                type="text"
                placeholder="Admin ID"
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="adminId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-lg hover:scale-105 transition"
            >
              Login as Admin
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AdminLoginForm;
