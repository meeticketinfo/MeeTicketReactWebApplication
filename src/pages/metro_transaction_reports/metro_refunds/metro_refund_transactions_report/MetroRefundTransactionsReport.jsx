import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import { formatToCurrency } from "../../../../utils/TypographyHelper";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../utils/Helper";

import Breadcrumb from "../../../../components/Breadcrumb";
import MetroRefundTransactionsReportForm from "./MetroRefundTransactionsReportForm";
import { metroRefundReports } from "../../../../store/metro_refund_reports_store/MetroRefundReportStore";
import { ToastContainer } from "react-toastify";
const MetroRefundTransactionsReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  
  const refundTransactionSearchParams =
    localStorage.getItem("refundMetroTransactionSearchParams") || "";

  const {
    isFetchMetroRefundTransactionsInnerReport,
    metroRefundTransactionsInnerReport,
    fetchMetroRefundTransactionsInnerReport,
  } = metroRefundReports();
  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },

    {
      field: "createdDate",
      headerName: "Date of Transaction",
      maxWidth: "180",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },

    {
      field: "refundStatus",
      headerName: "RefundStatus",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value || params.value === " " ? params.value : "N/A",
    },
    {
      field: "mobileNumber",
      minWidth: 100,
      headerName: "Mobile Number of user",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "fromStationName",
      headerName: "From Station",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "toStationName",
      headerName: "To Station",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    
    {
      field: "amount",
      headerName: "Amount",
      maxWidth: "100",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "noOfTickets",
      headerName: "No of Tickets",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  
    {
      field: "paymentMode",
      headerName: "Payment mode",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "orderId",
      headerName: "Order ID",
      Width: "390",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "bookingID",
      headerName: "Booking ID",
      Width: "260",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
  ];

  const loadRefundTransactionsReport = (page = 0) => {
    fetchMetroRefundTransactionsInnerReport({
      fromDate:
        cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      phoneNumber: searchParams.get("phoneNumber") || "",
      refundStatus:
        searchParams.get("RefundStatus") === "null"
          ? ""
          : searchParams.get("RefundStatus") || "",
      pageNumber: page + 1,
      pageSize: PAGE_LIMIT,
    });
  };
  useEffect(() => {
    loadRefundTransactionsReport(currentPage);
  }, [currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const breadcrumbItems = [
    {
      label: "Refund Transactions",
      path: `/metro-refund-transactions?${refundTransactionSearchParams}`,
    },
    {
      label: `Refund Transactions Report ${
        searchParams.get("RefundStatus")
          ? `(${searchParams.get("RefundStatus")})`
          : ""
      }`,
      isLast: true,
    },
  ];

  return (
    <>
      <AdminLayout>
        <ToastContainer/>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Refund Transactions Report{" "}
                {searchParams.get("RefundStatus")
                  ? `(${searchParams.get("RefundStatus")})`
                  : ""}
              </h1>
            </div>
            <div className="">
              <Link
                to={`/metro-refund-transactions?${refundTransactionSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <MetroRefundTransactionsReportForm
              pageNumber={currentPage + 1}
              pageSize={PAGE_LIMIT}
              setCurrentPage={setCurrentPage}
            />
            <AgGridTable
              ExportName="RefundTransactionsReport"
              rowData={metroRefundTransactionsInnerReport}
              columnDefs={columnDefs}
              isFetchLoading={isFetchMetroRefundTransactionsInnerReport}
              tableHeight={
                metroRefundTransactionsInnerReport?.length > 10 ? 560 : 330
              }
              isPagination={false}
              IsReactPaginate={true}
              setPageLimit={setPAGE_LIMIT}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              showTotalCount={true}
              totalCount={metroRefundTransactionsInnerReport[0]?.totalCount}
              SetcurrentPage={setCurrentPage}
            />
          </div>
        </div>
        {/* Initiate Refund */}
        {/* <PopupModal
          popupModalId="first-modal"
          isOpen={InitiatRefundModal}
          onClose={() => setInitiatRefundModal(false)}
          size="small"
          overlayClassName="bg-gray-800 bg-opacity-60"
          contentClassName="bg-white"
          defaultBodyPadding={true}
        >
          <div className="px-10 py-14">
            <h1 className="text-blue-v1 font-semibold">
              Are you sure you want to proceed with the refund?
            </h1>

            <div className="flex justify-center gap-8 mt-4 z-30">
              <button
                onClick={async () => {
                  await handleInitiateRefund();
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
              >
                {isInitiateRefund ? (
                  <span className="px-8">
                    <l-tailspin
                      size="15"
                      stroke="5"
                      speed="0.9"
                      color="white"
                    ></l-tailspin>
                  </span>
                ) : (
                  "Proceed"
                )}
              </button>

              <button
                onClick={() => setInitiatRefundModal(false)}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
              >
                Deny
              </button>
            </div>
          </div>
        </PopupModal> */}
      </AdminLayout>
    </>
  );
};

export default MetroRefundTransactionsReport;
