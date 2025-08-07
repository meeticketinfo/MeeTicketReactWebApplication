import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import { formatToCurrency } from "../../../../utils/TypographyHelper";
import Breadcrumb from "../../../../components/Breadcrumb";
import MetroUserDetailedReportForm from "./AmrabadUserDetailedReportForm";

// Dummy JSON data for Amrabad User Detailed Reports
const dummyAmrabadUserDetailedReports = [
  {
    id: 1,
    orderId: "ORD20240115001",
    bookingId: "BK20240115001",
    mobileNumber: "9876543210",
    createdDate: "2024-01-15T10:30:00Z",
    fromStationName: "Secunderabad Junction",
    toStationName: "Hyderabad Deccan",
    noOfTickets: 2,
    initiateTxnAmount: 120.00,
    transactionStatus: "SUCCESS",
    resultStatus: "SUCCESS",
    resultMessage: "Transaction completed successfully",
    action: "View Track Order"
  },
  {
    id: 2,
    orderId: "ORD20240116001",
    bookingId: "BK20240116001",
    mobileNumber: "9876543210",
    createdDate: "2024-01-16T14:45:00Z",
    fromStationName: "Hyderabad Deccan",
    toStationName: "Secunderabad Junction",
    noOfTickets: 1,
    initiateTxnAmount: 60.00,
    transactionStatus: "SUCCESS",
    resultStatus: "SUCCESS",
    resultMessage: "Transaction completed successfully",
    action: "View Track Order"
  },
  {
    id: 3,
    orderId: "ORD20240117001",
    bookingId: "BK20240117001",
    mobileNumber: "9876543210",
    createdDate: "2024-01-17T09:15:00Z",
    fromStationName: "Lingampally",
    toStationName: "Secunderabad Junction",
    noOfTickets: 3,
    initiateTxnAmount: 180.00,
    transactionStatus: "FAILED",
    resultStatus: "FAILED",
    resultMessage: "Payment gateway timeout",
    action: "View Track Order"
  },
  {
    id: 4,
    orderId: "ORD20240118001",
    bookingId: "BK20240118001",
    mobileNumber: "9876543210",
    createdDate: "2024-01-18T16:20:00Z",
    fromStationName: "Secunderabad Junction",
    toStationName: "Lingampally",
    noOfTickets: 1,
    initiateTxnAmount: 60.00,
    transactionStatus: "SUCCESS",
    resultStatus: "SUCCESS",
    resultMessage: "Transaction completed successfully",
    action: "View Track Order"
  },
  {
    id: 5,
    orderId: "ORD20240119001",
    bookingId: "BK20240119001",
    mobileNumber: "9876543210",
    createdDate: "2024-01-19T11:30:00Z",
    fromStationName: "Hyderabad Deccan",
    toStationName: "Lingampally",
    noOfTickets: 2,
    initiateTxnAmount: 120.00,
    transactionStatus: "PENDING",
    resultStatus: "PENDING",
    resultMessage: "Payment processing",
    action: "View Track Order"
  },
];

const AmarabadUserDetailedReport = () => {
  const [searchParams] = useSearchParams();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const userReportSearchParams = localStorage.getItem("userAmrabadReportSearchParams");
  
  // State for dummy data
  const [dummyData, setDummyData] = useState(dummyAmrabadUserDetailedReports);
  const [isLoading, setIsLoading] = useState(false);

  const columnDefs =[
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
      field: "mobileNumber",
      headerName: "Order  ID",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
     {
      field: "mobileNumber",
      headerName: "User Name",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "fromStationName",
      headerName: "Package",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "toStationName",
      headerName: "House name ",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "noOfTickets",
      headerName: "Total Amount",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "initiateTxnAmount",
      headerName: "Ticket Status",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "transactionStatus",
      headerName: "Payment Status",
      maxWidth: "220",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>{params.value}</span>
      ),
    },
   
    {
      field: "orderId",
      headerName: "Mode of Payment",
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
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
            status: params.data.resultStatus,
            amount: params.data.initiateTxnAmount,
            bookingId: params.data.bookingId,
          }}
        >
          View Track Order
        </Link>
      ),
    },

  ]

  const loadUserReport = (page = 0) => {
    // Simulate API loading
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Filter data based on search parameters if needed
      let filteredData = [...dummyAmrabadUserDetailedReports];
      
      const mobileNumber = searchParams.get("mobileNumber");
      if (mobileNumber) {
        filteredData = filteredData.filter(item => 
          item.mobileNumber.includes(mobileNumber)
        );
      }
      
      // Simulate pagination
      const startIndex = page * PAGE_LIMIT;
      const endIndex = startIndex + PAGE_LIMIT;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setDummyData(paginatedData);
      setIsLoading(false);
    }, 500); // 500ms delay to simulate API call
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
      path: `/metro-user-report?${userReportSearchParams}`
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
                to={`/amrabad-user-report?${userReportSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <MetroUserDetailedReportForm pageNumber={1} pageSize={PAGE_LIMIT} setcurrentPage={setCurrentPage}  />
            <AgGridTable
              ExportName="UserDetailedReport"
              rowData={dummyData}
              columnDefs={columnDefs}
              isFetchLoading={isLoading}
              IsReactPaginate={true}
              isPagination={false}
              tableHeight={dummyData?.length > 10 ? 550 : 300}
              setPageLimit={setPAGE_LIMIT}
              showTotalCount={true}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              totalCount={dummyAmrabadUserDetailedReports.length}
              SetcurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AmarabadUserDetailedReport;
