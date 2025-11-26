import React, { useEffect, useState } from "react";
import AmrabadPosReportForm from "./AmrabadPosReportForm";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { useAmrabadPosStore } from "./AmrabadPosStore";
// import { getCurrentDate } from "../../../../utils/TypographyHelper";

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getCurrentDateAtMidnight = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00`;
};

const AmrabadPosReportList = () => {
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-pos-report-filters")
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const {
    fetchAmrabadPosReportData,
    AmrabadPosReportData,
    isFetchAmrabadPosReportData
  } = useAmrabadPosStore();
  // console.log("AmrabadPosReportData", AmrabadPosReportData);
  useEffect(() => {
    fetchAmrabadPosReportData({
      fromDate: savedFilters?.fromDate ?? getCurrentDateAtMidnight(),
      toDate: savedFilters?.toDate ?? getCurrentDate(),
      adminMobileNumber: savedFilters?.adminMobileNumber
        ? savedFilters.adminMobileNumber
        : "",
      userName: savedFilters?.userName
        ? savedFilters.userName
        : "",
      userMobileNumber: savedFilters?.userMobileNumber
        ? savedFilters.userMobileNumber
        : "",
      paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
      vehicleNumber: savedFilters?.vehicleNumber
        ? savedFilters.vehicleNumber
        : "",
      transactionStatus: savedFilters?.transactionStatus
        ? savedFilters.transactionStatus
        : "",
      ticketType: savedFilters?.ticketType ? savedFilters.ticketType : "",
      pageNumber: currentPage + 1,
      PageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

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
      field: "posTransactionID",
      headerName: "POS Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "transactionDateTime",
      headerName: "Transaction Date & Time",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    // ------------------

    {
      field: "posMachineID",
      headerName: "POS Machine ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "viewPointNames",
      headerName: "View Point Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    
    {
      field: "location",
      headerName: "Location",
      maxWidth: 120,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "adminLoginMobile",
      headerName: "Admin/Operator Login Mobile number",

      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "ticketType",
      headerName: "Ticket Type",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "ticketNumber",
      headerName: "Ticket Number(Booking Reference ID)",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // -------------------

    {
      field: "totalAmount",
      headerName: "Total Amount",
      // flex: 1,
      maxWidth: 130,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },

    {
      field: "paymentMethod",
      headerName: "Payment Method",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "customerVehicleNumber",
      headerName: "Customer Vehicle Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "customerMobileNumber",
      headerName: "Customer Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
  ];
  return (
    <div>
      <AmrabadPosReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <AgGridTable
        ExportName="POS Report"
        rowData={AmrabadPosReportData}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAmrabadPosReportData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={AmrabadPosReportData[0]?.totalCount}
        tableHeight={AmrabadPosReportData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </div>
  );
};

export default AmrabadPosReportList;
