import React from "react";
import AgGridTable from "../../../components/tables/AgGridTable";

const PosList = () => {
  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "Department",
      headerName: "Department",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "EmailId",
      headerName: "Email Id",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <>
          <div
            className={`
                      "flex items-center justify-around py-2"
                    `}
          >
            {/* edit */}
            <button className="" onClick={() => {}}>
              <span className="">
                <LuClipboardEdit className="text-[24px] text-blue-600 " />
              </span>
            </button>
          </div>
        </>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ];
  return (
    <div>
      <AgGridTable
        ExportName="Pos"
        // rowData={MetroTotalTransactionsData}
        columnDefs={columnDefs}
        // isFetchLoading={isMetroTotalTransactionsLoading}
        // isPagination={false}
        // IsReactPaginate={true}
        // setPageLimit={setPAGE_LIMIT}
        // pageLimit={PAGE_LIMIT}
        // handlePageClick={handlePageClick}
        // currentPage={currentPage}
        // showTotalCount={true}
        // totalCount={MetroTotalTransactionsData[0]?.totalCount}
        // tableHeight={MetroTotalTransactionsData.length > 10 ? 550 : 300}
        // SetcurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default PosList;
