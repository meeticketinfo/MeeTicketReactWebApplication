export const paymentsColumnDefs = [
  { headerName: "S.No", valueGetter: "node.rowIndex + 1", width: 100 },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "paymentId", headerName: "Payment ID", flex: 1 },
  { field: "amount", headerName: "Amount ($)", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "method", headerName: "Method", flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: () => <button>View</button>,
    flex: 1,
  },
];
