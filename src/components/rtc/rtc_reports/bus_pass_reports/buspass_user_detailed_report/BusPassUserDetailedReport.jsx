import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BusPassUserDetailedReportForm from "./BusPassUserDetailedReportForm";
import AgGridTable from "../../../../tables/AgGridTable";
import AdminLayout from "../../../../../layouts/AdminLayout";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import Breadcrumb from "../../../../Breadcrumb";
import { useBuspassUserStore } from "../../../../../store/rtc/RtcUserReportStore";

const BusPassUserDetailedReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const userBusPassReportSearchParams = localStorage.getItem("userBusPassReportSearchParams");
  const {
    isBusPassUserDetailedReportsLoading,
    allBusPassUserDetailedReports,
    fetchBusPassUserDetailedReports,
  } = useBuspassUserStore();
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
      field: "transactionDateandTime",
      headerName: "Transaction Date & Time",
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
          to={"/bus-pass-user-transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.transactionDateandTime,
            mobileNo: params.data.login_MobilNumber,
            typeOfBusPass:params.data.typeOfBusPass,
            status: params.data.transactionStatus,
            amount: params.data.confirmedTransactionAmount,
            bookingId: params.data.applicationId,
            // backTitle: title(),
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "login_MobilNumber",
      headerName: "Mobile Number",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "typeOfBusPass",
      headerName: "Type of Bus Pass",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "confirmedTransactionAmount",
      headerName: "Amount",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "modeOfPayment",
      headerName: "Mode of Payment",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "ticketStatus",
      headerName: "Ticket Status",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "orderId",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "applicationId",
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
    fetchBusPassUserDetailedReports({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      mobileNo: searchParams.get("mobileNo") || "",
      paymentMode: searchParams.get("paymentMode") || "",
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
      path: `/bus-pass-user-report?${userBusPassReportSearchParams}`
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
                to={`/bus-pass-user-report?${userBusPassReportSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <BusPassUserDetailedReportForm pageNumber={1} pageSize={PAGE_LIMIT} setcurrentPage={setCurrentPage} />
            <AgGridTable
              ExportName="UserDetailedReport"
              rowData={allBusPassUserDetailedReports}
              columnDefs={columnDefs}
              isFetchLoading={isBusPassUserDetailedReportsLoading}
              IsReactPaginate={true}
              isPagination={false}
              tableHeight={allBusPassUserDetailedReports?.length > 10 ? 550 : 300}
              setPageLimit={setPAGE_LIMIT}
              showTotalCount={true}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              totalCount={allBusPassUserDetailedReports?.[0]?.totalCount}
              SetcurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default BusPassUserDetailedReport;
