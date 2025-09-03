import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import busPassTotalCommonStore from "../../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/busPassTotalCommonStore";
import { useBusPassTotalTransactionStore } from "../../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";
import { formatToCurrency } from "../../../../../../../utils/TypographyHelper";
import RtcFailedGateWayReportForm from "./RtcFailedGateWayReportForm";
import AdminLayout from "../../../../../../../layouts/AdminLayout";
import Breadcrumb from "../../../../../../Breadcrumb";
import AgGridTable from "../../../../../../tables/AgGridTable";
import { formatDateTime } from "../../../../../../../utils/Helper";

const RtcFailedGatewayReport = () => {
  const {
    innerFilters,
    outerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
    resetInnerFilters,
  } = busPassTotalCommonStore();
  const {
    fetchRtcTotalTransactions,
    RtcTotalTransactionsData,
    isRtcTotalTransactionsLoading,
  } = useBusPassTotalTransactionStore();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  console.log("outerFilters", innerFilters);
  useEffect(() => {
    fetchRtcTotalTransactions({
      startDate: deepInnerFilters.startDate ?? innerFilters.fromDate ?? "",
      endDate: deepInnerFilters.endDate ?? innerFilters.toDate ?? "",
      phoneNumber:
        innerFilters.mobileNumber ?? deepInnerFilters.mobileNumber ?? "",
      BusPassType:
        innerFilters.BusPassType ?? deepInnerFilters.BusPassType ?? "",
      status: innerFilters.status ?? "",
      subCategory: innerFilters.subCategory ?? "",

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
          to={"/bus-pass-total-traker"}
          state={{
            orderId: params.data.bP_OrderId,
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
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
      field: "toStationName",
      headerName: "Type of Bus Pass",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "noOfTickets",
      headerName: "Mode of Transaction",
      maxWidth: "120",
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
      headerName: "Mode of Payment",
      maxWidth: "140",
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
      field: "bP_OrderId",
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
        <span title={params.value}>{params.value}</span>
      ),
    },
  ];
  const breadcrumbItems = [
    {
      label: "Total Transactions",
      path: `/bus-pass-total-transaction`,
    },
    {
      label: "Failed (Payment Gateway)",
      path: `/bus-pass-failed-gateway`,
      onclick: () => {
        resetDeepInnerFilters();
      },
    },
    {
      label: "Failed (Payment Gateway)Report",
      isLast: true,
    },
  ];
  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Failed (Payment Gateway)-
              {innerFilters.subCategory.replace(/([A-Z])/g, " $1").trim()}Report
            </h1>
          </div>
          <div className="">
            <Link
              to="/bus-pass-failed-gateway"
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
          <RtcFailedGateWayReportForm
            pageNumber={currentPage + 1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
          />
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={RtcTotalTransactionsData}
            columnDefs={columnDefs}
            isFetchLoading={isRtcTotalTransactionsLoading}
            isPagination={false}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            showTotalCount={true}
            totalCount={RtcTotalTransactionsData[0]?.totalCount}
            tableHeight={RtcTotalTransactionsData.length > 10 ? 550 : 300}
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default RtcFailedGatewayReport;
