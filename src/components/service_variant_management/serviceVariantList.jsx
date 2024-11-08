import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { LuClipboardEdit } from "react-icons/lu";
import Tippy from "@tippyjs/react";

const ServiceVariantList = ({setIsServiceVarientCreateVisible,setIsServiceVarientEditVisible}) => {
  const {
    allServiceVariants,
    isFetchAllServiceVariantsLoading,
    fetchAllServiceVariants,
    setCurrentServiceVariantEditDetails,
  } = useServiceVariantStore();
  useEffect(() => {
    fetchAllServiceVariants();
  }, []);
  //   "varientName": "ENTRANCE_ADULT",
  // "amount": 10,
  // "type": null,
  // "serviceName": "ENTRANCE",
  // "facilityName": "ENTRANCE",
  // "parkName": "test park",
  // "createdDate": "2024-10-30T16:26:19.3830469"
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "varientName",
      headerName: "Varient Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "parkName",
      headerName: "Park Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
             <Tippy content="Edit" placement="right" className=" text-white rounded-lg px-[1px] py-[1px] shadow-lg">
            <button className="btn-edit" onClick={() => {
             
              setCurrentServiceVariantEditDetails(params.data);
              setIsServiceVarientCreateVisible(true)
              setIsServiceVarientEditVisible(true)
              }}>
              <span className="">
                <LuClipboardEdit className="text-[24px] text-[#0C3770]" />
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
    <>
      {/* <DashboardCard07> */}
      <AgGridTable
        isFetchLoading={isFetchAllServiceVariantsLoading}
        rowData={allServiceVariants}
        columnDefs={columnDefs}
      />
      {/* </DashboardCard07> */}
    </>
  );
};
export default ServiceVariantList;
