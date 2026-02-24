import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IntercityUserDetailedReportForm from "./IntercityUserDetailedReportForm";
import AgGridTable from "../../../../tables/AgGridTable";
import AdminLayout from "../../../../../layouts/AdminLayout";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../utils/Helper";
import Breadcrumb from "../../../../Breadcrumb";
import { useIntercityUserStore } from "../../../../../store/intercity/reports/IntercityUserReportStore";

const IntercityUserDetailedReport = () => {
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Get filters from localStorage
  const [currentFilters, setCurrentFilters] = useState(() => {
    const savedFilters = localStorage.getItem("userIntercityDetailedReportSearchParams");
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        return {
          fromDate: parsedFilters.fromDate || fromDate,
          toDate: parsedFilters.toDate || toDate,
          MobileNumber: parsedFilters.MobileNumber || "",
          destinationLocation: parsedFilters.destinationLocation || "",
          arrivalLocation: parsedFilters.arrivalLocation || "",
        };
      } catch (error) {
        console.error("Error parsing saved detailed report filters:", error);
      }
    }
    
    // If no saved filters, use default values
    return {
      fromDate: fromDate,
      toDate: toDate,
      MobileNumber: "",
      destinationLocation: "",
      arrivalLocation: "",
    };
  });
  
  const {
    isIntercityUserDetailedReportsLoading,
    allIntercityUserDetailedReports,
    fetchIntercityUserDetailedReports,
  } = useIntercityUserStore();
  const columnDefs = [
    {
      field: "sno",
      headerName: "S.NO",
      valueGetter: (params) => {
        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "dateandTimeOfTransaction",
      headerName: "DATE AND TIME OF TRANSACTION",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
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
      headerName: "ACTION",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 text-white py-1.5 px-2.5 leading-none rounded-lg text-sm uppercase"
          to={"/intercity-user-transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.dateandTimeOfTransaction,
            MobileNumber: params.data.mobileNumber,
            pnrNumber: params.data.pnrNumber,
            returnPNRNumber: params.data.returnPNRNumber,
            departureLocation: params.data.departureLocation,
            arrivalLocation: params.data.arrivalLocation,
            status: params.data.transactionStatus,
            amount: params.data.initiateAmount,
            bookingId: params.data.bookingId,
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "orderId",
      headerName: "ORDER ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "userName",
      headerName: "USER NAME",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "MOBILE NUMBER",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "departureLocation",
      headerName: "DEPARTURE LOCATION",
      minWidth: "200",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "arrivalLocation",
      headerName: "ARRIVAL LOCATION",
      minWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "initiateAmount",
      headerName: "TOTAL AMOUNT",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "paymentStatus",
      headerName: "PAYMENT STATUS",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "ticketStatus",
      headerName: "TICKET STATUS",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value.toUpperCase() ?? "N/A",
    },
    {
      field: "paymentMode",
      headerName: "PAYMENT MODE",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "bookingId",
      headerName: "BOOKING ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "resultMessage",
      headerName: "RESULT MESSAGE",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <span title={params.value}>{params.value || "N/A"}</span>
      ),
    },
  ];
  const loadUserReport = (page = 0) => {
    fetchIntercityUserDetailedReports({
      fromDate: currentFilters.fromDate,
      toDate: currentFilters.toDate,
      MobileNumber: currentFilters.MobileNumber,
      paymentMode: "",
      departureLocation: currentFilters.destinationLocation,
      arrivalLocation: currentFilters.arrivalLocation,
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
      path: "/intercity-user-report",
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
          <Breadcrumb customItems={breadcrumbItems} className="mb-4 uppercase" />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold uppercase">
                User Detailed Report
              </h1>
            </div>
            <div className="">
              <Link
                to="/intercity-user-report"
                className="btn-sm bg-gray-900 uppercase text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
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
              updateCurrentFilters={setCurrentFilters}
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
