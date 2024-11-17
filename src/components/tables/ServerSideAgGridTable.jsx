import "ag-grid-enterprise"; // Import ag-grid-enterprise
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";
import PropTypes from "prop-types";
import { useMemo, useCallback } from "react";

const ServerSideAgGridTable = ({
  rowData = [],
  columnDefs,
  isFetchLoading,
  onPageChange,
  totalRecords,
}) => {
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 180,
      filter: true,
    }),
    []
  );

  const dataTypeDefinitions = useMemo(
    () => ({
      object: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) => ({ name: params.newValue }),
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
      },
    }),
    []
  );

  const getServerSideDatasource = useCallback(() => {
    return {
      getRows: (params) => {
        const pageIndex = params.request.startRow / params.request.endRow;
        const pageSize = params.request.endRow - params.request.startRow;

        onPageChange(pageIndex + 1, pageSize)
          .then((data) => {
            params.successCallback(data.rows, totalRecords);
          })
          .catch((error) => {
            console.error(error);
            params.failCallback();
          });
      },
    };
  }, [onPageChange, totalRecords]);

  return (
    <div
      className="ag-theme-alpine bg-white/30 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg "
      style={{ height: 400, width: "100%", position: "relative" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        dataTypeDefinitions={dataTypeDefinitions}
        rowModelType="serverSide"
        serverSideDatasource={getServerSideDatasource()}
        paginationPageSize={10}
        cacheBlockSize={10}
        maxBlocksInCache={5}
      />
      {isFetchLoading && (
        <div className="ag-table-body-loader backdrop-blur-sm bg-white/30">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

ServerSideAgGridTable.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  isFetchLoading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalRecords: PropTypes.number.isRequired,
};

export default ServerSideAgGridTable;
