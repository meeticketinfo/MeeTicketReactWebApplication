import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useBusPassTotalTransactionStore } from "../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";
import { useIntercityRefundReportStore } from "../../../../../../store/intercity/reports/IntercityRefundReportStore";

const IntercityRefundTransactionsReportForm = ({
  pageNumber,
  pageSize,
  setCurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isFetchIntercityRefundTransactionsInnerReport,
    fetchIntercityRefundTransactionsInnerReport,
  } = useIntercityRefundReportStore();
  const refundTransactionSearchParams = localStorage.getItem(
    "busPassRefundInnerTransactionSearchParams"
  );

  const {  AllBusPassesData, fetchAllBusPasses } =
    useBusPassTotalTransactionStore();

  // Load packages on component mount
  useEffect(() => {
    fetchAllBusPasses();
  }, []);

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    mobileNumber: searchParams.get("mobileNumber") || "",
    destinationLocation:searchParams.get("destinationLocation"),
    arrivalLocation:searchParams.get("arrivalLocation"),
    refundStatus:
      (searchParams.get("RefundStatus") !== "null" &&
        searchParams.get("RefundStatus")) ||
      "",
  };

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    
    // Call the Intercity refund inner report API with proper parameters
    fetchIntercityRefundTransactionsInnerReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber,
      destinationLocation:values.destinationLocation,
      arrivalLocation:values.arrivalLocation,
      status: values.refundStatus,
      pageNumber: 1, // Reset to first page on new search
      pageSize: pageSize,
    });
    setCurrentPage(0);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
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
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
                min={values.fromDate}
              />
            </div>
            {/* mobile number */}

            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="mobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("mobileNumber", e.target.value);
                }}
              />
            </div>

            <div>
              <label
                htmlFor="BusPassType"
                className="block text-xs font-medium text-gray-700"
              >
                Bus Pass Type
              </label>
              <Field
                as="select"
                name="BusPassType"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("BusPassType", e.target.value);
                }}
              >
                <option value="">All</option>
                {AllBusPassesData?.filter((item) => item.isActive).map(
                  (item) => (
                    <option key={item.passTypeId} value={item.passTypeName}>{item.passTypeName}</option>
                  )
                )}
              </Field>
            </div>

            {/* status */}
            <div>
              <label
                htmlFor="refundStatus"
                className="block text-xs font-medium text-gray-700"
              >
                Refund Status
              </label>
              <Field
                as="select"
                name="refundStatus"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("refundStatus", e.target.value);
                }}
              >
                <option value="">Select Status</option>
                <option value="Refund">Refunded</option>
                <option value="NotRefund">Not Refunded</option>
              </Field>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isFetchIntercityRefundTransactionsInnerReport}
              >
                {isFetchIntercityRefundTransactionsInnerReport ? "Searching..." : "Search"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default IntercityRefundTransactionsReportForm;
    