import PropTypes from "prop-types";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";

const AgGridTable = ({ rowData, columnDefs, isFetchLoading }) => {
  const isPaginationEnabled = rowData.length > 10;
  const gridHeight = isPaginationEnabled ? 400 : 300;

  return (
    <div
      className="ag-theme-alpine bg-blue-v1"
      style={{ height: gridHeight, width: "100%", position: "relative" }}
    >
      {isFetchLoading && (
        <div className="loader-overlay">
          <div className="loader">Loading...</div>
        </div>
      )}
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={isPaginationEnabled}
        gridOptions={{
          paginationPageSize: 10,
          paginationPageSizeOptions: [10, 20, 50, 100],
        }}
      />
    </div>
  );
};

AgGridTable.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
};

export default AgGridTable;
