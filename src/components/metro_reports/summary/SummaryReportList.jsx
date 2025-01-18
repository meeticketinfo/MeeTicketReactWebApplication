import React, { useEffect, useState } from "react";
import { useSummaryReportStore } from "../../../store/metro_reports/summaryReportStore";
import useAuthStore from "../../../store/authStore";
import AgGridTable from "../../tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../../utils/TypographyHelper";

function SummaryReportList() {
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const {
    allMetroSummaryReports,
    fetchAllMetroSummaryReport,
    isFetchAllMetroSummaryReportsLoading,
  } = useSummaryReportStore();

  useEffect(() => {
    fetchAllMetroSummaryReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchAllMetroSummaryReport]);

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
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      // flex:1,
      headerClass: "text-blue-v2",
    },

    {
      field: "orderId",
      headerName: "Order Id",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },

    {
      field: "initiateTxnAmount",
      headerName: "Transaction Amount",
      maxWidth: "160",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value}rs ` || "N/A",
    },
    {
      field: "fromStationId",
      headerName: "From Station Name",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "toStationId",
      headerName: "To Station Name",
      //   flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "patronPhoneNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    // {
    //   field: "fromDate",
    //   headerName: " Date",
    //   // flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value || "N/A",
    // },
    {
      field: "fromDate",
      headerName: "Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
  ]);
  return (
    <>
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
                className="bg-green-700 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-green-700 hover:border hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <AgGridTable
        rowData={allMetroSummaryReports}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllMetroSummaryReportsLoading}
      />
    </>
  );
}

export default SummaryReportList;
