export const entryScanUsersColumnDefs = [
  { headerName: "S.No", valueGetter: "node.rowIndex + 1", width: 100 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "entryTime", headerName: "Entry Time", flex: 1 },
  { field: "exitTime", headerName: "Exit Time", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: () => <button>View</button>,
    flex: 1,
  },
];
