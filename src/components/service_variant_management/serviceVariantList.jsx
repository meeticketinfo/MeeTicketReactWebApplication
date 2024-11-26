import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { LuClipboardEdit } from "react-icons/lu";
import Tippy from "@tippyjs/react";
import { formatToCurrency } from "../../utils/TypographyHelper";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ServiceVariantList = ({
  setIsServiceVarientCreateVisible,
  setIsServiceVarientEditVisible,
}) => {
  const {
    allServiceVariants,
    isFetchAllServiceVariantsLoading,
    fetchAllServiceVariants,
    setCurrentServiceVariantEditDetails,
  } = useServiceVariantStore();
  useEffect(() => {
    fetchAllServiceVariants();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "serviceName",
      headerName: "Sub Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "varientName",
      headerName: "Ticket Type",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "parkName",
      headerName: "Location Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "isPriceFixed",
      headerName: "Fixed or Count Based",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value === true ? "Yes" : "No"),
    },
    {
      headerName: "Status",
      field: "isActive",
      flex: 1,
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value
                ? "bg-green-400 text-white shadow-md "
                : "bg-red-400 text-white shadow-md "
            } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
          >
            {" "}
            {params.value ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
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
                setCurrentServiceVariantEditDetails(params.data);
                setIsServiceVarientCreateVisible(true);
                setIsServiceVarientEditVisible(true);
              }}
            >
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
