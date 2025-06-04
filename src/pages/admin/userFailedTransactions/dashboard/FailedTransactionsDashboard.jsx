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

function FailedTransactionsDashboard({ Rangefilter, setActiveTab }) {
  superballs.register();
  localStorage.setItem("range-filter", Rangefilter);
  const UserTransactionReportFilter = JSON.parse(
    localStorage.getItem("transactionPayload")
  );
  const [filters, setfilters] = useState({
    fromDate: "",
    toDate: "",
    locationId: "",
    categoryId: "",
    departmentId: "",
    durationType: Rangefilter,
  });
  // console.log("allDashboardReportData", allDashboardReportData);
  const { allParks, fetchAllParks } = useParkStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const {
    fetchFailedTransactionByReason,
    FailedTransactionByReasonData,
    fetchFailedTransactionByLocation,
    FailedTransactionByLocationData,
    fetchFailedTransactionBydepartment,
    FailedTransactionByDepartmentData,
    fetchFailedTransactionByLocationCategory,
    FailedTransactionByLocationCategoryData,
    fetchFailedTransactionTrendGraph,
    FailedTransactionByGraphData,
  } = useTransactionsStore();
  console.log(
    "FailedTransactionByDepartmentData",
    FailedTransactionByDepartmentData
  );

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);
  useEffect(() => {
    fetchFailedTransactionByReason({
      fromDate: "",
      toDate: "",
      locationId: UserTransactionReportFilter?.locationId || "",
      categoryId: UserTransactionReportFilter?.categoryId || "",
      departmentId: UserTransactionReportFilter?.departmentId || "",
      durationType: Rangefilter,
    });
    fetchFailedTransactionByLocation({
      fromDate: "",
      toDate: "",
      locationId: UserTransactionReportFilter?.locationId || "",
      categoryId: UserTransactionReportFilter?.categoryId || "",
      departmentId: UserTransactionReportFilter?.departmentId || "",
      durationType: Rangefilter,
    });
    fetchFailedTransactionBydepartment({
      fromDate: "",
      toDate: "",
      locationId: UserTransactionReportFilter?.locationId || "",
      categoryId: UserTransactionReportFilter?.categoryId || "",
      departmentId: UserTransactionReportFilter?.departmentId || "",
      durationType: Rangefilter,
    });
    fetchFailedTransactionByLocationCategory({
      fromDate: "",
      toDate: "",
      locationId: UserTransactionReportFilter?.locationId || "",
      categoryId: UserTransactionReportFilter?.categoryId || "",
      departmentId: UserTransactionReportFilter?.departmentId || "",
      durationType: Rangefilter,
    });
    fetchFailedTransactionTrendGraph({
      fromDate: "",
      toDate: "",
      locationId: UserTransactionReportFilter?.locationId || "",
      categoryId: UserTransactionReportFilter?.categoryId || "",
      departmentId: UserTransactionReportFilter?.departmentId || "",
      durationType: Rangefilter,
    });
  }, [Rangefilter]);
  const initialValues = {
    fromDate: "",
    toDate: "",
    departmentId: UserTransactionReportFilter?.departmentId || "",
    entityId: UserTransactionReportFilter?.categoryId || "",
    ParkId: UserTransactionReportFilter?.locationId || "",
  };
  // overAll on submit
  const overAllOnSubmit = (values) => {
    // fetchallPassData({ ...values, active: true });
    const payload = {
      fromDate: values.fromDate,
      toDate: values.toDate,
      locationId: values.ParkId,
      categoryId: values.entityId,
      departmentId: values.departmentId,
      durationType: Rangefilter,
    };
    console.log("payload", payload);
    //  localStorage.setItem('transactionPayload', JSON.stringify(payload));
    setfilters(payload);
    fetchFailedTransactionTrendGraph(payload);
    fetchFailedTransactionByReason(payload);
    fetchFailedTransactionByLocation(payload);
    fetchFailedTransactionBydepartment(payload);
    fetchFailedTransactionByLocationCategory(payload);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <Formik initialValues={initialValues} onSubmit={overAllOnSubmit}>
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
                      type="datetime-local"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // min={values.fromDate || getCurrentDateStartTime()}
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
                      name="ParkId"
                      value={
                        allParks
                          ?.filter((park) => park.isActive)
                          .map((park) => ({
                            value: park.id,
                            label: park.name,
                          }))
                          .find((option) => option.value === values.ParkId) ||
                        null
                      }
                      options={allParks
                        ?.filter((park) => park.isActive)
                        .map((park) => ({
                          value: park.id,
                          label: park.name,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue("ParkId", selectedOption?.value || "")
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
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      onClick={() => {
                        console.log("test");
                        localStorage.removeItem("UserTransactionReportFilter");
                        localStorage.setItem("range-filter", "today");
                        localStorage.removeItem("transactionPayload")
                        setValues({
                          fromDate: "",
                          toDate: "",
                          departmentId: "",
                          entityId: "",
                          ParkId: "",
                        });
                        setActiveTab("today");
                        fetchFailedTransactionByReason({
                          fromDate: "",
                          toDate: "",
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          durationType: Rangefilter,
                        });
                        fetchFailedTransactionByLocation({
                          fromDate: "",
                          toDate: "",
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          durationType: Rangefilter,
                        });
                        fetchFailedTransactionBydepartment({
                          fromDate: "",
                          toDate: "",
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          durationType: Rangefilter,
                        });
                        fetchFailedTransactionByLocationCategory({
                          fromDate: "",
                          toDate: "",
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          durationType: Rangefilter,
                        });
                        fetchFailedTransactionTrendGraph({
                          fromDate: "",
                          toDate: "",
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          durationType: Rangefilter,
                        });
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
            <Link
              className="flex-1 m-1 px-4 rounded-lg overflow-hidden shadow-md"
              to="/failed-transactions"
              onClick={() => {
                localStorage.setItem(
                  "transactionPayload",
                  JSON.stringify(filters)
                );
              }}
            >
              <TransactionPieChart
                data={FailedTransactionByReasonData}
                title="Failed Transactions By Reason"
                angleKey="percentage"
                calloutLabelKey="failureReason"
              />
            </Link>

            <Link
              className="flex-1  px-4 m-1 rounded-lg overflow-hidden shadow-md"
              to="/failed-transactions"
              onClick={() => {
                localStorage.setItem(
                  "transactionPayload",
                  JSON.stringify(filters)
                );
              }}
            >
              <TransactionByLocation
                data={FailedTransactionByLocationData}
                title="Failed Transactions By Location "
                angleKey="percentage"
                calloutLabelKey="locationName"
              />
            </Link>
          </div>
        </DashboardCard07>
        <DashboardCard07>
          <div>
            <TransactionGraph
              data={FailedTransactionByGraphData}
              title="Failed Transactions By Trends"
              angleKey="percentage"
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
            <Link
              className="flex-1 "
              to="/failed-transactions"
              onClick={() => {
                localStorage.setItem(
                  "transactionPayload",
                  JSON.stringify(filters)
                );
              }}
            >
              <TransactionDepartment
                data={FailedTransactionByDepartmentData || []}
                title="Failed Transactions By Department"
                angleKey="percentage"
                calloutLabelKey="departmentName"
              />
            </Link>
            <Link
              className="flex-1"
              to="/failed-transactions"
              onClick={() => {
                localStorage.setItem(
                  "transactionPayload",
                  JSON.stringify(filters)
                );
              }}
            >
              <TransactionDepartment
                data={FailedTransactionByLocationCategoryData || []}
                title="Failed Transactions By Location category "
                angleKey="percentage"
                calloutLabelKey="locationCategory"
              />
            </Link>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default FailedTransactionsDashboard;
