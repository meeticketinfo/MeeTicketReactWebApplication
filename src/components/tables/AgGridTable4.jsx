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

const AgGridTable4 = ({
    rowData = [],
    columnDefs,
    isFetchLoading,
    pinnedBottomRowData,
    ExportName,
    gridOptions,
    tableHeight,
    isPagination = true,
    IsReactPaginate = false,
    setPageLimit,
    pageLimit,
    handlePageClick,
    currentPage,
    showTotalCount = false,
    totalCount = 0,
    SetcurrentPage,
    showSearch = true,
    rowSelection = "multiple",
    onSelectionChanged,
}) => {
    const { activePage, setActivePage } = usePaginationStore();
    const { quickFilterText, setQuickFilterText } = useAggridStore();

    const gridRef = useRef(null);
    // const [quickFilterText, setQuickFilterText] = useState("");
    const [gridApi, setGridApi] = useState(null); // Store the grid API

    const isPaginationEnabled = rowData.length > 10 && isPagination;
    const gridHeight = tableHeight || (isPaginationEnabled ? 550 : 300);

    useEffect(() => {
        setQuickFilterText("");
    }, [setQuickFilterText]);

    // Function to handle quick search input change
    const handleQuickFilterChange = (e) => {
        const filterText = e.target.value;
        setQuickFilterText(filterText);
        // Persist the filter text in localStorage
        localStorage.setItem("quickFilterText", filterText);
    };

    const handleExportExcel = () => {
        if (!gridApi) {
            console.error("Grid API not available for Excel export.");
            return;
        }

        const selectedRows = gridApi.getSelectedRows();
        const exportOnlySelected = selectedRows.length > 0;

        const allColumns = gridApi.getColumns();

        const columnKeys = allColumns
            .filter((col) => {
                const colDef = col.getColDef();

                return (
                    colDef.field &&
                    colDef.field !== "actions" &&
                    colDef.field !== "action" &&
                    !colDef.hide
                );
            })
            .map((col) => col.getColDef().field);

        gridApi.exportDataAsExcel({
            onlySelected: exportOnlySelected, // Export selected rows only if rows are selected

            sheetName:
                typeof ExportName === "string"
                    ? ExportName
                    : "Report",

            fileName:
                typeof ExportName === "string"
                    ? `${ExportName}.xlsx`
                    : "Report.xlsx",

            columnKeys,

            processCellCallback: (params) => {
                let value = params.value;
                const columnId = params.column.getColId();

                if (
                    (columnId === "requestTimestamp" ||
                        columnId === "responseTimestamp") &&
                    (value === null ||
                        value === undefined ||
                        value === "")
                ) {
                    return "";
                }

                if (
                    columnId === "facilitiesAssigned" &&
                    Array.isArray(value)
                ) {
                    return value
                        .map((item) => item.value)
                        .join(", ");
                }

                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return "N/A";
                }

                if (
                    typeof value === "object" &&
                    value !== null
                ) {
                    return JSON.stringify(value);
                }

                if (
                    columnId === "applicationId" ||
                    columnId === "bookingId" ||
                    columnId === "orderId"
                ) {
                    return `'${value}`;
                }

                return value;
            },
        });
    };

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
    }, [gridApi, quickFilterText]);

    return (
        <div className="bg-white/30 backdrop-blur-md p-2 border rounded-2xl">
            {/* Search and Export Buttons */}
            <div className="ag-grid-toolbar flex justify-between items-end p-1 bg-white rounded-2xl mb-2 shadow-sm backdrop-blur-sm">
                {showSearch && (
                    <div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={quickFilterText} // Controlled input
                            onChange={handleQuickFilterChange}
                            className={` border border-gray-300  rounded-xl shadow-sm focus:outline-none bg-white text-sm`}
                        />
                    </div>
                )}
                <div className="flex items-center gap-4 ml-auto">
                    {showTotalCount && rowData.length > 0 && (
                        <span className="text-sm font-semibold text-gray-500 py-1.5 px-3 bg-gray-100 rounded-xl border">
                            Total Count: <span className="text-blue-v2">{totalCount}</span>
                        </span>
                    )}
                    <div className="flex bg-gray-100 p-2 rounded-xl gap-4 items-end shadow-md border border-v1">
                        <button onClick={handleExportExcel} className="ag-grid-button">
                            <FaFileCsv className="text-blue-v2 text-xl" />
                        </button>
                    </div>
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
                    paginationPageSizeSelector={[20, 50, 100, 500, 1000]}
                    pinnedBottomRowData={pinnedBottomRowData}
                    columnDefs={columnDefs?.map((col) => ({
                        ...col,
                        minWidth: col.minWidth || 180,
                        sortable: true,
                    }))}
                    quickFilterText={quickFilterText}
                    rowSelection={rowSelection}
                    suppressRowClickSelection={true}
                    onSelectionChanged={(event) => {
                        onSelectionChanged?.(event.api.getSelectedRows());
                    }}
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
                    onRowSelected={(event) => {
                        // Optional: Handle row selection events
                        console.log('Row selected:', event.data);
                    }}
                />

                {/* Loader overlay within the table body */}
                {isFetchLoading && (
                    <div className="ag-table-body-loader backdrop-blur-sm bg-white/30">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
            {IsReactPaginate && !isFetchLoading && rowData?.length > 0 && (
                <div className="mt-4 flex justify-end items-center gap-4">
                    <div>
                        <span className="">Page Size: &nbsp;</span>
                        <select
                            className=" py-1 border border-gray-300 rounded-lg"
                            onChange={(e) => {
                                setPageLimit(e.target.value);
                                SetcurrentPage(0);
                            }}
                            value={pageLimit}
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                            <option value={20000}>20000</option>
                            <option value={20000}>50000</option>
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
                        containerClassName={
                            "pagination border px-2 py-1 rounded-lg flex gap-2"
                        }
                        activeLinkClassName={
                            "text-white bg-blue-v2 px-3 py-1 rounded inline-block"
                        }
                        breakLinkClassName={
                            "border px-3 py-1 rounded hover:bg-blue-v2 inline-block hover:text-white"
                        }
                        pageLinkClassName={
                            "border px-3 py-1 rounded hover:bg-blue-v2 hover:text-white inline-block"
                        }
                        previousLinkClassName={
                            "border px-3 py-1 ml-2 rounded hover:bg-blue-v2 inline-block hover:text-white"
                        }
                        nextLinkClassName={
                            "border px-3 py-1 rounded hover:bg-blue-v2 inline-block hover:text-white"
                        }
                        forcePage={currentPage}
                    />
                </div>
            )}
        </div>
    );
};

AgGridTable4.propTypes = {
    rowData: PropTypes.array.isRequired,
    columnDefs: PropTypes.array.isRequired,
    isFetchLoading: PropTypes.bool.isRequired,
    pinnedBottomRowData: PropTypes.array,
    ExportName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    gridOptions: PropTypes.object,
    tableHeight: PropTypes.number,
    isPagination: PropTypes.bool,
    IsReactPaginate: PropTypes.bool,
    setPageLimit: PropTypes.func,
    pageLimit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handlePageClick: PropTypes.func,
    currentPage: PropTypes.number,
    showTotalCount: PropTypes.bool,
    totalCount: PropTypes.number,
    SetcurrentPage: PropTypes.func,
    showSearch: PropTypes.bool,
    rowSelection: PropTypes.string,
    onSelectionChanged: PropTypes.func,
};

export default AgGridTable4;
