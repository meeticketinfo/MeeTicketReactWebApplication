import { useEffect, useState } from "react";
import PopupModal from "../utils/popup_modal/PopupModal";
import AgGridTable from "../tables/AgGridTable";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { FiEdit } from "react-icons/fi";
import { useModalStore } from "../../store/modalStore";
import DepartmentCreateForm from "./DepartmentCreateForm";
import { ToastContainer } from "react-toastify";

const DepartmentList = ({
  setIsDepartmentTypeCreateVisible,
  isDepartmentTypeEditVisible,
  setIsDepartmentTypeEditVisible,
  forestDeptAdmin,
}) => {
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
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      // flex: 1,
      width:"300",
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
    forestDeptAdmin && ({
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
            <span className="">
              <FiEdit className="text-[24px] text-blue-600 " />
            </span>
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    }),
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />{" "}
      <AgGridTable
        ExportName="Departments"
        rowData={allDepartmentTypes || []}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllDepartmentTypesLoading}
      />
      <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "department-modal"}
        onClose={closeModal}
        title={
          !isDepartmentTypeEditVisible ? "Add Department" : "Edit Department"
        }
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div>
          <DepartmentCreateForm
            isDepartmentTypeEditVisible={isDepartmentTypeEditVisible}
            setIsDepartmentTypeEditVisible={setIsDepartmentTypeEditVisible}
          />
        </div>
      </PopupModal>
    </>
  );
};

export default DepartmentList;
