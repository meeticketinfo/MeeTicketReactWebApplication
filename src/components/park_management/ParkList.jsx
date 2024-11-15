import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useParkStore } from "../../store/masters/parksStore";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { PiPark } from "react-icons/pi";

const ParkList = ({
  setIsParkCreateVisible,
  isParkEditVisible,
  setIsParkEditVisible,
}) => {
  const {
    allParks,
    fetchAllParks,
    isFetchAllParksLoading,
    setCurrentParkEditDetails,
  } = useParkStore();
  useEffect(() => {
    fetchAllParks();
  }, []);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  const handleImageError = () => {
    setIsImageLoaded(false);
  };

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80, // Set minimum width to enforce a narrow column
      maxWidth: 80,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "name",
      headerName: "Entity Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "entityTypeName",
      headerName: "Entity Type",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "name",
      headerName: "Address",
      flex: 1,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        const { street1, street2 } = params.data;
        return street1 || street2
          ? `${street1 || ""}, ${street2 || ""}`
          : "N/A";
      },
    },

    {
      field: "state",
      headerName: "State",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "zipCode",
      headerName: "Pincode",
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
              setCurrentParkEditDetails(params.data);
              setIsParkCreateVisible(true);
              setIsParkEditVisible(true);
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
        rowData={allParks}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllParksLoading}
      />
    </>
  );
};

export default ParkList;
