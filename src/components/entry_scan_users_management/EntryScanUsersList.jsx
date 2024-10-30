import React, { useState } from "react"
import AgGridTable from "../tables/AgGridTable"

const EntryScanUserList = () => {
    const [rowData] = useState([
        { name: "John Doe", entryTime: "09:00 AM", exitTime: "05:00 PM", status: "Checked Out" },
        { name: "Jane Smith", entryTime: "09:15 AM", exitTime: "05:10 PM", status: "Checked Out" },
        { name: "Alice Johnson", entryTime: "08:50 AM", exitTime: "05:00 PM", status: "Checked Out" },
        { name: "Robert Brown", entryTime: "09:30 AM", exitTime: "04:45 PM", status: "Checked Out" },
        { name: "Emily White", entryTime: "09:05 AM", exitTime: "05:15 PM", status: "Checked Out" },
        { name: "Michael Green", entryTime: "09:20 AM", exitTime: "05:05 PM", status: "Checked Out" },
        { name: "Laura Black", entryTime: "09:00 AM", exitTime: "05:20 PM", status: "Checked Out" },
        { name: "James Wilson", entryTime: "08:45 AM", exitTime: "04:50 PM", status: "Checked Out" },
        { name: "Sophia Taylor", entryTime: "09:25 AM", exitTime: "05:00 PM", status: "Checked Out" },
        { name: "Liam Martinez", entryTime: "09:10 AM", exitTime: "04:55 PM", status: "Checked Out" },
        { name: "Olivia Thomas", entryTime: "09:00 AM", exitTime: "05:10 PM", status: "Checked Out" },
        { name: "William Scott", entryTime: "09:35 AM", exitTime: "04:40 PM", status: "Checked Out" },
        { name: "Ava Moore", entryTime: "09:15 AM", exitTime: "05:05 PM", status: "Checked Out" },
        { name: "Noah Lee", entryTime: "08:50 AM", exitTime: "04:55 PM", status: "Checked Out" },
        { name: "Emma Harris", entryTime: "09:05 AM", exitTime: "05:20 PM", status: "Checked Out" }
      ]
    )
    const [columnDefs] = useState([
        {
          headerName: "S.No",
          valueGetter: "node.rowIndex + 1",
          width: 100,
          headerClass: "text-blue-v2",
        },
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          headerClass: "text-blue-v2",
        },
        {
          field: "entryTime",
          headerName: "Entry Time",
          flex: 1,
          headerClass: "text-blue-v2",
        },
        {
          field: "exitTime",
          headerName: "Exit Time",
          flex: 1,
          headerClass: "text-blue-v2",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            headerClass: "text-blue-v2",
          },
        {
          headerName: "Actions",
          field: "actions",
          cellRenderer: () => <button>View</button>,
          flex: 1,
          headerClass: "text-blue-v2",
        },
      ]);
      return (
        <>
          {/* <DashboardCard07> */}
            <AgGridTable rowData={rowData} columnDefs={columnDefs} />
          {/* </DashboardCard07> */}    
        </>
      );
    };
    export default EntryScanUserList;
