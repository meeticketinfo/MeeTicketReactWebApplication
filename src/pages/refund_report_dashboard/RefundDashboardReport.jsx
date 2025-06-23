import Select from "react-select";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useParkStore } from "../../store/masters/parksStore";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { getDateRange } from "../../utils/Helper";
import DashboardCard07 from "../../partials/dashboard/DashboardCard07";
import TotalTransactionsChart from "../admin/users/total_transaction/charts/TotalTransactionsChart";
import RefundChart from "./refund_charts/RefundChart";
import { RefundReportStore } from "../../store/refundReportDashboard/RefundReportStore";

const RefundDashboardReport = ({ range, setRange }) => {
  const RefundFilters = JSON.parse(localStorage.getItem("RefundReportPayload"));
  const data = [
    {
      status: "Refund",
      count: 8,
      percentage: 15,
      totalTransaction: 10,
    },
    {
      status: "Not Refund",
      count: 2,
      percentage: 5,
      totalTransaction: 10,
    },
  ];
  const { fromDate, toDate } = getDateRange(range);
  const { allParks, fetchAllParks } = useParkStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const { RefundsReports, fetchRefundsReport, isRefundsReportLoading } =
    RefundReportStore();

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks({});
  }, []);

  const InitialValues = {
    fromDate: RefundFilters?.fromDate || fromDate,
    toDate: RefundFilters?.toDate || toDate,
    departmentId: RefundFilters?.departmentId || "",
    entityId: RefundFilters?.entityId || "",
    ParkId: RefundFilters?.ParkId || "",
    phoneNumber: RefundFilters?.phoneNumber || "",
    ModeOfTransaction: RefundFilters?.ModeOfTransaction || "",
    PaymentMode: RefundFilters?.PaymentMode || "",
  };
  const onSubmit = (values) => {
    console.log("values", values);
    localStorage.setItem("RefundReportPayload", JSON.stringify(values));
  };
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <Formik
            enableReinitialize={true}
            initialValues={InitialValues}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, setValues }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
                  {/* from Date */}
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
                  {/* to date */}
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
                          ?.filter((park) => park.isActive && park.isCounter)
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
                  {/*Mode of Transaction  */}
                  <div>
                    <label className="block text-sm font-medium">
                      Mode of Transaction
                    </label>
                    <Field
                      as="select"
                      name="ModeOfTRansaction"
                      className={` block w-full px-2 py-1 border border-gray-300
                               rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    >
                      <option value="">Select Payment Status</option>
                      <option value="meeTicket">Mee Ticket App</option>
                      <option value="counter">Counter</option>
                    </Field>
                  </div>
                  {/* Payment Mode */}
                  <div>
                    <label className="block text-sm font-medium">
                      Payment Mode
                    </label>
                    <Field
                      as="select"
                      name="PaymentMode"
                      className={` block w-full px-2 py-1 border border-gray-300
                               rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    >
                      <option value="">Select Payment Status</option>
                      <option value="upi">UPI</option>
                      <option value="creditCard">Credit Card</option>
                      <option value="debitCard">Debit Card</option>
                      <option value="netBanking">Net Banking</option>
                    </Field>
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

                        localStorage.removeItem("RefundReportPayload");
                        setValues({
                          fromDate: resetFromDate,
                          toDate: resetToDate,
                          departmentId: "",
                          entityId: "",
                          ParkId: "",
                          phoneNumber: "",
                          ModeOfTRansaction: "",
                          PaymentMode: "",
                        });
                        setRange("today");
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
          <div className="">
            <div className="flex-1  rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {false && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <RefundChart
                // data={totalCount !== 0 ? PaymentTransactionPieChartData : []}
                data={data !== 0 ? data : []}
                title="Payment Success & Ticket Not Generated"
                angleKey="count"
                calloutLabelKey="status"
                percentage="percentage"
              />
            </div>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
};

export default RefundDashboardReport;
