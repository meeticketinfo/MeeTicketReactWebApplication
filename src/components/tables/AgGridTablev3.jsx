import PropTypes from "prop-types";
import { useEffect, useRef, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";
import { FaFileCsv } from "react-icons/fa6";
import usePaginationStore from "../../store/paginationStore";
import { useAggridStore } from "../../store/agGridStore";

const AgGridTablev3 = ({ rowData = [], columnDefs, isFetchLoading }) => {
  const { activePage, setActivePage } = usePaginationStore();
  const { quickFilterText, setQuickFilterText } = useAggridStore();
  const gridRef = useRef(null);
  const [gridApi, setGridApi] = useState(null); // Store the grid API

  const isPaginationEnabled = rowData.length > 5;
  const gridHeight = isPaginationEnabled ? 600 : 600;

  const purchaseIdColorMap = useMemo(() => {
    const colors = ["white", "#EBECF0"];
    const idColorMapping = {};
    let colorIndex = 0;

    rowData.forEach((row) => {
      if (!idColorMapping[row.ltmrhlPurchaseId]) {
        idColorMapping[row.ltmrhlPurchaseId] = colors[colorIndex % 2];
        colorIndex++;
      }
    });

    return idColorMapping;
  }, [rowData]);

  // Function to handle quick search input change
  const handleQuickFilterChange = (e) => {
    const filterText = e.target.value;
    setQuickFilterText(filterText);
    localStorage.setItem("quickFilterText", filterText);
  };

  // Function to export data to CSV
  const handleExportExcel = () => {
    if (gridApi) {
      gridApi.exportDataAsExcel({
        sheetName: "Individual Ticket Details",
        fileName: "Individual Ticket Details.xlsx",
        columnWidth: (params) => {
          const colId = params.column.getColId();
          const rowData = [];
 
          gridApi.forEachNode((node) => {
            if (node.data && node.data[colId] !== undefined) {
              rowData.push(String(node.data[colId]));
            }
          });
 
          // Get the maximum length of text in the column, including the header
          const headerName = params.column.getColDef().headerName || "";
          const maxContentLength = Math.max(
            ...rowData.map((value) => value.length),
            headerName.length
          );
 
          // Convert character length to approximate pixel width
          const estimatedWidth = maxContentLength * 7 + 20; // Adding padding
 
          return estimatedWidth;
        },
        processCellCallback: (params) => {
          let value = params.value;
 
          // Ensure "Refund ID" and empty values show "N/A"
          if (value === null || value === undefined || value === "") {
            return "N/A";
          }
 
          // Convert objects to readable JSON strings
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }
 
          // if (typeof value === "string") {
          //     value = value.replace(/[^\d.-]/g, "");
          // }
 
          // Prevent scientific notation by treating numbers longer than 15 digits as text
          if (/^\d{16,}$/.test(value)) {
            return `'${value}`; // Prefix with apostrophe to ensure text format
          }
 
          return value;
        },
      });
    } else {
      console.error("Grid API not available for Excel export.");
    }
  };

  useEffect(() => {
    const savedQuickFilterText = localStorage.getItem("quickFilterText");
    if (savedQuickFilterText) {
      setQuickFilterText(savedQuickFilterText);
    }
  }, []);

  useEffect(() => {
    if (gridApi) {
      gridApi.paginationGoToPage(activePage);
    }
  }, [activePage, gridApi]);

  return (
    <div className="bg-white/30 backdrop-blur-md p-4 border rounded-2xl">
      <div className="ag-grid-toolbar flex justify-between items-end p-1 bg-white rounded-2xl mb-2 shadow-sm backdrop-blur-sm">
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={quickFilterText}
            onChange={handleQuickFilterChange}
            className="border border-gray-300 rounded-xl shadow-sm focus:outline-none bg-white text-sm"
          />
        </div>
        <div className="flex bg-gray-100 p-2 rounded-xl gap-4 items-end shadow-md border border-v1">
          <button onClick={handleExportExcel} className="ag-grid-button">
            <FaFileCsv className="text-blue-v2 text-xl" />
          </button>
        </div>
      </div>

      <div
        className="ag-theme-alpine bg-white/30 backdrop-blur-sm border border-white/50 rounded-lg shadow-md overflow-hidden"
        style={{ height: gridHeight, width: "100%", position: "relative" }}
      >
        <AgGridReact
          enableCellTextSelection
          ref={gridRef}
          rowData={rowData}
          pagination={isPaginationEnabled}
          paginationPageSize={20}
          columnDefs={columnDefs.map((col) => ({
            ...col,
            minWidth: 180,
            sortable: true,
          }))}
          quickFilterText={quickFilterText}
          onGridReady={(params) => {
            setGridApi(params.api);
            params.api.paginationGoToPage(activePage);
          }}
          getRowStyle={(params) => {
            const color = purchaseIdColorMap[params.data.ltmrhlPurchaseId];
            return {
              backgroundColor: color ? color : "white",
              // color: color ? "white" : "black", 
            };
          }}
          onPaginationChanged={() => {
            if (gridApi) {
              const currentPage = gridApi.paginationGetCurrentPage();
              if (currentPage !== activePage) {
                setActivePage(currentPage);
              }
            }
          }}
        />
        {isFetchLoading && (
          <div className="ag-table-body-loader backdrop-blur-sm bg-white/30">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

AgGridTablev3.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
};

export default AgGridTablev3;
