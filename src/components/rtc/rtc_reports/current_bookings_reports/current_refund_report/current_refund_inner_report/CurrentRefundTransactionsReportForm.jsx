import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useCurrentRefundReportStore } from "../../../../../../store/rtc/CurrentRefundReportStore";

const REFUND_STATUS_OPTIONS = [
  { value: "-1", label: "ALL" },
  { value: "0", label: "Not Initiated" },
  { value: "1", label: "Initiated" },
  { value: "2", label: "Refunded" },
  { value: "3", label: "Failed" },
];

const CurrentRefundTransactionsReportForm = ({ setCurrentPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isFetchCurrentRefundTransactionsInnerReport,
    fetchCurrentRefundTransactionsInnerReport,
  } = useCurrentRefundReportStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const getRefundStatusFromParams = () => {
    const status =
      searchParams.get("refundStatus") ?? searchParams.get("RefundStatus");
    if (status === null || status === "") return "-1";
    return status;
  };

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    mobileNumber: searchParams.get("mobileNumber") || "",
    pnrNumber: searchParams.get("pnrNumber") || "",
    paymentMode: searchParams.get("paymentMode") || "",
    refundStatus: getRefundStatusFromParams(),
  };

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (value !== undefined && value !== null && value !== "") {
        newSearchParams.set(
          key,
          key.includes("Date") ? cleanString(value, ":", "_") : String(value)
        );
      }
    });
    newSearchParams.set("refundStatus", String(values.refundStatus ?? "-1"));

    setSearchParams(newSearchParams);
    localStorage.setItem(
      "currentRefundInnerTransactionSearchParams",
      newSearchParams.toString()
    );

    fetchCurrentRefundTransactionsInnerReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber,
      pnrNumber: values.pnrNumber || "",
      refundStatus: values.refundStatus ?? "-1",
    });
    setCurrentPage(0);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      {({ values, setFieldValue }) => (
        <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3 uppercase">
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
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              onChange={(e) => {
                const fromDateValue = e.target.value;
                setFieldValue("fromDate", fromDateValue);
                if (new Date(fromDateValue) > new Date(values.toDate)) {
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
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              min={values.fromDate}
            />
          </div>
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-xs font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <Field
              type="text"
              maxLength="10"
              name="mobileNumber"
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter phone number"
              onKeyPress={(e) => {
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div>
            <label
              htmlFor="pnrNumber"
              className="block text-xs font-medium text-gray-700"
            >
              PNR No
            </label>
            <Field
              type="text"
              name="pnrNumber"
              className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter PNR"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Payment Mode
            </label>
            <Field
              as="select"
              name="paymentMode"
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="">All</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
            </Field>
          </div>
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
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              {REFUND_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-green-700 text-xs uppercase text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
              disabled={isFetchCurrentRefundTransactionsInnerReport}
            >
              {isFetchCurrentRefundTransactionsInnerReport
                ? "Searching..."
                : "Search"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CurrentRefundTransactionsReportForm;
