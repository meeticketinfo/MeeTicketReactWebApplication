// DepartmentListColumns.js
import React from "react";
import { LuClipboardEdit } from "react-icons/lu";

const DepartmentListColumns = ({
  setOpenModalId,
  setDepartmentTypeEditDetails,
  setIsDepartmentTypeEditVisible,
}) => [
  {
    headerName: "S.No",
    valueGetter: "node.rowIndex + 1",
    width: 100,
    headerClass: "text-blue-v2",
    valueFormatter: (params) => params.value || "N/A",
  },
  {
    field: "departmentName",
    headerName: "Department Name",
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
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
          } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
        >
          {params.value ? "Active" : "Inactive"}
        </span>
      </div>
    ),
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
          onClick={() => {
            setOpenModalId("department-modal");
            setDepartmentTypeEditDetails(params.data);
            setIsDepartmentTypeEditVisible(true);
          }}
        >
          <span>
            <LuClipboardEdit className="text-[24px] text-blue-600 " />
          </span>
        </button>
      </div>
    ),
    flex: 1,
    headerClass: "text-blue-v2",
  },
];

export default DepartmentListColumns;
