import React, { useState } from 'react'
import AgGridTable from '../../../../components/tables/AgGridTable';

const FacilityHolidayList = () => {
    const [columnDefs] = useState([
        {
          headerName: "S.No",
          valueGetter: "node.rowIndex + 1",
          width: 100,
          headerClass: "text-blue-v2",
        },
        {
          field: "holidayName",
          headerName: "Name",
          flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "holidayDate",
          headerName: "Date",
          flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) =>
            params.value ? formatToStandardDate(params.value) : "N/A",
        },
        {
            field: "Status",
            headerName: "status",
            flex: 1,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
          },
        {
          headerName: "Actions",
          field: "actions",
          cellRenderer: (params) =>
           {
              <div style={{ display: "flex align-center", gap: "0.5rem" }}>
                
                <l-tail-chase size="15" speed="1.75" color="red"></l-tail-chase>
              </div>
           },
          flex: 1,
          headerClass: "text-blue-v2",
        },
      ]);
  return (
    <>
     <AgGridTable
        ExportName="Holidays"
        // rowData={allHolidays}
        columnDefs={columnDefs}
      />
    </>
  )
}

export default FacilityHolidayList
