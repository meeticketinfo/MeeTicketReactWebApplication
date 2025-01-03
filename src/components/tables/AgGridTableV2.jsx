import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";
import { FaFileCsv } from "react-icons/fa6";
import usePaginationStore from "../../store/paginationStore";
import { useAggridStore } from "../../store/agGridStore";
import usePaginationStoreV2 from "../../store/paginationStoreV2";

const AgGridTableV2 = ({ rowData = [], columnDefs, isFetchLoading }) => {
  const { activePageV2, setActivePageV2 } = usePaginationStoreV2();
  const { quickFilterText, setQuickFilterText } = useAggridStore();
  console.log("quickFilterText",quickFilterText)
  const gridRef = useRef(null);
  // const [quickFilterText, setQuickFilterText] = useState("");
  const [gridApi, setGridApi] = useState(null); // Store the grid API

  const isPaginationEnabled = rowData.length > 5;
  const gridHeight = isPaginationEnabled ? 600 : 600;

  // Function to handle quick search input change
  const handleQuickFilterChange = (e) => {
    const filterText = e.target.value;
    setQuickFilterText(filterText);
    // Persist the filter text in localStorage
    localStorage.setItem("quickFilterText", filterText);
  };

  // Function to export data to CSV
  const handleExportCsv = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv([]);
    }
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    if (gridApi) {
      gridApi.exportDataAsExcel([]);
    }
  };

  useEffect(() => {
    // Load the saved quickFilterText from localStorage on component mount
    const savedQuickFilterText = localStorage.getItem("quickFilterText");
    if (savedQuickFilterText) {
      setQuickFilterText(savedQuickFilterText);
    }
  }, []);

  useEffect(() => {
    // Whenever activePage changes, update the grid's pagination
    if (gridApi) {
      gridApi.paginationGoToPage(activePageV2);
    }
  }, [activePageV2, gridApi]);

  return (
    <div className="bg-white/30 backdrop-blur-md p-4 border rounded-2xl">
      {/* Search and Export Buttons */}
      <div className="ag-grid-toolbar flex justify-between items-end p-1 bg-white rounded-2xl mb-2 shadow-sm backdrop-blur-sm">
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={quickFilterText} // Controlled input
            onChange={handleQuickFilterChange}
            className={` border border-gray-300  rounded-xl shadow-sm focus:outline-none bg-white text-sm`}
          />
        </div>
        <div className="flex bg-gray-100 p-2 rounded-xl gap-4 items-end shadow-md border border-v1">
          <button onClick={handleExportCsv} className="ag-grid-button">
            <FaFileCsv className="text-blue-v2 text-xl" />
          </button>
        </div>
      </div>

      {/* Ag-Grid Table */}
      <div
        className="ag-theme-alpine bg-white/30 backdrop-blur-sm border border-white/50 rounded-lg shadow-md overflow-hidden"
        style={{ height: gridHeight, width: "100%", position: "relative" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          pagination={isPaginationEnabled}
          paginationPageSize={20}
          columnDefs={columnDefs.map((col) => ({
            ...col,
            minWidth: 180,
            sortable: true,
          }))}
          quickFilterText={quickFilterText} // Binding quickFilterText to AgGrid
          onGridReady={(params) => {
            setGridApi(params.api); // Store the API instance
            params.api.paginationGoToPage(activePageV2); // Navigate to the saved active page
          }}
          onPaginationChanged={() => {
            if (gridApi) {
              const currentPage = gridApi.paginationGetCurrentPage();
              if (currentPage !== activePageV2

              ) {
              setActivePageV2(currentPage);
              }
            }
          }}
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

AgGridTableV2.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
};

export default AgGridTableV2;
