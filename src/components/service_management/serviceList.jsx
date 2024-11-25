import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useServiceStore } from "../../store/masters/servicesStore";
import { LuClipboardEdit } from "react-icons/lu";
import Tippy from "@tippyjs/react";

const ServiceList = ({setIsServiceCreateVisible,setIsServiceEditVisible}) => {
  const { allServices, isFetchAllServicesLoading, fetchAllServices,setCurrentServiceEditDetails } =
    useServiceStore();
  useEffect(() => {
    fetchAllServices();
  }, []);
    
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "name",
      headerName: "Service Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "parkName",
      headerName: "Location Name",
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
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <Tippy
            content="Edit"
            placement="right"
            className=" text-white rounded-lg px-[1px] py-[1px] shadow-lg"
          >
            <button
              className="btn-edit"
              onClick={() => {
                setCurrentServiceEditDetails(params.data);
                setIsServiceCreateVisible(true);
                setIsServiceEditVisible(true);
              }}
            >
              <span className="">
                <LuClipboardEdit className="text-[24px] text-[#0C3770] " />
              </span>
            </button>
          </Tippy>
        </div>
      ),
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
