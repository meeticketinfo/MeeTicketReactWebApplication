import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { useUsersStore } from "../../store/masters/usersStore";

function GateKeeperList() {
    const { allUsers, isFetchAllUsersLoading, fetchAllUsers } = useUsersStore();
    useEffect(() => {
      fetchAllUsers();
    }, []);
    const handleEdit = (data) => {};
  
    const handleDelete = (data) => {};
  
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
        field: "isActive",
        headerName: "Status",
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
      {
        field: "dob",
        headerName: "DOB",
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            <button className="btn-edit" onClick={() => handleEdit(params.data)}>
              <span className="">
                <FiEdit className="text-[24px] " />
              </span>
            </button>
            <button
              className="btn-delete"
              onClick={() => handleDelete(params.data)}
            >
              <span>
                <BsTrash className="text-[24px]" />
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
          isFetchLoading={isFetchAllUsersLoading}
          rowData={allUsers}
          columnDefs={columnDefs}
        />
      </>
    );
  
}

export default GateKeeperList
