export const facilitiesColumnDefs = [
  {
    headerName: "S.No",
    valueGetter: "node.rowIndex + 1",
    width: 100,
    headerClass: "text-blue-v2",
  },
  {
    field: "facilityName",
    headerName: "Facility Name",
    flex: 1,
    headerClass: "text-blue-v2",
  },
  { field: "type", headerName: "Type", flex: 1, headerClass: "text-blue-v2" },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    headerClass: "text-blue-v2",
  },
  {
    field: "availability",
    headerName: "Availability",
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
];
