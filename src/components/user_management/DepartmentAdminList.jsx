import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { formatToStandardDate } from "../../utils/TypographyHelper";
import { useNodalOfficerStore } from "../../store/masters/nodalOfficerStore";
import { Field, Form, Formik } from "formik";

const DepartmentAdminList = ({
  setIsNodalOfficerCreateVisible,
  isNodalOfficerEditVisible,
  setIsNodalOfficerEditVisible,
}) => {
  const {
    allNodalOfficers,
    isFetchAllNodalOfficersLoading,
    fetchAllNodalOfficers,
    setCurrentNodalOfficerEditDetails,
    fetchAllNodalOfficerParks,
  } = useNodalOfficerStore();

  useEffect(() => {
    fetchAllNodalOfficers();
  }, []);

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "firstName",
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
      field: "lastName",
      headerName: "Department Name",
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
      field: "phoneNumber",
      headerName: "Mobile Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "isActive",
      headerName: "Status",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value
                ? "bg-green-400 text-white shadow-md"
                : "bg-red-400 text-white shadow-md"
            } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
          >
            {" "}
            {params.value ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      headerClass: "text-blue-v2",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <button
            className="btn-edit"
            onClick={() => {
              setCurrentNodalOfficerEditDetails(params.data);
              setIsNodalOfficerCreateVisible(true);
              setIsNodalOfficerEditVisible(true);
              if (params.data.id) {
                fetchAllNodalOfficerParks(null, null, {}, params.data.id);
              }
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
  const initialValues = {
    fromDate: "",
    toDate: "",
    mobileNumber: "",
  };
  const onSubmit = (values) => {
    console.log(values);
  };
  return (
    <>
      <div>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
                    className={`mt-1 block w-full px    -2 py-1 border
                                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    className={`mt-1 block w-full px-2 py-1 border
                                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    //   onChange={(e) => {
                    //     const toDateValue = e.target.value;
                    //     setFieldValue("toDate", toDateValue);
                    //   }}
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
                </div>
              </Form>

             
            </>
          )}
        </Formik>
      </div>
      <AgGridTable
        ExportName="Nodal Officer"
        isFetchLoading={isFetchAllNodalOfficersLoading}
        rowData={allNodalOfficers}
        columnDefs={columnDefs}
      />
    </>
  );
};

export default DepartmentAdminList;
