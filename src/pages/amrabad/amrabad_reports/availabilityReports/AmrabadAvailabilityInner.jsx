import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import { ToastContainer } from "react-toastify";
import AmarabdAvailabilityInnerList from "./AmarabdAvailabilityInnerList";
import AmarabadAvailabilityInnerForm from "./AmarabadAvailabilityInnerForm";
import BackButton from "../../../../components/BackButton";

const AmrabadAvailabilityInner = ({ fromDate, toDate, packageId, roomId, bookingDate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    // Get the current filter state from the inner form
    const currentInnerFilters = JSON.parse(
      localStorage.getItem("amrabad-availability-inner-report-filters") || "{}"
    );
    
    // Get the original outer filters that were passed when navigating to inner page
    const originalOuterFilters = location.state?.outerFilters || {};
    
    // Send back only the specific filters: fromDate, toDate, month, year
    const filtersToSend = {
      fromDate: originalOuterFilters.fromDate || currentInnerFilters.fromDate || fromDate,
      toDate: originalOuterFilters.toDate || currentInnerFilters.toDate || toDate,
      month: originalOuterFilters.month || currentInnerFilters.month,
      year: originalOuterFilters.year || currentInnerFilters.year,
    };
    
    // Navigate back with only the specific filter values
    navigate("/amrabad-availability-report", {
      state: { 
        filters: filtersToSend,
        shouldRefresh: true 
      }
    });
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Availability Inner Report
            </h1>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <BackButton
              label="Back"
              onClick={handleBackClick}
              className="bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </div>
        <AmarabdAvailabilityInnerList />
      </div>
    </AdminLayout>
  );
};

export default AmrabadAvailabilityInner;
