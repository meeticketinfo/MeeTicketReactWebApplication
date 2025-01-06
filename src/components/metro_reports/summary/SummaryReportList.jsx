import React, { useEffect, useState } from 'react'
import { useSummaryReportStore } from '../../../store/metro_reports/summaryReportStore';
import useAuthStore from '../../../store/authStore';
import AgGridTable from '../../tables/AgGridTable';

function SummaryReportList() {
    const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
  useAuthStore();
  const { allMetroSummaryReports,fetchAllMetroSummaryReport } =
  useSummaryReportStore();

useEffect(()=>{
  fetchAllMetroSummaryReport()
},[])
const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    
    {
      field: "id",
      headerName: "Transaction Id",
    //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
    //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "totalTransactionAmount",
      headerName: "Total Transaction Amount",
    //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "settlementAmount",
      headerName: "Settlement Amount",
    //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "adjustment",
      headerName: "Adjustment",
    //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
        field: "netSettlementAmount",
        headerName: "Net Settlement Amount",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "from",
        headerName: "From Date",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "till",
        headerName: "Till Date",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "status",
        headerName: "Status",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "utrNo",
        headerName: "UTR No",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "settlementDate",
        headerName: "Settlement Date",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "settlementType",
        headerName: "Settlement Type",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "settlementCharge",
        headerName: "Settlement Charge",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "settlementTax",
        headerName: "Settlement Tax",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "remarks",
        headerName: "Remarks",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
  ]);
  return (
    <AgGridTable rowData={allMetroSummaryReports} columnDefs={columnDefs} />
  )
}

export default SummaryReportList
