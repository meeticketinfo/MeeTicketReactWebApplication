import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
// import { useSearchParams } from "react-router-dom";
// import { useRtcRefundStore } from "../../../../../../store/rtc/RtcRefundTransactionStore";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
const IntercityRefundOuterReportForm = () => {
  //   const [searchParams, setSearchParams] = useSearchParams();
  //   const {
  //     refundBusPassTransactionsReport,
  //     isFetchBusPassRefundTransactionsReport,
  //     fetchBusPassRefundTransactionsReport,
  //   } = useRtcRefundStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  //   useEffect(() => {
  //     const preservedParams = localStorage.getItem("busPassRefundInnerTransactionSearchParams");
  //     if (preservedParams && !searchParams.toString()) {
  //       const urlParams = new URLSearchParams(preservedParams);
  //       urlParams.delete("RefundStatus");
  //       setSearchParams(urlParams);
  //     } else {
  //       const newSearchParams = new URLSearchParams(searchParams);
  //       newSearchParams.delete("RefundStatus");
  //       setSearchParams(newSearchParams);
  //     }
  //     if (searchParams.toString() || preservedParams) {
  //       fetchAllBusPasses();
  //     }
  //   }, [searchParams]);

  //   const { AllBusPassesData, fetchAllBusPasses } =
  //     useBusPassTotalTransactionStore();
  //   const getInitialValues = () => {
  //     const preservedParams = localStorage.getItem("busPassRefundInnerTransactionSearchParams");
  //     const paramsToUse = preservedParams && !searchParams.toString()
  //       ? new URLSearchParams(preservedParams)
  //       : searchParams;

  //     return {
  //       fromDate: cleanString(paramsToUse.get("fromDate"), "_", ":") || startOfDay,
  //       toDate: cleanString(paramsToUse.get("toDate"), "_", ":") || endOfDay,
  //       mobileNumber: paramsToUse.get("mobileNumber") || "",
  //       BusPassType: paramsToUse.get("BusPassType") || "",
  //     };
  //   };

  //   const initialValues = getInitialValues();

  //   const overAllOnSubmit = (values) => {
  //     const newSearchParams = new URLSearchParams();
  //     Object.keys(values).forEach((key) => {
  //       if (values[key]) {
  //         newSearchParams.set(key, cleanString(values[key], ":", "_"));
  //       }
  //     });
  //     setSearchParams(newSearchParams);
  //     localStorage.setItem(
  //       "busPassRefundInnerTransactionSearchParams",
  //       newSearchParams
  //     );

  //     const payload = {
  //       fromDate: values.fromDate,
  //       toDate: values.toDate,
  //       busPassType: values.BusPassType,
  //       mobileNumber: values.mobileNumber,
  //     };

  //     fetchBusPassRefundTransactionsReport(payload);
  //   };

  //   const resetForm = (setValues) => {
  //     const payload = {
  //       fromDate: startOfDay,
  //       toDate: endOfDay,
  //       BusPassType: "",
  //       mobileNumber: "",
  //     };

  //     // Clear URL search params
  //     setSearchParams(new URLSearchParams());

  //     localStorage.setItem("busPassRefundInnerTransactionSearchParams", "");
  //     setValues(payload);
  //     fetchBusPassRefundTransactionsReport(payload);
  //   };

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initialValues}
        // onSubmit={overAllOnSubmit}
      >
        {({ values, setFieldValue, setValues }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 gap-x-3 py-3">
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
                //   onChange={(e) => {
                //     const toDateValue = e.target.value;
                //     setFieldValue("toDate", toDateValue);
                //   }}
                //   min={values.fromDate}
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
                  //   disabled={isFetchBusPassRefundTransactionsReport}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                  onClick={() => resetForm(setValues)}
                  //   disabled={isFetchBusPassRefundTransactionsReport}
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

export default IntercityRefundOuterReportForm;
