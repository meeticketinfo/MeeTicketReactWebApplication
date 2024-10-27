import React from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";

const AgGridTable = ({ rowData, columnDefs }) => {
  const isPaginationEnabled = rowData.length > 10;

  const gridHeight = isPaginationEnabled ? 400 : 300;

  return (
    <div
      className="ag-theme-alpine bg-blue-v1"
      style={{ height: gridHeight, width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={isPaginationEnabled}
        paginationPageSize={10}
        paginationPageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  );
};

export default AgGridTable;
