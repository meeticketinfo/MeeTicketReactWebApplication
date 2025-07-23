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
  useEffect(() => {
    fetchAmrabadPaymentTransactions({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      paymentStatus: savedFilters?.paymentStatus
        ? savedFilters.paymentStatus
        : "",
      paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : null,
      phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : null,
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
      field: "department",
      headerName: "Department",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "locationCategory",
      headerName: "Location category",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "orderID",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionID",
      headerName: "Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile No.",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "amount",
      headerName: "Amount Initiated",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentDate",
      headerName: "Payment Date",
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundStatus",
      headerName: "Refund Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paytmConfirmedStatus",
      headerName: "Paytm Confirmed Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    // {
    //   field: "Re-grnerateTicket",
    //   headerName: "Re-grnerate Ticket",
    //   maxWidth: 160,
    //   headerClass: "text-blue-v2",
    //   cellRenderer: (params) => {
    //     return (
    //       <div className="flex justify-center">
    //         <span
    //           onClick={() => {
    //             setOpenModal(true);
    //             setreGenerateData({
    //               paymentOrderId: params.data.orderId,
    //               mobileNumber: params.data.phonE_NUMBER,
    //             });
    //           }}
    //         >
    //           <HiArrowPathRoundedSquare className="text-[24px] text-green-400  mt-2.5 " />
    //         </span>
    //       </div>
    //     );
    //   },
    // },
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
          rowData={allAmrabadTransactionPaymentReports || []}
          columnDefs={columnDefs}
          isFetchLoading={isAmrabadTransactionPaymentReportsLoading}
          isPagination={false}
          tableHeight={
            allAmrabadTransactionPaymentReports?.data?.length > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={allAmrabadTransactionPaymentReports[0]?.totalCount}
          showTotalCount={true}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
        />
      </div>
    </div>
  );
}

export default AmrabadPaymentTransactionsList;
