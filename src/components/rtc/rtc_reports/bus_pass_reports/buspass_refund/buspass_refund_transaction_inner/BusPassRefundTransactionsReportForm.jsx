import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useBusPassTotalTransactionStore } from "../../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/BusPassTotalTransactionStore";
import { useRtcRefundStore } from "../../../../../../store/rtc/RtcRefundTransactionStore";

// Helper function to get current datetime in the format required for datetime-local max attribute
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to get current date with 23:59 time for To Date field
const getCurrentDateWithEndTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T23:59`;
};

const BusPassRefundTransactionsReportForm = ({
  pageNumber,
  pageSize,
  setCurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isFetchBusPassRefundTransactionsInnerReport,
    fetchBusPassRefundTransactionsInnerReport,
  } = useRtcRefundStore();
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
    BusPassType: searchParams.get("BusPassType") || "",
    refundStatus:
      (searchParams.get("RefundStatus") !== "null" &&
        searchParams.get("RefundStatus")) ||
      "",
  };

  const onSubmit = (values) => {
    // Validate date range
    if (values.fromDate && values.toDate && new Date(values.fromDate) > new Date(values.toDate)) {
      alert("From Date cannot be greater than To Date. Please select a valid date range.");
      return;
    }

    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    
    // Call the correct API function with proper parameters
    fetchBusPassRefundTransactionsInnerReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber,
      busPassType: values.BusPassType,
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
                max={getCurrentDateTime()}
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  // If fromDate is greater than toDate, update toDate to match fromDate
                  if (values.toDate && new Date(fromDateValue) > new Date(values.toDate)) {
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
                max={getCurrentDateWithEndTime()}
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  // If toDate is less than fromDate, update fromDate to match toDate
                  if (values.fromDate && new Date(toDateValue) < new Date(values.fromDate)) {
                    setFieldValue("fromDate", toDateValue);
                  }
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
                disabled={isFetchBusPassRefundTransactionsInnerReport}
              >
                {isFetchBusPassRefundTransactionsInnerReport ? "Searching..." : "Search"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BusPassRefundTransactionsReportForm;
