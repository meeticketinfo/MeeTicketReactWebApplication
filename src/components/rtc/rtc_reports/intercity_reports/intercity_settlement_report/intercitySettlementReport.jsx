import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "../../../../../layouts/AdminLayout";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../utils/Helper";
import { formatToCurrency, formatToStandardDate } from "../../../../../utils/TypographyHelper";
import AgGridTable from "../../../../tables/AgGridTable";
import Breadcrumb from "../../../../Breadcrumb";
import { useIntercitySettlementStore } from "../../../../../store/rtc/intercitySettlementStore";      
import IntercitySettlementInnerReportForm from "./intercitySettlementInnerReportForm";
const IntercitySettlementReport = () => {
  const [searchParams] = useSearchParams();
  const startOfDay = getStartOfCurrentDay();
  const {
    isIntercitySettlementTransactionsLoading,
    allIntercitySettlementTransactions,
    fetchIntercitySettlementTransactions
  } = useIntercitySettlementStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const columnDefs = [
    {
      field: "sno",
      headerName: "S.NO",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "utrNumber",
      headerName: "UTR",
      maxWidth: 160,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "UTRProcessTime",
      headerName: "UTR PROCESS DATE TIME",
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
      field: "busType",
      headerName: "BUS TYPE",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "transactionId",
      headerName: "TRANSACTION ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "orderId",
      headerName: "ORDER ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "pnrNumber",
      headerName: "PNR NUMBER",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "ticketStatus",
      headerName: "TICKET STATUS",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "settlementDate",
      headerName: "PG SETTLED DATE TIME",
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
      field: "settlementAmount",
      headerName: "SETTLED AMOUNT",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value
          ? formatToCurrency(params.value, "INR", "en-IN")
          : "N/A",
    },
  ];

  

useEffect(() => {

}, [searchParams]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };


  // Create search params for back navigation - use original filters from when we came to inner report
  const getBackSearchParams = () => {
    const backParams = new URLSearchParams();
    
    // Get original filters that were stored when navigating to inner report
    const originalFilters = localStorage.getItem("intercitySettlementInnerTransactionSearchParams");
    
    if (originalFilters && originalFilters !== "") {
      // Use the original filters that were there when we came to inner report
      const params = new URLSearchParams(originalFilters);
      
      // Copy all original parameters
      for (const [key, value] of params.entries()) {
        if (key !== "status") { // Don't include status as it's specific to inner report
          backParams.set(key, value);
        }
      }
      
    } else {
      // Fallback: Include current parameters (but remove inner form specific ones)
      if (searchParams.get("date")) backParams.set("date", searchParams.get("date"));
      if (searchParams.get("type")) backParams.set("type", searchParams.get("type"));
      if (searchParams.get("transactionDate")) backParams.set("transactionDate", searchParams.get("transactionDate"));
      if (searchParams.get("settlementDate")) backParams.set("settlementDate", searchParams.get("settlementDate"));
      
    }
    
    return backParams.toString();
  };

  const breadcrumbItems = [
    {
      label: "Settlement Summary",
      path: `/intercity-settlement-summary-report?${getBackSearchParams()}`,
    },
    {
      label: `${searchParams.get("status")} Summary`,
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold uppercase">
            {searchParams.get("status")} Summary Report{" "}
            </h1>
          </div>
          <div className="">
            <Link
              to={`/intercity-settlement-summary-report`}
              onClick={() => {
                // Clear inner report filters on back
                localStorage.removeItem("intercitySettlementInnerTransactionSearchParams");
              }}
              className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
            >
              Back
            </Link>
          </div>
        </div>
        <div>
          <IntercitySettlementInnerReportForm
            pageNumber={currentPage + 1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
            currentPage={currentPage}
            PAGE_LIMIT={PAGE_LIMIT}
            isLoading={isIntercitySettlementTransactionsLoading}
            searchParameter={searchParams.get("status")}
          />
        </div>
        <div>
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={allIntercitySettlementTransactions?.data?.storedProcedureResults || []}
            columnDefs={columnDefs}
            isFetchLoading={isIntercitySettlementTransactionsLoading}
            isPagination={false}
            tableHeight={allIntercitySettlementTransactions?.data?.storedProcedureResults?.length > 10 ? 560 : 330}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            totalCount={allIntercitySettlementTransactions?.data?.notSettledCount || 0}
            showTotalCount={true}
            SetcurrentPage={setCurrentPage}
            showSearch={false}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default IntercitySettlementReport;
