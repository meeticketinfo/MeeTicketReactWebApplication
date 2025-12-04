import React, { useEffect, useState } from "react";
import { useMetroPendingTransactionStore } from "../../../store/metro_reports/metroPendingTransactionReportStore";
import AgGridTable from "../../tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../../utils/TypographyHelper";
function MetroPendingTransactionList() {
  const {
    allMetroPendingTransactionDetailsReports,
    fetchAllMetroPaymentTransactionDetailsReport,
    isFetchAllMetroPaymentTransactionDetailsReportsLoading,
  } = useMetroPendingTransactionStore();

  useEffect(() => {
    fetchAllMetroPaymentTransactionDetailsReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      mobileNumber: "",
    });
  }, [fetchAllMetroPaymentTransactionDetailsReport]);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    mobileNumber: "",
  };
  const onSubmit = (values) => {
    fetchAllMetroPaymentTransactionDetailsReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber.trim(),
    });
  };
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "110",

      headerClass: "text-blue-v2",
    },
    {
      field: "orderId",
      headerName: "Order ID",
      // maxWidth: "1000",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      maxWidth: "250",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "initiateTxnAmount",
      headerName: "TXN Amount",
      // maxWidth: "160",
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
      field: "createdDate",
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
    //   field: "userId",
    //   headerName: "User ID",

    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => `${params.value} ` || "N/A",
    // },
    // {
    //   field: "paymentOrderID",
    //   headerName: "Order ID",

    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value || "0",
    // },
    {
      field: "paymentStatus",
      headerName: "Payment Status While Booking",
      width: 225,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "actualPaymentStatus",
      headerName: " Actual Payment Status",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "actualAmountPaid",
      headerName: "Actual Amount Paid",

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
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
        field: "refundId",
        headerName: "Refund Id",
  
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "refundStatus",
        headerName: "Refund Status",
  
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params?.value?.toUpperCase() || "N/A",
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
            {/* <div>
                            <label htmlFor="mobileNumber" className="block text-xs font-medium text-gray-700">Mobile Number</label>
                            <Field type="text" name="mobileNumber" placeholder="Enter Mobile Number" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" />
                        </div> */}
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
        ExportName="Payment Transactions"
        rowData={allMetroPendingTransactionDetailsReports}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllMetroPaymentTransactionDetailsReportsLoading}
      />
    </>
  );
}

export default MetroPendingTransactionList;
