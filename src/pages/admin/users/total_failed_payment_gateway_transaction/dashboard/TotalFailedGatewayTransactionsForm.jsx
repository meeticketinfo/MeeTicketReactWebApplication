import { useParkStore } from "../../../../../store/masters/parksStore";
import { useEntityTypesStore } from "../../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../../store/masters/departmentTypesStore";
import { cleanString, getDateRange, getEndOfCurrentDay, getStartOfCurrentDay, getValueFromQuery } from "../../../../../utils/Helper";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import { useSearchParams } from "react-router-dom";

const TotalFailedGatewayTransactionsForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalTransactionSearchParams = localStorage.getItem("totalTransactionSearchParams");
  const { allParks, fetchAllParks } = useParkStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } = useDepartmentTypesStore();
  const { fetchPaymentFailedGatewayTransactionSummaryPieChartData } = useTransactionsStore();

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("subCategory");
    setSearchParams(newSearchParams);
  }, [searchParams]);

  // Initial load effect
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

  const initialValues =  {
    startDate: cleanString(searchParams.get("startDate"), "_", ":") || startOfDay,
    endDate: cleanString(searchParams.get("endDate"), "_", ":") || endOfDay,
    departmentId: +searchParams.get("departmentId") || "",
    entityId: +searchParams.get("entityId") || "",
    locationId: searchParams.get("locationId") || "",
    phoneNumber: searchParams.get("phoneNumber") || "",
  }  

  const overAllOnSubmit = (values) => {
    // Update URL search params with form values
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach(key => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams + "&category=" + getValueFromQuery(totalTransactionSearchParams, "category"));
    localStorage.setItem("totalFailedGatewayTransactionSearchParams", newSearchParams.toString() + "&category=" + getValueFromQuery(totalTransactionSearchParams, "category"));

    const payload = {
      startDate: values.startDate,
      endDate: values.endDate,
      locationId: values.locationId,
      categoryId: values.entityId,
      departmentId: values.departmentId,
      phoneNumber: values.phoneNumber,
    };

    fetchPaymentFailedGatewayTransactionSummaryPieChartData(payload);
  };

  const resetForm = (setValues) => {
    const payload = {
      startDate: startOfDay,
      endDate: endOfDay,
      locationId: "",
      categoryId: "",
      departmentId: "",
      phoneNumber: "",
    };
    const newSearchParams = new URLSearchParams();

    // Clear URL search params
    setSearchParams(newSearchParams + "&category=" + getValueFromQuery(totalTransactionSearchParams, "category"));

    setValues(payload);
    fetchPaymentFailedGatewayTransactionSummaryPieChartData(payload);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={overAllOnSubmit}
      >
        {({ values, setFieldValue, setValues }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 gap-x-3 py-3">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-xs font-medium text-gray-700"
                >
                  From Date
                </label>
                <Field
                  type="datetime-local"
                  name="startDate"
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  onChange={(e) => {
                    const fromDateValue = e.target.value;
                    setFieldValue("startDate", fromDateValue);
                    if (new Date(fromDateValue) > new Date(values.endDate)) {
                      setFieldValue("endDate", fromDateValue);
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
                  name="endDate"
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  onChange={(e) => {
                    const toDateValue = e.target.value;
                    setFieldValue("endDate", toDateValue);
                  }}
                  min={values.startDate || startOfDay}
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
                      ) || null
                  }
                  options={allDepartmentTypes
                    ?.filter((dept) => dept.isActive)
                    .map((dept) => ({
                      value: dept.departmentId,
                      label: dept.departmentName,
                    }))}
                  onChange={(selectedOption) => {
                    setFieldValue(
                      "departmentId",
                      selectedOption?.value || ""
                    )
                  }}
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
                    null
                  }
                  options={allEntityTypes
                    ?.filter((entity) => entity.isActive)
                    .map((entity) => ({
                      value: entity.entityTypeId,
                      label: entity.entityTypeName,
                    }))}
                  onChange={(selectedOption) => {
                    setFieldValue(
                      "entityId",
                      selectedOption?.value || ""
                    )
                  }}
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
                    ?.filter((park) => park.isActive && (park.departmentId == values.departmentId || values.departmentId == "") && (park.entityTypeId == values.entityId || values.entityId == ""))
                    .map((park) => ({
                      value: park.id,
                      label: park.name,
                    }))}
                  onChange={(selectedOption) => {
                    setFieldValue(
                      "locationId",
                      selectedOption?.value || ""
                    )
                  }}
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
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setFieldValue("phoneNumber",e.target.value)
                  }}
                />
              </div>
              <div className="flex gap-2 items-end">
                <button
                  type="submit"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                  onClick={() => resetForm(setValues)}
                >
                  Reset
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TotalFailedGatewayTransactionsForm;