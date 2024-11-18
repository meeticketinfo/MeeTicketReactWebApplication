import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { formatToStandardDate } from "../../utils/TypographyHelper";
import { useNodalOfficerStore } from "../../store/masters/nodalOfficerStore";

const NodalOfficerList = ({
  setIsNodalOfficerCreateVisible,
  isNodalOfficerEditVisible,
  setIsNodalOfficerEditVisible,
}) => {
  const {
    allNodalOfficers,
    isFetchAllNodalOfficersLoading,
    fetchAllNodalOfficers,
    setCurrentNodalOfficerEditDetails,
  } = useNodalOfficerStore();

  useEffect(() => {
    fetchAllNodalOfficers();
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
      field: "firstName",
      headerName: "Officer Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        const { firstName, lastName } = params.data;
        return firstName || lastName
          ? `${firstName || ""} ${lastName || ""}`
          : "N/A";
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
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
              setCurrentNodalOfficerEditDetails(params.data);
              setIsNodalOfficerCreateVisible(true);
              setIsNodalOfficerEditVisible(true);
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
        isFetchLoading={isFetchAllNodalOfficersLoading}
        rowData={allNodalOfficers}
        columnDefs={columnDefs}
      />
    </>
  );
};

export default NodalOfficerList;
