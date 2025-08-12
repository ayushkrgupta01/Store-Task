'use client';

import React from 'react';
import { FaCode, FaMobileAlt, FaCloud, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';

const services = [
  {
    title: 'Web Development',
    description: 'Custom websites and web apps built with modern technologies.',
    icon: <FaCode className="text-4xl text-indigo-600" />,
  },
  {
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications for iOS and Android.',
    icon: <FaMobileAlt className="text-4xl text-green-500" />,
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and DevOps services.',
    icon: <FaCloud className="text-4xl text-blue-500" />,
  },
  {
    title: 'Cybersecurity',
    description: 'Security audits, penetration testing, and data protection.',
    icon: <FaShieldAlt className="text-4xl text-red-500" />,
  },
];

const ServicesPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">🛠️ Our Services</h1>
        <p className="mt-2 text-gray-600">Explore what we offer to help your business grow.</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
        <p className="mb-4">Let’s build something amazing together.</p>
        <Link
          href="/contact"
          className="inline-block bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
