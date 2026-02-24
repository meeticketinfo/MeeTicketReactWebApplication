import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IntercityUserReportForm from "./IntercityUserReportForm";
import AdminLayout from "../../../../../layouts/AdminLayout";
import { getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import AgGridTable from "../../../../tables/AgGridTable";
import { useIntercityUserStore } from "../../../../../store/intercity/reports/IntercityUserReportStore";
import { ToastContainer } from "react-toastify";

const IntercityUserReport = () => {
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const {
    isIntercityUserReportsLoading,
    allIntercityUserReports,
    fetchIntercityUserReports,
  } = useIntercityUserStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  
  // Store current filter values to use during pagination
  const [currentFilters, setCurrentFilters] = useState(() => {
    // Try to get filters from localStorage first
    const savedFilters = localStorage.getItem("userIntercityReportSearchParams");
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        return {
          fromDate: parsedFilters.fromDate || fromDate,
          toDate: parsedFilters.toDate || toDate,
          MobileNumber: parsedFilters.MobileNumber || "",
        };
      } catch (error) {
        console.error("Error parsing saved filters:", error);
      }
    }
    
    // If no saved filters, use default values
    return {
      fromDate: fromDate,
      toDate: toDate,
      MobileNumber: "",
    };
  });
  const columnDefs = [
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "login_MobileNumber",
      // maxWidth: 120,
      flex: 1,
      headerName: "Mobile Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    // {
    //   field: "form_MobileNumber",
    //   // maxWidth: 120,
    //   flex: 1,
    //   headerName: "Form Mobile No.",
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value ?? "N/A",
    // },
    {
      field: "registrationDate",
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
      field: "action",
      headerName: "Actions",
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 hover:bg-blue-v2-hover text-white px-3 py-2 rounded-md"
          to="/intercity-user-detailed-report"
          onClick={() => {
            // Store the detailed report parameters in localStorage
            const detailedReportParams = {
              MobileNumber: currentFilters.MobileNumber || params.data.login_MobileNumber,
              fromDate: currentFilters.fromDate,
              toDate: currentFilters.toDate,
              destinationLocation: "",
              arrivalLocation: ""
            };
            localStorage.setItem("userIntercityDetailedReportSearchParams", JSON.stringify(detailedReportParams));
          }}
        >
          View Transaction
        </Link>
      ),
    },

  ]

  const loadUserReport = (page = 0) => {
    fetchIntercityUserReports({
      fromDate: currentFilters.fromDate,
      toDate: currentFilters.toDate,
      MobileNumber: currentFilters.MobileNumber,
      pageNumber: page + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  };

  useEffect(() => {
    loadUserReport(currentPage);
  }, [currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  // Function to update current filters when form is submitted
  const updateCurrentFilters = (filters) => {
    setCurrentFilters(filters);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto uppercase">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              User Report
            </h1>
          </div>
        </div>
        <IntercityUserReportForm 
          pageNumber={1} 
          pageSize={PAGE_LIMIT} 
          SetcurrentPage={setCurrentPage} 
          updateCurrentFilters={updateCurrentFilters}
        />
        <div>
          <ToastContainer/>
          <AgGridTable
            ExportName="IntercityUserReport"
            rowData={allIntercityUserReports}
            columnDefs={columnDefs}
            isFetchLoading={isIntercityUserReportsLoading}
            isPagination={false}
            tableHeight={allIntercityUserReports?.length > 10 ? 560 : 330}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            totalCount={allIntercityUserReports?.[0]?.totalCount}
            showTotalCount={true}
            SetcurrentPage={setCurrentPage}
            showSearch={false}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default IntercityUserReport;
