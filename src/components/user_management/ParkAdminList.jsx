import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { gateKeepersStore } from "../../store/masters/gateKeepersStore";
import { formatToStandardDate } from "../../utils/TypographyHelper";
import { useParkAdminStore } from "../../store/masters/parkAdminStore";
import { useUsersStore } from "../../store/masters/usersStore";
import { useNodalOfficerStore } from "../../store/masters/nodalOfficerStore";

const ParkAdminList = ({ setIsUserCreateVisible, setIsUserEditVisible }) => {
  const { setCurrentUserEditDetails } = useUsersStore();
  const { allParkAdmins, isFetchAllParkAdminsLoading, fetchAllParkAdmins } =
    useParkAdminStore();
  const {
    allNodalOfficerParks,
    isFetchAllNodalOfficerParksLoading,
    fetchAllNodalOfficerParks,
    NodalOfficersEditDetails,
    fetchAllNodalOfficerLocationAdmins,
    isFetchAllNodalOfficerLocaionAdminsLoading,
    allNodalOfficerLocaionAdmins,
  } = useNodalOfficerStore();

  useEffect(() => {
    // fetchAllParkAdmins();
    fetchAllNodalOfficerLocationAdmins();
  }, []);

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "entityName",
      headerName: "Location Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "emailId",
      headerName: "Email",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phoneNumber",
      headerName: "Mobile Number",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
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
          <button
            className="btn-edit"
            onClick={() => {
              setCurrentUserEditDetails(params.data);
              setIsUserCreateVisible(true);
              setIsUserEditVisible(true);
            }}
          >
            <span className="">
              <LuClipboardEdit className="text-[24px] text-blue-600 " />
            </span>
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ];
  return (
    <>
      <AgGridTable
        isFetchLoading={isFetchAllNodalOfficerLocaionAdminsLoading}
        rowData={allNodalOfficerLocaionAdmins}
        columnDefs={columnDefs}
      />
    </>
  );
};

export default ParkAdminList;
