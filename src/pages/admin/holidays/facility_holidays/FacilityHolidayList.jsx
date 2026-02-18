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
      field: "Facility",
      headerName: "facilityName",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "listofAvailableDays",
      headerName: "listofBlockedDays",
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          {
            params.listofBlockedDays.map((p) => {
              <div>
                <p>{p}</p>
              </div>
            })
          }

        </div>
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>

          <button onClick={()=>{
            
          }}>Edit</button>
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
