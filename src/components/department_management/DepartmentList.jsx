import { useEffect, useState } from "react";
import PopupModal from "../utils/popup_modal/PopupModal";
import AgGridTable from "../tables/AgGridTable";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { LuClipboardEdit } from "react-icons/lu";

const DepartmentList = ({
  setIsDepartmentTypeCreateVisible,
  isDepartmentTypeEditVisible,
  setIsDepartmentTypeEditVisible,
}) => {
  const [openModalId, setOpenModalId] = useState(null);

  const openModal = (modalId) => setOpenModalId(modalId);
  const closeModal = () => setOpenModalId(null);

  const {
    allDepartmentTypes,
    fetchAllDepartmentTypes,
    isFetchAllDepartmentTypesLoading,
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
            {" "}
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
            onClick={() => openModal("edit-department")}
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
      {/* <button
        className="flex bg-[#027F8B] font-medium text-lg text-white px-6 py-2 md:px-6 md:py-[10px] items-center rounded-sm"
        onClick={() => openModal("log-in-modal")}
      >
        Open Modal
      </button> */}
      <AgGridTable
        rowData={allDepartmentTypes?.data || []}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllDepartmentTypesLoading}
      />
      <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "edit-department"}
        onClose={closeModal}
        title="Modal Title"
        size="medium"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div>Your modal content here</div>
      </PopupModal>
    </>
  );
};

export default DepartmentList;
