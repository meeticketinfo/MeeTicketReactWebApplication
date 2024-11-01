import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { useFacilityStore } from "../../store/masters/facilitiesStore";

const FacilityList = () => {
  const { allFacilities, fetchAllFacilities } = useFacilityStore();
  useEffect(() => {
    fetchAllFacilities();
  }, []);
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "name",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "parkName",
      headerName: "Park Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "openTime",
      headerName: "Open Time",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "closeTime",
      headerName: "Close Time",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      headerName: "Status",
      field: "isActive",
      flex: 1,
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
          >
            {" "}
            {params.value ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  ]);
  return (
    <>
      {/* <DashboardCard07> */}
      <AgGridTable rowData={allFacilities} columnDefs={columnDefs} />
      {/* </DashboardCard07> */}
    </>
  );
};
export default FacilityList;
