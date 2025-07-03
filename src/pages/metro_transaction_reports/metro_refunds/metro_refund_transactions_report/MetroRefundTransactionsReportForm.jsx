import { Formik, Form, Field } from "formik";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import { useParkStore } from "../../../../store/masters/parksStore";
import { useEffect } from "react";
import Select from "react-select";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import { useSearchParams } from "react-router-dom";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
  getValueFromQuery,
} from "../../../../utils/Helper";
import { useTransactionsStore } from "../../../../store/userTransaction/TransactionsStore";
import { userReports } from "../../../../store/userTransaction/UserReports";

const MetroRefundTransactionsReportForm = ({
  pageNumber,
  pageSize,
  setCurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const { allParks, fetchAllParks } = useParkStore();

  const { isFetchRefundTransactionsReport, fetchRefundTransactionsReport } =
    userReports();
  const refundTransactionSearchParams = localStorage.getItem(
    "refundTransactionSearchParams"
  );

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    phoneNumber: searchParams.get("phoneNumber") || "",
    refundStatus: (searchParams.get("RefundStatus") !== "null" && searchParams.get("RefundStatus")) || "",
  };

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);

    fetchRefundTransactionsReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      phoneNumber: values.phoneNumber,
      refundStatus: values.refundStatus,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    setCurrentPage(0);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
              />
            </div>
            {/* mobile number */}
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
                onChange={(e) => {
                  setFieldValue("phoneNumber", e.target.value);
                }}
              />
            </div>
            {/* status */}
            <div>
              <label
                htmlFor="refundStatus"
                className="block text-xs font-medium text-gray-700"
              >
                Status
              </label>
              <Field
                as="select"
                name="refundStatus"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("refundStatus", e.target.value);
                }}
              >
                <option value="">Select Mode</option>
                <option value="Refund">Refunded</option>
                <option value="NotRefund">Not Refunded</option>
              </Field>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isFetchRefundTransactionsReport}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default MetroRefundTransactionsReportForm;
