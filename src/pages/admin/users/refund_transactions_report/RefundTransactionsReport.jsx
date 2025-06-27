import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  formatToCurrency,
} from "../../../../utils/TypographyHelper";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import RefundTransactionsReportForm from "./RefundTransactionsReportForm";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import { useTransactionsStore } from "../../../../store/userTransaction/TransactionsStore";
import { userReports } from "../../../../store/userTransaction/UserReports";

const RefundTransactionsReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const refundTransactionSearchParams = localStorage.getItem("refundTransactionSearchParams");
  
  const {
    isFetchRefundTransactionsReport,
    refundTransactionsReport,
    fetchRefundTransactionsReport,
  } = userReports();

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
 
    {
      field: "dateandTimeofTransaction",
      headerName: "Date of Transaction",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      headerName: "Actions",
      field: "actions",
      maxWidth: "100",
      //   hide: email === "esdadmin@gmail.com",
      cellRenderer: (params) => {
        return (
          <div className="flex align-center gap-2">
            <>
              <button
                className={`bg-green-400text-white leading-normal px-2 py-1 mt-1.5 rounded-md`}
              >
                Pay Now
              </button>
            </>
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
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
      field: "mobileNumberofuser",
      minWidth: 100,
      headerName: "Mobile Number of user",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
 
    {
      field: "department",
      headerName: "Department",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "locationCategory",
      headerName: "Location Category",
     
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "locationName",
      headerName: "Location name",
     
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "amount",
      headerName: "Amount",
      maxWidth: "100",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalConfirmedTicketFare",
      headerName: "No of Tickets",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "modeofTransaction",
      headerName: "Mode of Transaction",
       maxWidth: "170",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "0",
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
  ]);

  const loadRefundTransactionsReport = (page = 0) => {
    fetchRefundTransactionsReport({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      locationId: searchParams.get("locationId") || "",
      departmentId: +searchParams.get("departmentId") || "",
      categoryId: +searchParams.get("entityId") || "",
      refundStatus: searchParams.get("RefundStatus") || "",
      phoneNumber: searchParams.get("phoneNumber") || "",
      pageNumber: page + 1,
      pageSize: PAGE_LIMIT,
    });
  };
  useEffect(() => {
    loadRefundTransactionsReport(currentPage);
  }, [currentPage, PAGE_LIMIT ]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                {searchParams.get("category") == "Success" ? "Success Transactions" 
                  : searchParams.get("category") == "PaymentSuccessButTicketNotGenerated" ? "Ticket not Generated" 
                  : "Failed Transactions"}
              </h1>
            </div>
            <div className="">
              <Link
                to={`/refund-transactions?${refundTransactionSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <RefundTransactionsReportForm pageNumber={currentPage + 1} pageSize={PAGE_LIMIT} />
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={refundTransactionsReport}
              columnDefs={columnDefs}
              isFetchLoading={isFetchRefundTransactionsReport}
              tableHeight={refundTransactionsReport?.length > 10 ? 560 : 330}
              isPagination={false}
              IsReactPaginate={true}
              setPageLimit={setPAGE_LIMIT}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              showTotalCount={true}
              totalCount={refundTransactionsReport[0]?.totalCount}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default RefundTransactionsReport;
