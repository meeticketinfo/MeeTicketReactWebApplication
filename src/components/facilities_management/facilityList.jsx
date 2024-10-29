import React, { useState } from "react";
import DashboardCard07 from "../../partials/dashboard/DashboardCard07";
import AgGridTable from "../tables/AgGridTable";

const FacilityList = () => {
  const [rowData] = useState([
    {
      facilityName: "Community Park",
      type: "Outdoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "City Library",
      type: "Indoor",
      status: "Closed",
      availability: "N/A",
    },
    {
      facilityName: "Swimming Pool",
      type: "Outdoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Fitness Center",
      type: "Indoor",
      status: "Open",
      availability: "Limited",
    },
    {
      facilityName: "Basketball Court",
      type: "Outdoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Art Gallery",
      type: "Indoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Soccer Field",
      type: "Outdoor",
      status: "Closed",
      availability: "N/A",
    },
    {
      facilityName: "Dance Studio",
      type: "Indoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Tennis Court",
      type: "Outdoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Music Room",
      type: "Indoor",
      status: "Closed",
      availability: "N/A",
    },
    {
      facilityName: "Skate Park",
      type: "Outdoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Convention Center",
      type: "Indoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Playground",
      type: "Outdoor",
      status: "Open",
      availability: "Available",
    },
    {
      facilityName: "Gymnasium",
      type: "Indoor",
      status: "Open",
      availability: "Limited",
    },
    {
      facilityName: "Botanical Garden",
      type: "Outdoor",
      status: "Closed",
      availability: "N/A",
    },
    {
      facilityName: "Meeting Room",
      type: "Indoor",
      status: "Open",
      availability: "Available",
    },
  ]);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    { field: "type", headerName: "Type", flex: 1, headerClass: "text-blue-v2" },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "availability",
      headerName: "Availability",
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
export default FacilityList;
