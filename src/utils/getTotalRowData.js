const parseTotalValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    if (cleaned === "") {
      return 0;
    }

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const formatTotalValue = (sum) =>
  Number.isInteger(sum) ? sum : Number(sum.toFixed(2));

const isTotalRow = (params) => Boolean(params?.data?.isTotal);

const applyTotalRowDisplay = (columnDefs = []) =>
  columnDefs.map((col) => {
    if (!col) {
      return col;
    }

    const originalValueFormatter = col.valueFormatter;
    const originalCellRenderer = col.cellRenderer;
    const originalCellStyle = col.cellStyle;

    return {
      ...col,
      valueFormatter: (params) => {
        if (isTotalRow(params)) {
          if (col.isTotal === true) {
            return typeof originalValueFormatter === "function"
              ? originalValueFormatter(params)
              : params?.value;
          }

          return params?.value === "Total" ? "Total" : "";
        }

        if (typeof originalValueFormatter === "function") {
          return originalValueFormatter(params);
        }

        return params?.value;
      },
      cellStyle: (params) => {
        const existingStyle =
          typeof originalCellStyle === "function"
            ? originalCellStyle(params)
            : originalCellStyle;

        if (isTotalRow(params)) {
          return { ...(existingStyle || {}), fontWeight: "bold" };
        }

        return existingStyle || null;
      },
      ...(typeof originalCellRenderer === "function"
        ? {
            cellRenderer: (params) => {
              if (isTotalRow(params)) {
                return "";
              }
              return originalCellRenderer(params);
            },
          }
        : {}),
    };
  });

/**
 * Builds grid rows with a total row for columns marked `isTotal: true`.
 * Returns row data plus columnDefs that blank non-total cells (no "N/A" or buttons).
 */
export const getTotalRowData = (tableData = [], columnDefs = []) => {
  if (!Array.isArray(tableData) || !Array.isArray(columnDefs)) {
    return {
      rowData: Array.isArray(tableData) ? tableData : [],
      columnDefs: Array.isArray(columnDefs) ? columnDefs : [],
    };
  }

  const totalColumns = columnDefs.filter((col) => col?.isTotal === true);

  if (totalColumns.length === 0) {
    return { rowData: tableData, columnDefs };
  }

  const rows = tableData.filter((row) => !row?.isTotal);
  if (rows.length === 0) {
    return { rowData: tableData, columnDefs };
  }

  const firstVisibleCol = columnDefs.find((col) => col?.field && !col.hide);
  const totalRow = { isTotal: true };

  if (firstVisibleCol?.field) {
    totalRow[firstVisibleCol.field] = "Total";
  }

  totalColumns.forEach((col) => {
    if (!col?.field) {
      return;
    }

    const sum = rows.reduce(
      (acc, row) => acc + parseTotalValue(row?.[col.field]),
      0
    );
    totalRow[col.field] = formatTotalValue(sum);
  });

  return {
    rowData: [...rows, totalRow],
    columnDefs: applyTotalRowDisplay(columnDefs),
  };
};
