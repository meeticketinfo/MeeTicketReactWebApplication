import React, { useEffect, useState } from "react";
import { getCurrentDate } from "../../utils/TypographyHelper";
import { Field, Form, Formik } from "formik";
import AgGridTable from "../../components/tables/AgGridTable";
import useDashboardDetailedStore from "../../store/dashboard/DashboardDetailedStore";
import { useDashboardStore } from "../../store/dashboard/dashboardStore";

const DashBoardDetailedReport = () => {
  const { setDetailedReportParams, detailedReport } =
    useDashboardDetailedStore();
  const {
    fetchAllDetailedReportFilters,
    AllDetailedReport,
    isFetchDetailedLoading,
  } = useDashboardStore();
  
  useEffect(() => {
    fetchAllDetailedReportFilters(detailedReport);
  }, []);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "facilityName",
      headerName: "facility Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "serviceName",
      headerName: "Sub Facility",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "serviceVariantName",
      headerName: "Ticket Type",

      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "N/A" : params.value,
    },
    {
      field: "quantity",
      headerName: "Ticket Quantity",
      maxWidth: "160",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "ticketPrice",
      headerName: "Each Ticket Price",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "userName",
      headerName: "User Mobile No",

      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        params.value ? (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) : (
          "N/A"
        ),
    },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },

    {
      field: "transactionId",
      headerName: "Transaction Id",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "modeOfPayment",
      headerName: "Mode Of Payment",
      Width: "100",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <>
          
          <span>{params.value}</span>
        </>
      ),
    },
  ]);

  return (
    <>
    
      <AgGridTable
           rowData={AllDetailedReport}
        columnDefs={columnDefs}
           isFetchLoading={isFetchDetailedLoading}
      />
    </>
  );
};

export default DashBoardDetailedReport;
