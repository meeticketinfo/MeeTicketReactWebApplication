import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom"; 
import IntercityTotalCommonStore from "../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";
import { ToastContainer } from "react-toastify";
import AdminLayout from "../../../../../layouts/AdminLayout";
import Breadcrumb from "../../../../Breadcrumb";
import AgGridTable from "../../../../tables/AgGridTable";
import { formatDateTime } from "../../../../../utils/Helper";
import { formatToCurrency } from "../../../../../utils/TypographyHelper";
import { useIntercityTotalTransactionStore } from "./store/IntercityTotalTransactionStore";
import IntercityTotalTransactionForm from "./outer_report/intercityTotalTransactionForm";
// import IntercityTotalTransactionForm from "./outer_report/intercityTotalTransactionForm";

const InetercityTotalReport = () => {
  const {
    outerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
    innerFilters,
  } = IntercityTotalCommonStore();

  const {
    fetchTotalTransactionsReport,
    totalTransactionsReport,
    isTotalTransactionsReportLoading,
  } = useIntercityTotalTransactionStore();

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const searchParams = new URLSearchParams(window.location.search);
  const mobileNumber = searchParams.get("mobileNumber");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const subCategory = searchParams.get("subCategory");
  const status = searchParams.get("status");

  useEffect(() => {
    fetchTotalTransactionsReport({
      startDate: fromDate ?? (deepInnerFilters.startDate || outerFilters.fromDate) ?? "",
      endDate: toDate ?? (deepInnerFilters.endDate || outerFilters.toDate) ?? "",
      phoneNumber:
        mobileNumber ?? (deepInnerFilters.mobileNumber || outerFilters.mobileNumber) ?? "",
      BusPassType:
        subCategory ?? (deepInnerFilters.BusPassType || outerFilters.BusPassType) ?? "",
      departureLocation:
        subCategory ?? (deepInnerFilters.departureLocation || outerFilters.departureLocation) ?? "",
      arrivalLocation:
        subCategory ?? (deepInnerFilters.arrivalLocation || outerFilters.arrivalLocation) ?? "",
      busType:
        subCategory ?? (deepInnerFilters.busType || outerFilters.busType) ?? "",
      status: status ?? outerFilters.status ?? "",
      // subCategory: subCategory ?? innerFilters.subCategory ?? outerFilters.subCategory ?? "",

      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }, [
    PAGE_LIMIT,
    currentPage,
    deepInnerFilters.startDate,
    deepInnerFilters.endDate,
    deepInnerFilters.mobileNumber,
    deepInnerFilters.BusPassType,
    deepInnerFilters.departureLocation,
    deepInnerFilters.arrivalLocation,
    deepInnerFilters.busType,
    outerFilters.fromDate,
    outerFilters.toDate,
    outerFilters.mobileNumber,
    outerFilters.BusPassType,
    outerFilters.departureLocation,
    outerFilters.arrivalLocation,
    outerFilters.busType,
    outerFilters.status,
  ]);
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
      field: "createdDate",
      maxWidth: "200",
      headerName: "Transaction Date & Time",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        return formatDateTime(params.value);
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
          to={"/intercity-total-transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
            status: params.data.transactionStatus,
            amount: params.data.amount,
            bookingId: params.data.bookingId,
            arrivalLocation: params.data.arrivalLocation,
            departureLocation: params.data.departureLocation,
            busType: params.data.busType,
            pnrNumber: params.data.pnrNumber,
            returnPNRNumber: params.data.returnPNRNumber,
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "userName",
      headerName: "User Name",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile No.",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },

    {
      field: "busType",
      headerName: "Type of Bus Pass",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value  === "" ? "N/A" : params.value,
    },
    {
      field: "ticketQuantity",
      headerName: "Ticket Quantity",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
   
    
    {
      field: "departureLocation",
      headerName: "Departure Location",
      // maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "arrivalLocation",
      headerName: "Arrival Location",
      // maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },

    {
      field: "paymentMode",
      headerName: "Payment Mode",
      maxWidth: "170",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      maxWidth: "220",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>{params.value}</span>
      ),
    },
    {
      field: "orderId",
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
      field: "resultMessage",
      hide: outerFilters.status === "Success",
      headerName: "Result Message",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value ?? "N/A"}>{params.value ?? "N/A"}</span>
      ),
    },
  ];

  const breadcrumbItems = [
    {
      label: "Total Transactions ",
      path: `/intercity-total-transaction`,
      onclick: () => resetDeepInnerFilters(),
    },

    {
      label: `Total ${
        outerFilters.status ? outerFilters.status : "Transaction"
      } Report`,
      isLast: true,
    },
  ];
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-6">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        </div>
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Total {outerFilters.status ? outerFilters.status : "Transaction"}{" "}
              Report
            </h1>
          </div>
          <div className="">
            <Link
              to="/intercity-total-transaction"
              className="bg-black text-white font-semibold px-4 py-1.5 rounded"
              onClick={() => {
                resetDeepInnerFilters();
              }}
            >
              Back
            </Link>
          </div>
        </div>

        <div>
          <IntercityTotalTransactionForm
            pageNumber={currentPage + 1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
            mobileNumber={outerFilters.mobileNumber}
            fromDate={outerFilters.fromDate}
            toDate={outerFilters.toDate}
            subCategory={outerFilters.subCategory}
            status={outerFilters.status}
            arrivalLocation={outerFilters.arrivalLocation}
            departureLocation={outerFilters.departureLocation}
            busType={outerFilters.busType}
          />
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={totalTransactionsReport}
            columnDefs={columnDefs}
            isFetchLoading={isTotalTransactionsReportLoading}
            isPagination={false}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            showTotalCount={true}
            totalCount={totalTransactionsReport[0]?.totalCount}
            tableHeight={totalTransactionsReport.length > 10 ? 550 : 300}
            SetcurrentPage={setCurrentPage}
            showSearch={false}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default InetercityTotalReport;
