import { useEffect, useState } from "react";
import PopupModal from "../utils/popup_modal/PopupModal";
import AgGridTable from "../tables/AgGridTable";
import { useEntityTypesStore } from "../../store/masters/EntityTypesStore";
import { LuClipboardEdit } from "react-icons/lu";
import EntityCreateForm from "./EntityCreateForm";
import { useModalStore } from "../../store/modalStore";

const EntityTypeList = ({
  setIsEntityTypeCreateVisible,
  isEntityTypeCreateVisible,
  isEntityTypeEditVisible,
  setIsEntityTypeEditVisible,
}) => {
  const { openModalId, setOpenModalId, closeModal } = useModalStore();

  const {
    allEntityTypes,
    fetchAllEntityTypes,
    isFetchAllEntityTypesLoading,
    setEntityTypeEditDetails,
  } = useEntityTypesStore();

  useEffect(() => {
    fetchAllEntityTypes();
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
      field: "entityTypeName",
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
              setEntityTypeEditDetails(params.data);
              setIsEntityTypeEditVisible(true);
              setOpenModalId("entity-modal");
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
        rowData={allEntityTypes?.data || []}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllEntityTypesLoading}
      />

      <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "entity-modal"}
        onClose={closeModal}
        title={isEntityTypeEditVisible ? "Update Entity" : "Create Entity"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div>
          <EntityCreateForm
            isEntityTypeEditVisible={isEntityTypeEditVisible}
            setIsEntityTypeEditVisible={setIsEntityTypeEditVisible}
          />
        </div>
      </PopupModal>
    </>
  );
};

export default EntityTypeList;
