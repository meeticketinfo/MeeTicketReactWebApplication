import  { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AgGridTable = () => {
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
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
    {
      date: "2024-10-25",
      bookings: 10,
      Adults: 18,
      children: 5,
      totalAmount: 1200,
    },
  ]);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      sortable: false,
      filter: false,
      width: 100,
    },
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "bookings",
      headerName: "Total Bookings",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "Adults",
      headerName: "Adults",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "children",
      headerName: "Children",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ]);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10} // Set the default page size
        paginationPageSizeOptions={[10, 20, 50]} // Options available for page size
      />
    </div>
  );
};

export default AgGridTable;
