import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { formatToStandardDate } from "../../utils/TypographyHelper";
import { DepartmentAdminStore } from "../../store/masters/departmentAdminStore";
import { Field, Form, Formik } from "formik";
import { ToastContainer } from "react-toastify";

const DepartmentAdminList = ({
  setIsNodalOfficerCreateVisible,
  isNodalOfficerEditVisible,
  setIsNodalOfficerEditVisible,
}) => {
  const {
    allDepartmentAdmin,
    isFetchAllDepartmentAdminLoading,
    fetchAllDepartmentAdmin,
    setCurrentDepartmentAdminEditDetails,
  } = DepartmentAdminStore();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Load filters from localStorage on component mount
  const getStoredFilters = () => {
    try {
      const stored = localStorage.getItem('departmentAdminFilters');
      return stored ? JSON.parse(stored) : { fromDate: "", toDate: "", mobileNumber: "" };
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
      return { fromDate: "", toDate: "", mobileNumber: "" };
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  
  useEffect(() => {
    const storedFilters = getStoredFilters();
    fetchAllDepartmentAdmin({
      fromDateTime: storedFilters.fromDate || "",
      toDateTime: storedFilters.toDate || "",
      mobileNumber: storedFilters.mobileNumber || "",
      pageSize: PAGE_LIMIT,
      PageNumber: currentPage+1
    });
  }, [currentPage,PAGE_LIMIT])

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) => {
        return (currentPage * PAGE_LIMIT) + params.node.rowIndex + 1;
      },
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
     {
      field: "departmentAssigned",
      headerName: "Department Name",
      flex: 2,
      minWidth:365,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <>
          <div className={"flex items-center justify-start gap-1 "}>
            {params?.value && params.value.length > 0 ? (
              params.value.map((item, i) => (
                <span key={item}>
                  {item.value} {i < params.value.length - 1 ? " ," : ""}
                </span>
              ))
            ) : (
              <span className="text-black">N/A</span>
            )}
          </div>
        </>
      ),
    },
    {
      field: "departmentAdminName",
      headerName: "Officer Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        const { firstName, lastName } = params.data;
        return firstName || lastName
          ? `${firstName || ""} ${lastName || ""}`
          : "N/A";
      },
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
      maxWidth:150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth:100,
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
      maxWidth:100,
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem", position: "relative", top: "9px" }}>
          <button
            className="btn-edit"
            onClick={() => {
              setCurrentDepartmentAdminEditDetails(params.data);
              setIsNodalOfficerCreateVisible(true);
              setIsNodalOfficerEditVisible(true);
            }}
          >
            <span className="">
              <LuClipboardEdit className="text-[24px] text-blue-600 " />
            </span>
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ];
  const initialValues = getStoredFilters();
  const onSubmit = (values) => {
    // Save filters to localStorage
    try {
      localStorage.setItem('departmentAdminFilters', JSON.stringify(values));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
    
    fetchAllDepartmentAdmin({
      fromDateTime: values.fromDate || "",
      toDateTime: values.toDate || "",
      mobileNumber: values.mobileNumber || "",
      pageSize: 100,
      PageNumber: 1,
    });
  };
  return (
    <>
      <div>
      <ToastContainer />
        <Formik 
          initialValues={initialValues} 
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, setValues }) => (
            <>
              <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-xs font-medium text-gray-700"
                  >
                    From Date
                  </label>
                  <Field
                    type="datetime-local"
                    name="fromDate"
                    max={values.toDate || ""}
                    className={`mt-1 block w-full px-2 py-1 border
                                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    onChange={(e) => {
                      const fromDateValue = e.target.value;
                      setFieldValue("fromDate", fromDateValue);
                      // If To Date is set and is before the new From Date, clear it
                      if (values.toDate && fromDateValue && new Date(values.toDate) < new Date(fromDateValue)) {
                        setFieldValue("toDate", "");
                      }
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-xs font-medium text-gray-700"
                  >
                    To Date
                  </label>
                  <Field
                    type="datetime-local"
                    name="toDate"
                    min={values.fromDate || ""}
                    className={`mt-1 block w-full px-2 py-1 border
                                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    onChange={(e) => {
                      const toDateValue = e.target.value;
                      setFieldValue("toDate", toDateValue);
                      // If From Date is set and is after the new To Date, clear it
                      if (values.fromDate && toDateValue && new Date(values.fromDate) > new Date(toDateValue)) {
                        setFieldValue("fromDate", "");
                      }
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <Field
                    type="text"
                    name="mobileNumber"
                    placeholder="Enter Mobile Number"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                    // disabled={isfetchAllMetroBookingDetailsReportsLoading}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Clear localStorage
                      localStorage.removeItem('departmentAdminFilters');
                      // Reset form values
                      setValues({ fromDate: "", toDate: "", mobileNumber: "" });
                      // Fetch with empty filters
                      fetchAllDepartmentAdmin({
                        fromDateTime: "",
                        toDateTime: "",
                        mobileNumber: "",
                        pageSize: 100,
                        PageNumber: 1,
                      });
                    }}
                    className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                  >
                    Reset
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
      <AgGridTable
        ExportName="Department Admin"
        isFetchLoading={isFetchAllDepartmentAdminLoading}
        rowData={allDepartmentAdmin || []}
        columnDefs={columnDefs}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={allDepartmentAdmin && allDepartmentAdmin[0]?.totalCount}
        tableHeight={allDepartmentAdmin?.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </>
  );
};

export default DepartmentAdminList;
