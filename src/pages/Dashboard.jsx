import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterButton from "../components/DropdownFilter";
import Datepicker from "../components/Datepicker";
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard07 from "../partials/dashboard/DashboardCard07";
import { IoTicketSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaChildren } from "react-icons/fa6";
import { HiCurrencyRupee } from "react-icons/hi";
import AgGridTable from "../components/tables/AgGridTable";
import { FaIndianRupeeSign } from "react-icons/fa6";

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
      icon: FaIndianRupeeSign,
    },
  ];
  const [rowData] = useState([
    {
      date: "2024-10-27",
      bookings: 15,
      Adults: 25,
      children: 10,
      totalAmount: 1500,
    },
    {
      date: "2024-10-26",
      bookings: 20,
      Adults: 35,
      children: 12,
      totalAmount: 2000,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    // Add more rows as needed
  ]);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      sortable: false,
      // filter: false,
      width: 100,
      headerClass: "bg-gray-50 text-gray-400",
    },
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      // filter: true,
      flex: 1,
      headerClass: "bg-gray-50 text-gray-400",
    },
    {
      field: "bookings",
      headerName: "Total Bookings",
      sortable: true,
      // filter: true,
      flex: 1,
      headerClass: "bg-gray-50 text-gray-400",
    },
    {
      field: "Adults",
      headerName: "Adults",
      sortable: true,
      // filter: true,
      flex: 1,
      headerClass: "bg-gray-50 text-gray-400",
    },
    {
      field: "children",
      headerName: "Children",
      sortable: true,
      // filter: true,
      flex: 1,
      headerClass: "bg-gray-50 text-gray-400",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      sortable: true,
      // filter: true,
      flex: 1,
      headerClass: "bg-gray-50 text-gray-400",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <span className="total-value-renderer">
          <span></span>
          <button type="button" className="">view</button>
        </span>
      ),
      headerClass: "bg-gray-50 text-gray-400",
      flex: 1,
    },
  ]);

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
              <DashboardCard07>
                <AgGridTable rowData={rowData} columnDefs={columnDefs} />
              </DashboardCard07>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
