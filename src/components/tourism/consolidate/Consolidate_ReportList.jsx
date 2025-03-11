import React, { useEffect, useState } from "react";
import { formatToCurrency, getCurrentDate } from "../../../utils/TypographyHelper";
import { Field, Form, Formik } from "formik";
import AgGridTable from "../../tables/AgGridTable";
import { ToursimReportStore } from "../../../store/reports/toursimStore";

function Consolidate_ReportList() {
  const {
    ConsolidateReports,
    isFetchConsolidateReportsLoading,
    fetchConsolidateReports,
  } = ToursimReportStore();

  useEffect(() => {
    fetchConsolidateReports({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchConsolidateReports]);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "ticket_Number",
      headerName: "Ticket Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value}` || "N/A",
    },

    {
      field: "package_Type",
      headerName: "Package Type",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "package_Services",
      headerName: "Package Services",
      width: 300,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "0" : params.value,
    },

    {
      field: "from_Station_Name",
      headerName: "From Station Name",
      width: 300,

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "to_Station_Name",
      headerName: "To Station Name",
      width: 300,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "mobile_Number",
      headerName: "Mobile Number",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "purchase_Date",
      headerName: "Purchase Date",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "booking_Date",
      headerName: "Booking Date",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "total_Ticket_Fare",
      headerName: "Total Ticket Fare (including GST)",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value) || "N/A",
    },
    {
      field: "transaction_ID",
      headerName: "Transaction ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "booking_Status",
      headerName: "Booking Status",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "refundDate",
      headerName: "Refund Date",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      field: "refundId",
      headerName: "Refund ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundStatus",
      headerName: "Refund Status",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "utrNumber",
      headerName: "UTR Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "utrDate",
      headerName: "UTR Date",
      maxWidth: "130",
      
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
  ]);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchConsolidateReports({
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
        ExportName="Tourisim Consolidate"
        rowData={ConsolidateReports}
        columnDefs={columnDefs}
        isFetchLoading={isFetchConsolidateReportsLoading}
      />
    </div>
  );
}

export default Consolidate_ReportList;
