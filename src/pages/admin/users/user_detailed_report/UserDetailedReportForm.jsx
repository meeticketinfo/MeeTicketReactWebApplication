import { Formik, Form, Field } from "formik";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import { useParkStore } from "../../../../store/masters/parksStore";
import { useEffect } from "react";
import Select from "react-select";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import { useSearchParams } from "react-router-dom";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay, getValueFromQuery } from "../../../../utils/Helper";
import { useTransactionsStore } from "../../../../store/userTransaction/TransactionsStore";
import { userReports } from "../../../../store/userTransaction/UserReports";

const UserDetailedReportForm = ({pageNumber, pageSize, setcurrentPage}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } = useDepartmentTypesStore();
  const { allParks, fetchAllParks } = useParkStore();
  const {isFetchUserDetailedReport, fetchUserDetailedReport} = userReports();

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

  useEffect(() => {
    if (searchParams.toString()) {
      const newSearchParams = new URLSearchParams();
      
      for (const [key, value] of searchParams.entries()) {
        if (value) {
          newSearchParams.set(key, cleanString(value, ":", "_"));
        }
      }
      localStorage.setItem("userDetailedReportSearchParams", newSearchParams.toString());
    }
  }, [searchParams]);

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    parkId: searchParams.get("parkId") || "",
    departmentId: +searchParams.get("departmentId") || "",
    entityId: +searchParams.get("entityId") || "",
    mobileNumber: searchParams.get("mobileNumber") || "",
  };

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach(key => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    localStorage.setItem("userDetailedReportSearchParams", newSearchParams);

    fetchUserDetailedReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      parkId: values.parkId,
      departmentId: values.departmentId,
      entityTypeId: values.entityId,
      mobileNumber: values.mobileNumber,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    setcurrentPage(0);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
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
                  const value = selectedOption?.value || "";
                  setFieldValue("departmentId", value);
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
                      ?.filter((entity) => entity.isActive)
                      .map((entity) => ({
                        value: entity.entityTypeId,
                        label: entity.entityTypeName,
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
                    const value = selectedOption?.value || "";
                    setFieldValue("entityId", value);
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
                name="parkId"
                value={
                  allParks
                    ?.filter((park) => park.isActive)
                    .map((park) => ({
                      value: park.id,
                      label: park.name,
                    }))
                    .find((option) => option.value === values.parkId) ||
                  null
                }
                options={allParks
                  ?.filter((park) => park.isActive)
                  .map((park) => ({
                    value: park.id,
                    label: park.name,
                  }))}
                onChange={(selectedOption) => {
                  const value = selectedOption?.value || "";
                  setFieldValue("parkId", value);
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
                name="mobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("mobileNumber", e.target.value);
                }}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isFetchUserDetailedReport}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserDetailedReportForm;