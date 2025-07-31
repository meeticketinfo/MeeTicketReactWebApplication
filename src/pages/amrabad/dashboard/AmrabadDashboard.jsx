import React, { useEffect, useState } from "react";
import DashboardCard01 from "../../../partials/dashboard/DashboardCard01";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import DashboardCard07 from "../../../partials/dashboard/DashboardCard07";
import ToursimPieChart from "../../../components/tourism/ToursimPieChart";
import { usetoursimDashboardStore } from "../../../store/dashboard/toursimDashboardStore";
import AmrabadPieChart from "./AmrabadPieChart";
import { useAmrabadConsolidatedStore } from "../../../store/amrabad/reports/ConsolidatedStore";

function AmrabadDashboard() {

  const {
    fetchAmrabadConsolidatedReports,
    allAmrabadConsolidatedReports,
    setisAmrabadCompleteBookings,
    isAmrabadConsolidatedReportsLoading,
  } = useAmrabadConsolidatedStore();
  console.log(
    "allPackageTransactionReportData",
  );
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
      lableName: "Total Tickets",
      count: 10,
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Income",
      count: 10000,
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const cardsToDisplay = dashboardCards;

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-12 gap-6  ">
        {cardsToDisplay &&
          cardsToDisplay.map((card, index) => (
            <DashboardCard01
              key={index} // It's important to provide a key when rendering lists
              lableName={card.lableName}
              count={card.count}
              percentageChange={card.percentageChange}
              icon={card.icon}
            />
          ))}
        {/* pie chart */}
        <DashboardCard07>
          <div className="flex">
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <AmrabadPieChart
                data={packageData}
                title="Total Tickets Booked Based on Package services "
                angleKey="totalBookings"
              />
            </div>
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <AmrabadPieChart
                data={packageData}
                title="Total Amount Generated Based on Package services "
                angleKey="totalAmount"
              />
            </div>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default AmrabadDashboard;
