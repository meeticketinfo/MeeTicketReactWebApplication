import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useUsersStore } from "../../store/masters/usersStore";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";

const EntryScanUserList = () => {
  const {
    allScannedUsers,
    isFetchAllScannedUsersLoading,
    fetchAllScannedUsers,
  } = useUsersStore();
  useEffect(() => {
    fetchAllScannedUsers();
  }, []);
  //  "id": "5f46e0e1-d3bf-4e67-a60b-56c5313ce467",
  //     "phoneNumber": "1234567891",
  //     "firstName": null,
  //     "middleName": null,
  //     "lastName": null,
  //     "isActive": false,
  //     "parkName": "A"
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
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
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
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
  ]);
  return (
    <>
      {/* <DashboardCard07> */}
      <AgGridTable
        isFetchLoading={isFetchAllScannedUsersLoading}
        rowData={allScannedUsers}
        columnDefs={columnDefs}
      />
      {/* </DashboardCard07> */}
    </>
  );
};
export default EntryScanUserList;
