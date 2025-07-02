import React, { useEffect } from "react";
import AdminLayout from "../../../../../layouts/AdminLayout";
import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import useMetroTotalCommonStore from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalCommonStore";
import FailedOtherReasonChart from "../../charts/FailedOtherReasonChart";
import { useMetroTotalTransactionsStore } from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalTransactionsStore";

const MetroFailedGateway = () => {
  const { setOuterFilters, outerFilters, resetOuterFilters } =
    useMetroTotalCommonStore();
  const {
    fetchOtherReasonsPieChart,
    OtherReasonsPieChartData,
    isOtherReasonsPieChartLoading,
  } = useMetroTotalTransactionsStore();
  console.log("OtherReasonsPieChartData", OtherReasonsPieChartData);
  useEffect(() => {
    fetchOtherReasonsPieChart({
      fromDate: outerFilters.fromDate || "",
      toDate: outerFilters.toDate || "",
      mobileNumber: outerFilters.mobileNumber || "",
    });
  }, []);

  const initialValues = {
    fromDate: outerFilters.fromDate || "",
    toDate: outerFilters.toDate || "",
    mobileNumber: outerFilters.mobileNumber || "",
  };
  const onSubmit = (values) => {
    // setOuterFilters(values);
    // fetchMetroTransactionByReason(values);
  };
  const totalCount =
    OtherReasonsPieChartData?.reduce((sum, item) => sum + item.totalCount, 0) ||
    0;
  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Failed (Payment Gateway)
            </h1>
          </div>
          <div className="">
            <Link
              to="/metro-total-transaction"
              className="bg-black text-white font-semibold px-4 py-1.5 rounded"
            >
              Back
            </Link>
          </div>
        </div>
        <div>
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
                    Mobile Number
                  </label>
                  <Field
                    type="text"
                    name="mobileNumber"
                    placeholder="Enter Mobile Number"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
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
                        fromDate: "",
                        toDate: "",
                        mobileNumber: "",
                      });
                      resetOuterFilters();
                      fetchMetroTransactionByReason({
                        fromDate: "",
                        toDate: "",
                        mobileNumber: "",
                      });
                    }}
                  >
                    Reset
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <FailedOtherReasonChart
            data={totalCount !== 0 ? OtherReasonsPieChartData : []}
            title="Failed (Payment Gateway)"
            angleKey="subCategoryCount"
            calloutLabelKey="subCategory"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default MetroFailedGateway;
