import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { ToastContainer } from "react-toastify";

const AmrabadDashboard = () => {
  return (
    <>
      <AdminLayout>
        <ToastContainer position="top-right" autoClose={3000} />{" "}
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Packages
              </h1>
            </div>

            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
          </div>
          {/* <SummaryReportList /> */}
        </div>
      </AdminLayout>
    </>
  );
};

export default AmrabadDashboard;
