import { useEffect, useState } from "react";
import PopupModal from "../utils/popup_modal/PopupModal";
import AgGridTable from "../tables/AgGridTable";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { LuTrash2 } from "react-icons/lu";
import { useModalStore } from "../../store/modalStore";
import DepartmentRemoveForm from "./DepartmentRemoveForm";
import { ToastContainer } from "react-toastify";

const DepartmentRemoveList = () => {
  const { openModalId, setOpenModalId, closeModal } = useModalStore();

  const {
    allDepartmentTypes,
    fetchAllDepartmentTypes,
    isFetchAllDepartmentTypesLoading,
    setDepartmentTypeEditDetails,
  } = useDepartmentTypesStore();

  useEffect(() => {
    fetchAllDepartmentTypes();
  }, []);

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-red-600",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      width: "300",
      headerClass: "text-red-600",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "isActive",
      headerName: "Current Status",
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
      headerClass: "text-red-600",
    },
    {
      headerName: "Remove Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <button
            className="btn-remove"
            onClick={() => {
              setOpenModalId("department-remove-modal");
              setDepartmentTypeEditDetails(params.data);
            }}
            disabled={!params.data.isActive}
          >
            <span className="">
              <LuTrash2 className={`text-[24px] ${params.data.isActive ? 'text-red-600' : 'text-gray-400'}`} />
            </span>
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-red-600",
    },
  ];

  // Filter only active departments for removal
  const activeDepartments = allDepartmentTypes?.filter(dept => dept.isActive) || [];

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Warning Message */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Department Removal Mode
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This view shows only active departments that can be removed. Inactive departments cannot be removed.
                Removing a department will deactivate it and make it unavailable for new assignments.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AgGridTable
        ExportName="Departments_For_Removal"
        rowData={activeDepartments}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllDepartmentTypesLoading}
      />
      
      <PopupModal
        popupModalId="department-remove-modal"
        isOpen={openModalId === "department-remove-modal"}
        onClose={closeModal}
        title="Remove Department"
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div>
          <DepartmentRemoveForm />
        </div>
      </PopupModal>
    </>
  );
};

export default DepartmentRemoveList; 