export const serviceVariantColumnDefs = [
  { headerName: "S.No", valueGetter: "node.rowIndex + 1", width: 100 },
  { field: "variantName", headerName: "Variant Name", flex: 1 },
  { field: "description", headerName: "Description", flex: 1 },
  { field: "additionalPrice", headerName: "Additional Price ($)", flex: 1 },
  { field: "availability", headerName: "Availability", flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: () => <button>View</button>,
    flex: 1,
  },
];
