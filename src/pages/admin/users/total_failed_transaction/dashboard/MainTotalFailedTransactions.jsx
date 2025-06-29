import React, { useState } from "react";
// import AdminLayout from "../../../layouts/AdminLayout";
import AdminLayout from "../../../../../layouts/AdminLayout";
import TotalFailedTransactions from "./TotalFailedTransactions";
import { Link } from "react-router-dom";


const MainTotalFailedTransactions = () => {
  const totalTransactionSearchParams = localStorage.getItem("totalTransactionSearchParams");
  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Total Failed (Other Reasons) Report
            </h1>
          </div>
          <Link
            to={`/total-transactions-dashboard?${totalTransactionSearchParams}`}
            className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
          >
            Back
          </Link>
        </div>
        <TotalFailedTransactions />
      </div>
    </AdminLayout>
  );
};

export default MainTotalFailedTransactions;
