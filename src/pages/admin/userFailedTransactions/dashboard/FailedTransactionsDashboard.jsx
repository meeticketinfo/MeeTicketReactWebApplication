import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { Field, Form, Formik } from "formik";
import DashboardCard07 from "../../../../partials/dashboard/DashboardCard07";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { useRtcDashboardStore } from "../../../../store/rtc/RtcDashboardStore";
import TransactionPieChart from "../piecharts/TransactionPieChart";
import TransactionGraph from "../piecharts/TransactionGraph";
import TransactionDepartment from "../piecharts/TransactionDepartment";
import { useTransactionsStore } from "../../../../store/userTransaction/TransactionsStore";

function FailedTransactionsDashboard({ filter }) {
  superballs.register();
  const {
    fetchallPassData,
    fetchallPassTypeData,
    allPassTypeData,
    fetchallbuspasses,
    fetchallDashboardReportData,
    allDashboardReportData,
  } = useRtcDashboardStore();
  // console.log("allDashboardReportData", allDashboardReportData);
  const {
      fetchFailedTransactionByReason,
      FailedTransactionByReasonData,
  } = useTransactionsStore();
  console.log("FailedTransactionByReasonData", FailedTransactionByReasonData);
  const initialValues = {
    fromDate: "",
    toDate: "",
  };
  
   useEffect(()=>{
    fetchFailedTransactionByReason()
   },[])

  useEffect(() => {
    fetchallPassData({
      fromDate: "",
      toDate: "",
      active: false,
    });
    fetchallPassTypeData({
      fromDate: "",
      toDate: "",
      active: false,
    });
    fetchallDashboardReportData({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      passTypeId: "",
      active: false,
    });
    fetchallbuspasses();
  }, []);

  // overAll on submit
  const overAllOnSubmit = (values) => {
    fetchallPassData({ ...values, active: true });
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <Formik initialValues={initialValues} onSubmit={overAllOnSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
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
                      min={values.fromDate || getCurrentDate()} // Ensure toDate can't be earlier than fromDate
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="locationCategory"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Location Category
                    </label>
                    <Field
                      type="date"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                    border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // Ensure toDate can't be earlier than fromDate
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="Department"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Department
                    </label>
                    <Field
                      type="date"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                    border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // Ensure toDate can't be earlier than fromDate
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="Location"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <Field
                      type="date"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // Ensure toDate can't be earlier than fromDate
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      // disabled={isFetchEntityBookingsLoading}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Transactions by reason chart */}
        <DashboardCard07>
          <div className="flex">
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <TransactionPieChart
                data={allPassTypeData}
                title="Failed Transactions By Reason"
                angleKey="totalPasses"
              />
            </div>
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <TransactionPieChart
                data={allPassTypeData}
                title="Failed Transactions By Location "
                angleKey="totalAmount"
              />
            </div>
          </div>
        </DashboardCard07>
        <DashboardCard07>
          <div>
            <TransactionGraph
              data={allPassTypeData}
              title="Total Amount "
              angleKey="totalAmount"
            />
          </div>
        </DashboardCard07>
        <DashboardCard07>
           <div className="flex justify-center items-center h-full">
              <TransactionPieChart
                data={allPassTypeData}
                title="Failed Transactions By Type Of Device"
                angleKey="totalPasses"
              />
            </div>
        </DashboardCard07>
        <DashboardCard07>
          <div className="flex gap-4">
            <div className="flex-1 ">
              <TransactionDepartment
                data={allPassTypeData}
                title="Total Passes"
                angleKey="totalPasses"
              />
            </div>
            <div className="flex-1">
              <TransactionDepartment
                data={allPassTypeData}
                title="Total Amount "
                angleKey="totalAmount"
              />
            </div>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default FailedTransactionsDashboard;
