import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import AdminLayout from "../../../../../../layouts/AdminLayout";
import AgGridTable from "../../../../../tables/AgGridTable";
import Breadcrumb from "../../../../../Breadcrumb";
import { formatToCurrency } from "../../../../../../utils/TypographyHelper";
import { formatDateTime } from "../../../../../../utils/Helper";
import { useRtcRefundStore } from "../../../../../../store/rtc/RtcRefundTransactionStore";

const BusPassUserTransactionsRefundTracker = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const stateData = location.state || {};

  const orderId = searchParams.get("orderId") || stateData.orderId || "";
  const date = searchParams.get("date") || stateData.date || "";
  const mobileNo = searchParams.get("mobileNo") || stateData.mobileNo || "";
  const typeOfBusPass =
    searchParams.get("typeOfBusPass") || stateData.typeOfBusPass || "";
  const status = searchParams.get("status") || stateData.status || "";
  const amount = searchParams.get("amount") || stateData.amount || "";
  const bookingId = searchParams.get("bookingId") || stateData.bookingId || "";

  const refundSearchParams =
    localStorage.getItem("busPassRefundInnerTransactionSearchParams") || "";

  const {
    fetchBusPassRefundOrderId,
    refundBusPassRefundTrackingReport,
    isFetchBusPassRefundTrackingReport,
  } = useRtcRefundStore();

  const [columnDefs] = useState([
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "requestTimestamp",
      headerName: "Request Time Stamp",
      minWidth: 190,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value ? formatDateTime(params.value) : "N/A",
    },
    {
      field: "responseTimestamp",
      headerName: "Response Time Stamp",
      minWidth: 190,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value ? formatDateTime(params.value) : "N/A",
    },
    {
      field: "transactionStatus",
      headerName: "Refund Status",
       maxWidth: "180",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value ?? "N/A"}>{params.value ?? "N/A"}</span>
      ),
    },
    // {
    //   field: "refundStatus",
    //   headerName: "Refund Status",
    //   flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value ?? "N/A",
    //   cellRenderer: (params) => (
    //     <span title={params.value ?? "N/A"}>{params.value ?? "N/A"}</span>
    //   ),
    // },
    {
      field: "statusMessage",
      headerName: "Result Message",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value ?? "N/A"}>{params.value ?? "N/A"}</span>
      ),
    },
  ]);

  useEffect(() => {
    if (orderId) {
      fetchBusPassRefundOrderId(orderId);
    }
  }, [fetchBusPassRefundOrderId, orderId]);

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmedOrderId = orderId?.trim();
    if (!trimmedOrderId) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("orderId", trimmedOrderId);
    if (date) nextParams.set("date", date);
    if (mobileNo) nextParams.set("mobileNo", mobileNo);
    if (typeOfBusPass) nextParams.set("typeOfBusPass", typeOfBusPass);
    if (status) nextParams.set("status", status);
    if (amount) nextParams.set("amount", amount);
    if (bookingId) nextParams.set("bookingId", bookingId);
    setSearchParams(nextParams);

    await fetchBusPassRefundOrderId(trimmedOrderId);
  };

  const breadcrumbItems = [
    {
      label: "Refund Transactions Report",
      path: `/bus-pass-refund-report?${refundSearchParams}`,
    },
    {
      label: "Refund Transaction Tracking Report",
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4" />

        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Refund Transaction Tracking Report
            </h1>
          </div>
          <div>
            <Link
              to={`/bus-pass-refund-report?${refundSearchParams}`}
              className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Date</h3>
            <p className="text-sm font-semibold text-gray-900">
              {date ? formatDateTime(date) : "N/A"}
            </p>
          </div>
          <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Order ID</h3>
            <p className="text-sm font-semibold text-gray-900">
              {orderId || "N/A"}
            </p>
          </div>
          <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 mb-1">
              Booking ID
            </h3>
            <p className="text-sm font-semibold text-gray-900">
              {bookingId || "N/A"}
            </p>
          </div>
          <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 mb-1">
              Mobile Number
            </h3>
            <p className="text-sm font-semibold text-gray-900">
              {mobileNo || "N/A"}
            </p>
          </div>
          <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Amount</h3>
            <p className="text-sm font-semibold text-gray-900">
              {amount ? formatToCurrency(amount) : "N/A"}
            </p>
          </div>
          <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 mb-1">
              Type of Bus Pass
            </h3>
            <p className="text-sm font-semibold text-gray-900">
              {typeOfBusPass || "N/A"}
            </p>
          </div>
          <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Status</h3>
            <p className="text-sm font-semibold text-gray-900">
              {status || "N/A"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex justify-start mb-4">
          <button
            type="submit"
            className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
            disabled={isFetchBusPassRefundTrackingReport || !orderId}
          >
            {isFetchBusPassRefundTrackingReport ? "Searching..." : "Search"}
          </button>
        </form>

        <AgGridTable
          showSearch={false}
          ExportName="BusPassRefundTransactionTracker"
          rowData={
            Array.isArray(refundBusPassRefundTrackingReport)
              ? refundBusPassRefundTrackingReport
              : []
          }
          columnDefs={columnDefs}
          isFetchLoading={isFetchBusPassRefundTrackingReport}
        />
      </div>
    </AdminLayout>
  );
};

export default BusPassUserTransactionsRefundTracker;
