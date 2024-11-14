import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { gateKeepersStore } from "../../store/masters/gateKeepersStore";
import { formatToStandardDate } from "../../utils/TypographyHelper";
import { useNodalOfficerStore } from "../../store/masters/nodalOfficerStore";

const NodalOfficerList = () => {
  const { allGateKeepers, isFetchAllGateKeepersLoading,fetchAllGateKeepers  } =
    gateKeepersStore();
    const { allNodalOfficers , isFetchAllNodalOfficersLoading , fetchAllNodalOfficers}=useNodalOfficerStore()

  useEffect(() => {
    fetchAllGateKeepers();
  }, []);

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
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
      headerName: "emailId",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phoneNumber",
      headerName: "Department",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phoneNumber",
      headerName: "Entity Type",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phoneNumber",
      headerName: "Status",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phoneNumber",
      headerName: "Entities",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <button
            className="btn-edit"
            // onClick={() => {
            //   setCurrentUserEditDetails(params.data);
            //   setIsUserCreateVisible(true);
            //   setIsUserEditVisible(true);
            // }}
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
        isFetchLoading={isFetchAllGateKeepersLoading}
        rowData={allGateKeepers}
        columnDefs={columnDefs}
      />
    </>
  );
};

export default NodalOfficerList;
