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
import { FaIndianRupeeSign } from "react-icons/fa6";
import dashboardColumnDefs from "../config/agGrid/dashboardColumnDefs";
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
  const dashboardColumnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      sortable: false,
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "bookings",
      headerName: "Total Bookings",
      sortable: true,
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "Adults",
      headerName: "Adults",
      sortable: true,
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "children",
      headerName: "Children",
      sortable: true,
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      sortable: true,
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: () => <button>View</button>,
      headerClass: "text-blue-v2",
      flex: 1,
    },
  ];
  const [rowData] = useState([
    {
      date: "2024-10-01",
      bookings: 5,
      Adults: 10,
      children: 2,
      totalAmount: 800,
    },
    {
      date: "2024-10-02",
      bookings: 8,
      Adults: 12,
      children: 3,
      totalAmount: 950,
    },
    {
      date: "2024-10-03",
      bookings: 12,
      Adults: 20,
      children: 4,
      totalAmount: 1500,
    },
    {
      date: "2024-10-04",
      bookings: 7,
      Adults: 14,
      children: 6,
      totalAmount: 1100,
    },
    {
      date: "2024-10-05",
      bookings: 3,
      Adults: 6,
      children: 1,
      totalAmount: 400,
    },
    {
      date: "2024-10-06",
      bookings: 15,
      Adults: 30,
      children: 8,
      totalAmount: 2500,
    },
    {
      date: "2024-10-07",
      bookings: 4,
      Adults: 8,
      children: 2,
      totalAmount: 600,
    },
    {
      date: "2024-10-08",
      bookings: 9,
      Adults: 15,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-09",
      bookings: 6,
      Adults: 11,
      children: 3,
      totalAmount: 700,
    },
    {
      date: "2024-10-10",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1400,
    },
    {
      date: "2024-10-11",
      bookings: 13,
      Adults: 25,
      children: 7,
      totalAmount: 1900,
    },
    {
      date: "2024-10-12",
      bookings: 11,
      Adults: 22,
      children: 4,
      totalAmount: 1650,
    },
    {
      date: "2024-10-13",
      bookings: 2,
      Adults: 5,
      children: 0,
      totalAmount: 250,
    },
    {
      date: "2024-10-14",
      bookings: 16,
      Adults: 32,
      children: 10,
      totalAmount: 3000,
    },
    {
      date: "2024-10-15",
      bookings: 5,
      Adults: 10,
      children: 2,
      totalAmount: 800,
    },
    {
      date: "2024-10-16",
      bookings: 9,
      Adults: 16,
      children: 4,
      totalAmount: 1300,
    },
    {
      date: "2024-10-17",
      bookings: 14,
      Adults: 28,
      children: 5,
      totalAmount: 2000,
    },
    {
      date: "2024-10-18",
      bookings: 7,
      Adults: 14,
      children: 3,
      totalAmount: 950,
    },
    {
      date: "2024-10-19",
      bookings: 3,
      Adults: 6,
      children: 1,
      totalAmount: 400,
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
                <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Datepicker built with flatpickr */}
                {/* <Datepicker align="right" /> */}
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
                <AgGridTable
                  rowData={rowData}
                  columnDefs={dashboardColumnDefs}
                />
              </DashboardCard07>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
