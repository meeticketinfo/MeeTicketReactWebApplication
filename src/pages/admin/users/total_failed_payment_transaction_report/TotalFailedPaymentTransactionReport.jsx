import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import { formatToCurrency } from "../../../../utils/TypographyHelper";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import { cleanString, formatDateTime, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import TotalFailedPaymentTransactionReportForm from "./TotalFailedPaymentTransactionReportForm";
import Breadcrumb from "../../../../components/Breadcrumb";

const TotalFailedPaymentTransactionReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const totalTransactionSearchParams = localStorage.getItem("totalTransactionSearchParams");
  const totalFailedTransactionSearchParams = localStorage.getItem("totalFailedTransactionSearchParams");
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };  
  
  const {
    paymentTransactionDetailsByStatusResult,
    isFetchPaymentTransactionDetailsByStatusResult,
    fetchPaymentTransactionDetailsByStatusResult
  } = userFailureTransaction();

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
          to={"/total-failed-payment-transaction-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
            parkName: params.data.locationName,
            status: params.data.transactionStatus,
            amount: params.data.amount,
            bookingId: params.data.bookingId,
            backTitle: searchParams.get("subCategory"),
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
      field: "bookingSource",
      headerName: "Mode of Transaction",
      maxWidth: "170",
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
      hide: searchParams.get("category") == "Success",
      headerName: "Result Message",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value}
        </span>
      ),
    },
  ];

  const loadPaymentTransactionDetailsByStatusResult = () => {
    fetchPaymentTransactionDetailsByStatusResult({
      startDate: cleanString(searchParams.get("startDate"), "_", ":") || fromDate,
      endDate: cleanString(searchParams.get("endDate"), "_", ":") || toDate,
      locationId: searchParams.get("locationId") || "",
      departmentId: +searchParams.get("departmentId") || "",
      categoryId: +searchParams.get("entityId") || "",
      status: searchParams.get("category") || "",
      subCategory: searchParams.get("subCategory") || "",
      phoneNumber: searchParams.get("phoneNumber") || "",
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }

  useEffect(() => {
    loadPaymentTransactionDetailsByStatusResult();
  }, [currentPage, PAGE_LIMIT]);

  const backLink = () => {
      return `/failed-transactions-dashboard?${totalFailedTransactionSearchParams}`
  }

  const breadcrumbItems = [
    {
      label: 'Total Transactions Report',
      path: `/total-transactions-dashboard?${totalTransactionSearchParams}`
    },
    {
      label: 'Total Failed (Other Reasons)',
      path: `/failed-transactions-dashboard?${totalFailedTransactionSearchParams}`
    },
    {
      label: searchParams.get("subCategory") || "Total Failed (Other Reasons) Report",
      isLast: true
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
                Total Failed (Other Reasons) Report {searchParams.get("subCategory") ? `- ${searchParams.get("subCategory")}` : ""}
              </h1>
            </div>
            <div className="">
              <Link
                to={backLink()}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <TotalFailedPaymentTransactionReportForm pageNumber={currentPage + 1} pageSize={PAGE_LIMIT} SetcurrentPage={setCurrentPage} />
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={paymentTransactionDetailsByStatusResult}
              columnDefs={columnDefs}
              isFetchLoading={isFetchPaymentTransactionDetailsByStatusResult}
              isPagination={false}
              IsReactPaginate={true}
              setPageLimit={setPAGE_LIMIT}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              showTotalCount={true}
              totalCount={paymentTransactionDetailsByStatusResult[0]?.totalCount}
              tableHeight={paymentTransactionDetailsByStatusResult.length > 10 ? 550 : 300}
              SetcurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default TotalFailedPaymentTransactionReport;
