import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import { formatToCurrency } from "../../../../utils/TypographyHelper";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../utils/Helper";
import ReactPaginate from "react-paginate";
import Breadcrumb from "../../../../components/Breadcrumb";
import AmrabadUserDetailedReportForm from "./AmrabadUserDetailedReportForm";
import { useAmrabadUserStore } from "../../../../store/amrabad/reports/UserReportStore";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";

const AmarabadUserDetailedReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const userAmrabadReportSearchParams = localStorage.getItem("userAmrabadReportSearchParams");
  const {
    isAmrabadUserDetailedReportsLoading,
    allAmrabadUserDetailedReports,
    fetchAmrabadUserDetailedReports,
  } = useAmrabadUserStore();
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
      field: "purchaseDate",
      maxWidth: "200",
      headerName: "Date and Time of Transaction",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
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
      headerName: "Action",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 text-white py-1.5 px-2.5 leading-none rounded-lg text-sm"
          to={"/amrabad-user-transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.purchaseDate,
            mobileNumber: params.data.mobileNumber,
            packageName: params.data.packageName,
            status: params.data.transactionStatus,
            amount: params.data.amount,
            bookingId: params.data.bookingId,
            // backTitle: title(),
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "orderId",
      headerName: "Order ID",
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
      field: "packageName",
      headerName: "Package Name",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "houseName",
      headerName: "House Name",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "amount",
      headerName: "Total Amount",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "actualPaymentStatus",
      headerName: "Ticket Status",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "modeOfBooking",
      headerName: "Payment Mode",
      maxWidth: "160",
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
      headerName: "Result Message",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <span title={params.value}>{params.value || "N/A"}</span>
      ),
    },
  ]
  const loadUserReport = (page = 0) => {
    fetchAmrabadUserDetailedReports({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      mobileNumber: searchParams.get("mobileNumber") || "",
      packageId: searchParams.get("packageId") || "",
      houseId: searchParams.get("houseId") || "",
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
      label: 'User Report',
      path: `/amrabad-user-report?${userAmrabadReportSearchParams}`
    },
    {
      label: 'User Detailed Report',
      isLast: true
    }
  ];
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Breadcrumb
            customItems={breadcrumbItems}
            className="mb-4"
          />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                User Detailed Report
              </h1>
            </div>
            <div className="">
              <Link
                to={`/amrabad-user-report?${userAmrabadReportSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <AmrabadUserDetailedReportForm pageNumber={1} pageSize={PAGE_LIMIT} setcurrentPage={setCurrentPage} />
            <AgGridTable
              ExportName="UserDetailedReport"
              rowData={allAmrabadUserDetailedReports}
              columnDefs={columnDefs}
              isFetchLoading={isAmrabadUserDetailedReportsLoading}
              IsReactPaginate={true}
              isPagination={false}
              tableHeight={allAmrabadUserDetailedReports?.length > 10 ? 550 : 300}
              setPageLimit={setPAGE_LIMIT}
              showTotalCount={true}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              totalCount={allAmrabadUserDetailedReports?.[0]?.totalCount}
              SetcurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AmarabadUserDetailedReport;
