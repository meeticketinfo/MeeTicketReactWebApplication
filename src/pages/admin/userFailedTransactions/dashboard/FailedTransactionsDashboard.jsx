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
import TransactionByLocation from "../piecharts/TransactionByLocation";
import { useParkStore } from "../../../../store/masters/parksStore";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import Select from "react-select";
import { Link } from "react-router-dom";
import { getDateRange } from "../../../../utils/Helper";
import Loader from "../../../../web_app_loaders/Loader";

function FailedTransactionsDashboard({ Rangefilter, setActiveTab }) {
  superballs.register();

  localStorage.setItem("range-filter", Rangefilter);
  const UserTransactionReportFilter = JSON.parse(
    localStorage.getItem("transactionPayload")
  );
  const range = localStorage.getItem("range-filter");

  const { fromDate, toDate } = getDateRange(Rangefilter);
  const newformInitialValues = {
    fromDate: UserTransactionReportFilter?.fromDate || fromDate,
    toDate: UserTransactionReportFilter?.toDate || toDate,
    departmentId: "",
    entityId: "",
    ParkId: "",
    phoneNumber: UserTransactionReportFilter?.phoneNumber || "",
  };

  // Initial load effect
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

  // Effect for updating form values and fetching data when Rangefilter changes
  useEffect(() => {
    const { fromDate, toDate } = getDateRange(Rangefilter);
    localStorage.setItem(
      "transactionPayload",
      JSON.stringify({
        ...UserTransactionReportFilter,
        fromDate: fromDate,
        toDate: toDate,
      })
    );
    
    const payload = {
      fromDate: fromDate,
      toDate: toDate,
      locationId: "",
      categoryId: "",
      departmentId: "",
      phoneNumber: UserTransactionReportFilter?.phoneNumber || "",
    };

    fetchFailedTransactionByReason(payload);
    fetchFailedTransactionByLocation(payload);
    fetchFailedTransactionBydepartment(payload);
    fetchFailedTransactionByLocationCategory(payload);
    fetchFailedTransactionTrendGraph(payload);
  }, [Rangefilter]);

  const { allParks, fetchAllParks } = useParkStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const {
    fetchFailedTransactionByReason,
    isFailedTransactionByReasonLoading,
    FailedTransactionByReasonData,
    isFailedTransactionByLocationCategoryLoading,
    fetchFailedTransactionByLocation,
    isFailedTransactionByLocationLoading,
    FailedTransactionByLocationData,
    fetchFailedTransactionBydepartment,
    FailedTransactionByDepartmentData,
    isFailedTransactionByDepartmentLoading,
    fetchFailedTransactionByLocationCategory,
    FailedTransactionByLocationCategoryData,
    fetchFailedTransactionTrendGraph,
    FailedTransactionByGraphData,
    isFailedTransactionByGraphLoading,
  } = useTransactionsStore();

  // overAll on submit
  const overAllOnSubmit = (values) => {
    const payload = {
      fromDate: values.fromDate,
      toDate: values.toDate,
      locationId: values.locationId,
      categoryId: values.entityId,
      departmentId: values.departmentId,
      durationType: Rangefilter,
      phoneNumber: values.phoneNumber,
    };

    localStorage.setItem("transactionPayload", JSON.stringify(payload));
    
    fetchFailedTransactionByReason(payload);
    fetchFailedTransactionByLocation(payload);
    fetchFailedTransactionBydepartment(payload);
    fetchFailedTransactionByLocationCategory(payload);
    fetchFailedTransactionTrendGraph(payload);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <Formik 
            enableReinitialize={true}
            initialValues={newformInitialValues} 
            onSubmit={overAllOnSubmit}
          >
            {({ values, setFieldValue, setValues }) => (
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
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  {/* department */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Department
                    </label>

                    <Select
                      name="departmentId"
                      value={
                        allDepartmentTypes
                          ?.filter((dept) => dept.isActive)
                          .map((dept) => ({
                            value: dept.departmentId,
                            label: dept.departmentName,
                          }))
                          .find(
                            (option) => option.value === values.departmentId
                          ) || null // Set the selected value
                      }
                      options={allDepartmentTypes
                        ?.filter((dept) => dept.isActive)
                        .map((dept) => ({
                          value: dept.departmentId,
                          label: dept.departmentName,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue(
                          "departmentId",
                          selectedOption?.value || ""
                        )
                      }
                      isClearable
                      placeholder="Department"
                      className="mt-[4px] text-sm"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          outline: "none",
                          boxShadow: "none",
                          borderColor: "#ced4da",
                          borderRadius: "6px",
                          height: "30px",
                          minHeight: "33px",
                        }),

                        menu: (base) => ({
                          ...base,
                          // padding: "4px 0",
                        }),
                        option: (base, { isFocused }) => ({
                          ...base,
                          fontSize: "0.775rem",
                          backgroundColor: isFocused ? "#F8F8F8" : "white",
                          color: isFocused ? "#0C3771" : "#000",
                          cursor: "pointer",
                        }),
                      }}
                    />
                  </div>
                  {/* location category */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Location Category
                    </label>

                    <Select
                      name="entityId"
                      value={
                        allEntityTypes
                          ?.filter((dept) => dept.isActive)
                          .map((dept) => ({
                            value: dept.entityTypeId,
                            label: dept.entityTypeName,
                          }))
                          .find((option) => option.value === values.entityId) ||
                        null // Use values.entityId
                      }
                      options={allEntityTypes
                        ?.filter((entity) => entity.isActive)
                        .map((entity) => ({
                          value: entity.entityTypeId,
                          label: entity.entityTypeName,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue("entityId", selectedOption?.value || "")
                      }
                      isClearable
                      placeholder="Location Category"
                      className="mt-[4px] text-sm"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          outline: "none",
                          boxShadow: "none",
                          borderColor: "#ced4da",
                          borderRadius: "6px",
                          height: "30px",
                          minHeight: "33px",
                        }),

                        menu: (base) => ({
                          ...base,
                          // padding: "4px 0",
                        }),
                        option: (base, { isFocused }) => ({
                          ...base,
                          fontSize: "0.775rem",
                          backgroundColor: isFocused ? "#F8F8F8" : "white",
                          color: isFocused ? "#0C3771" : "#6D7072",
                          cursor: "pointer",
                        }),
                      }}
                    />
                  </div>
                  {/* location */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Location
                    </label>

                    <Select
                      name="locationId"
                      value={
                        allParks
                          ?.filter((park) => park.isActive)
                          .map((park) => ({
                            value: park.id,
                            label: park.name,
                          }))
                          .find((option) => option.value === values.locationId) ||
                        null
                      }
                      options={allParks
                        ?.filter((park) => park.isActive)
                        .map((park) => ({
                          value: park.id,
                          label: park.name,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue("locationId", selectedOption?.value || "")
                      }
                      isClearable
                      placeholder="Location"
                      className="mt-[4px] text-sm"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          outline: "none",
                          boxShadow: "none",
                          borderColor: "#ced4da",
                          borderRadius: "6px",
                          height: "30px",
                          minHeight: "33px",
                        }),

                        menu: (base) => ({
                          ...base,
                          // padding: "4px 0",
                        }),
                        option: (base, { isFocused }) => ({
                          ...base,
                          fontSize: "0.775rem",
                          backgroundColor: isFocused ? "#F8F8F8" : "white",
                          color: isFocused ? "#0C3771" : "#6D7072",
                          cursor: "pointer",
                        }),
                      }}
                    />
                  </div>
                  {/* phone number */}
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
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter phone number"
                      onKeyPress={(e) => {
                        if (!/^\d$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      // disabled={isFetchEntityBookingsLoading}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                      onClick={() => {
                        const { fromDate: resetFromDate, toDate: resetToDate } =
                          getDateRange("today");
                        
                        localStorage.removeItem("UserTransactionReportFilter");
                        localStorage.setItem("range-filter", "today");
                        localStorage.removeItem("transactionPayload");
                        
                        setValues({
                          fromDate: resetFromDate,
                          toDate: resetToDate,
                          departmentId: "",
                          entityId: "",
                          ParkId: "",
                          phoneNumber: "",
                        });
                        
                        setActiveTab("today");

                        const resetPayload = {
                          fromDate: resetFromDate,
                          toDate: resetToDate,
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          phoneNumber: "",
                        };

                        fetchFailedTransactionByReason(resetPayload);
                        fetchFailedTransactionByLocation(resetPayload);
                        fetchFailedTransactionBydepartment(resetPayload);
                        fetchFailedTransactionByLocationCategory(resetPayload);
                        fetchFailedTransactionTrendGraph(resetPayload);
                      }}
                    >
                      Reset
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
            <div
              className="flex-1 p-1 m-1 rounded-lg overflow-hidden shadow-md relative"
            >
              {/* <Loader/> */}
              
                { isFailedTransactionByReasonLoading && (
                  <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                    <div className="loader"></div>
                  </div>
                )}
              <TransactionPieChart
                data={FailedTransactionByReasonData}
                title="Failed Transactions By Reason"
                angleKey="percentage"
                calloutLabelKey="failureReason"
              />
            </div>

            <div
              className="flex-1  p-1 m-1 rounded-lg overflow-hidden shadow-md relative"
            >
              { isFailedTransactionByLocationLoading && (
                  <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                    <div className="loader"></div>
                  </div>
                )}
              <TransactionByLocation
                data={FailedTransactionByLocationData}
                title="Failed Transactions By Location "
                angleKey="percentage"
                calloutLabelKey="locationName"
              />
            </div>
          </div>
        </DashboardCard07>
        <DashboardCard07>
          <div>
            {isFailedTransactionByGraphLoading && (
              <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                <div className="loader"></div>
              </div>
            )}
            <TransactionGraph
              data={FailedTransactionByGraphData}
              title="Failed Transactions By Trends"
              angleKey="failedCount"
              calloutLabelKey="timeSlot"
            />
          </div>
        </DashboardCard07>
        {/* <DashboardCard07>
           <div className="flex justify-center items-center h-full">
              <TransactionPieChart
                data={allPassTypeData}
                title="Failed Transactions By Type Of Device"
                angleKey="totalPasses"
              />
            </div>
        </DashboardCard07> */}
        <DashboardCard07>
          <div className="flex gap-4">
            <div
              className="flex-1 relative"
            >
              {isFailedTransactionByDepartmentLoading  && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TransactionDepartment
                data={FailedTransactionByDepartmentData || []}
                title="Failed Transactions By Department"
                angleKey="failedCount"
                calloutLabelKey="departmentName"
              />
            </div>
            <div
              className="flex-1 relative"
            >
              {isFailedTransactionByLocationCategoryLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TransactionDepartment
                data={FailedTransactionByLocationCategoryData || []}
                title="Failed Transactions By Location category "
                angleKey="failedCount"
                calloutLabelKey="locationCategory"
              />
            </div>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default FailedTransactionsDashboard;
