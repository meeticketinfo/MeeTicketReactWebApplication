import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable from "../../../components/tables/AgGridTable";
import { formatToStandardDate, getCurrentDate } from "../../../utils/TypographyHelper";
import IntercityConsolidatedReportForm from "../../../components/rtc/rtc_reports/intercity_reports/intercity_consolidated_report/IntercityConsolidatedReportForm";
import { useIntercityConsolidateStore } from "../../../components/rtc/rtc_reports/intercity_reports/intercity_consolidated_report/IntercityConsolidateStore";
import WalkersPassReportForm from "./WalkersPassReportForm";
import { useWalkersPassReportStore } from "./WalkersPassReportStore";

// Status cell renderer component
const StatusCellRenderer = (params) => {
  if (!params.value) return "N/A";
  
  const status = params.value.toLowerCase();
  const colorClass = status === 'confirmed' ? 'text-green-600' : status === 'expired' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <span className={`${colorClass} font-medium`}>
      {params.value}
    </span>
  );
};
function WalkersPassReportList() {
  const savedFilters = JSON.parse(
    localStorage.getItem("walkers-pass-report-filters") || "{}"
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const {
    fetchWalkersPassReportData,
    WalkersPassReportData, 
    isFetchWalkersPassReportData,
  } = useWalkersPassReportStore();
  useEffect(() => {
    fetchWalkersPassReportData({
      fromDate: savedFilters?.fromDate ?? getCurrentDate(),
      toDate: savedFilters?.toDate ?? getCurrentDate(),
      passTypeId: savedFilters?.passTypeId ?? "",
      subFacilityId: savedFilters?.subFacilityId ?? "",
      locationId: savedFilters?.locationId ?? "",
      pageNumber: currentPage + 1,
      PageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT, fetchWalkersPassReportData]);

  const columnDefs = [
    {
      field: "sno",
      headerName: "S.No",
      maxWidth: 70,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "userName",
      headerName: "User Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "facilityName",
      headerName: "Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "subFacilityName",
      headerName: "Sub Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "passType",
      headerName: "Pass Type",
      maxWidth: 140,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    // -------------------

    {
      field: "validityStartDate",
      headerName: "Validity Start Date",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "validityEndDate",
      headerName: "Validity End Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "passAmount",
      headerName: "Pass Amount",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        return `₹${params.value}`;
      },
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: 180,
      // flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "passType",
      headerName: "Pass Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mode",
      headerName: "Mode",
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
   
  ];
  return (
    <div>
      <WalkersPassReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <AgGridTable
        ExportName="Walkers Pass Report"
        rowData={WalkersPassReportData}
        columnDefs={columnDefs}
        isFetchLoading={isFetchWalkersPassReportData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={WalkersPassReportData[0]?.totalRecords}
        tableHeight={WalkersPassReportData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </div>
  );
}

export default WalkersPassReportList;
