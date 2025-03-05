import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { useHolidayStore } from "../../store/masters/holidayStore";
import { formatToStandardDate, formatToStandardTime } from "../../utils/TypographyHelper";

const HolidayList = () => {
  const { allHolidays, fetchAllHolidays } = useHolidayStore();

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
  ]);
  return (
    <>
      {/* <DashboardCard07> */}
      <AgGridTable ExportName="Holidays" rowData={allHolidays} columnDefs={columnDefs} />
      {/* </DashboardCard07> */}
    </>
  );
};
export default HolidayList;
