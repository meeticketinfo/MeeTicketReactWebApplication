import React from "react";

import AgGridTable from "../../../../components/tables/AgGridTable";

const DepartmentTable = ({AllDepartmentEntities,isFetchDepartmentEntitiesLoading}) => {
    const columnDefs = [
        {
          headerName: "S.No",
          valueGetter: (params) => {
            // Return empty string for total row, otherwise use row index + 1
            if (params.data?.parkName === "TOTAL") {
              return "";
            }
            return params.node.rowIndex + 1;
          },
          maxWidth: "100",
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "",
        },
        {
          field: "parkName",
          headerName: "Location",
          flex: 1,
          width: "330",
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "totalAmount",
          headerName: "Amount",
          flex: 1,
          width: "100",
          headerClass: "text-blue-v2",
          valueFormatter: (params) => `₹${params.value}` || "N/A",
        },
        {
          field: "totalBookings",
          headerName: " No. of bookings",
          flex: 1,
          width: "100",
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
    
        {
          field: "totalQuantity",
          headerName: "No. of tickets",
          flex: 1,
          width: "100",
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
      ];

    // Calculate total amount
    const totalAmount = AllDepartmentEntities?.reduce((sum, item) => {
        return sum + (item.totalAmount || 0);
    }, 0);

    // Create pinned bottom row data
    const pinnedBottomRowData = [
        {
            parkName: "TOTAL",
            totalAmount: totalAmount,
            totalBookings: AllDepartmentEntities?.reduce((sum, item) => sum + (item.totalBookings || 0), 0),
            totalQuantity: AllDepartmentEntities?.reduce((sum, item) => sum + (item.totalQuantity || 0), 0),
        }
    ];

  return (
    <div>
      <AgGridTable
        ExportName="Departments"
        rowData={AllDepartmentEntities || []}
        columnDefs={columnDefs}
        isFetchLoading={isFetchDepartmentEntitiesLoading}
        pinnedBottomRowData={pinnedBottomRowData}
      />
    </div>
  );
};

export default DepartmentTable;
