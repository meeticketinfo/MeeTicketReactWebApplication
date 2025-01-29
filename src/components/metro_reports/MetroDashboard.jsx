import React, { useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard01 from "../../partials/dashboard/DashboardCard01";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useDashboardStore } from "../../store/dashboard/dashboardStore";
import useAuthStore from "../../store/authStore";

function MetroDashboard() {
  const { fetchAllDashboardCounts, allCounts } = useDashboardStore();
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();

  useEffect(() => {
    fetchAllDashboardCounts(roleDetails);
  }, []);
  const dashboardCards = [
    {
      lableName: "Total Tickets",
      count: allCounts.data?.totalTicketCount || "0",
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Income",
      // count: allCounts?.totalAmount,
      count: allCounts.data?.totalAmount || "0",
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const cardsToDisplay = dashboardCards;
  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-8 gap-6  ">
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
      </div>
    </>
  );
}

export default MetroDashboard;
