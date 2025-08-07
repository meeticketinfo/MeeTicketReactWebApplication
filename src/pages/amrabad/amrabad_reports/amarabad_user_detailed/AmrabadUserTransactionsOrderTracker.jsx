import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  formatToCurrency,
} from "../../../../utils/TypographyHelper";
import { formatDateTime } from "../../../../utils/Helper";
import Breadcrumb from "../../../../components/Breadcrumb";

// Dummy JSON data for Amrabad User Transaction Order Tracker
const dummyMetroTransactionTrackingStatusByOrderId = [
  {
    id: 1,
    requestTimestamp: "2024-01-15T10:30:00Z",
    responseTimestamp: "2024-01-15T10:30:05Z",
    transactionStatus: "INITIATE",
    resultStatus: "SUCCESS",
    resultMsg: "Transaction initiated successfully"
  },
  {
    id: 2,
    requestTimestamp: "2024-01-15T10:30:10Z",
    responseTimestamp: "2024-01-15T10:30:15Z",
    transactionStatus: "INPROCESS",
    resultStatus: "SUCCESS",
    resultMsg: "Payment gateway processing"
  },
  {
    id: 3,
    requestTimestamp: "2024-01-15T10:30:20Z",
    responseTimestamp: "2024-01-15T10:30:25Z",
    transactionStatus: "FINAL_STATUS",
    resultStatus: "SUCCESS",
    resultMsg: "Transaction completed successfully"
  },
  {
    id: 4,
    requestTimestamp: "2024-01-15T10:30:30Z",
    responseTimestamp: "2024-01-15T10:30:35Z",
    transactionStatus: "INITIATE",
    resultStatus: "SUCCESS",
    resultMsg: "Booking confirmed"
  },
  {
    id: 5,
    requestTimestamp: "2024-01-15T10:30:40Z",
    responseTimestamp: "2024-01-15T10:30:45Z",
    transactionStatus: "INPROCESS",
    resultStatus: "SUCCESS",
    resultMsg: "Ticket generation in progress"
  },
  {
    id: 6,
    requestTimestamp: "2024-01-15T10:30:50Z",
    responseTimestamp: "2024-01-15T10:30:55Z",
    transactionStatus: "FINAL_STATUS",
    resultStatus: "SUCCESS",
    resultMsg: "Tickets generated successfully"
  },
  {
    id: 7,
    requestTimestamp: "2024-01-15T10:31:00Z",
    responseTimestamp: "2024-01-15T10:31:05Z",
    transactionStatus: "INITIATE",
    resultStatus: "SUCCESS",
    resultMsg: "SMS notification sent"
  },
  {
    id: 8,
    requestTimestamp: "2024-01-15T10:31:10Z",
    responseTimestamp: "2024-01-15T10:31:15Z",
    transactionStatus: "INPROCESS",
    resultStatus: "SUCCESS",
    resultMsg: "Email notification sent"
  },
  {
    id: 9,
    requestTimestamp: "2024-01-15T10:31:20Z",
    responseTimestamp: "2024-01-15T10:31:25Z",
    transactionStatus: "FINAL_STATUS",
    resultStatus: "SUCCESS",
    resultMsg: "All notifications delivered"
  },
 
];

const AmrabadUserTransactionsOrderTracker = () => {
  const location = useLocation();
  const { orderId, mobileNumber, date, amount, bookingId } = location.state || {};
  const userDetailedReportSearchParams = localStorage.getItem("userAmrabadDetailedReportSearchParams");
  const userReportSearchParams = localStorage.getItem("userAmrabadReportSearchParams");

  // State for dummy data
  const [dummyData, setDummyData] = useState(dummyMetroTransactionTrackingStatusByOrderId);
  const [isLoading, setIsLoading] = useState(false);

  const [columnDefs] = useState([
    {
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
      field: "transactionStatus",
      flex: 1,
      headerName: "Transaction Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value == "INITIATE" ? "Request Sent"
        : params.value == "INPROCESS" ? "Deep Link Status"
          : params.value == "FINAL_STATUS" ? params.data.resultStatus : "Payment Status Check",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value == "INITIATE" ? "Request Sent"
            : params.value == "INPROCESS" ? "Deep Link Status"
              : params.value == "FINAL_STATUS" ? params.data.resultStatus : "Payment Status Check"}
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
        <span title={params.value}>
          {params.value}
        </span>
      ),
    },
  ]);

  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setDummyData(dummyMetroTransactionTrackingStatusByOrderId);
      setIsLoading(false);
    }, 500); // 500ms delay to simulate API call
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
  }

  const breadcrumbItems = [
    {
      label: 'User Report',
      path: `/amrabad-user-report?${userReportSearchParams}`
    },
    {
      label: 'User Detailed Report',
      path: `/amrabad-user-detailed-report?${userDetailedReportSearchParams}`
    },
    {
      label: 'Transaction Order Tracking Report',
      isLast: true
    }
  ];

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Breadcrumb
            customItems={breadcrumbItems}
            className="mb-4"
          />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Transaction Order Tracking Report
              </h1>
            </div>
            <div className="">
              <Link
                to={`/amrabad-user-detailed-report?${userDetailedReportSearchParams}`}
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
                {TimeFormate(date) || 'N/A'}
              </p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Order ID</h3>
              <p className="text-sm font-semibold text-gray-900">{orderId || 'N/A'}</p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Booking ID</h3>
              <p className="text-sm font-semibold text-gray-900">
                {bookingId || 'N/A'}
              </p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Mobile Number</h3>
              <p className="text-sm font-semibold text-gray-900">{mobileNumber || 'N/A'}</p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Amount</h3>
              <p className="text-sm font-semibold text-gray-900">{amount ? formatToCurrency(amount) : 'N/A'}</p>
            </div>
          </div>

          <div>
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={dummyData}
              columnDefs={columnDefs}
              isFetchLoading={isLoading}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AmrabadUserTransactionsOrderTracker;
