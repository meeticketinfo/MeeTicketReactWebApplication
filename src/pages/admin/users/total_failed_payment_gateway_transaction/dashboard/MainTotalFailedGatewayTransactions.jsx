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
      <div className="px-4 py-8 w-full max-w-9xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb 
            customItems={breadcrumbItems}
            className="mb-4"
          />
        </div>
        
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Failed (Payment Gateway)
            </h1>
          </div>
          <Link
            to={`/total-transactions-dashboard?${totalTransactionSearchParams}`}
            className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          >
            Back
          </Link>
        </div>
        <TotalFailedGatewayTransactions />
      </div>
    </AdminLayout>
  );
};

export default MainTotalFailedGatewayTransactions;
