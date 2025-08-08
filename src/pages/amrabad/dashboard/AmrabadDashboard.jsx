import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import DashboardCard01 from "../../../partials/dashboard/DashboardCard01";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import DashboardCard07 from "../../../partials/dashboard/DashboardCard07";
import ToursimPieChart from "../../../components/tourism/ToursimPieChart";
import { usetoursimDashboardStore } from "../../../store/dashboard/toursimDashboardStore";
import AmrabadPieChart from "./AmrabadPieChart";
import { useAmrabadConsolidatedStore } from "../../../store/amrabad/reports/ConsolidatedStore";
import MunnanurTigerReserveDashboard from "./MunnanurTigerReserveDashboard";
import GraphicalRepresentationDashboard from "./GraphicalRepresentationDashboard";
import CountUp from "react-countup";

function AmrabadDashboard() {
  const {
    fetchAmrabadConsolidatedReports,
    allAmrabadConsolidatedReports,
    setisAmrabadCompleteBookings,
    isAmrabadConsolidatedReportsLoading,
  } = useAmrabadConsolidatedStore();

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initial form values
  const initialValues = {
    fromDate: "",
    toDate: "",
  };

  // Form submission handler
  const onSubmit = (values) => {
    console.log("Form submitted with values:", values);
    // Add your form submission logic here
  };

  console.log("allPackageTransactionReportData");
  const packageData = [
    {
      packageTypeId: 0,
      packageTypeName: "Mahabubabad",
      totalBookings: 2,
      totalAmount: 2000,
    },
    {
      packageTypeId: 1,
      packageTypeName: "munnanur jungle resort, the Tiger Stay Package",
      totalBookings: 1,
      totalAmount: 1000,
    },
    {
      packageTypeId: 2,
      packageTypeName: "Domalapenta Akkamaha Devi stay package",
      totalBookings: 4,
      totalAmount: 4000,
    },
    {
      packageTypeId: 7,
      packageTypeName: "Srisailam",
      totalBookings: 1,
      totalAmount: 1000,
    },
    {
      packageTypeId: 7,
      packageTypeName: "Domalapenta Resorts",
      totalBookings: 2,
      totalAmount: 2000,
    },
  ];

  const dashboardCards = [
    {
      lableName: "Total Bookings Count",
      count: 10,
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Amount Received",
      count: 10000,
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const cardsToDisplay = dashboardCards;

  return (
    <>
      {/* Cards */}
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
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
                  // min={getCurrentDate()}
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
                  min={values.fromDate || getCurrentDate()}
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
        {cardsToDisplay &&
          cardsToDisplay.map((card, index) => (
            <div
              key={index}
              className="bg-[#EFF6FF] rounded-xl p-3 shadow-sm relative transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
              <div className="text-md sm:text-2xl md:text-xl font-bold text-gray-700 leading-tight">
                  {card.lableName === "Total Amount Received" ? (
                    <CountUp
                      end={card.count}
                      duration={2}
                      prefix="₹"
                      separator=","
                    />
                  ) : (
                    <CountUp
                      end={card.count}
                      duration={2}
                      prefix=""
                      separator=","
                    />
                  )}
                </div>
                <div className="w-8 h-8 bg-[#D9DEF7] rounded-lg flex items-center justify-center">
                  <card.icon className="text-blue-600 text-lg" />
                </div>
               
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                {card.lableName}
              </div>
            </div>
          ))}
      </div>
      {/* Munnanur Tiger Reserve Package Dashboard */}
      <div className="mt-4">
        <MunnanurTigerReserveDashboard />
      </div>

      {/* Graphical Representation Dashboard */}
      <div>
        <GraphicalRepresentationDashboard />
      </div>
    </>
  );
}

export default AmrabadDashboard;
