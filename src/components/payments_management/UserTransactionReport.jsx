import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Field, Form, Formik } from "formik";
import { getCurrentDateEndTime, getCurrentDateStartTime } from "../../utils/TypographyHelper";
import AgGridTable from "../tables/AgGridTable";
import { userTransaction } from "../../store/user/userTransaction";
import { Link } from "react-router-dom";
import { useParkStore } from "../../store/masters/parksStore";
import Select from "react-select";

const UserTransactionReport = () => {
  const userTransactionReportFilter = JSON.parse(localStorage.getItem("UserTransactionReportFilter"));
  const { userTransactionReport, isFetchUserTransactionReport, fetchUserTransactionReport } = userTransaction();
  const {
    allParks,
    fetchAllParks,
  } = useParkStore();

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
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "totalAttempts",
      headerName: "Total Attempts",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (<Link className="text-blue-v2" state={{ mobileNumber: params.data.mobileNumber, status: "" }} to="/user-status-transaction">{params.value}</Link>),
    },
    {
      field: "successCount",
      headerName: "Success Count",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => <Link className="text-blue-v2" state={{ mobileNumber: params.data.mobileNumber, status: "CONFIRMED" }} to="/user-status-transaction">{params.value}</Link>,
    },
    {
      field: "pendingCount",
      headerName: "In Process Count",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (<Link className="text-blue-v2" state={{ mobileNumber: params.data.mobileNumber, status: "INPROCESS" }} to="/user-status-transaction">{params.value}</Link>),
    },
    {
      field: "failureCount",
      headerName: "Failure Count",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (<Link className="text-blue-v2" state={{ mobileNumber: params.data.mobileNumber, status: "FAILED" }} to="/user-status-transaction">{params.value}</Link>),
    },
  ]);

  useEffect(() => {
    fetchAllParks();
    fetchUserTransactionReport(initialValues);
  }, [])

  const initialValues = {
    fromDate: userTransactionReportFilter?.fromDate || getCurrentDateStartTime(),
    toDate: userTransactionReportFilter?.toDate || getCurrentDateEndTime(),
    mobileNumber: userTransactionReportFilter?.mobileNumber || "",
    parkId: userTransactionReportFilter?.parkId || "",
  };

  const onSubmit = (values) => {
    fetchUserTransactionReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber,
      parkId: values.parkId,
    });
    localStorage.setItem("UserTransactionReportFilter", JSON.stringify(values));
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
                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <Field
                      type="text"
                      name="mobileNumber"
                      placeholder="Enter Phone Number"
                      className={`mt-1 block w-full px-2 py-1 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Location
                    </label>

                    <Select
                      name="parkId"
                      value={
                        allParks
                          ?.filter((park) => park.isActive)
                          .map((park) => ({
                            value: park.id,
                            label: park.name,
                          }))
                          .find((option) => option.value === values.parkId) || null
                      }
                      options={allParks
                        ?.filter((park) => park.isActive)
                        .map((park) => ({
                          value: park.id,
                          label: park.name,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue("parkId", selectedOption?.value || "")
                      }
                      isClearable
                      placeholder="Location"
                      className="mt-[4px] text-sm"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          outline: "none",
                          boxShadow: "none",
                          borderColor: "#ced4da",
                          borderRadius: "6px",
                          height: "30px",
                          minHeight: "33px",
                        }),

                        menu: (base) => ({
                          ...base,
                          // padding: "4px 0",
                        }),
                        option: (base, { isFocused }) => ({
                          ...base,
                          fontSize: "0.775rem",
                          backgroundColor: isFocused ? "#F8F8F8" : "white",
                          color: isFocused ? "#0C3771" : "#6D7072",
                          cursor: "pointer",
                        }),
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
              ExportName="UserTransactionReport"
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