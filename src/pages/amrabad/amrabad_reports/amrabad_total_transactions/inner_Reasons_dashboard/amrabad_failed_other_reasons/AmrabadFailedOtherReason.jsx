import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
// import FailedOtherReasonChart from "../../charts/FailedOtherReasonChart";
// import { useMetroTotalTransactionsStore } from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalTransactionsStore";
import AmarabadTotalCommonStore from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import AdminLayout from "../../../../../../layouts/AdminLayout";
// import Breadcrumb from "../../../../../../components/Breadcrumb";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { usePackagesStore } from "../../../../../../store/amrabad/masters/packagesStore";
import { useAmarabadTotalTransactionStore } from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalTransactionStore";
import Breadcrumb from "../../../../../../components/Breadcrumb";
import AmrabadTotalTransactionChart from "../../charts/AmrabadTotalTransactionChart";

const AmrabadFailedOtherReason = () => {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { setInnerFilters, outerFilters, resetInnerFilters, innerFilters } =
    AmarabadTotalCommonStore();
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();
  const {
    fetchOtherReasonsPieChart,
    OtherReasonsPieChartData,
    isOtherReasonsPieChartLoading,
  } = useAmarabadTotalTransactionStore();

  console.log("OtherReasonsPieChartData", OtherReasonsPieChartData);
  // console.log("OtherReasonsPieChartData", OtherReasonsPieChartData);

  const filtersToUse = {
    fromDate: innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
    toDate: innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
    mobileNumber: innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
  };

  useEffect(() => {
    fetchOtherReasonsPieChart(filtersToUse);
    getPackages();
  }, []);

  const initialValues = {
    fromDate: innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
    toDate: innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
    package: innerFilters.package ?? outerFilters.package ?? "",
    house: innerFilters.house ?? outerFilters.house ?? "",
    mobileNumber: innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
  };
  const onSubmit = (values) => {
    setInnerFilters(values);
    fetchOtherReasonsPieChart(values);
  };

  // const totalCount = Array.isArray(OtherReasonsPieChartData)
  //   ? OtherReasonsPieChartData.reduce((sum, item) => sum + item.count, 0)
  //   : 0;
  const breadcrumbItems = [
    {
      label: "Total Transactions ",
      path: `/metro-total-transaction`,
      onclick: () => resetInnerFilters(),
    },
    {
      label: "Failed (Other Reasons)",
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <div className="mb-6">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        </div>
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Failed (Other Reasons)
            </h1>
          </div>
          <div className="">
            <Link
              to="/amarabad-total-transaction"
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
                    htmlFor="package"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Packages
                  </label>
                  <Field
                    as="select"
                    name="package"
                    placeholder="Select Package"
                    onChange={(e) => {
                      const packageId = e.target.value;
                      getHouses(packageId);
                      setFieldValue("package", packageId);
                    }}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select Package</option>
                    {AllPackages.map((item) => (
                      <option key={item.packageId} value={item.packageId}>
                        {item.packageName}
                      </option>
                    ))}
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="house"
                    className="block text-xs font-medium text-gray-700"
                  >
                    House
                  </label>
                  <Field
                    as="select"
                    name="house"
                    placeholder="Select House"
                    disabled={values.package == ""}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select House</option>
                    {AllHouses.map((item) => (
                      <option key={item.roomId} value={item.roomId}>
                        {item.roomName}
                      </option>
                    ))}
                  </Field>
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
                        fromDate: endOfDay,
                        toDate: endOfDay,
                        mobileNumber: "",
                      });
                      // resetInnerFilters();
                      // fetchOtherReasonsPieChart({
                      //   fromDate: endOfDay,
                      //   toDate: endOfDay,
                      //   mobileNumber: "",
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
               

                {false && (
                  <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                    <div className="loader"></div>
                  </div>
                )}
                <AmrabadTotalTransactionChart
                  data={OtherReasonsPieChartData || []}
                  title="Failed Other Reasons"
                  angleKey="subCategoryCount"
                  calloutLabelKey="subCategory"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AmrabadFailedOtherReason;
