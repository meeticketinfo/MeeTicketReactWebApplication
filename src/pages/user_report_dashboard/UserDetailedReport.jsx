import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import UserDetailedReportList from "./UserDetailedReportList";
import { Navigate, useNavigate } from "react-router-dom";

function UserDetailedReport() {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              User Detailed Report
            </h1>
          </div>
          <div>
             <button
              onClick={() => navigate("/user-report")} 
              className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              Back
            </button>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        <UserDetailedReportList />
      </div>
    </AdminLayout>
  );
}

export default UserDetailedReport;
