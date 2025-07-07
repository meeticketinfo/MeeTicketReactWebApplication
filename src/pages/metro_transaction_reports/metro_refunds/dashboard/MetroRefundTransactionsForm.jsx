import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { useParkStore } from "../../../../store/masters/parksStore";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import { userReports } from "../../../../store/userTransaction/UserReports";
import { metroRefundReports } from "../../../../store/metro_refund_reports_store/MetroRefundReportStore";

const TotalTransactionsForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { allParks, fetchAllParks } = useParkStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  // const { isFetchRefundTransactions, fetchRefundTransactions } = userReports();
  const {isFetchMetroRefundTransactionsReport,fetchMetroRefundTransactionsReport } = metroRefundReports();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("RefundStatus");
    setSearchParams(newSearchParams);
  }, [searchParams]);

  // Initial load effect
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

  const initialValues = {
    startDate: cleanString(searchParams.get("startDate"), "_", ":") || startOfDay,
    endDate: cleanString(searchParams.get("endDate"), "_", ":") || endOfDay,
    mobileNumber: searchParams.get("mobileNumber") || "",
  };

  const overAllOnSubmit = (values) => {
    // Update URL search params with form values
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    localStorage.setItem("refundMetroTransactionSearchParams", newSearchParams);

    const payload = {
      startDate: values.startDate,
      endDate: values.endDate,
      mobileNumber: values.mobileNumber,
    };

    fetchMetroRefundTransactionsReport(payload);
  };

  const resetForm = (setValues) => {
    const payload = {
      startDate: startOfDay,
      endDate: endOfDay,
      mobileNumber: "",
    };

    // Clear URL search params
    setSearchParams(new URLSearchParams());

    localStorage.setItem("refundMetroTransactionSearchParams", "");
    setValues(payload);
    fetchMetroRefundTransactionsReport(payload);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={overAllOnSubmit}
      >
        {({ values, setFieldValue, setValues }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 gap-x-3 py-3">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-xs font-medium text-gray-700"
                >
                  From Date
                </label>
                <Field
                  type="datetime-local"
                  name="startDate"
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  onChange={(e) => {
                    const fromDateValue = e.target.value;
                    setFieldValue("startDate", fromDateValue);
                    if (new Date(fromDateValue) > new Date(values.endDate)) {
                      setFieldValue("endDate", fromDateValue);
                    }
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-xs font-medium text-gray-700"
                >
                  To Date
                </label>
                <Field
                  type="datetime-local"
                  name="endDate"
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  onChange={(e) => {
                    const toDateValue = e.target.value;
                    setFieldValue("endDate", toDateValue);
                  }}
                />
              </div>
              {/* mobile number */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-xs font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Field
                  type="text"
                  maxLength="10"
                  name="mobileNumber"
                  className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter phone number"
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setFieldValue("mobileNumber", e.target.value);
                  }}
                />
              </div>
              <div className="flex gap-2 items-end">
                <button
                  type="submit"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  disabled={isFetchMetroRefundTransactionsReport}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                  onClick={() => resetForm(setValues)}
                  disabled={isFetchMetroRefundTransactionsReport}
                >
                  Reset
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TotalTransactionsForm;
