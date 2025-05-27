import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Field, Form, Formik } from "formik";
import { getCurrentDate, getCurrentDateEndTime, getCurrentDateStartTime } from "../../utils/TypographyHelper";
import AgGridTable from "../tables/AgGridTable";
import { userTransaction } from "../../store/user/userTransaction";
import { Link } from "react-router-dom";

const UserTransactionReport = () => {
  const {userTransactionReport, isFetchUserTransactionReport, fetchUserTransactionReport, fetFilters, filters} = userTransaction();
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile No.",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (<Link to="/user-status-transaction">{params.value}</Link>),
    },
    {
      field: "totalAttempts",
      headerName: "Total Attempts",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (<Link to="/user-status-transaction">{params.value}</Link>),
    },
    {
      field: "successCount",
      headerName: "Success Count",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "0",
    },
    {
      field: "pendingCount",
      headerName: "Pending Count",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "0",
    },
    {
      field: "failureCount",
      headerName: "Failure Count",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "0",
    },
  ]);


  const initialValues = {
    fromDate: filters.fromDate || getCurrentDateStartTime(),
    toDate: filters.toDate || getCurrentDateEndTime(),
  };

  useEffect(() => {
    fetchUserTransactionReport(initialValues);
  },[])

  const onSubmit = (values) => {
    console.log(values, "values")
    fetFilters(values)
    fetchUserTransactionReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                User Transaction Report
              </h1>
            </div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
          </div>
          <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
                  <div>
                    <label
                      htmlFor="fromDate"
                      className="block text-xs font-medium text-gray-700"
                    >
                      From Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="fromDate"
                      className={`mt-1 block w-full px-2 py-1 border
                              border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // min={getCurrentDate()}
                      onChange={(e) => {
                        const fromDateValue = e.target.value;
                        setFieldValue("fromDate", fromDateValue);
                        if (new Date(fromDateValue) > new Date(values.toDate)) {
                          // Automatically update toDate if it's earlier than fromDate
                          setFieldValue("toDate", fromDateValue);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="toDate"
                      className="block text-xs font-medium text-gray-700"
                    >
                      To Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // min={values.fromDate || getCurrentDateStartTime()}
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      disabled={isFetchUserTransactionReport}
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <AgGridTable
              ExportName="Tourisim Bank Payment"
              rowData={userTransactionReport}
              columnDefs={columnDefs}
              isFetchLoading={isFetchUserTransactionReport}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default UserTransactionReport;