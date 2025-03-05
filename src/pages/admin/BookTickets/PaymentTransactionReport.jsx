import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import AgGridTable from '../../../components/tables/AgGridTable'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { formatToStandardDate, getCurrentDate } from '../../../utils/TypographyHelper';
import { useBookingsStore } from '../../../store/masters/bookingsStore';

function PaymentTransactionReport() {
  const {
    isTransactionPaymentReportsLoading,
    allTransactionPaymentReports,
    fetchPaymentTransactions,
  } = useBookingsStore();
  
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    typeOfBooking: "",
    phoneNumber: "",
  };

  useEffect(() => {
    fetchPaymentTransactions({
      startDate: getCurrentDate(),
      endDate: getCurrentDate(),
      currentTransactionStatus: null,
      phoneNumber: null,
      parkId:null
    });
  }, [fetchPaymentTransactions])
  
  const onSubmit = (values, { resetForm }) => {
    fetchPaymentTransactions({
      startDate: values.fromDate,
      endDate: values.toDate,
      currentTransactionStatus: values.typeOfBooking ? values.typeOfBooking : null,
      phoneNumber: values.phoneNumber ? values.phoneNumber : null,
      parkId:null,
    });
  };

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "orderId",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phonE_NUMBER",
      headerName: "Mobile No.",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "confirmedTxnAmount",
      headerName: "Amount Initiated",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "createdDate",
      headerName: "Payment Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "currentTransactionStatus",
      headerName: "Payment Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundStatus",
      headerName: "Refund Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  ]);
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Payment Transactions
            </h1>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

          </div>
        </div>
        <div className="mb-8">
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ values, setFieldValue }) => (
              <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
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
                  <label className="block text-sm font-medium">
                    Payment Status
                  </label>
                  <Field
                    as="select"
                    name="typeOfBooking"
                    className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="INITIATE">Initiate</option>
                    <option value="INPROCESS">In Process</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="FAILED">Failed</option>
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Phone Number 
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="phoneNumber"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter phone number"
                    onKeyPress={(e) => {
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault(); // Prevent non-numeric characters
                      }
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
            ExportName="Payment Transactions"
            isFetchLoading={isTransactionPaymentReportsLoading}
            rowData={allTransactionPaymentReports || []}
            columnDefs={columnDefs}
            // onPageChange={handlePageChange}
            // totalRecords={totalEntityBookingRecords}
            enableAdvancedFilter={true}
          />
        </div>
      </div>
    </AdminLayout>
  )
}

export default PaymentTransactionReport
