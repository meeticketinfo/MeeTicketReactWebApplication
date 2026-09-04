import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";
import { FaFileCsv, FaFilePdf } from "react-icons/fa6";
import usePaginationStore from "../../store/paginationStore";
import { useAggridStore } from "../../store/agGridStore";
import { ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import ReactPaginate from "react-paginate";
import { formatDateTime } from "../../utils/Helper";
ModuleRegistry.registerModules([ExcelExportModule]);

const AgGridTable = ({
  rowData = [],
  columnDefs,
  isFetchLoading,
  pinnedBottomRowData,
  getPagePinnedBottomRowData,
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
  totalCount=0,
  SetcurrentPage,
  showSearch = true,
  showPdfExport = false,
}) => {
  const { activePage, setActivePage } = usePaginationStore();
  const { quickFilterText, setQuickFilterText } = useAggridStore();
  console.log("pageLimit", pageLimit,totalCount);
  const gridRef = useRef(null);
  // const [quickFilterText, setQuickFilterText] = useState("");
  const [gridApi, setGridApi] = useState(null); // Store the grid API
  const getPagePinnedBottomRowDataRef = useRef(getPagePinnedBottomRowData);
  getPagePinnedBottomRowDataRef.current = getPagePinnedBottomRowData;

  const isPaginationEnabled = rowData.length > 10 && isPagination;
  const gridHeight = tableHeight || (isPaginationEnabled ? 550 : 300);

  const updatePagePinnedBottom = (api) => {
    const buildPinnedRow = getPagePinnedBottomRowDataRef.current;
    if (!buildPinnedRow || !api) return;

    const filteredRows = [];
    api.forEachNodeAfterFilterAndSort((node) => {
      if (node?.data) filteredRows.push(node.data);
    });

    if (filteredRows.length === 0) {
      api.setGridOption("pinnedBottomRowData", []);
      return;
    }

    let pageRows = filteredRows;
    const paginationActive = api.getGridOption?.("pagination");
    if (paginationActive) {
      const pageSize = api.paginationGetPageSize();
      const currentPage = api.paginationGetCurrentPage();
      const start = currentPage * pageSize;
      pageRows = filteredRows.slice(start, start + pageSize);
    }

    api.setGridOption(
      "pinnedBottomRowData",
      pageRows.length > 0 ? buildPinnedRow(pageRows) : [],
    );
  };

  useEffect(() => {
    setQuickFilterText("");
  }, []);

  useEffect(() => {
    if (gridApi && getPagePinnedBottomRowData) {
      // Allow ag-grid to apply new rowData before calculating page totals
      const timer = setTimeout(() => updatePagePinnedBottom(gridApi), 0);
      return () => clearTimeout(timer);
    }
  }, [rowData, quickFilterText, gridApi, getPagePinnedBottomRowData]);

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
      // Get all visible columns including dynamic ones
      const allColumns = gridApi.getColumns();
      const columnKeys = allColumns
        .filter((col) => {
          const colDef = col.getColDef();
          return colDef.field && 
                 colDef.field !== "actions" && 
                 colDef.field !== "action" &&
                 !colDef.hide; // Only include visible columns
        })
        .map((col) => col.getColDef().field);

      // Excel exports all filtered rows, so TOTAL must be grand total (not page total)
      const buildPinnedRow = getPagePinnedBottomRowDataRef.current;
      if (buildPinnedRow) {
        const filteredRows = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
          if (node?.data && !node.data.isTotal) filteredRows.push(node.data);
        });
        gridApi.setGridOption(
          "pinnedBottomRowData",
          filteredRows.length > 0 ? buildPinnedRow(filteredRows) : [],
        );
      }

      gridApi.exportDataAsExcel({
        sheetName: typeof ExportName === "string" ? ExportName : "Report",
        fileName:
          ExportName && typeof ExportName === "string"
            ? `${ExportName}.xlsx`
            : "Report.xlsx",
        columnKeys: columnKeys,
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
          const columnId = params.column.getColId();
          const isTotalRow =
            params.node?.rowPinned === "bottom" || params.node?.data?.isTotal;

          const formatAmountValue = (amount) => {
            if (amount === null || amount === undefined || amount === "") {
              return isTotalRow ? "" : "N/A";
            }
            const numericValue = Number(amount);
            // Keep as number so Excel right-aligns and applies #,##0.00
            return Number.isNaN(numericValue) ? amount : numericValue;
          };

          if (
            columnId === "totalTicketAmount" ||
            columnId === "amount" ||
            columnId === "totalAmount"
          ) {
            return formatAmountValue(value);
          }

          if (columnId === "validityDate") {
            if (isTotalRow) return "";
            return formatBookingDateForExport(value);
          }

          if (isTotalRow) {
            if (value === null || value === undefined || value === "") {
              return "";
            }
            return value;
          }

          if (
            (columnId === "requestTimestamp" ||
              columnId === "responseTimestamp") &&
            (value === null || value === undefined || value === "")
          ) {
            return ""; // empty string
          }
          
          if (columnId === "facilitiesAssigned" && Array.isArray(value)) {
            return value.map((item, i) => `${item.value}${i < value.length - 1 ? "," : ""}`).join(" ");
          }

          // Ensure "Refund ID" and empty values show "N/A"
          if (value === null || value === undefined || value === "") {
            return "N/A";
          }

          // Convert objects to readable JSON strings
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }

          if (columnId === "bpTransactionStatus" || columnId === "transactionStatus") {
            if (value === "INITIATE") return "Request Sent";
            if (value === "INPROCESS") return "Deep Link Status";
            if (value === "STATUSCALL") return "Payment Status Check";
            if (value === "FINAL_STATUS")
              return params.node?.data?.resultStatus || "N/A";
            return params.node?.data?.transactionStatus || "Payment Status Check";
          }

          // Handle specific fields that should always be treated as text
          if (
            columnId === "applicationId" ||
            columnId === "bookingId" ||
            columnId === "orderId"
          ) {
            return `'${value}`; // Prefix with apostrophe to ensure text format in Excel
          }

          // Format date and time values using formatDateTime
          if (
            typeof value === "string" &&
            (value.includes("T") || value.includes("-") || value.includes(":"))
          ) {
            // Check if it looks like a date/time string
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
            const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
            const isoDateRegex =
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z?$/;

            if (
              dateRegex.test(value) ||
              dateTimeRegex.test(value) ||
              isoDateRegex.test(value)
            ) {
              try {
                return formatDateTime(value);
              } catch (error) {
                console.warn("Error formatting date/time:", error);
                return value; // Return original value if formatting fails
              }
            }
          }

          // Prevent scientific notation by treating numbers longer than 15 digits as text
          if (/^\d{16,}$/.test(value)) {
            return `'${value}`; // Prefix with apostrophe to ensure text format
          }

          return value;
        },
      });

      // Restore page-wise total after export
      if (buildPinnedRow) {
        updatePagePinnedBottom(gridApi);
      }
    } else {
      console.error("Grid API not available for Excel export.");
    }
  };

  const formatExportAmount = (amount) => {
    if (amount === null || amount === undefined || amount === "") return "";
    const numericValue = Number(amount);
    if (Number.isNaN(numericValue)) return String(amount);
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const removeSecondsFromDateTime = (value) => {
    if (value === null || value === undefined || value === "") return value;
    return String(value).replace(
      /(\d{1,2}:\d{2}):\d{2}(\s*[AaPp][Mm])?/,
      "$1$2",
    );
  };

  const formatBookingDateForExport = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return `${day}-${month}-${year} ${formattedTime}`;
    }
    return removeSecondsFromDateTime(value) || "N/A";
  };

  const handleExportPdf = async () => {
    if (!gridApi) {
      console.error("Grid API not available for PDF export.");
      return;
    }

    try {
      const jsPdfModule = await import("jspdf");
      const JsPDF = jsPdfModule.jsPDF || jsPdfModule.default;

      const amountFields = ["totalTicketAmount", "amount", "totalAmount"];
      const exportColumns = gridApi
        .getColumns()
        .map((col) => col.getColDef())
        .filter(
          (colDef) =>
            colDef.field &&
            colDef.field !== "actions" &&
            colDef.field !== "action" &&
            !colDef.hide,
        );

      const filteredRows = [];
      gridApi.forEachNodeAfterFilterAndSort((node) => {
        if (node?.data && !node.data.isTotal) filteredRows.push(node.data);
      });

      if (filteredRows.length === 0) return;

      const buildPinnedRow = getPagePinnedBottomRowDataRef.current;
      const totalRow = buildPinnedRow ? buildPinnedRow(filteredRows)?.[0] : null;

      const headers = ["S.No", ...exportColumns.map((col) => col.headerName || col.field)];
      const bodyRows = filteredRows.map((row, index) => [
        String(index + 1),
        ...exportColumns.map((col) => {
          const value = row[col.field];
          if (amountFields.includes(col.field)) {
            return formatExportAmount(value);
          }
          if (col.field === "validityDate") {
            return formatBookingDateForExport(value);
          }
          if (value === null || value === undefined || value === "") return "N/A";
          return String(value);
        }),
      ]);

      if (totalRow) {
        bodyRows.push([
          "",
          ...exportColumns.map((col) => {
            if (col.field === "transactionId") return "TOTAL";
            if (amountFields.includes(col.field)) {
              return formatExportAmount(totalRow[col.field]);
            }
            return "";
          }),
        ]);
      }

      const pdf = new JsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 20;
      const marginY = 30;
      const title =
        typeof ExportName === "string" && ExportName
          ? ExportName
          : "Report";

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, pageWidth / 2, marginY, { align: "center" });

      const tableTop = marginY + 16;
      const usableWidth = pageWidth - marginX * 2;
      const colCount = headers.length;
      const colWidth = usableWidth / colCount;
      const fontSize = colCount > 12 ? 6 : colCount > 8 ? 7 : 8;
      const lineHeight = fontSize + 4;
      const cellPadding = 2;

      const wrapText = (text, maxWidth) => {
        const words = String(text ?? "").split(/\s+/);
        const lines = [];
        let current = "";
        words.forEach((word) => {
          const test = current ? `${current} ${word}` : word;
          if (pdf.getTextWidth(test) > maxWidth && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        });
        if (current) lines.push(current);
        return lines.length ? lines : [""];
      };

      const drawRow = (cells, y, isHeader = false, isTotal = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isHeader || isTotal ? "bold" : "normal");

        const cellLines = cells.map((cell, idx) => {
          const maxTextWidth = colWidth - cellPadding * 2;
          return wrapText(cell, maxTextWidth);
        });
        const rowHeight =
          Math.max(...cellLines.map((lines) => lines.length)) * lineHeight +
          cellPadding * 2;

        if (y + rowHeight > pageHeight - marginY) {
          pdf.addPage();
          y = marginY;
        }

        let x = marginX;
        cellLines.forEach((lines, idx) => {
          pdf.setDrawColor(180);
          pdf.setFillColor(isHeader ? 230 : isTotal ? 245 : 255, isHeader ? 236 : isTotal ? 245 : 255, isHeader ? 240 : isTotal ? 245 : 255);
          pdf.rect(x, y, colWidth, rowHeight, "FD");

          const isAmountCol =
            idx > 0 && amountFields.includes(exportColumns[idx - 1]?.field);
          lines.forEach((line, lineIdx) => {
            const textY = y + cellPadding + (lineIdx + 1) * lineHeight - 2;
            if (isAmountCol) {
              pdf.text(line, x + colWidth - cellPadding, textY, {
                align: "right",
              });
            } else {
              pdf.text(line, x + cellPadding, textY);
            }
          });
          x += colWidth;
        });

        return y + rowHeight;
      };

      let cursorY = tableTop;
      cursorY = drawRow(headers, cursorY, true, false);
      bodyRows.forEach((row, rowIndex) => {
        const isTotal = Boolean(totalRow) && rowIndex === bodyRows.length - 1;
        cursorY = drawRow(row, cursorY, false, isTotal);
      });

      const fileName =
        typeof ExportName === "string" && ExportName
          ? `${ExportName}.pdf`
          : "Report.pdf";
      pdf.save(fileName);
    } catch (error) {
      console.error("Unable to export PDF:", error);
    }
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
  }, [quickFilterText]);

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
            <button
              onClick={handleExportExcel}
              className="ag-grid-button"
              title="Export Excel"
            >
              <FaFileCsv className="text-blue-v2 text-xl" />
            </button>
            {showPdfExport && (
              <button
                onClick={handleExportPdf}
                className="ag-grid-button"
                title="Export PDF"
              >
                <FaFilePdf className="text-red-600 text-xl" />
              </button>
            )}
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
          excelStyles={[
            {
              id: "excelAmount",
              alignment: { horizontal: "Right" },
              numberFormat: { format: "#,##0.00" },
            },
          ]}
          {...(getPagePinnedBottomRowData
            ? {}
            : { pinnedBottomRowData })}
          columnDefs={columnDefs?.map((col) => {
            const amountFields = [
              "totalTicketAmount",
              "amount",
              "totalAmount",
            ];
            const mappedCol = {
              ...col,
              minWidth: col.minWidth || 180,
              sortable: true,
            };
            if (amountFields.includes(col.field)) {
              const existingClass = col.cellClass;
              if (!existingClass) {
                mappedCol.cellClass = "excelAmount";
              } else if (typeof existingClass === "string") {
                mappedCol.cellClass = `${existingClass} excelAmount`;
              } else if (Array.isArray(existingClass)) {
                mappedCol.cellClass = [...existingClass, "excelAmount"];
              } else if (typeof existingClass === "function") {
                mappedCol.cellClass = (params) => {
                  const result = existingClass(params);
                  if (Array.isArray(result)) return [...result, "excelAmount"];
                  if (typeof result === "string")
                    return `${result} excelAmount`.trim();
                  return "excelAmount";
                };
              } else {
                mappedCol.cellClass = "excelAmount";
              }
            }
            return mappedCol;
          })}
          quickFilterText={quickFilterText}
          rowSelection="single"
          suppressRowClickSelection={false}
          onGridReady={(params) => {
            setGridApi(params.api); // Store the API instance
            if (isPaginationEnabled) {
              params.api.paginationGoToPage(activePage); // Navigate to the saved active page
            }
            updatePagePinnedBottom(params.api);
          }}
          onFirstDataRendered={(params) => {
            updatePagePinnedBottom(params.api);
          }}
          onPaginationChanged={(params) => {
            const api = params?.api || gridApi;
            if (api) {
              if (isPaginationEnabled) {
                const currentPage = api.paginationGetCurrentPage();
                if (currentPage !== activePage) {
                  setActivePage(currentPage);
                }
              }
              updatePagePinnedBottom(api);
            }
          }}
          onFilterChanged={(params) => {
            updatePagePinnedBottom(params.api);
          }}
          onSortChanged={(params) => {
            updatePagePinnedBottom(params.api);
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

AgGridTable.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
};

export default AgGridTable;
