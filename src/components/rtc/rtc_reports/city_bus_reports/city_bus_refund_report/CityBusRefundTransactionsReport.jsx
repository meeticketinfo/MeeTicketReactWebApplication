import React from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../../../../layouts/AdminLayout";
import Breadcrumb from "../../../../Breadcrumb";
import CityBusRefundTransactionsList from "./CityBusRefundTransactionsList";
import { ToastContainer } from "react-toastify";

const getRefundStatusLabel = (status) => {
  const labels = {
    "-1": "ALL",
    0: "Not Initiated",
    1: "Initiated",
    2: "Refunded",
    3: "Failed",
  };
  return labels[status] ?? status;
};

const CityBusRefundTransactionsReport = () => {
  const [searchParams] = useSearchParams();
  const refundStatus = searchParams.get("refundStatus");
  const statusLabel =
    refundStatus && refundStatus !== "-1"
      ? `(${getRefundStatusLabel(refundStatus)})`
      : "";

  const breadcrumbItems = [
    {
      label: `City Bus Refund Transactions Report ${statusLabel}`,
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4 uppercase" />
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold uppercase">
              City Bus Refund Transactions Report {statusLabel}
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        <CityBusRefundTransactionsList />
      </div>
    </AdminLayout>
  );
};

export default CityBusRefundTransactionsReport;
