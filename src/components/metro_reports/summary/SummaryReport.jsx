import React, { useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import useAuthStore from "../../../store/authStore";
import { useSummaryReportStore } from "../../../store/metro_reports/summaryReportStore";
import SummaryReportList from "./SummaryReportList";

function SummaryReport() {
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Individual Ticket Details
            </h1>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        <SummaryReportList />
      </div>
    </AdminLayout>
  );
}

export default SummaryReport;
