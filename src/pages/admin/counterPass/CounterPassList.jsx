import React, { useEffect, useState } from "react";
import AgGridTable from "../../../components/tables/AgGridTable";
import { CounterPassUserCreationStore } from "./counterpass_store/CounterPassUserCreationStore";
import { LuClipboardEdit } from "react-icons/lu";
import CounterPassListForm from "./CounterPassListForm";
import { ToastContainer } from "react-toastify";



const CounterPassList = ({ setIsEdit, isEdit, setIsCounterPassCreateVisible }) => {
  const {
    allCounterPassUsers,
    isFetchAllCounterPassUsersLoading,
    fetchAllCounterPassUsers,
    setCurrentCounterPassUserEditDetails,
  } = CounterPassUserCreationStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("counterpass-user-report-filters")
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    fetchAllCounterPassUsers({
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
      field: "counterPassAdminName",
      headerName: "Counter Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueGetter: (params) => params.data?.counterName || params.data?.counterPassAdminName || "N/A",
    },
    {
      field: "counterNumber",
      headerName: "Counter Number",
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
      headerName: "Mobile Number",
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
                setIsCounterPassCreateVisible(true);
                setCurrentCounterPassUserEditDetails(params.data);
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
      <CounterPassListForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <AgGridTable
        ExportName="Counter Pass Users"
        rowData={allCounterPassUsers}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllCounterPassUsersLoading}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={allCounterPassUsers && allCounterPassUsers[0]?.totalCount}
        tableHeight={allCounterPassUsers?.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </div>
    </>
  );
};

export default CounterPassList;

