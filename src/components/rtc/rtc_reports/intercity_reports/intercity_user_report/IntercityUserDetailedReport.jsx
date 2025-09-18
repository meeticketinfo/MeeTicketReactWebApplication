import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import IntercityUserDetailedReportForm from "./IntercityUserDetailedReportForm";
import AgGridTable from "../../../../tables/AgGridTable";
import AdminLayout from "../../../../../layouts/AdminLayout";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../utils/Helper";
import Breadcrumb from "../../../../Breadcrumb";
import { useIntercityUserStore } from "../../../../../store/intercity/reports/IntercityUserReportStore";

const IntercityUserDetailedReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const userIntercityReportSearchParams = localStorage.getItem(
    "userIntercityReportSearchParams"
  );
  const {
    isIntercityUserDetailedReportsLoading,
    allIntercityUserDetailedReports,
    fetchIntercityUserDetailedReports,
  } = useIntercityUserStore();
  const columnDefs = [
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) => {
        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "dateandTimeOfTransaction",
      headerName: "Date and Time of Transaction",
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
          second: "2-digit",
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
          to={"/intercity-user-transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.dateandTimeOfTransaction,
            MobileNumber: params.data.mobileNumber,
            departureLocation: params.data.departureLocation,
            arrivalLocation: params.data.arrivalLocation,
            status: params.data.transactionStatus,
            amount: params.data.initiateAmount,
            bookingId: params.data.bookingId,
            // backTitle: title(),
          }}
        >
          View Track Order
        </Link>
      ),
    },
     {
      field: "orderId",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
       {
      field: "userName",
      headerName: "User Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "departureLocation",
      headerName: "Departure Location ",
      minWidth: "200",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "arrivalLocation",
      headerName: "Arrival Location",
      minWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "initiateAmount",
      headerName: "Total Amount",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "ticketStatus",
      headerName: "Ticket Status",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
   
    {
      field: "paymentMode",
      headerName: "Payment mode",
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
      field: "resultMessage",
      headerName: "Result Message",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <span title={params.value}>{params.value || "N/A"}</span>
      ),
    },
  ];
  const loadUserReport = (page = 0) => {
    fetchIntercityUserDetailedReports({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      MobileNumber: searchParams.get("MobileNumber") || "",
      paymentMode: searchParams.get("paymentMode") || "",
      pageNumber: page + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  };

  useEffect(() => {
    loadUserReport(currentPage);
  }, [currentPage, PAGE_LIMIT]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const breadcrumbItems = [
    {
      label: "User Report",
      path: `/intercity-user-report?${userIntercityReportSearchParams}`,
    },
    {
      label: "User Detailed Report",
      isLast: true,
    },
  ];
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                User Detailed Report
              </h1>
            </div>
            <div className="">
              <Link
                to={`/intercity-user-report?${userIntercityReportSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <IntercityUserDetailedReportForm
              pageNumber={1}
              pageSize={PAGE_LIMIT}
              setcurrentPage={setCurrentPage}
            />
            <AgGridTable
              ExportName="IntercityUserDetailedReport"
              rowData={allIntercityUserDetailedReports}
              columnDefs={columnDefs}
              isFetchLoading={isIntercityUserDetailedReportsLoading}
              IsReactPaginate={true}
              isPagination={false}
              tableHeight={
                allIntercityUserDetailedReports?.length > 10 ? 550 : 300
              }
              setPageLimit={setPAGE_LIMIT}
              showTotalCount={true}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              totalCount={allIntercityUserDetailedReports?.[0]?.totalCount}
              SetcurrentPage={setCurrentPage}
              showSearch={false}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default IntercityUserDetailedReport;
