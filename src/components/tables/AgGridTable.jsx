import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";
import { FaFileCsv } from "react-icons/fa6";
import usePaginationStore from "../../store/paginationStore";
import { useAggridStore } from "../../store/agGridStore";
import { ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import ReactPaginate from "react-paginate";

ModuleRegistry.registerModules([ExcelExportModule]);
 
const AgGridTable = ({
  rowData = [],
  columnDefs,
  isFetchLoading,
  pinnedBottomRowData,
  ExportName,
  gridOptions,
  tableHeight,
  isPagination=true,
  IsReactPaginate=false,
  setPageLimit,
  pageLimit,
  handlePageClick,
  currentPage,
  totalCount
}) => {
  const { activePage, setActivePage } = usePaginationStore();
  const { quickFilterText, setQuickFilterText } = useAggridStore();
   
  const gridRef = useRef(null);
  // const [quickFilterText, setQuickFilterText] = useState("");
  const [gridApi, setGridApi] = useState(null); // Store the grid API

  const isPaginationEnabled = rowData.length > 10&&isPagination;
  const gridHeight = tableHeight || (isPaginationEnabled ? 550 : 300);

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

  const handleExportExcel = () => {
    if (gridApi) {
      gridApi.exportDataAsExcel({
        sheetName: typeof ExportName === "string" ? ExportName : "Report",
        fileName:
          ExportName && typeof ExportName === "string"
            ? `${ExportName}.xlsx`
            : "Report.xlsx",
            // columnKeys: gridApi
            // .getColumnDefs()
            // .filter(col => col.field !== "actions")
            // .map(col => col.field),
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
    // Load the saved quickFilterText from localStorage on component mount
    const savedQuickFilterText = localStorage.getItem("quickFilterText");
    if (savedQuickFilterText) {
      setQuickFilterText(savedQuickFilterText);
    }
  }, []);

  useEffect(() => {
    // Whenever activePage changes, update the grid's pagination
    if (gridApi) {
      gridApi.paginationGoToPage(activePage);
    }
  }, [activePage, gridApi]);
  useEffect(() => {
    if (gridApi) {
      gridApi.refreshClientSideRowModel(); // Refresh indexes when filtering
    }
  }, [quickFilterText]);

  return (
    <div className="bg-white/30 backdrop-blur-md p-2 border rounded-2xl">
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
          <button onClick={handleExportExcel} className="ag-grid-button">
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
          enableCellTextSelection
          ref={gridRef}
          rowData={rowData}
          gridOptions={gridOptions}
          pagination={isPaginationEnabled}
          paginationPageSize={20}
          paginationPageSizeSelector={[20,50,100,500,1000]}
          pinnedBottomRowData={pinnedBottomRowData}
          columnDefs={columnDefs?.map((col) => ({
            ...col, 
            minWidth: 180,
            sortable: true,
          }))}
          quickFilterText={quickFilterText}
          onGridReady={(params) => {
            setGridApi(params.api); // Store the API instance
            params.api.paginationGoToPage(activePage); // Navigate to the saved active page
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

         

        {/* Loader overlay within the table body */}
        {isFetchLoading && (
          <div className="ag-table-body-loader backdrop-blur-sm bg-white/30">
            <div className="loader"></div>
          </div>
        )}
      </div>
       {(IsReactPaginate && !isFetchLoading && rowData?.length > 0) && <div className="mt-4 flex justify-end items-center gap-4">
          <div>
            <span className="">Page Size:</span>
            <select className=" py-1 border border-gray-300 rounded-lg"
            onChange={(e)=>{setPageLimit(e.target.value)}}
            >
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={Math.ceil(totalCount / pageLimit)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination border px-2 py-1 rounded-lg flex gap-2"}
            activeClassName={"text-white bg-blue-v2 px-3 py-1 rounded "}
            pageClassName={"border px-3 py-1 rounded hover:bg-blue-v2 hover:text-white"}
            previousClassName={"border px-3 py-1 ml-2 rounded hover:bg-blue-v2"}
            nextClassName={"border px-3 py-1 rounded hover:bg-blue-v2"}
            breakClassName={"px-2"}
            forcePage={currentPage}
          />
        </div>}
    </div>
  );
};

AgGridTable.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
};

export default AgGridTable;
