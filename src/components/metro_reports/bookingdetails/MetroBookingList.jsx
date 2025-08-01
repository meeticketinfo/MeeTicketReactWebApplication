import React, { useEffect, useState } from "react";
import { useSummaryReportStore } from "../../../store/metro_reports/summaryReportStore";
import { useMetroBookingStore } from "../../../store/metro_reports/metroBookingReportStore";
import useAuthStore from "../../../store/authStore";
import AgGridTable from "../../tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { PiCurrencyInr } from "react-icons/pi";
function MetroBookingList() {
  const {
    allMetroBookingDetailsReports,
    fetchAllMetroBookingDetailsReport,
    isFetchAllMetroBookingDetailsReportsLoading,
  } = useMetroBookingStore();

  useEffect(() => {
    fetchAllMetroBookingDetailsReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      mobileNumber: "",
    });
  }, [fetchAllMetroBookingDetailsReport]);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    mobileNumber: "",
  };
  const onSubmit = (values) => {
    fetchAllMetroBookingDetailsReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber.trim(),
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
      field: "paymentOrderID",
      headerName: "Transaction ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "bookingDetailsId",
      headerName: "Booking Details ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "fromStationName",
      headerName: "From Station Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "toStationName",
      headerName: "To Station Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "N/A" : params.value,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      maxWidth: "160",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "merchantId",
      headerName: "Merchant Order ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "ticketType",
      headerName: "Ticket Type",
      maxWidth: "160",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "travelDate",
      headerName: "Travel Date",
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
      field: "noOfTickets",
      headerName: "No Of Tickets",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "eachTicketFare",
      headerName: "Each Ticket Fare",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) ?? "N/A",
      // params.value ? (
      //   <>
      //     <span>Rs. </span>
      //     <span>{params.value}</span>
      //   </>
      // ) : (
      //   "N/A"
      // ),
    },

    {
      field: "totalTicketFare",
      headerName: "Total Ticket Fare",

      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "N/A",
      cellRenderer: (params) =>
        (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) ?? "N/A",
      // params.value ? (
      //   <>
      //     <span>Rs. </span>
      //     <span>{params.value}</span>
      //   </>
      // ) : (
      //   "N/A"
      // ),
    },
    {
      field: "paymentConfirmedTxnAmount",
      headerName: "Actual Fare Paid",
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "N/A",
      cellRenderer: (params) =>
        (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) ?? "N/A",
      // params.value ? (
      //   <>
      //     <span>Rs. </span>
      //     <span>{params.value}</span>
      //   </>
      // ) : (
      //   "N/A"
      // ),
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
    {
      field: "paymentOrderID",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "actualPaymentStatus",
      headerName: "Booking Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundDate",
      headerName: "Refund Date",
      headerClass: "text-blue-v2 bg-[#FFD3AC] hover:!bg-[#FFD3AC]",
      cellStyle: { backgroundColor: "rgb(243 229 218)" },
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
    {
      field: "refundId",
      headerName: "Refund ID",
      headerClass: "text-blue-v2 bg-[#FFD3AC] hover:!bg-[#FFD3AC]",
      valueFormatter: (params) => params.value || "N/A",
      cellStyle: { backgroundColor: "rgb(243 229 218)" },
    },
    {
      field: "refundStatus",
      headerName: "Refund Status",
      headerClass: "text-blue-v2 bg-[#FFD3AC] hover:!bg-[#FFD3AC]",
      valueFormatter: (params) => params.value || "N/A",
      cellStyle: { backgroundColor: "rgb(243 229 218)" },
    },
    {
      field: "mid",
      headerName: "MID",
      headerClass: "text-blue-v2 bg-[#FFD3AC] hover:!bg-[#FFD3AC]",
      valueFormatter: (params) => params.value || "N/A",
      cellStyle: { backgroundColor: "rgb(243 229 218)" },
    },
    {
      field: "utr",
      headerName: "UTR",
      headerClass: "text-blue-v2 bg-blue-200 hover:!bg-blue-200",
      valueFormatter: (params) => params.value || "N/A",
      cellStyle: { backgroundColor: "rgb(219 234 254 / 1)" },
    },
    {
      field: "utrprocessedtime",
      headerName: "UTR Processed Time",
      headerClass: "text-blue-v2 bg-blue-200 hover:!bg-blue-200",
      valueFormatter: (params) => params.value || "N/A",
      cellStyle: { backgroundColor: "rgb(219 234 254 / 1)" },
    },
    {
      field: "finalutr",
      headerName: "Settled UTR",
      headerClass: "text-blue-v2 bg-blue-200 hover:!bg-blue-200",
      valueFormatter: (params) => params.value || "N/A",
      cellStyle: { backgroundColor: "rgb(219 234 254 / 1)" },
    },
    {
      field: "finalutrprocessedtime",
      headerName: "Settled UTR Processed Time",
      headerClass: "text-blue-v2 bg-blue-200 hover:!bg-blue-200",
      valueFormatter: (params) => params.value || "N/A",
      cellStyle: { backgroundColor: "rgb(219 234 254 / 1)" },
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
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isfetchAllMetroBookingDetailsReportsLoading}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <AgGridTable
        ExportName="Consolidated Ticket Details"
        rowData={allMetroBookingDetailsReports}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllMetroBookingDetailsReportsLoading}
      />
    </>
  );
}

export default MetroBookingList;
