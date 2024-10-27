import React from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AgGridTable = ({ rowData, columnDefs }) => {
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10} // Set the default page size
        paginationPageSizeOptions={[10, 20, 50, 100]} // Options available for page size without empty value
      />
    </div>
  );
};

export default AgGridTable;
