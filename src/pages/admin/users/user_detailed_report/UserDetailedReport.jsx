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
import ReactPaginate from "react-paginate";

const UserDetailedReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const userReportSearchParams = localStorage.getItem("userReportSearchParams");

  const {
    userDetailedReport,
    isFetchUserDetailedReport,
    fetchUserDetailedReport
  } = userReports();

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: (params) => {
        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
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

  const loadUserReport = (page = 0) => {
    fetchUserDetailedReport({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      parkId: searchParams.get("locationId") || "",
      departmentId: +searchParams.get("departmentId") || "",
      entityTypeId: +searchParams.get("entityId") || "",
      mobileNumber: searchParams.get("phoneNumber") || "",
      pageNumber: page + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  };

  useEffect(() => {
    loadUserReport(currentPage);
  }, [currentPage,PAGE_LIMIT, searchParams]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

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
              <Link
                to={`/user-report?${userReportSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
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
          <div className="mt-4 flex justify-end items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page Size:</span>
              <select 
                className="border w-20 border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-v2"
                onChange={(e) => { setPAGE_LIMIT(Number(e.target.value)) }}
                value={PAGE_LIMIT}
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="bg-white/30 backdrop-blur-md p-2 border rounded-lg shadow-sm">
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                pageCount={Math.ceil(100 / PAGE_LIMIT)}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex gap-1 items-center"}
                activeClassName={"text-white bg-blue-v2 px-3 py-1.5 rounded-lg font-medium"}
                pageClassName={"border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-blue-v2 hover:text-white transition-colors text-sm"}
                previousClassName={"border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-blue-v2 hover:text-white transition-colors text-sm"}
                nextClassName={"border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-blue-v2 hover:text-white transition-colors text-sm"}
                breakClassName={"px-2 py-1.5 text-gray-500"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                forcePage={currentPage}
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UserDetailedReport;
