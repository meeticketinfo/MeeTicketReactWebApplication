export const serviceColumnDefs = [
  { headerName: "S.No", valueGetter: "node.rowIndex + 1", width: 100 },
  { field: "serviceName", headerName: "Service Name", flex: 1 },
  { field: "description", headerName: "Description", flex: 1 },
  { field: "price", headerName: "Price ($)", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: () => <button>View</button>,
    flex: 1,
  },
];
