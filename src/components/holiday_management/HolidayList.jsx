import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { useHolidayStore } from "../../store/masters/holidayStore";
import {
  formatToStandardDate,
  formatToStandardTime,
} from "../../utils/TypographyHelper";
import { MdDeleteForever } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { tailChase } from "ldrs";

tailChase.register();

const HolidayList = () => {
  const {
    allHolidays,
    fetchAllHolidays,
    DeleteHolidayDetails,
    DeleteHolidayDetailsLoading,
    setDeleteHolidayDetailsLoading,
  } = useHolidayStore();
  console.log("DeleteHolidayDetailsLoading", DeleteHolidayDetailsLoading);
  useEffect(() => {
    fetchAllHolidays();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "holidayName",
      headerName: "Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "holidayDate",
      headerName: "Date",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value ? formatToStandardDate(params.value) : "N/A",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) =>
        DeleteHolidayDetailsLoading ? (
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            
            <l-tail-chase size="15" speed="1.75" color="red"></l-tail-chase>
          </div>
        ) : (
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            <button
              className="btn-edit"
              onClick={async () => {
                const res = await DeleteHolidayDetails(params.data.holidayId);
                if (res.data.status == 200) {
                  toast.success("Holiday deleted successfully.");
                  fetchAllHolidays();
                } else {
                  toast.error("Somthing went Wrong.");
                }
              }}
            >
              <span className="">
                <MdDeleteForever className="text-[24px] text-red-600 " />
              </span>
            </button>
          </div>
        ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  return (
    <>
      {/* <DashboardCard07> */}
      <ToastContainer position="top-right" autoClose={2000} />
      <AgGridTable
        ExportName="Holidays"
        rowData={allHolidays}
        columnDefs={columnDefs}
      />
      {/* </DashboardCard07> */}
    </>
  );
};
export default HolidayList;
