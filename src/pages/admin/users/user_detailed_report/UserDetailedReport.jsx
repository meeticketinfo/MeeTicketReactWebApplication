import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  formatToCurrency,
} from "../../../../utils/TypographyHelper";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import UserDetailedReportForm from "./UserDetailedReportForm";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import { useTransactionsStore } from "../../../../store/userTransaction/TransactionsStore";
import { userReports } from "../../../../store/userTransaction/UserReports";

const UserDetailedReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();

  const navigate = useNavigate();
  const {totalTransactionSearchParams} = useTransactionsStore();
  
  const {
    userDetailedReport,
    isFetchUserDetailedReport,
    fetchUserDetailedReport
  } = userReports();

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "createdDate",
      maxWidth: "200",
      headerName: "Transaction Date & Time",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: "action",
      maxWidth: "180",
      headerName: "Action",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 text-white py-1.5 px-2.5 leading-none rounded-lg text-sm"
          to={"/user-transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.createdDate,
            mobileNumber: params.data.phonE_NUMBER,
            parkName: params.data.locationName,
            status: params.data.resultStatus,
            amount: params.data.initiateTxnAmount
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "phonE_NUMBER",
      headerName: "Mobile No.",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "entityTypeName",
      headerName: "Location Category",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "locationName",
      headerName: "Park Name",
      minWidth: "200",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "confirmedTxnAmount",
      headerName: "Amount",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      maxWidth: "220",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value}
        </span>
      ),
    },
    {
      field: "transactionStatus",
      headerName: "Ticket Status",
      maxWidth: "220",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value}
        </span>
      ),
    },
    {
      field: "transactionId",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "bookingId",
      headerName: "Booking ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "resultMsg",
      headerName: "Result Message",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value || "N/A"}
        </span>
      ),
    },
  ]);

  useEffect(() => {
    fetchUserDetailedReport({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      parkId: searchParams.get("locationId") || "",
      departmentId: +searchParams.get("departmentId") || "",
      entityTypeId: +searchParams.get("entityId") || "",
      mobileNumber: searchParams.get("phoneNumber") || "",
    });
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                User Detailed Report
              </h1>
            </div>
            <div className="">
              <button
                onClick={() => navigate(`/user-report?phoneNumber=${searchParams.get("phoneNumber")}&fromDate=${searchParams.get("fromDate")}&toDate=${searchParams.get("toDate")}`)}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </button>
            </div>
          </div>
          <div>
            <UserDetailedReportForm />
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={userDetailedReport}
              columnDefs={columnDefs}
              isFetchLoading={isFetchUserDetailedReport}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UserDetailedReport;
