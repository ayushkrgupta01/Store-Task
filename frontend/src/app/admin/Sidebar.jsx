'use client';
import Link from "next/link";
import React, { useState } from "react";
import { FaTachometerAlt, FaStore, FaUsers, FaBox, FaSignInAlt, FaUserPlus, FaBars, FaShoppingCart, FaCog, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { IoIosArrowDown, IoMdAddCircle, IoMdPeople, IoMdCart } from 'react-icons/io';

const Sidebar = () => {
  const [openStores, setOpenStores] = useState(false);
  const [openCustomers, setOpenCustomers] = useState(false);

  const toggleStores = () => {
    setOpenStores(!openStores);
  };

  const toggleCustomers = () => {
    setOpenCustomers(!openCustomers);
  };

  return (
    <div>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <FaBars className="w-6 h-6" />
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {/* Title at the top of the sidebar */}
          <div className="text-center py-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Title</h2>
          </div>

          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/admin"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/storeForm"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <IoMdAddCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Add Store</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={toggleStores}
              >
                <FaStore className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 text-left whitespace-nowrap">Stores Options</span>
                <IoIosArrowDown className="w-3 h-3" />
              </button>
              {openStores && (
                <ul className="py-2 space-y-2">
                  <li>
                    <Link
                      href="/admin/stores/option1"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      Option 1
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/stores/option2"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      Option 2
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/stores/option3"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      Option 3
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={toggleCustomers}
              >
                <IoMdPeople className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 text-left whitespace-nowrap">Customer Options</span>
                <IoIosArrowDown className="w-3 h-3" />
              </button>
              {openCustomers && (
                <ul className="py-2 space-y-2">
                  <li>
                    <Link
                      href="/admin/customers/option1"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      Option 1
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/customers/option2"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      Option 2
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/customers/option3"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      Option 3
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/admin/stores"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaShoppingCart className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Stores</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/customers"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaUserCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/services"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaCog className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Services</span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaSignOutAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
