import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  TableContainer,
  Stack,
} from "@mui/material";

const MuiTable = ({
  columns = [],
  data = [],
  isLoading = false,
  error = null,
  page = 1,
  pageSize = 10,
  pagingTextInfo,
  totalCount = 0,
  handlePageChange,
  rowStyles = {},
}) => {
  return (
    <Paper sx={{ width: "100%" }}>
      <>
        <TableContainer
          sx={{
            maxHeight: "80vh",
            maxWidth: "100%", // Set max width for the table
            overflow: "auto", // Enable horizontal scrolling
            fontSize: "13px",
          }}
        >
          <Table stickyHeader sx={{ fontSize: "13px" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "gainsboro",
                    border: "1px solid rgb(221, 221, 221)",
                    color: "black",
                    padding: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  SNo
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    style={{
                      backgroundColor: "gainsboro",
                      border: "1px solid rgb(221, 221, 221)",
                      color: "black",
                      padding: "10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <CircularProgress />
                </div>
              ) : error ? (
                <div style={{ color: "red", textAlign: "center" }}>{error}</div>
              ) : data.length > 0 ? (
                <>
                  {data.map((row, rowIndex) => (
                    <TableRow
                      key={row.id || rowIndex}
                      style={
                        rowIndex % 2 === 0 ? rowStyles.odd : rowStyles.even
                      }
                    >
                      <TableCell
                        style={{
                          padding: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {(page - 1) * pageSize + rowIndex + 1}
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          style={{
                            padding: "10px",
                            whiteSpace: "nowrap", // Prevent text wrapping
                          }}
                        >
                          {row[column.field] || "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow style={rowStyles.odd}>
                  <TableCell
                    colSpan={columns?.length + 1 || 1}
                    style={{ textAlign: "center" }}
                  >
                    <p>No data available</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 10px",
          }}
        >
          <span>{pagingTextInfo}</span>
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(totalCount / pageSize)}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  backgroundColor: "#f8f8f8", // Default background color
                  "&:hover": {
                    backgroundColor: "#198754",
                    color: "#fff",
                  },
                },
                "& .Mui-selected": {
                  backgroundColor: "#198754 !important", // Active page button color
                  color: "#fff", // Change text color if needed
                  "&:hover": {
                    backgroundColor: "#198754",
                    color: "#fff",
                  },
                },
              }}
            />
          </Stack>
        </div>
      </>
    </Paper>
  );
};

export default MuiTable;
