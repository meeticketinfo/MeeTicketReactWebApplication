import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useMetroTotalTransactionsStore } from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalTransactionsStore";
import useMetroTotalCommonStore from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalCommonStore";
import AgGridTable from "../../../../../components/tables/AgGridTable";

import AdminLayout from "../../../../../layouts/AdminLayout";
import { formatDateTime } from "../../../../../utils/Helper";
import { formatToCurrency } from "../../../../../utils/TypographyHelper";

import MetroNotGeneratedReportForm from "./MetroNotGeneratedReportForm";

const MetroNotGeneratedReport = () => {
  const { innerFilters, outerFilters } = useMetroTotalCommonStore();
  const {
    fetchMetroTotalTransactions,
    MetroTotalTransactionsData,
    isMetroTotalTransactionsLoading,
  } = useMetroTotalTransactionsStore();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  console.log("outerFilters", innerFilters);
  useEffect(() => {
    fetchMetroTotalTransactions({
      startDate: innerFilters.fromDate || "",
      endDate: innerFilters.toDate || "",
      phoneNumber: innerFilters.mobileNumber || "",
      status: innerFilters.status || "",
      subCategory: innerFilters.subCategory || "",
      PaymentMode: "",
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }, [PAGE_LIMIT, currentPage]);
  const columnDefs = [
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
          to={"/total-payment-transaction-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
            parkName: params.data.locationName,
            status: params.data.transactionStatus,
            amount: params.data.amount,
            bookingId: params.data.bookingId,
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile No.",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "fromStationName",
      headerName: "From Station",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "toStationName",
      headerName: "To Station",
      maxWidth: "160",
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
      field: "noOfTickets",
      headerName: "No of Tickets",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },

    {
      field: "paymentMode",
      headerName: "Payment Mode",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "status",
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
      field: "bookingDetailsId",
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
        <span title={params.value}>{params.value}</span>
      ),
    },
  ];
  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Total Transactions Report
            </h1>
          </div>
          <div className="">
            <Link
              to="/metro-failed-other-reason"
              className="bg-black text-white font-semibold px-4 py-1.5 rounded"
            >
              Back
            </Link>
          </div>
        </div>

        <div>
          <MetroNotGeneratedReportForm
            pageNumber={currentPage + 1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
          />
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={MetroTotalTransactionsData}
            columnDefs={columnDefs}
            isFetchLoading={isMetroTotalTransactionsLoading}
            isPagination={false}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            showTotalCount={true}
            totalCount={MetroTotalTransactionsData[0]?.totalCount}
            tableHeight={MetroTotalTransactionsData.length > 10 ? 550 : 300}
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default MetroNotGeneratedReport;
