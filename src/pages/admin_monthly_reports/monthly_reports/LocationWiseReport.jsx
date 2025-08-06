import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import AgGridTable from "../../../components/tables/AgGridTable";
import { UsemonthlyReportsStore } from "../../../store/reports/monthlyReportsStore";

const LocationWiseReport = () => {
  const {
    fetchLocationWiseReport,
    LocationWiseReport,
    isFetchLocationWiseReportLoading,
  } = UsemonthlyReportsStore();
  console.log("LocationWiseReport", LocationWiseReport); 
  useEffect(() => {
    fetchLocationWiseReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, []);
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchLocationWiseReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };
  const totals = LocationWiseReport.reduce(
    (acc, row) => {
      acc.totalBookingCount += row.totalBookingCount || 0;
      acc.totalTickets += row.totalTickets || 0;
      acc.totalAmount += row.totalAmount || 0;
      return acc;
    },
    { totalBookingCount: 0, totalTickets: 0, totalAmount: 0 }
  );

  const pinnedBottomRowData = [
    {
      SNo: "",
      departmentName: "",
      locationCategoryName: "",
      parkName: "TOTAL",
      totalBookingCount: totals.totalBookingCount,
      totalTickets: totals.totalTickets,
      totalAmount: totals.totalAmount,
    },
  ];
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        // Return empty string for totals row
        if (params.data && params.data.parkName === "TOTAL") {
          return "";
        }
        return params.value;
      },
    },
    {
      field: "departmentName",
      headerName: "Department Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        // Return empty string for totals row
        if (params.data && params.data.parkName === "TOTAL") {
          return "";
        }
        return params.value ? params.value : "N/A";
      },
    },

    {
      field: "locationCategoryName",
      headerName: "Category Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "parkName",
      headerName: "Location Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "totalBookingCount",
      headerName: "Total Booking Count",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "totalTickets",
      headerName: "Total Ticket Count",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹${params.value} ` || "N/A",
    },
  ]);
  return (
    <div>
      <h1 className="text-xl font-semibold">Location Wise Report</h1>
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
        rowData={LocationWiseReport}
        columnDefs={columnDefs}
        pinnedBottomRowData={
          LocationWiseReport.length > 0 ? pinnedBottomRowData : []
        }
        isFetchLoading={isFetchLocationWiseReportLoading}
        ExportName="Location Wise Report"
      />
    </div>
  );
};

export default LocationWiseReport;
