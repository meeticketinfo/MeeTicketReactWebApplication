import React, { useEffect, useState } from "react";
import AgGridTable from "../../../../components/tables/AgGridTable";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import Select from "react-select";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import AmrabadPaymentTransactionsForm from "./AmrabadPaymentTransactionsForm";
function AmrabadPaymentTransactionsList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const {
    isAmrabadTransactionPaymentReportsLoading,
    allAmrabadTransactionPaymentReports,
    fetchAmrabadPaymentTransactions,
  } = useAmrabadConsolidatedStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-payment-report-filters")
  );
  console.log(
    "allAmrabadTransactionPaymentReports",
    allAmrabadTransactionPaymentReports
  );
  useEffect(() => {
    fetchAmrabadPaymentTransactions({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      paymentStatus: savedFilters?.paymentStatus
        ? savedFilters.paymentStatus
        : "",
      paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
      phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
      PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  }, [fetchAmrabadPaymentTransactions]);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "userName",
      headerName: "User Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "transaactionID",
      headerName: "Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "packageName",
      headerName: "Package Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "houseName",
      headerName: "House Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "amountPaid",
      headerName: "Amount Paid",
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Mode of Booking ",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Paymode Mode",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paytmConfirmedStatus",
      headerName: "Payment Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Actual Paytm Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Refund Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Refund ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Refund Initiated Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  ]);
  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <div>
      <div className="mb-8">
        <AmrabadPaymentTransactionsForm
          PageIndex={1}
          pageSize={PAGE_LIMIT}
          SetcurrentPage={setCurrentPage}
        />
        <AgGridTable
          ExportName="Payment Transactions"
          rowData={allAmrabadTransactionPaymentReports?.records || []}
          columnDefs={columnDefs}
          isFetchLoading={isAmrabadTransactionPaymentReportsLoading}
          isPagination={false}
          tableHeight={
            allAmrabadTransactionPaymentReports?.records?.length > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={allAmrabadTransactionPaymentReports.totalCount}
          showTotalCount={true}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
        />
      </div>
    </div>
  );
}

export default AmrabadPaymentTransactionsList;
