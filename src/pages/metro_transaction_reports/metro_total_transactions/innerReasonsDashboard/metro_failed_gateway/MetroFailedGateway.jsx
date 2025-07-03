import React, { useEffect } from "react";
import AdminLayout from "../../../../../layouts/AdminLayout";
import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import useMetroTotalCommonStore from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalCommonStore";
import FailedOtherReasonChart from "../../charts/FailedOtherReasonChart";
import { useMetroTotalTransactionsStore } from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalTransactionsStore";
import MetroFailedGatewayChart from "../../charts/MetroFailedGatewayChart";
import Breadcrumb from "../../../../../components/Breadcrumb";
import { getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";

const MetroFailedGateway = () => {
  const startOfDay = getStartOfCurrentDay();
    const endOfDay = getEndOfCurrentDay();
  const { setInnerFilters, outerFilters, resetInnerFilters, innerFilters } =
    useMetroTotalCommonStore();
  const {
    fetchGateWayPieChart,
    PaymentGatewayPieChartData,
    isPaymentGatewayPieChartLoading,
  } = useMetroTotalTransactionsStore();
  console.log("PaymentGatewayPieChartData", PaymentGatewayPieChartData);
  useEffect(() => {
    fetchGateWayPieChart({
      fromDate: innerFilters.fromDate || outerFilters.fromDate || startOfDay,
      toDate: innerFilters.toDate || outerFilters.toDate || endOfDay,
      mobileNumber:
        innerFilters.mobileNumber || outerFilters.mobileNumber || "",
    });
  }, []);

  const initialValues = {
    fromDate: innerFilters.fromDate || outerFilters.fromDate || startOfDay,
    toDate: innerFilters.toDate || outerFilters.toDate || endOfDay,
    mobileNumber: innerFilters.mobileNumber || outerFilters.mobileNumber || "",
  };
  const onSubmit = (values) => {
    setInnerFilters(values);
    fetchGateWayPieChart(values);
  };
  const totalCount =
    PaymentGatewayPieChartData?.reduce(
      (sum, item) => sum + item.totalCount,
      0
    ) || 0;

       const breadcrumbItems = [
    {
      label: 'Total Transactions',
      path: `/metro-total-transaction`,
      onclick:()=>resetInnerFilters(),
    },
    {
      label: 'Failed (Payment Gateway)',  
      isLast: true
    }
  ];

  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb 
            customItems={breadcrumbItems}
            className="mb-4"
          />
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
              onClick={() => {
                resetInnerFilters();
              }}
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
                        fromDate: startOfDay,
                        toDate: endOfDay,
                        mobileNumber: "",
                      });
                      resetInnerFilters();
                      fetchGateWayPieChart({
                        fromDate: startOfDay,
                        toDate: endOfDay,
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
          <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
            <div className="flex">
              <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
                {/* <Loader/> */}

                {isPaymentGatewayPieChartLoading && (
                  <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                    <div className="loader"></div>
                  </div>
                )}
                <MetroFailedGatewayChart
                  data={totalCount !== 0 ? PaymentGatewayPieChartData : []}
                  title="Failed (Payment Gateway)"
                  angleKey="reasonCount"
                  calloutLabelKey="failureReason"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MetroFailedGateway;
