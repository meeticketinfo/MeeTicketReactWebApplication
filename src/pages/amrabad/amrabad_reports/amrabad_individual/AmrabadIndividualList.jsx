import { useEffect, useState } from "react";
import AgGridTable from "../../../../components/tables/AgGridTable";
import {
  formatToCurrency,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import { useDashboardStore } from "../../../../store/dashboard/dashboardStore";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import AmrabadIndividualForm from "./AmrabadIndividualForm";

export default function AdminBookings() {
  const {
    isFetchEntityBookingsLoading,
  } = useDashboardStore();
  const {
    fetchAmrabadIndividualReports,
    allAmrabadIndividualReports,
  } = useAmrabadConsolidatedStore();

  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-individual-report-filters")
  );
  const [currentPage, setCurrentPage] = useState(0);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  useEffect(() => {
    fetchAmrabadIndividualReports({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

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
      field: "bookingID",
      headerName: "Transaction Id",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNo",
      headerName: "User Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "parkName",
      headerName: "Location Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "locationCategoryName",
      headerName: "Location category",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "packageName",
      headerName: "Package",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "roomName",
      headerName: "House",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "noofDays",
      headerName: "Quantity",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "individualAmount",
      headerName: "Amount(Per Ticket)",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "totalAmount",
      headerName: "Total Tickets Amount",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "paymentMode",
      headerName: "Mode of Payment",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            to={`/entity-bookings/view-details/${params.data?.bookingId}`}
            className="bg-gray-100 text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-100 transition"
          >
            <span className="text-blue-v2">View Bookings</span>
          </NavLink>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <div>
      <div className="mb-8">
        <div>
          <AmrabadIndividualForm
            PageIndex={1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
          />
        </div>

        <AgGridTable
          ExportName="Individual Booking Details"
          rowData={allAmrabadIndividualReports || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchEntityBookingsLoading}
          isPagination={false}
          tableHeight={
            allAmrabadIndividualReports?.data?.length > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={allAmrabadIndividualReports[0]?.totalCount}
          showTotalCount={true}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
        />
      </div>
    </div>
  );
}
