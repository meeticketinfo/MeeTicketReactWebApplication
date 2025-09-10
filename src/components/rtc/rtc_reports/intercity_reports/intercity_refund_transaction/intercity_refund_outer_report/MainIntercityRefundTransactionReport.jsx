import React from "react";
import AdminLayout from "../../../../../../layouts/AdminLayout";
import { ToastContainer } from "react-toastify";
import IntercityRefundOuterReportForm from "./IntercityRefundOuterReportForm";
import IntercityRefundTransactions from "./IntercityRefundTransactions";

const MainIntercityRefundTransactionReport = () => {
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Refund Transactions Dashboard
            </h1>
          </div>
        </div>
        <IntercityRefundTransactions/>
      </div>
    </AdminLayout>
  );
};

export default MainIntercityRefundTransactionReport;
