import React from "react";
import AdminLayout from "../../../../../layouts/AdminLayout";
import IntercityPaymentTransactionsList from "./IntercityPaymentTransactionsList";

const IntercityPaymentTransactionsReport = () => {
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Payment Transactions
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        <IntercityPaymentTransactionsList />
      </div>
    </AdminLayout>
  );
};

export default IntercityPaymentTransactionsReport;
