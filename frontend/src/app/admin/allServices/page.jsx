"use client";
import React, { useState, useEffect } from "react";
import {
  FaStore,
  FaSearch,
  FaSyncAlt,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaProjectDiagram,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllServices = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const router = useRouter();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceNameInput, setServiceNameInput] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

const fetchStores = async () => {
    setLoading(true);
    // Show a loading toast and get its ID
    const loadingToastId = toast.loading("Loading services...", {
      toastId: "loading-services",
    });

    try {
      const requestBody = {
        ActionMode: "READ",
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICES_URL}/GetAllServices`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        if (data.StatusCode === "1" && data.ServiceDetails) {
          const parsedServices = JSON.parse(data.ServiceDetails);
          const services = parsedServices.map((s) => ({
            service_id: s.Productservices_Id,
            service_name: s.service_name,
            employee_id: s.EmployeeID,
            store_id: s.StoreID,
          }));

          setStores(services);
          // Update the existing loading toast to a success toast
          toast.update(loadingToastId, {
            render: data.msg || "Services loaded successfully.",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          setStores([]);
          // Update to an error toast
          toast.update(loadingToastId, {
            render: data.msg || "No services found.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } else {
        setStores([]);
        toast.update(loadingToastId, {
          render: "No service data found.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Failed to load services:", error);
      setStores([]);
      toast.update(loadingToastId, {
        render: "Failed to load service data.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      handleCloseModal(); // This might not be needed here if the modal isn't open
    }
  };

  useEffect(() => {
    if (toastMessage) {
      if (toastMessage.type === "success") {
        toast.success(toastMessage.message);
      } else if (toastMessage.type === "error") {
        toast.error(toastMessage.message);
      }
      setToastMessage(null);
    }
  }, [toastMessage]);

  useEffect(() => {
    fetchStores();
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="ml-2 text-gray-400" />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp className="ml-2 text-indigo-600" />;
    }
    return <FaSortDown className="ml-2 text-indigo-600" />;
  };

  const handleOpenAddModal = () => {
    setCurrentService(null);
    setServiceNameInput("");
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setServiceNameInput(service.service_name);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setLoading(true);
    handleCloseDeleteModal();
    const loadingToastId = toast.loading("Deleting service...", {
      toastId: "deleting-service",
    });

    try {
      const requestBody = {
        ActionMode: "DELETE",
        Productservices_Id: serviceToDelete.service_id,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICES_URL}/DeleteServices`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        if (data.status === "1" || data.StatusCode === "1") {
          toast.update(loadingToastId, {
            render: data.msg || "Service deleted successfully.",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          fetchStores();
        } else {
          toast.update(loadingToastId, {
            render: data.msg || "Failed to delete service.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } else {
        toast.update(loadingToastId, {
          render: "Invalid response from server.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.update(loadingToastId, {
        render: "An error occurred while deleting the service.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
    setServiceNameInput("");
  };

const handleAddOrUpdateService = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isEditing = currentService !== null;
    const endpoint = isEditing ? "UpdateService" : "CreateService";
    const loadingMessage = isEditing ? "Updating service..." : "Adding service...";
    const loadingToastId = toast.loading(loadingMessage, {
      toastId: "add-update-service",
    });
    handleCloseModal(); // Close modal immediately

    const requestBody = {
      ActionMode: isEditing ? "UPDATE" : "CREATE",
      ServiceName: serviceNameInput,
    };

    if (isEditing) {
      requestBody.Productservices_Id = currentService.service_id;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICES_URL}/${endpoint}`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        if (data.StatusCode === "1") {
          toast.update(loadingToastId, {
            render: data.msg || `Service ${isEditing ? "updated" : "added"} successfully.`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          fetchStores();
        } else {
          toast.update(loadingToastId, {
            render: data.msg || `Failed to ${isEditing ? "update" : "add"} service.`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } else {
        toast.update(loadingToastId, {
          render: "Invalid response from server.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} service:`, error);
      toast.update(loadingToastId, {
        render: `An error occurred while ${isEditing ? "updating" : "adding"} the service.`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = stores.filter((store) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(store.service_name || "").toLowerCase().includes(q);
  });

  const sortedServices = React.useMemo(() => {
    let sortableItems = [...filtered];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'sno') {
          // Sorting by S.No. (index) requires a direct comparison
          const aIndex = filtered.indexOf(a);
          const bIndex = filtered.indexOf(b);
          if (sortConfig.direction === 'ascending') {
            return aIndex - bIndex;
          }
          return bIndex - aIndex;
        }

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue.toLowerCase() < bValue.toLowerCase()) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue.toLowerCase() > bValue.toLowerCase()) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }
    return sortableItems;
  }, [filtered, sortConfig]);

  const getValue = (obj, keys) => {
    for (const key of keys) {
      const value = obj && obj[key];
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return value;
      }
    }
    return "-";
  };

  const exportToExcel = () => {
    const dataToExport = sortedServices.map((store, index) => ({
      "S.No.": index + 1,
      "Service ID": store.service_id,
      "Service Name": store.service_name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Services");
    XLSX.writeFile(workbook, "all_services_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("All Services List", 14, 20);

    const tableColumn = ["S.No.", "Service ID", "Service Name"];
    const tableRows = sortedServices.map((store, index) => [
      index + 1,
      store.service_id,
      store.service_name,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle",
        halign: "left",
        textColor: [0, 0, 0],
        lineColor: [180, 180, 180],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 58, 64],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
      },
    });

    doc.save("all_services_data.pdf");
  };

  const totalPages = Math.ceil(sortedServices.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = sortedServices.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <FaArrowLeft />
        Back
      </button>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Services
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Clear and concise name of the service.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search services..."
                className="w-full rounded-full border border-gray-300 pl-12 pr-10 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchStores}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSyncAlt className={`${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaStore />
                Add Service
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 w-full lg:w-auto mt-4 lg:mt-0">
            <button
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Export to Excel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaStore className="mr-3" />
              Services List
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-indigo-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => requestSort("sno")}
                      >
                        <div className="flex items-center">
                          S.No.
                          {getSortIcon("sno")}
                        </div>
                      </th>
                      <th
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => requestSort("service_name")}
                      >
                        <div className="flex items-center">
                          Services Name
                          {getSortIcon("service_name")}
                        </div>
                      </th>
                      <th className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map((store, index) => (
                        <tr
                          key={store.service_id || index}
                          className="hover:bg-gray-50 text-sm sm:text-[15px]"
                        >
                          <td className="p-3 text-sm border-t">
                            {indexOfFirst + index + 1}
                          </td>
                          <td className="p-3 text-sm border-t truncate">
                            {getValue(store, ["service_name"])}
                          </td>
                          <td className="p-3 text-sm border-t text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEdit(store)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                aria-label={`Edit service ${store.service_name}`}
                              >
                                <FaEdit className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleOpenDeleteModal(store)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                aria-label={`Delete service ${store.service_name}`}
                              >
                                <FaTrash className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-gray-500 border-t"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <FaStore className="text-4xl text-gray-300" />
                            <p>No services found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 border rounded-lg ${
                          currentPage === index + 1
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-sm shadow-green-700 p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {currentService ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddOrUpdateService} className="space-y-4">
              <div>
                <label
                  htmlFor="service_name"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <FaProjectDiagram /> <span className="ml-2">Service Name</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  id="service_name"
                  value={serviceNameInput}
                  onChange={(e) => setServiceNameInput(e.target.value)}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Add service name"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || serviceNameInput.trim() === ""}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : currentService ? (
                    "Update Service"
                  ) : (
                    "Add Service"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && serviceToDelete && (
        <div className="fixed inset-0 bg-transparentbg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg  shadow-sm shadow-red-600  p-8 max-w-sm w-full">
            <div className="flex flex-col items-center text-center">
              <FaTrash className="text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the service: <br />
                <span className="font-semibold">
                  {serviceToDelete.service_name}
                </span>
                ?
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AllServices;