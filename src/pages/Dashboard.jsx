import { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
// import FilterButton from "../components/DropdownFilter";
import Datepicker from "../components/Datepicker";
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard07 from "../partials/dashboard/DashboardCard07";
import { IoTicketSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaChildren } from "react-icons/fa6";
import { HiCurrencyRupee } from "react-icons/hi";
import AgGridTable from "../components/tables/AgGridTable";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dashboardCards = [
    {
      lableName: "Total Tickets",
      count: 2780,
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Adults",
      count: 480,
      percentageChange: 49,
      icon: FaPeopleGroup,
    },
    {
      lableName: "Children",
      count: 240,
      percentageChange: 49,
      icon: FaChildren,
    },
    {
      lableName: "Total Income",
      count: 82478,
      percentageChange: 49,
      icon: HiCurrencyRupee,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Datepicker built with flatpickr */}
                <Datepicker align="right" />
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {dashboardCards &&
                dashboardCards.map((card, index) => (
                  <DashboardCard01
                    key={index} // It's important to provide a key when rendering lists
                    lableName={card.lableName}
                    count={card.count}
                    percentageChange={card.percentageChange}
                    icon={card.icon}
                  />
                ))}
              <DashboardCard07 >
                <AgGridTable  />
              </DashboardCard07>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
