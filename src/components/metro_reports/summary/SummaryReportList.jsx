import React, { useEffect } from 'react'
import { useSummaryReportStore } from '../../../store/metro_reports/summaryReportStore';
import useAuthStore from '../../../store/authStore';

function SummaryReportList() {
    const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
  useAuthStore();
  const { allMetroSummaryReports,fetchAllMetroSummaryReport } =
  useSummaryReportStore();
const role = roleDetails?.name;
console.log("allMetroSummaryReports",allMetroSummaryReports)
useEffect(()=>{
  fetchAllMetroSummaryReport()
},[])
  return (
    <div>
      
    </div>
  )
}

export default SummaryReportList
