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
      width: 100,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "name",
      headerName: "Park Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "country",
      headerName: "country",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "city",
      headerName: "city",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "landmark",
      headerName: "Landmark",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "Coordinates",
      flex: 1,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        const { latitude, longitude } = params.data;
        return latitude && longitude ? `${latitude}, ${longitude}` : "N/A";
      },
    },
    // {
    //   headerName: "Image",
    //   flex: 1,
    //   field: "ImageUrl",
    //   headerClass: "text-blue-v2",
    //   cellRenderer: (params) => (
    //     <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    //       <img
    //         src={params.value}
    //         alt="Park"
    //         style={{ width: "50px", height: "50px", objectFit: "cover" }}
    //         onError={(e) => {
    //           e.target.src = "";
    //         }}
    //       />
    //     </div>
    //   ),
    // },
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
