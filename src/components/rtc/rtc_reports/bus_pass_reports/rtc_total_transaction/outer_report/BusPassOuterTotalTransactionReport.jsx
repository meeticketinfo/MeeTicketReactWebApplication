import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import busPassTotalCommonStore from "../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/busPassTotalCommonStore";
import { useBusPassTotalTransactionStore } from "../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";
import BusPassTotalTransactionChart from "../charts/BusPassTotalTransactionChart";
import { getStartOfCurrentDay,getEndOfCurrentDay } from "../../../../../../utils/Helper";

const BusPassOuterTotalTransactionReport = () => {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const {
    setOuterFilters,
    outerFilters,
    resetOuterFilters,
    setInnerFilters,
    resetInnerFilters,
  } = busPassTotalCommonStore();
  const {
    fetchMetroTransactionByReason,
    MetroTransactionByReasonData,
    isMetroTransactionByReasonLoading,
  } = useBusPassTotalTransactionStore();
  useEffect(() => {
    setInnerFilters({
      fromDate: outerFilters.fromDate ?? startOfDay,
      toDate: outerFilters.toDate ?? endOfDay,
      mobileNumber: outerFilters.mobileNumber ?? "",
      BusPassType: outerFilters.BusPassType ?? "",
    });
    // fetchMetroTransactionByReason({
    //   fromDate: outerFilters.fromDate ?? startOfDay,
    //   toDate: outerFilters.toDate ?? endOfDay,
    //   mobileNumber: outerFilters.mobileNumber ?? "",
    // });
  }, []);
  console.log("outerFilters", outerFilters);
  const initialValues = {
    fromDate: outerFilters.fromDate ?? startOfDay,
    toDate: outerFilters.toDate ?? endOfDay,
    mobileNumber: outerFilters.mobileNumber ?? "",
    BusPassType: outerFilters.BusPassType ?? "",
  };
  const onSubmit = (values) => {
    setOuterFilters(values);
    setInnerFilters(values);
    // fetchMetroTransactionByReason(values);
  };
  // const totalCount = Array.isArray(MetroTransactionByReasonData)
  //   ? MetroTransactionByReasonData.reduce((sum, item) => sum + item.count, 0)
  //   : 0;
  return (
    <>
      <ToastContainer />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
            <div>
              <label
                htmlFor="startDate"
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
                  if (new Date(fromDateValue) > new Date(values.endDate)) {
                    // Automatically update toDate if it's earlier than fromDate
                    setFieldValue("toDate", fromDateValue);
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
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
            {/* bus pass type */}
            <div>
              <label
                htmlFor="PaymentMode"
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
                <option value="Single">Single</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                
              </Field>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isfetchAllMetroBookingDetailsReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                onClick={() => {
                  setValues({
                    fromDate: startOfDay,
                    toDate: endOfDay,
                    mobileNumber: "",
                    BusPassType: "",
                  });
                  // resetOuterFilters();
                  // resetInnerFilters();
                  resetOuterFilters({
                    fromDate: startOfDay,
                    toDate: endOfDay,
                    mobileNumber: "",
                    BusPassType: "",
                  });
                  setInnerFilters({
                    fromDate: startOfDay,
                    toDate: endOfDay,
                    mobileNumber: "",
                    BusPassType: "",
                  });
                  // fetchMetroTransactionByReason({
                  //   fromDate: startOfDay,
                  //   toDate: endOfDay,
                  //   mobileNumber: "",
                  //   BusPassType: "",
                  // });
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
        <div className="flex">
          <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
            {/* <Loader/> */}

            {false && (
              <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                <div className="loader"></div>
              </div>
            )}
            <BusPassTotalTransactionChart
              // data={totalCount !== 0 ? [] : []}
              title="Total Transactions"
              angleKey="count"
              calloutLabelKey="paymentCategory"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BusPassOuterTotalTransactionReport;
