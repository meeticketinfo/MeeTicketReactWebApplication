import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import busPassTotalCommonStore from "../../../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/busPassTotalCommonStore";
import {
  getEndOfCurrentDay,
  getEndOfCurrentDayRtc,
  getStartOfCurrentDay,
  getStartOfCurrentDayRtc,
} from "../../../../../../../utils/Helper";

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
import Breadcrumb from "../../../../../../Breadcrumb";
import AdminLayout from "../../../../../../../layouts/AdminLayout";
import BusPassFailedGatewayChart from "../../charts/BusPassFailedGatewayChart";
import { useBusPassTotalTransactionStore } from "../../../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/BusPassTotalTransactionStore";

const RtcFailedGateway = () => {
  const startOfDay = getStartOfCurrentDayRtc();
  const endOfDay = getEndOfCurrentDayRtc();
  const { setInnerFilters, outerFilters, resetInnerFilters, innerFilters } =
    busPassTotalCommonStore();

  const {
    fetchRtcGateWayPieChart,
    RtcGateWayPieChartData,
    RtcisGateWayPieChartLoading,
    AllBusPassesData,
    fetchAllBusPasses,
  } = useBusPassTotalTransactionStore();

  useEffect(() => {
    fetchRtcGateWayPieChart({
      fromDate: innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
      toDate: innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
      mobileNumber:
        innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
      BusPassType: innerFilters.BusPassType ?? outerFilters.BusPassType ?? "",
    });
    fetchAllBusPasses();
  }, []);

  const initialValues = {
    fromDate: innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
    toDate: innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
    mobileNumber: innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
    BusPassType: innerFilters.BusPassType ?? outerFilters.BusPassType ?? "",
  };
  const onSubmit = (values) => {
    // Validate date range
    if (values.fromDate && values.toDate && new Date(values.fromDate) > new Date(values.toDate)) {
      alert("From Date cannot be greater than To Date. Please select a valid date range.");
      return;
    }

    setInnerFilters(values);
    fetchRtcGateWayPieChart(values);
  };

  const totalCount = Array.isArray(RtcGateWayPieChartData)
    ? RtcGateWayPieChartData.reduce((sum, item) => sum + item.count, 0)
    : 0;

  const breadcrumbItems = [
    {
      label: "Total Transactions",
      path: `/bus-pass-total-transaction`,
      onclick: () => resetInnerFilters(),
    },
    {
      label: "Failed (Payment Gateway)",
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Failed (Payment Gateway)
            </h1>
          </div>
          <div className="">
            <Link
              to="/bus-pass-total-transaction"
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
                    type="date"
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
                    htmlFor="endDate"
                    className="block text-xs font-medium text-gray-700"
                  >
                    To Date
                  </label>
                  <Field
                    type="date"
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

                {/* bus pass type */}
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
                    {
                      AllBusPassesData?.filter((item) => item.isActive).map((item) => (
                        <option value={item.passTypeId}>{item.passTypeName}</option>
                      ))
                    }
                    
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
                      // resetInnerFilters();
                      fetchRtcGateWayPieChart({
                        fromDate: startOfDay,
                        toDate: endOfDay,
                        mobileNumber: "",
                        BusPassType: "",
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

                {RtcisGateWayPieChartLoading && (
                  <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                    <div className="loader"></div>
                  </div>
                )}
                <BusPassFailedGatewayChart
                  data={totalCount !== 0 ? RtcGateWayPieChartData : []}
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

export default RtcFailedGateway;
