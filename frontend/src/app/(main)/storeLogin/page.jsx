"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEnvelope, FaLock } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";
import Link from "next/link";

const LoginForm = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await axios.post("/api/login", values);
      alert("Login successful!");
      resetForm();
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center shadow-2xl min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🔐 Login
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:scale-105 transition"
            >
              Login
            </button>
          </Form>
        </Formik>
      </div>

      {/* Registration Link */}
      <p className="mt-4 text-sm text-gray-600">
        Customer register{" "}
        <Link href="/customerRegister" className="text-green-600 underline">
          here
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
