import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { Field, Form, Formik } from "formik";
import DashboardCard07 from "../../../../../partials/dashboard/DashboardCard07";
import { useParkStore } from "../../../../../store/masters/parksStore";
import { useEntityTypesStore } from "../../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../../store/masters/departmentTypesStore";
import Select from "react-select";
import { getDateRange } from "../../../../../utils/Helper";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import TransactionByLocation from "../../../userFailedTransactions/piecharts/TransactionByLocation";
import TotalTransactionsChart from "../charts/TotalTransactionsChart";
import TicketNotGenerated from "../charts/TicketNotGenerated";

function TotalTransactions({ Rangefilter, setActiveTab }) {
  superballs.register();

  const {
    PaymentTransactionPieChartData,
    isPaymentTransactionPieChartLoading,
    fetchPaymentTransactionPieChartData,
    SuccessButNotConfirmedPieChartData,
    isSuccessButNotConfirmedPieChartLoading,
    fetchSuccessButNotConfirmedPieChartData,
  } = useTransactionsStore();

  const { allParks, fetchAllParks } = useParkStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  localStorage.setItem("range-filter", Rangefilter);
  const UserTransactionReportFilter = JSON.parse(
    localStorage.getItem("transactionPayload")
  );

  const { fromDate, toDate } = getDateRange(Rangefilter);

  const newformInitialValues = {
    fromDate: fromDate || UserTransactionReportFilter?.fromDate,
    toDate: toDate || UserTransactionReportFilter?.toDate,
    departmentId: UserTransactionReportFilter?.departmentId || "",
    entityId: UserTransactionReportFilter?.categoryId || "",
    ParkId: UserTransactionReportFilter?.locationId || "",
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
      locationId: UserTransactionReportFilter?.locationId || "",
      categoryId: UserTransactionReportFilter?.categoryId || "",
      departmentId: UserTransactionReportFilter?.departmentId || "",
      phoneNumber: UserTransactionReportFilter?.phoneNumber || "",
    };

    fetchPaymentTransactionPieChartData(payload);
    fetchSuccessButNotConfirmedPieChartData(payload);
  }, [Rangefilter]);

  // overAll on submit
  const overAllOnSubmit = (values) => {
    const payload = {
      fromDate: values.fromDate,
      toDate: values.toDate,
      locationId: values.ParkId,
      categoryId: values.entityId,
      departmentId: values.departmentId,
      durationType: Rangefilter,
      phoneNumber: values.phoneNumber,
    };

    localStorage.setItem("transactionPayload", JSON.stringify(payload));
    fetchPaymentTransactionPieChartData(payload);
    fetchSuccessButNotConfirmedPieChartData(payload);
  };
  const totalCount =
    PaymentTransactionPieChartData?.reduce(
      (sum, item) => sum + item.count,
      0
    ) || 0;

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
                  {/* mobile number */}
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
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                      placeholder="Enter phone number"
                      onKeyPress={(e) => {
                        if (!/^\d$/.test(e.key)) {
                          e.preventDefault(); // Prevent non-numeric characters
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
                        // Reset form values and filters
                        localStorage.removeItem("UserTransactionReportFilter");
                        localStorage.setItem("range-filter", "today");
                        localStorage.removeItem("transactionPayload");
                        setValues({
                          fromDate: resetFromDate,
                          toDate: resetToDate,
                          departmentId: "",
                          entityId: "",
                          ParkId: "",
                        });
                        setActiveTab("today");

                        // Reset chart data by clearing relevant stores
                        fetchPaymentTransactionPieChartData({
                          fromDate: resetFromDate,
                          toDate: resetToDate,
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          phoneNumber: "",
                        });
                        fetchSuccessButNotConfirmedPieChartData({
                          fromDate: fromDate,
                          toDate: toDate,
                          locationId: "",
                          categoryId: "",
                          departmentId: "",
                          phoneNumber: "",
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
            <div className="flex-1 p-1 m-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isPaymentTransactionPieChartLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TotalTransactionsChart
                data={totalCount !== 0 ? PaymentTransactionPieChartData : []}
                title="Total Transactions"
                angleKey="count"
                calloutLabelKey="category"
              />
            </div>

            <div className="flex-1  p-1 m-1 rounded-lg overflow-hidden shadow-md relative">
              {isSuccessButNotConfirmedPieChartLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TicketNotGenerated
                data={SuccessButNotConfirmedPieChartData}
                title="Payment Success and Ticket not generated"
                angleKey="count"
                calloutLabelKey="subCategory"
              />
            </div>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default TotalTransactions;
