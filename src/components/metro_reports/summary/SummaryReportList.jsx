import React, { useEffect, useState } from "react";
import { useSummaryReportStore } from "../../../store/metro_reports/summaryReportStore";
import useAuthStore from "../../../store/authStore";
import AgGridTable from "../../tables/AgGridTable";

function SummaryReportList() {
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const {
    allMetroSummaryReports,
    fetchAllMetroSummaryReport,
    isFetchAllMetroSummaryReportsLoading,
  } = useSummaryReportStore();

  useEffect(() => {
    fetchAllMetroSummaryReport();
  }, []);
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      // flex:1,
      headerClass: "text-blue-v2",
    },

    {
      field: "orderId",
      headerName: "Order Id",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "userId",
      headerName: "User Id",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentTransactionId",
      headerName: "Payment Transaction Id",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "initiateTxnAmount",
      headerName: "Transaction Amount",
      maxWidth: "160",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value}rs ` || "N/A",
    },
    {
      field: "fromStationId",
      headerName: "From Station Name",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "toStationId",
      headerName: "To Station Name",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    // {
    //   field: "ticketStatus",
    //   headerName: "Ticket Status",
    //   headerClass: "text-blue-v2",
    //   // valueFormatter: (params) => params.value || "N/A",
    //   cellRenderer: (params) => (
    //     <div style={{ display: "flex align-center", gap: "0.5rem" }}>
    //       <span
    //         className={`${
    //           params.value==="NEW"
    //             ? "bg-green-400 text-white shadow-md"
    //             :  params.value==="ENTRY_USED"
    //              ? "bg-green-400 text-white shadow-md"
    //              :  params.value==="EXIT_USED"
    //              ? "bg-green-400 text-white shadow-md"
    //              :  params.value==="REFUNDED"
    //              ? "bg-green-400 text-white shadow-md"
    //              :  params.value==="EXPIRED"
    //              ? "bg-green-400 text-white shadow-md"
    //              :  params.value==="CHANGE_DESTINATION"
    //              ? "bg-green-400 text-white shadow-md"
    //              :""

    //         } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
    //       >
    //         {" "}
    //         {params.value}
    //       </span>
    //     </div>
    //   ),
    // },

    {
      field: "ticketStatus",
      headerName: "Ticket Status",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        // Define status styles dynamically
        const statusStyles = {
          NEW: "bg-green-400 text-white shadow-md",
          ENTRY_USED: "bg-blue-400 text-white shadow-md",
          EXIT_USED: "bg-yellow-400 text-white shadow-md",
          REFUNDED: "bg-orange-400 text-white shadow-md",
          EXPIRED: "bg-red-400 text-white shadow-md",
          CHANGE_DESTINATION: "bg-purple-400 text-white shadow-md",
        };
    
        // Apply default fallback style if no match
        const styleClass =
          statusStyles[params.value] || "bg-gray-400 text-white shadow-md";
    
        return (
         
            <span
              className={`${styleClass} text-xs font-medium px-2.5 py-0.5 rounded`}
            >
              {params.value || "N/A"} {/* Default text if value is null */}
            </span>
         
        );
      },
    },
    

  

    {
      field: "patronPhoneNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "fromDate",
      headerName: "From Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "toDate",
      headerName: "To Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "utrNumber",
      headerName: "UTR Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  ]);
  return (
    <AgGridTable
      rowData={allMetroSummaryReports}
      columnDefs={columnDefs}
      isFetchLoading={isFetchAllMetroSummaryReportsLoading}
    />
  );
}

export default SummaryReportList;
