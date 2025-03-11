import React, { useState, useEffect } from "react";
import {
  formatToCurrency,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import AgGridTable from "../../tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import { ToursimReportStore } from "../../../store/reports/toursimStore";

function BankPaymentReportList() {
  const {
    BankPaymentReports,
    isFetchBankPaymentReportsLoading,
    fetchBankPaymentReports,
  } = ToursimReportStore();
  useEffect(() => {
    fetchBankPaymentReports({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchBankPaymentReports]);
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "bookDate",
      headerName: "Book Date",
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

    {
      field: "cancelledDate",
      headerName: "Cancelled Date",
      maxWidth: "140",
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
      field: "cancelTickets",
      headerName: "Cancel Tickets",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "0" : params.value,
    },

    {
      field: "confirmTickets",
      headerName: "Confirm Tickets",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalTickets",
      headerName: "Total Tickets",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "ticketFareIncGST",
      headerName: "Ticket Fare(inc.GST)",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value) || "N/A",
    },
    {
      field: "cancelledTicketFare",
      headerName: "Cancelled Ticket Fare",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value) || "N/A",
    },
    {
      field: "amountDeductionInFare",
      headerName: "Amount Deduction in Fare",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value) || "N/A",
    },
    {
      field: "settlementTicketFare",
      headerName: "Settlement Ticket Fare",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value) || "N/A",
    },

    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className=" flex align-center">
          <button
            className="bg-green-400 text-white leading-normal shadow-lg px-2 py-1 mt-1.5 rounded-md"
            onClick={() => {
              // setOpenModal(true);
              // setSettlementAmount(params.data.totalAmount);
            }}
          >
            Pay Now
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchBankPaymentReports({
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
       ExportName="Tourisim Bank Payment"
        rowData={BankPaymentReports}
        columnDefs={columnDefs}
        isFetchLoading={isFetchBankPaymentReportsLoading}
      />
    </div>
  );
}

export default BankPaymentReportList;
