import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";

const ServiceVariantList = () => {
  const {
    allServiceVariants,
    isFetchAllServiceVariantsLoading,
    fetchAllServiceVariants,
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
