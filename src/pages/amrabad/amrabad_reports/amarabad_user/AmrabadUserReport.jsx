import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../utils/Helper";
import AmrabadUserReportForm from "./AmrabadUserReportForm";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { useAmrabadUserStore } from "../../../../store/amrabad/reports/UserReportStore";

const AmrabadUserReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const {
    isAmrabadUserReportsLoading,
    allAmrabadUserReports,
    fetchAmrabadUserReports,
  } = useAmrabadUserStore();
  const [currentPage, setCurrentPage] = useState(0);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "mobileNumber",
      // maxWidth: 120,
      flex: 1,
      headerName: "Mobile No.",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "registration",
      // maxWidth: 200,
      flex: 1,
      headerName: "Registration Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
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
      field: "viewTransaction",
      headerName: "Action",
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 hover:bg-blue-v2-hover text-white px-3 py-2 rounded-md"
          to={`/amrabad-user-detailed-report?mobileNumber=${params.data.mobileNumber
            }&fromDate=${searchParams.get("fromDate") || fromDate}&toDate=${searchParams.get("toDate") || toDate
            }`}
          onClick={() => {
            localStorage.setItem("userAmrabadReportSearchParams", `mobileNumber=${searchParams.get("mobileNumber") ? params.data.phoneNumber : ""}&fromDate=${searchParams.get("fromDate") || fromDate}&toDate=${searchParams.get("toDate") || toDate}`);

          }}
        >
          View Transaction
        </Link>
      ),
    },
    {
      field: "action",
      maxWidth: "180",
      headerName: "Action",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 text-white py-1.5 px-2.5 leading-none rounded-lg text-sm"
          to={"/amrabad-view-transaction-track-order"}
          state={{
            orderId: params.data.orderId,
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
            parkName: params.data.locationName,
            status: params.data.transactionStatus,
            amount: params.data.amount,
            bookingId: params.data.bookingId,
            // backTitle: title()
          }}
        >
          View Track Order
        </Link>
      ),
    },
  ]

  const loadUserReport = (page = 0) => {
    fetchAmrabadUserReports({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      mobileNumber: searchParams.get("mobileNumber") || "",
      pageNumber: page + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  };

  useEffect(() => {
    loadUserReport(currentPage);
  }, [currentPage, PAGE_LIMIT, searchParams]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              User Report
            </h1>
          </div>
        </div>
        <AmrabadUserReportForm PageIndex={1} pageSize={PAGE_LIMIT} SetcurrentPage={setCurrentPage} />
        <div>
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={allAmrabadUserReports}
            columnDefs={columnDefs}
            isFetchLoading={isAmrabadUserReportsLoading}
            isPagination={false}
            tableHeight={allAmrabadUserReports?.length > 10 ? 560 : 330}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            totalCount={allAmrabadUserReports?.totalCount}
            showTotalCount={true}
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AmrabadUserReport;
