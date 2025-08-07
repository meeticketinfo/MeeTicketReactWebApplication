import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../utils/Helper";
import AmrabadUserReportForm from "./AmrabadUserReportForm";
import AdminLayout from "../../../../layouts/AdminLayout";
import AgGridTable from "../../../../components/tables/AgGridTable";

// Dummy JSON data for Amrabad User Reports
const dummyAmrabadUserReports = {
  data: [
    {
      id: 1,
      phoneNumber: "9876543210",
      createdDate: "2024-01-15T10:30:00Z",
      userName: "John Doe",
      email: "john.doe@example.com",
      status: "Active"
    },
    {
      id: 2,
      phoneNumber: "9876543211",
      createdDate: "2024-01-16T14:45:00Z",
      userName: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Active"
    },
    {
      id: 3,
      phoneNumber: "9876543212",
      createdDate: "2024-01-17T09:15:00Z",
      userName: "Mike Johnson",
      email: "mike.johnson@example.com",
      status: "Inactive"
    },
    {
      id: 4,
      phoneNumber: "9876543213",
      createdDate: "2024-01-18T16:20:00Z",
      userName: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      status: "Active"
    },
    {
      id: 5,
      phoneNumber: "9876543214",
      createdDate: "2024-01-19T11:30:00Z",
      userName: "David Brown",
      email: "david.brown@example.com",
      status: "Active"
    },
  ],
  totalCount: 5,
  success: true,
  message: "Data retrieved successfully"
};

const AmrabadUserReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);

  // State for dummy data
  const [dummyData, setDummyData] = useState(dummyAmrabadUserReports);
  const [isLoading, setIsLoading] = useState(false);

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "phoneNumber",
      // maxWidth: 120,
      flex: 1,
      headerName: "Mobile No.",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "createdDate",
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
          to={`/amrabad-user-detailed-report?mobileNumber=${
            params.data.phoneNumber
          }&fromDate=${searchParams.get("fromDate") || fromDate}&toDate=${
            searchParams.get("toDate") || toDate
          }`}
          onClick={() => {
            localStorage.setItem(
              "userAmrabadReportSearchParams",
              `mobileNumber=${
                searchParams.get("mobileNumber") ? params.data.phoneNumber : ""
              }&fromDate=${searchParams.get("fromDate") || fromDate}&toDate=${
                searchParams.get("toDate") || toDate
              }`
            );
          }}
        >
          View Transaction
        </Link>
      ),
    },
  ];

  const loadUserReport = (page = 0) => {
    // Simulate API loading
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Filter data based on search parameters if needed
      let filteredData = [...dummyAmrabadUserReports.data];
      
      const mobileNumber = searchParams.get("mobileNumber");
      if (mobileNumber) {
        filteredData = filteredData.filter(item => 
          item.phoneNumber.includes(mobileNumber)
        );
      }
      
      // Simulate pagination
      const startIndex = page * PAGE_LIMIT;
      const endIndex = startIndex + PAGE_LIMIT;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setDummyData({
        ...dummyAmrabadUserReports,
        data: paginatedData,
        totalCount: filteredData.length
      });
      
      setIsLoading(false);
    }, 500); // 500ms delay to simulate API call
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
        <AmrabadUserReportForm
          PageIndex={1}
          pageSize={PAGE_LIMIT}
          SetcurrentPage={setCurrentPage}
        />
        <div>
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={dummyData?.data}
            columnDefs={columnDefs}
            isFetchLoading={isLoading}
            isPagination={false}
            tableHeight={
              dummyData?.data?.length > 10 ? 560 : 330
            }
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            totalCount={dummyData?.totalCount}
            showTotalCount={true}
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AmrabadUserReport;
