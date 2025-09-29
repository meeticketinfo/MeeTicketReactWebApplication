import React, { useEffect } from "react";
import AgGridTable from "../../../components/tables/AgGridTable";
import { PosUserCreationStore } from "./pos_store/PosUserCreationStore";
import { LuClipboardEdit } from "react-icons/lu";

const PosList = () => {
  const { allPosUsers, isFetchAllPosUsersLoading, fetchAllPosUsers } =
    PosUserCreationStore();
  useEffect(() => {
    fetchAllPosUsers();
  }, []);
  console.log("allPosUsers", allPosUsers);
  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "posAdminName",
      headerName: "POS Admin Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "emailId",
      headerName: "Email Id",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "mobileNumber",
      headerName: "Phone Number",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: 100,
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <>
          <div className={`flex items-center gap-2 py-2 ${params.value? "text-green-500  text-shadow-md" : "text-red-400  text-shadow-md"}`}>
            {params.value? "Active" : "In Active"}
          </div>
        </>
      ),
    },
    {
      field: "facilitiesAssigned",
      headerName: "facilities Assigned",
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <>
          <div className={"flex items-center gap-1 py-2"}>
            {params.value.map((item,i) => (
              <span key={item}>{item.value} {i<params.value.length-1?" ,":""}</span>
            ))}
          </div>
        </>
      ),
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
        rowData={allPosUsers}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllPosUsersLoading}
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
