import { useParkStore } from "../../../../../store/masters/parksStore";
import { useEntityTypesStore } from "../../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../../store/masters/departmentTypesStore";
import { cleanString, departmentToCategoryMapping, getDateRange, getEndOfCurrentDay, getStartOfCurrentDay, getValueFromQuery } from "../../../../../utils/Helper";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import { useSearchParams } from "react-router-dom";
import useAuthStore from "../../../../../store/authStore";

const TotalFailedGatewayTransactionsForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalTransactionSearchParams = localStorage.getItem("totalTransactionSearchParams");
  const { allParks, fetchAllParks } = useParkStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } = useDepartmentTypesStore();
  const { fetchPaymentFailedGatewayTransactionSummaryPieChartData } = useTransactionsStore();
const { roleDetails } = useAuthStore();

  const role = roleDetails?.name;
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

  const initialValues = {
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

  // Get filtered entity types based on selected department
  const getFilteredEntityTypes = (selectedDepartmentId) => {
    if (!selectedDepartmentId || !allDepartmentTypes || !allEntityTypes) {
      return allEntityTypes?.filter((entity) => entity.isActive && entity.entityTypeName !== "Metro") || [];
    }

    const selectedDepartment = allDepartmentTypes.find(dept => dept.departmentId === selectedDepartmentId);
    if (!selectedDepartment) {
      return allEntityTypes?.filter((entity) => entity.isActive && entity.entityTypeName !== "Metro") || [];
    }

    const allowedCategories = departmentToCategoryMapping[selectedDepartment.departmentName] || [];

    return allEntityTypes
      ?.filter((entity) => entity.isActive && entity.entityTypeName !== "Metro" && allowedCategories.includes(entity.entityTypeName)) || [];
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {/* From Date */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="startDate"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  From Date
                </label>
                <Field
                  type="datetime-local"
                  name="startDate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => {
                    const fromDateValue = e.target.value;
                    setFieldValue("startDate", fromDateValue);
                    if (new Date(fromDateValue) > new Date(values.endDate)) {
                      setFieldValue("endDate", fromDateValue);
                    }
                  }}
                />
              </div>
              
              {/* To Date */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="endDate"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  To Date
                </label>
                <Field
                  type="datetime-local"
                  name="endDate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => {
                    const toDateValue = e.target.value;
                    setFieldValue("endDate", toDateValue);
                  }}
                  min={values.startDate || startOfDay}
                />
              </div>

              {/* Department - Only for Super Admin */}
              {role === "ROLE_SUPERADMIN" && (
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <Select
                    name="departmentId"
                    value={
                      allDepartmentTypes
                        ?.filter((dept) => dept.isActive && dept.departmentName !== "Metro")
                        .map((dept) => ({
                          value: dept.departmentId,
                          label: dept.departmentName,
                        }))
                        .find(
                          (option) => option.value === values.departmentId
                        ) || null
                    }
                    options={allDepartmentTypes
                      ?.filter((dept) => dept.isActive && dept.departmentName !== "Metro")
                      .map((dept) => ({
                        value: dept.departmentId,
                        label: dept.departmentName,
                      }))}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || "";
                      setFieldValue("departmentId", value);
                      // Clear entity and location when department changes
                      setFieldValue("entityId", "");
                      setFieldValue("parkId", "");
                    }}
                    isClearable
                    placeholder="Department"
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        outline: "none",
                        boxShadow: "none",
                        borderColor: "#ced4da",
                        borderRadius: "6px",
                        minHeight: "40px",
                        backgroundColor: "#fff",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        fontSize: "0.875rem",
                        backgroundColor: isFocused ? "#F8F8F8" : "white",
                        color: isFocused ? "#0C3771" : "#000",
                        cursor: "pointer",
                      }),
                    }}
                  />
                </div>
              )}
              
              {/* Location Category */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location Category
                </label>
                <Select
                  name="entityId"
                  value={
                    getFilteredEntityTypes(values.departmentId)
                      .map((entity) => ({
                        value: entity.entityTypeId,
                        label: entity.entityTypeName,
                      }))
                      .find((option) => option.value === values.entityId) ||
                    null
                  }
                  options={getFilteredEntityTypes(values.departmentId)
                    .map((entity) => ({
                      value: entity.entityTypeId,
                      label: entity.entityTypeName,
                    }))}
                  onChange={(selectedOption) => {
                    const value = selectedOption?.value || "";
                    setFieldValue("entityId", value);
                    // Clear location when entity changes
                    setFieldValue("parkId", "");
                  }}
                  isClearable
                  placeholder="Location Category"
                  className="mt-1 text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      outline: "none",
                      boxShadow: "none",
                      borderColor: "#ced4da",
                      borderRadius: "6px",
                      minHeight: "40px",
                      backgroundColor: "#fff",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      fontSize: "0.875rem",
                      backgroundColor: isFocused ? "#F8F8F8" : "white",
                      color: isFocused ? "#0C3771" : "#6D7072",
                      cursor: "pointer",
                    }),
                  }}
                />
              </div>
              
              {/* Location */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <Select
                  name="locationId"
                  value={
                    allParks
                      ?.filter((park) => park.departmentName !== "Metro")
                      .map((park) => ({
                        value: park.id,
                        label: park.name,
                      }))
                      .find((option) => option.value === values.locationId) ||
                    null
                  }
                  options={allParks
                    ?.filter((park) => park.departmentName !== "Metro" && (park.departmentId == values.departmentId || values.departmentId == "") && (park.entityTypeId == values.entityId || values.entityId == ""))
                    .map((park) => ({
                      value: park.id,
                      label: park.name,
                    }))}
                  onChange={(selectedOption) => {
                    const value = selectedOption?.value || "";
                    setFieldValue("locationId", value);
                  }}
                  isClearable
                  placeholder="Location"
                  className="mt-1 text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      outline: "none",
                      boxShadow: "none",
                      borderColor: "#ced4da",
                      borderRadius: "6px",
                      minHeight: "40px",
                      backgroundColor: "#fff",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      fontSize: "0.875rem",
                      backgroundColor: isFocused ? "#F8F8F8" : "white",
                      color: isFocused ? "#0C3771" : "#6D7072",
                      cursor: "pointer",
                    }),
                  }}
                />
              </div>
              
              {/* Phone Number */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phone Number
                </label>
                <Field
                  type="text"
                  maxLength="10"
                  name="phoneNumber"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter phone number"
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setFieldValue("phoneNumber", e.target.value)
                  }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="sm:col-span-1 flex flex-col sm:flex-row gap-2 sm:items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Search
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto bg-gray-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
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