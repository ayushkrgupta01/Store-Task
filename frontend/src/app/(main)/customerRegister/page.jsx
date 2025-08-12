"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";

const RegisterForm = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await axios.post("/api/register", values);
      alert("Registration successful!");
      resetForm();
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex items-center justify-center shadow-2xl min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📝 Register
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-5">
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <Field
                name="username"
                type="text"
                placeholder="Username"
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="email"
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
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;
