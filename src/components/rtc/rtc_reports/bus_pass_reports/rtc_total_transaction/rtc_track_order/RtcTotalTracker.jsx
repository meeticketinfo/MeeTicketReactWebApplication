import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import busPassTotalCommonStore from "../../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/busPassTotalCommonStore";
import { useBusPassTotalTransactionStore } from "../../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/BusPassTotalTransactionStore";
import AdminLayout from "../../../../../../layouts/AdminLayout";
import Breadcrumb from "../../../../../Breadcrumb";
import { formatToCurrency } from "../../../../../../utils/TypographyHelper";
import AgGridTable from "../../../../../tables/AgGridTable";
import { formatDateTime } from "../../../../../../utils/Helper";

const RtcTotalTracker = () => {
  const location = useLocation();
  const { orderId, mobileNumber, parkName, date, amount, bookingId } =
    location.state || {};
  const { outerFilters } = busPassTotalCommonStore();
  const {
    fetchRtcTransactionTrackingStatusByOrderId,
    RtcTransactionTrackingStatusByOrderIdData,
    isFetchRtcTransactionTrackingStatusByOrderId,
  } = useBusPassTotalTransactionStore();

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
      maxWidth: "200",
      headerName: "Request Time Stamp",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return " ";
        return formatDateTime(params.value);
      },
    },
    {
      field: "responseTimestamp",
      maxWidth: "200",
      headerName: "Response Time Stamp",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return " ";
        return formatDateTime(params.value);
      },
    },
    {
      field: "bpTransactionStatus",
      flex: 1,
      headerName: "Transaction Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value == "INITIATE"
          ? "Request Sent"
          : params.value == "INPROCESS"
          ? "Deep Link Status"
          : params.value == "FINAL_STATUS"
          ? params.data.resultStatus
          : "Payment Status Check",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value == "INITIATE"
            ? "Request Sent"
            : params.value == "INPROCESS"
            ? "Deep Link Status"
            : params.value == "FINAL_STATUS"
            ? params.data.resultStatus
            : "Payment Status Check"}
        </span>
      ),
    },
    {
      field: "resultMsg",
      flex: 1,
      headerName: "Result Msg",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>{params.value}</span>
      ),
    },
  ]);

  useEffect(() => {
    fetchRtcTransactionTrackingStatusByOrderId(orderId);
  }, [orderId]);

  const TimeFormate = (dateParam) => {
    const date = new Date(dateParam);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
    const year = date.getFullYear(); // Get year
    const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const breadcrumbItems = [
    // {
    //   label: "User Report",
    //   path: `/user-report?${userReportSearchParams}`,
    // },
    // {
    //   label: "User Detailed Report",
    //   path: `/user-detailed-report?${userDetailedReportSearchParams}`,
    // },
    {
      label: "Transaction Order Tracking Report",
      isLast: true,
    },
  ];

  const TrackRouteConfig = {
    FailedDueToOtherReasons: "/bus-pass-failed-other-reason-report",
    FailedFromGateway: "/bus-pass-failed-gateway-report",
    PaymentSuccessButTicketNotGenerated: "/bus-pass-not-generated-report",
    Success: "/bus-pass-total-report",
    Uncategorized: "/bus-pass-total-report",
  };

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Transaction Order Tracking Report
              </h1>
            </div>
            <div className="">
              <Link
                to={
                  outerFilters.status != ""
                    ? TrackRouteConfig[outerFilters.status]
                    : "/bus-pass-total-report"
                }
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>

          {/* Transaction Details Cards */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Date</h3>
              <p className="text-sm font-semibold text-gray-900">
                {TimeFormate(date) || "N/A"}
              </p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                Order ID
              </h3>
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
                {/* {bookingId && bookingId != "Not Generated" && (
                  <button
                    className="ml-2 text-blue-600 underline"
                    onClick={() => fetchQRsForBooking(bookingId)}
                  >
                    View Ticket Details
                  </button>
                )} */}
              </p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                Mobile Number
              </h3>
              <p className="text-sm font-semibold text-gray-900">
                {mobileNumber || "N/A"}
              </p>
            </div>
            {/* <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                Park Name
              </h3>
              <p className="text-sm font-semibold text-gray-900">
                {parkName || "N/A"}
              </p>
            </div> */}
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Amount</h3>
              <p className="text-sm font-semibold text-gray-900">
                {amount ? formatToCurrency(amount) : "N/A"}
              </p>
            </div>
          </div>

          <div>
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={RtcTransactionTrackingStatusByOrderIdData}
              columnDefs={columnDefs}
              isFetchLoading={isFetchRtcTransactionTrackingStatusByOrderId}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default RtcTotalTracker;
