import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import RefundDashboardReport from "./RefundDashboardReport";

const MainRefundDashboard = () => {
  const [range, setRange] = useState("today");
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0 ">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Refund Reports
              </h1>
            </div>
            <div className="flex rounded-lg  border border-gray-300">
              <button
                className={` ${
                  range === "today"
                    ? "bg-blue-v2 text-white"
                    : "bg-white text-blue-v2"
                } transition-transform duration-300 ease-in-out  px-3 py-1 rounded-l-md `}
                onClick={() => {
                  setRange("today");
                }}
              >
                Today
              </button>
              <button
                className={`${
                  range === "week"
                    ? "bg-blue-v2 text-white"
                    : "bg-white text-blue-v2"
                } transition-all duration-300 ease-in-out px-3 py-1 border-x border-gray-300`}
                onClick={() => {
                  setRange("week");
                }}
              >
                Week
              </button>
              <button
                className={`${
                  range === "month"
                    ? "bg-blue-v2 text-white"
                    : "bg-white text-blue-v2"
                } transition-all duration-300 ease-in-out px-3 py-1 border-r border-gray-300`}
                onClick={() => {
                  setRange("month");
                }}
              >
                Month
              </button>
              <button
                className={` ${
                  range === "year"
                    ? "bg-blue-v2 text-white"
                    : "bg-white text-blue-v2"
                } transition-all duration-300 ease-in-out  px-3 py-1 rounded-r-md `}
                onClick={() => {
                  setRange("year");
                }}
              >
                Year
              </button>
            </div>
          </div>
          <div>
            <RefundDashboardReport range={range} setRange={setRange} />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default MainRefundDashboard;
