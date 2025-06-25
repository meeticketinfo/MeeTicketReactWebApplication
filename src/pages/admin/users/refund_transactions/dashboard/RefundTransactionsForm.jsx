import { useParkStore } from "../../../../../store/masters/parksStore";
import { useEntityTypesStore } from "../../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../../store/masters/departmentTypesStore";
import { cleanString, getDateRange, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import { useSearchParams } from "react-router-dom";
import { userReports } from "../../../../../store/userTransaction/UserReports";

const TotalTransactionsForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { allParks, fetchAllParks } = useParkStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } = useDepartmentTypesStore();
  const {
    totalTransactionSearchParams,
    setTotalTransactionSearchParams,
    clearTotalTransactionSearchParams,
  } = useTransactionsStore();

  const {
    isFetchRefundTransactions,
    fetchRefundTransactions
  } = userReports();

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  // Initial load effect
  useEffect(() => {
    setSearchParams(totalTransactionSearchParams);
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("category");
    setSearchParams(newSearchParams);
  }, [searchParams]);

  const initialValues =  {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
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
    setSearchParams(newSearchParams);
    setTotalTransactionSearchParams(newSearchParams);

    const payload = {
      fromDate: values.fromDate,
      toDate: values.toDate,
      locationId: values.locationId,
      locationCategoryId: values.entityId,
      departmentId: values.departmentId,
      phoneNumber: values.phoneNumber,
    };

    fetchRefundTransactions(payload);
  };

  const resetForm = (setValues) => {
    const payload = {
      fromDate: startOfDay,
      toDate: endOfDay,
      locationId: "",
      locationCategoryId: "",
      departmentId: "",
      phoneNumber: "",
    };

    // Clear URL search params
    setSearchParams(new URLSearchParams());

    setValues(payload);
    fetchRefundTransactions(payload);
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
                    ?.filter((park) => park.isActive)
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
                  disabled={isFetchRefundTransactions}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                  onClick={() => resetForm(setValues)}
                  disabled={isFetchRefundTransactions}
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

export default TotalTransactionsForm;