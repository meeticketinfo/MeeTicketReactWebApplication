import React, { useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import MetroRefundTransactions from "./MetroRefundTransactions";
import { ToastContainer } from "react-toastify";


const MainMetroRefundTransactions = () => {
  return (
    <AdminLayout>
      <ToastContainer/>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
             Refund Transactions Dashboard
            </h1>
          </div>
        </div>
        <MetroRefundTransactions />
      </div>
    </AdminLayout>
  );
};

export default MainMetroRefundTransactions;
