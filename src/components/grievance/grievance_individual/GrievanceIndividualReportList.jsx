import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import { getCurrentDate } from '../../../utils/TypographyHelper';
import AgGridTable from '../../tables/AgGridTable';

function GrievanceIndividualReportList() {
     const [columnDefs] = useState([
          {
            headerName: "S.No",
            valueGetter: "node.rowIndex + 1",
            maxWidth: "80",
            headerClass: "text-blue-v2",
          },
          {
            field: "Ticket ID",
            headerName: "Ticket ID",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => `${params.value} ` || "N/A",
          },
          {
            field: "User mobile Number",
            headerName: "User mobile Number",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => `${params.value} ` || "N/A",
          },
          {
            field: "Location category",
            headerName: "Location category",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => `${params.value} ` || "N/A",
          },
      
          {
            field: "Location Name",
            headerName: "Location Name",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => `${params.value} ` || "N/A",
          },
          {
            field: " Complaint Description",
            headerName: " Complaint Description",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) =>
              params.value === "null" ? "0" : params.value,
          },
          {
            field: "Incident Generated Date ",
            headerName: "Incident Generated Date ",
            maxWidth: "160",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => `${params.value} ` || "0",
          },
          {
            field: "Incident Updated Date",
            headerName: "Incident Updated Date",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "0",
          },
          {
            field: "Status",
            headerName: "Status ",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
          },
          {
            field: "Recent Comments",
            headerName: "Recent Comments ",
      
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
          },
        ]);
         const initialValues = {
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
          };
          const onSubmit = (values) => {
            fetchAllMetroSummaryReport({
              fromDate: values.fromDate,
              toDate: values.toDate,
            });
          };
  return (
     <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
                  <div>
                    <label
                      htmlFor="fromDate"
                      className="block text-xs font-medium text-gray-700"
                    >
                      From Date
                    </label>
                    <Field
                      type="date"
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
                      type="date"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                       border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      min={values.fromDate || getCurrentDate()}
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
                      // disabled={isFetchAllMetroSummaryReportsLoading}
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <AgGridTable
              // rowData={allMetroSummaryReports}
              columnDefs={columnDefs}
              // isFetchLoading={isFetchAllMetroSummaryReportsLoading}
            />
          </div>
  )
}

export default GrievanceIndividualReportList
