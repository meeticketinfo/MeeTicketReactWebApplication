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
      className="ag-theme-alpine bg-white/30 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg "
      style={{ height: gridHeight, width: "100%", position: "relative" }}
    >
      {/* skjdfhaksjdfhk */}
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={isPaginationEnabled}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
      />
      {/* Loader overlay within the table body */}
      {isFetchLoading && (
        <div className="ag-table-body-loader backdrop-blur-sm bg-white/30">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

AgGridTable.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
};

export default AgGridTable;
