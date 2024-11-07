import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useServiceStore } from "../../store/masters/servicesStore";

const ServiceList = () => {
  const { allServices, isFetchAllServicesLoading, fetchAllServices } =
    useServiceStore();
  useEffect(() => {
    fetchAllServices();
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
      headerName: "Service Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "facilityId",
      headerName: "Facility",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "parkName",
      headerName: "Park Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "isActive",
      headerName: "Status",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value
               ? "bg-green-400 text-white shadow-md"
                : "bg-red-400 text-white shadow-md"
            } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
          >
            {" "}
            {params.value ? "Active" : "Inactive"}
          </span>
        </div>
      ),
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
      <AgGridTable
        isFetchLoading={isFetchAllServicesLoading}
        rowData={allServices}
        columnDefs={columnDefs}
      />
      {/* </DashboardCard07> */}
    </>
  );
};
export default ServiceList;
