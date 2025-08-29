import React, { useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import { Field, Form, Formik } from "formik";

// import MetroNotGeneratedChart from "../../charts/MetroNotGeneratedChart";
// import Breadcrumb from "../../../../../components/Breadcrumb";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { usePackagesStore } from "../../../../../../store/amrabad/masters/packagesStore";
import AdminLayout from "../../../../../../layouts/AdminLayout";
import AmarabadTotalCommonStore from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import AmrabadTotalTransactionChart from "../../charts/AmrabadTotalTransactionChart";
import { useAmarabadTotalTransactionStore } from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalTransactionStore";
import Breadcrumb from "../../../../../../components/Breadcrumb";
import AmrabadNotGeneratedChart from "../../charts/AmarabadNotGenerateChart";

const AmrabadNotGenerated = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const packageName = searchParams.get("package");
  const house = searchParams.get("house");
  const mobileNumber = searchParams.get("mobileNumber");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const subCategory = searchParams.get("subCategory");
  
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { setInnerFilters, outerFilters, resetInnerFilters, innerFilters } =
    AmarabadTotalCommonStore();
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();
  const {
    fetchTicketNotGeneratedPieChart,
    TicketNotGeneratedPieChartData,
    isTicketNotGeneratedPieChartLoading,
  } = useAmarabadTotalTransactionStore();

  useEffect(() => {
    fetchTicketNotGeneratedPieChart({
      fromDate: fromDate ?? innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
      toDate: toDate ?? innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
      mobileNumber:
        mobileNumber ?? innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
      package: packageName ?? innerFilters.package ?? outerFilters.package ?? "",
      house: house ?? innerFilters.house ?? outerFilters.house ?? "",
    });
    getPackages();
  }, [packageName, house, mobileNumber, fromDate, toDate]);

  const initialValues = {
    fromDate: fromDate ?? innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
    toDate: toDate ?? innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
    package: packageName ?? innerFilters.package ?? outerFilters.package ?? "",
    house: house ?? innerFilters.house ?? outerFilters.house ?? "",
    mobileNumber: mobileNumber ?? innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
  };
  const onSubmit = (values) => {
    setInnerFilters({
      ...values,
      subCategory: subCategory || innerFilters.subCategory || "",
    });
    fetchTicketNotGeneratedPieChart(values);
  };

  const breadcrumbItems = [
    {
      label: "Total Transactions Report",
      path: `/amarabad-total-transaction?package=${packageName || ""}&house=${house || ""}&mobileNumber=${mobileNumber || ""}&fromDate=${fromDate || ""}&toDate=${toDate || ""}`,
      onclick: () => resetInnerFilters(),
    },
    {
      label: "Ticket Not Generated Transactions Report",
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Payment Successful but Ticket not Generated
            </h1>
          </div>
          <div className="">
            <Link
              to={`/amarabad-total-transaction?package=${packageName || ""}&house=${house || ""}&mobileNumber=${mobileNumber || ""}&fromDate=${fromDate || ""}&toDate=${toDate || ""}`}
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
              <>
                <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-2">
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
                        if (
                          new Date(fromDateValue) > new Date(values.endDate)
                        ) {
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
                          fromDate: startOfDay,
                          toDate: startOfDay,
                          package: "",
                          house: "",
                          mobileNumber: "",
                        });
                        // resetInnerFilters();
                        // fetchTicketNotGeneratedPieChart({
                        //   fromDate: startOfDay,
                        //   toDate: endOfDay,
                        //   mobileNumber: "",
                        // });
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </Form>

                <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
                  <div className="flex">
                    <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
                      {isTicketNotGeneratedPieChartLoading && (
                        <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                          <div className="loader"></div>
                        </div>
                      )}
                      <AmrabadNotGeneratedChart
                        data={TicketNotGeneratedPieChartData || []}
                        title="Payment Successful but Ticket not Generated"
                        angleKey="subCategoryCount"
                        calloutLabelKey="subCategory"
                        packageName={values.package}
                        house={values.house}
                        mobileNumber={values.mobileNumber}
                        fromDate={values.fromDate}
                        toDate={values.toDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AmrabadNotGenerated;
