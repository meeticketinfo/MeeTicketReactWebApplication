export const usersColumnDefs = [
  { headerName: "S.No", valueGetter: "node.rowIndex + 1", width: 100 },
  { field: "username", headerName: "Username", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "role", headerName: "Role", flex: 1 },
  { field: "createdAt", headerName: "Registered On", flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: () => <button>View</button>,
    flex: 1,
  },
];
