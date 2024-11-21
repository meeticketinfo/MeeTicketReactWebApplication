import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import Tippy from "@tippyjs/react";
import { LuClipboardEdit } from "react-icons/lu";
import { useAdminFacilityStore } from "../../store/masters/SuperAdminFacilitiesStore";

function SuperAdminFacilitiesList({setIsFacilityCreateVisible,setIsFacilityEditVisible}) {
  const { AdminFacilitiesDetails, fetchAllAdminFacilitiesDetails,setCurrentAdminFacilityEditDetails } =
    useAdminFacilityStore();
  useEffect(() => {
    fetchAllAdminFacilitiesDetails();
  }, []);
  console.log("AdminFacilitiesDetails", AdminFacilitiesDetails);
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "locationCategoryName",
      headerName: "Location Category",
      flex: 1,
      headerClass: "text-blue-v2",
      //   valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
      //   valueFormatter: (params) => params.value || "00:00",
    },
    // {
    //   headerName: "Status",
    //   field: "isActive",
    //   flex: 1,
    //   cellRenderer: (params) => (
    //     <div style={{ display: "flex align-center", gap: "0.5rem" }}>
    //       <span
    //         className={`${
    //           params.value
    //             ? "bg-green-400 text-white shadow-md "
    //             : "bg-red-400 text-white shadow-md "
    //         } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
    //       >
    //         {" "}
    //         {params.value ? "Active" : "Inactive"}
    //       </span>
    //     </div>
    //   ),
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value || "N/A",
    // },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <Tippy
            content="Edit"
            placement="right"
            className=" text-white rounded-lg px-[1px] py-[1px] shadow-lg"
          >
            <button
              className="btn-edit"
                onClick={() => {
                  setCurrentAdminFacilityEditDetails(params.data);
                  setIsFacilityCreateVisible(true);
                  setIsFacilityEditVisible(true);
                }}
            >
              <span className="">
                <LuClipboardEdit className="text-[24px] text-[#0C3770] " />
              </span>
            </button>
          </Tippy>
          {/* <button
                  className="btn-delete"
                  onClick={() => handleDelete(params.data)}
                >
                  <span>
                    <BsTrash className="text-[24px]" />
                  </span>
                </button> */}
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  return (
    <div>
      <AgGridTable rowData={AdminFacilitiesDetails} columnDefs={columnDefs} />
    </div>
  );
}

export default SuperAdminFacilitiesList;
