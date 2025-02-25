import React, { useEffect, useState } from "react";
import { useSummaryReportStore } from "../../../store/metro_reports/summaryReportStore";
import useAuthStore from "../../../store/authStore";
import AgGridTable from "../../tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { PiCurrencyInr } from "react-icons/pi";
import AgGridTablev3 from "../../tables/AgGridTablev3";
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
      headerClass: "text-blue-v2",
    },
    {
      field: "ltmrhlPurchaseId",
      headerName: "LTHMRL Purchase ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "ticketId",
      headerName: "Ticket ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "rjtID",
      headerName: "RJT ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "N/A" : params.value,
    },
    {
      field: "ticketTypeId",
      headerName: "Ticket Type",
      maxWidth: "160",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "fromStationName",
      headerName: "From Station Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "toStationName",
      headerName: "To Station Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "patronPhoneNumber",
      headerName: "Mobile Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

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

    // {
    //   field: "noOfTickets",
    //   headerName: "No Of Tickets",
    //   maxWidth: "160",

    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => `${params.value} ` || "N/A",
    // },
    {
      field: "merchantEachTicketFareAfterGst",
      headerName: "Ticket Fare",

      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        params.value ? (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) : (
          "N/A"
        ),
    },
    {
      field: "changeDestinationAmount",
      headerName: "Change Destination Ticket Fare",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
    },
    {
      field: "totalTicketAmount",
      headerName: "Total Ticket Fare",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        params.value ? (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) : (
          "N/A"
        ),
    },
    // {
    //     field: "actualAmountPaid",
    //     headerName: "Settlement Amount Paid",
    //     headerClass: "text-blue-v2",            
    //     cellRenderer: (params) =>
    //         params.value ? (
    //             <>
    //                 <span>Rs. </span>
    //                 <span>{+params.value}</span>
    //             </>
    //         ) : (
    //             "N/A"
    //         ),
    // },
    // {
    //     field: "actualPaymentStatus",
    //     headerName: "Settlement Payment Status",
    //     headerClass: "text-blue-v2",
    //     valueFormatter: (params) => params.value || "N/A",
    // },
    // {
    //     field: "utr",
    //     headerName: "UTR",
    //     headerClass: "text-blue-v2",
    //     valueFormatter: (params) => params.value || "N/A",
    // },
    // {
    //     field: "utrprocessedtime",
    //     headerName: "UTR Processed Time",
    //     headerClass: "text-blue-v2",
    //     valueFormatter: (params) => params.value || "N/A",
    // },
    // {
    //     field: "refundId",
    //     headerName: "Refund ID",
    //     headerClass: "text-blue-v2",
    //     valueFormatter: (params) => params.value || "N/A",
    // },
    // {
    //     field: "refundStatus",
    //     headerName: "Refund Status",
    //     headerClass: "text-blue-v2",
    //     valueFormatter: (params) => params.value || "N/A",
    // },
    {
      field: "paymentOrderId",
      headerName: "Order ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "ticketStatus",
      headerName: "Ticket Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
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
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <AgGridTablev3
        rowData={allMetroSummaryReports}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllMetroSummaryReportsLoading}
      />
    </>
  );
}

export default SummaryReportList;
