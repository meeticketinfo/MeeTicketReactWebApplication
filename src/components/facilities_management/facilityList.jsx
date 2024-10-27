import React, { useState } from "react";
import DashboardCard07 from "../../partials/dashboard/DashboardCard07";
import AgGridTable from "../tables/AgGridTable";

const FacilityList = () => {
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
          <button type="button" className="">
            view
          </button>
        </span>
      ),
      headerClass: "bg-gray-50 text-gray-400",
      flex: 1,
    },
  ]);
  return (
    <>
      <DashboardCard07>
        <AgGridTable rowData={rowData} columnDefs={columnDefs} />
      </DashboardCard07>
    </>
  );
};
export default FacilityList;
