import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";
import { FaFileCsv } from "react-icons/fa6";
import { RiFileExcel2Fill } from "react-icons/ri";

const AgGridTable = ({ rowData = [], columnDefs, isFetchLoading }) => {
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState(""); // For search functionality

  const isPaginationEnabled = rowData.length > 10;
  const gridHeight = isPaginationEnabled ? 400 : 300;

  // Function to handle quick search input change
  const handleQuickFilterChange = (e) => {
    setQuickFilterText(e.target.value);
  };

  // Function to export data to CSV
  const handleExportCsv = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv();
    }
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsExcel();
    }
  };
  

  return (
    <div className="bg-white/30 backdrop-blur-md p-4 border rounded-2xl">
      {/* Search and Export Buttons */}
      <div className="ag-grid-toolbar flex justify-between items-end p-1 bg-white rounded-2xl mb-2 shadow-sm backdrop-blur-sm">
        <div>
          <input
            type="text"
            placeholder="Search..."
            onChange={handleQuickFilterChange}
            className={` border border-gray-300  rounded-xl shadow-sm focus:outline-none bg-white text-sm`}
          />
        </div>
        <div className="flex bg-gray-100 p-2 rounded-xl gap-4 items-end shadow-md">
          <button onClick={handleExportCsv} className="ag-grid-button">
            <FaFileCsv className="text-green-600 text-xl" />
          </button>
          <button onClick={handleExportExcel} className="ag-grid-button">
            <RiFileExcel2Fill className="text-red-600 text-2xl" />
          </button>
        </div>
      </div>

      {/* Ag-Grid Table */}
      <div
        className="ag-theme-alpine bg-white/30 backdrop-blur-sm border border-white/50 rounded-lg shadow-md overflow-hidden"
        style={{ height: 400, width: "100%", position: "relative" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          // columnDefs={columnDefs.map((col) => ({ ...col, sortable: true }))}
          pagination={isPaginationEnabled}
          paginationPageSize={10}
          columnDefs={columnDefs.map((col) => ({
            ...col,
            // width: 180, // Default column width
            minWidth: 180, // Minimum width for responsiveness
            sortable: true,
          }))}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          // domLayout="autoHeight" // Adapts grid height based on data
          quickFilterText={quickFilterText} // Binding quickFilterText to AgGrid
        />

        {/* Loader overlay within the table body */}
        {isFetchLoading && (
          <div className="ag-table-body-loader backdrop-blur-sm bg-white/30">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

AgGridTable.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
};

export default AgGridTable;
