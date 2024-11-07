import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { gateKeepersStore } from "../../store/masters/gateKeepersStore";
import { formatToStandardDate } from "../../utils/TypographyHelper";

const GateKeeperList = () => {
  const { allGateKeepers, isFetchAllGateKeepersLoading, fetchAllGateKeepers } =
    gateKeepersStore();

  useEffect(() => {
    fetchAllGateKeepers();
  }, []);

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "emailId",
      headerName: "emailId",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "dob",
      headerName: "DOB",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value ? formatToStandardDate(params.value) : "N/A",
    },
  ];
  return (
    <>
      <AgGridTable
        isFetchLoading={isFetchAllGateKeepersLoading}
        rowData={allGateKeepers}
        columnDefs={columnDefs}
      />
    </>
  );
};

export default GateKeeperList;
