import React from "react";

const dashboardColumnDefs = [
  {
    headerName: "S.No",
    valueGetter: "node.rowIndex + 1",
    sortable: false,
    width: 100,
    headerClass: "bg-gray-50 text-gray-400",
  },
  {
    field: "date",
    headerName: "Date",
    sortable: true,
    flex: 1,
    headerClass: "bg-gray-50 text-gray-400",
  },
  {
    field: "bookings",
    headerName: "Total Bookings",
    sortable: true,
    flex: 1,
    headerClass: "bg-gray-50 text-gray-400",
  },
  {
    field: "Adults",
    headerName: "Adults",
    sortable: true,
    flex: 1,
    headerClass: "bg-gray-50 text-gray-400",
  },
  {
    field: "children",
    headerName: "Children",
    sortable: true,
    flex: 1,
    headerClass: "bg-gray-50 text-gray-400",
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    sortable: true,
    flex: 1,
    headerClass: "bg-gray-50 text-gray-400",
  },
  {
    headerName: "Actions",
    field: "actions",
    cellRendererFramework: (params) => {
      console.log("Rendering actions for row:", params.data);
      return (
        <span className="total-value-renderer">
          <button type="button">View</button>
        </span>
      );
    },
    headerClass: "bg-gray-50 text-gray-400",
    flex: 1,
  },
];

// Exporting the column definitions
export default dashboardColumnDefs;
