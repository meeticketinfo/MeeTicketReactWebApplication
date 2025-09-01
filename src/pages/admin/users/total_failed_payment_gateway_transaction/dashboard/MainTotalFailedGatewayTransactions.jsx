import React, { useState } from "react";
// import AdminLayout from "../../../layouts/AdminLayout";
import AdminLayout from "../../../../../layouts/AdminLayout";
import TotalFailedGatewayTransactions from "./TotalFailedGatewayTransactions";
import { Link } from "react-router-dom";
import Breadcrumb from "../../../../../components/Breadcrumb";
import { IoHomeOutline } from "react-icons/io5";

const MainTotalFailedGatewayTransactions = () => {
  const totalTransactionSearchParams = localStorage.getItem("totalTransactionSearchParams");
  
  // Custom breadcrumb items for this specific page
  const breadcrumbItems = [
    {
      label: 'Total Transactions Report',
      path: `/total-transactions-dashboard?${totalTransactionSearchParams}`
    },
    {
      label: 'Failed (Payment Gateway)',  
      isLast: true
    }
  ];

  return (
    <AdminLayout>
      <div className="px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 w-full max-w-9xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb 
            customItems={breadcrumbItems}
            className="mb-2 sm:mb-4"
          />
        </div>
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-100 font-bold leading-tight">
              Failed (Payment Gateway)
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              View and analyze failed payment gateway transactions
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to={`/total-transactions-dashboard?${totalTransactionSearchParams}`}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-lg transition-colors duration-200 font-medium"
            >
              {/* <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg> */}
              Back
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 sm:space-y-6">
          <TotalFailedGatewayTransactions />
        </div>
      </div>
    </AdminLayout>
  );
};

export default MainTotalFailedGatewayTransactions;
