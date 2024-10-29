export const parksColumnDefs = [
  { headerName: "S.No", valueGetter: "node.rowIndex + 1", width: 100 },
  { field: "name", headerName: "Park Name", flex: 1 },
  { field: "location", headerName: "Location", flex: 1 },
  { field: "areaSize", headerName: "Area Size (sq ft)", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: () => <button>View</button>,
    flex: 1,
  },
];
