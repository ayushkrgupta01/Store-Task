"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaStore,
  FaUsers,
  FaBox,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaShoppingCart,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  IoIosArrowDown,
  IoMdAddCircle,
  IoMdPeople,
  IoMdCart,
} from "react-icons/io";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Sidebar = ({ onNavigate = () => {} }) => {
  const [openStores, setOpenStores] = useState(false);
  const [openCustomers, setOpenCustomers] = useState(false);
  const { logout, adminData } = useAdminAuth();
  const router = useRouter();

  const toggleStores = () => {
    setOpenStores(!openStores);
  };

  const toggleCustomers = () => {
    setOpenCustomers(!openCustomers);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    router.push("/");
  };

  return (
    <div className="h-full w-64 bg-gray-50 dark:bg-gray-800">
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Title at the top of the sidebar */}
        <div className="text-center py-4">
          <img
            src="/SidebarLightLogo.png"
            alt="Logo"
            className="rounded-full h-10 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Admin Panel
          </h2>
          {adminData && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Welcome, {adminData.username}
            </p>
          )}
        </div>

        <ul className="space-y-2 font-medium">
          <li>
            <Link
              href="/admin"
              onClick={onNavigate}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/allStores"
              onClick={onNavigate}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaShoppingCart className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">Stores</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/allCustomers"
              onClick={onNavigate}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaUserCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/allServices"
              onClick={onNavigate}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaCog className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">Services</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={toggleStores}
            >
              <FaStore className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 text-left whitespace-nowrap">
                Stores Options
              </span>
              <IoIosArrowDown className="w-3 h-3" />
            </button>
            {openStores && (
              <ul className="py-2 space-y-2">
                <li>
                  <Link
                    href="/admin/storeForm"
                    onClick={onNavigate}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    Add Store
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/manageStore"
                    onClick={onNavigate}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    Manage Store
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/storeDetails"
                    onClick={onNavigate}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    Store Details
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
              <span className="flex-1 ms-3 text-left whitespace-nowrap">
                Customer Options
              </span>
              <IoIosArrowDown className="w-3 h-3" />
            </button>
            {openCustomers && (
              <ul className="py-2 space-y-2">
                {/* <li>
                  <Link
                    href="/admin/customers/customerDashboard"
                    onClick={onNavigate}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    Customer Dashboard
                  </Link>
                </li> */}
                {/* <li>
                    <Link
                      href="/admin/customers/allCustomers"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      All Customers
                    </Link>
                  </li> */}
                <li>
                  <Link
                    href="/admin/customers/customerForm"
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    Add Customer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/customers/manageCustomers"
                    onClick={onNavigate}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    Manage Customers
                  </Link>
                </li>
                {/* <li>
                    <Link
                      href="/admin/customers/customerList"
                      className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      Customer List
                    </Link>
                  </li> */}
              </ul>
            )}
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaSignOutAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 text-left whitespace-nowrap">
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
