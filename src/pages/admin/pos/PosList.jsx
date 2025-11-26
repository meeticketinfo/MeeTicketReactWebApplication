import React, { useEffect, useState } from "react";
import AgGridTable from "../../../components/tables/AgGridTable";
import { PosUserCreationStore } from "./pos_store/PosUserCreationStore";
import { LuClipboardEdit } from "react-icons/lu";
import PosListForm from "./PosListForm";
import { ToastContainer } from "react-toastify";



const PosList = ({ setIsEdit, isEdit, setIsPosCreateVisible }) => {
  const {
    allPosUsers,
    isFetchAllPosUsersLoading,
    fetchAllPosUsers,
    setCurrentPosUserEditDetails,
  } = PosUserCreationStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("pos-user-report-filters")
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    fetchAllPosUsers({
      fromDate: savedFilters?.fromDate ?? "",
      toDate: savedFilters?.toDate ?? "",
      mobileNumber: savedFilters?.mobileNumber ? savedFilters.mobileNumber : "",
      pageNumber: currentPage + 1,
      PageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

  const columnDefs = [
    {
      field: "sno",
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
      headerName: "Email ID",
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

      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <>
          <div
            className={`flex   font-semibold gap-2  ${
              params.value
                ? "text-green-500  text-shadow-md"
                : "text-red-400 text-shadow-md"
            }`}
          >
            <span className="">{params.value ? "Active" : "In Active"}</span>
          </div>
        </>
      ),
    },
    {
      field: "facilitiesAssigned",
      headerName: "Facilities Assigned",
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <>
          <div className={"flex items-center  gap-1 "}>
            {params.value.map((item, i) => (
              <span key={i}>
                {item.value} {i < params.value.length - 1 ? " ," : ""}
                
              </span>
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
          <div className={` flex items-center justify-around py-2`}>
            {/* edit */}
            <button
              className=""
              onClick={() => {
                setIsEdit(true);
                setIsPosCreateVisible(true);
                setCurrentPosUserEditDetails(params.data);
              }}
            >
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
    <>
    <div>
      <ToastContainer />
      <PosListForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <AgGridTable
        ExportName="POS Users"
        rowData={allPosUsers}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllPosUsersLoading}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={allPosUsers && allPosUsers[0]?.totalCount}
        tableHeight={allPosUsers?.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </div>
    </>
  );
};

export default PosList;
