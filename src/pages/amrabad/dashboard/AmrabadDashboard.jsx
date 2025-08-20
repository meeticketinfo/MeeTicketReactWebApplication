import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useAmrabadDashboardStore } from "./store/amarabadDashboardStore";
import MunnanurTigerReserveDashboard from "./AmarabadPckagesNames";
import GraphicalRepresentationDashboard from "./GraphicalRepresentationDashboard";
import CountUp from "react-countup";
import AmarabadPckagesNames from "./AmarabadPckagesNames";

function AmrabadDashboard() {
  const {
    amrabadDashboardData,
    fetchAmrabadDashboardData,
    fetchAmrabadDashboardBookingsSummaryData,
  } = useAmrabadDashboardStore();

  const initialValues = {
    fromDate: "",
    toDate: "",
  };
  useEffect(() => {
    fetchAmrabadDashboardData(initialValues);
    fetchAmrabadDashboardBookingsSummaryData(initialValues);
  }, []);
  const onSubmit = (values) => {
    fetchAmrabadDashboardData(values);
    fetchAmrabadDashboardBookingsSummaryData(values);
  };
  return (
    <>
      {/* Cards */}
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <>
            <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-xs font-medium text-gray-700"
                >
                  From Date
                </label>
                <Field
                  type="date"
                  name="fromDate"
                  className={`mt-1 block w-full px-2 py-1 border
                    border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  onChange={(e) => {
                    const fromDateValue = e.target.value;
                    setFieldValue("fromDate", fromDateValue);
                    if (new Date(fromDateValue) > new Date(values.toDate)) {
                      // Automatically update toDate if it's earlier than fromDate
                      setFieldValue("toDate", fromDateValue);
                    }
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="toDate"
                  className="block text-xs font-medium text-gray-700"
                >
                  To Date
                </label>
                <Field
                  type="date"
                  name="toDate"
                  className={`mt-1 block w-full px-2 py-1 border
                       border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  min={values.fromDate}
                  onChange={(e) => {
                    const toDateValue = e.target.value;
                    setFieldValue("toDate", toDateValue);
                  }}
                />
              </div>

              {/* submit */}
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  // disabled={isFetchAllMetroSummaryReportsLoading}
                >
                  Search
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <h3 className="text-xl text-gray-800 mt-2">Packages Summary Count</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0 mt-2">
        {/* Total Bookings Card */}
        <div className="bg-[#EFF6FF] rounded-xl p-3 shadow-sm relative transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-md sm:text-2xl md:text-xl font-bold text-gray-700 leading-tight">
              <CountUp
                end={amrabadDashboardData.totalBookings || 0}
                duration={2}
                prefix=""
                separator=","
              />
            </div>
            <div className="w-8 h-8 bg-[#D9DEF7] rounded-lg flex items-center justify-center">
              <IoTicketSharp className="text-blue-600 text-lg" />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            Total Bookings
          </div>
        </div>

        <div className="bg-[#EFF6FF] rounded-xl p-3 shadow-sm relative transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-md sm:text-2xl md:text-xl font-bold text-gray-700 leading-tight">
              <CountUp
                end={amrabadDashboardData.totalTicketCount || 0}
                duration={2}
                prefix=""
                separator=","
              />
            </div>
            <div className="w-8 h-8 bg-[#D9DEF7] rounded-lg flex items-center justify-center">
              <IoTicketSharp className="text-blue-600 text-lg" />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            Total Tickets
          </div>
        </div>
        {/* Total Amount Card */}
        <div className="bg-[#EFF6FF] rounded-xl p-3 shadow-sm relative transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-md sm:text-2xl md:text-xl font-bold text-gray-700 leading-tight">
              <CountUp
                end={amrabadDashboardData.totalAmount || 0}
                duration={2}
                prefix="₹"
                separator=","
              />
            </div>
            <div className="w-8 h-8 bg-[#D9DEF7] rounded-lg flex items-center justify-center">
              <FaIndianRupeeSign className="text-blue-600 text-lg" />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            Total Amount
          </div>
        </div>
      </div>
      {/* Munnanur Tiger Reserve Package Dashboard */}
      <div className="mt-4">
        <AmarabadPckagesNames />
      </div>

      {/* Graphical Representation Dashboard */}
      <div>
        <GraphicalRepresentationDashboard />
      </div>
    </>
  );
}

export default AmrabadDashboard;
