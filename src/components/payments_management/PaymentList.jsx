import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { usePaymentsStore } from "../../store/masters/paymentsStore";

const PaymentList = () => {
  const { allPayments, isFetchAllPaymentsLoading, fetchAllPayments } =
    usePaymentsStore();
  useEffect(() => {
    fetchAllPayments();
  }, []);
  
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "paymentId",
      headerName: "Payment Id",
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
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "method",
      headerName: "Method",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: () => <button>View</button>,
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  return (
    <>
      {/* <DashboardCard07> */}
      <AgGridTable
        isFetchLoading={isFetchAllPaymentsLoading}
        rowData={allPayments}
        columnDefs={columnDefs}
      />
      {/* </DashboardCard07> */}
    </>
  );
};
export default PaymentList;
