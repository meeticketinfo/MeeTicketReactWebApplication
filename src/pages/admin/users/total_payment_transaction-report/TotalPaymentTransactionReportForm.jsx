import { Formik, Form, Field } from "formik";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import { useParkStore } from "../../../../store/masters/parksStore";
import { useEffect } from "react";
import Select from "react-select";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import { useSearchParams } from "react-router-dom";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay, getValueFromQuery, departmentToCategoryMapping } from "../../../../utils/Helper";

const TotalPaymentTransactionReportForm = ({ pageNumber, pageSize, SetcurrentPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalTransactionSearchParams = localStorage.getItem("totalTransactionSearchParams");

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } = useDepartmentTypesStore();
  const { allParks, fetchAllParks } = useParkStore();
  const { isFetchPaymentTransactionDetailsByStatusResult, fetchPaymentTransactionDetailsByStatusResult } = userFailureTransaction();

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  useEffect(() => {
    if (searchParams.toString()) {
      const newSearchParams = new URLSearchParams();
      
      for (const [key, value] of searchParams.entries()) {
        if (value) {
          newSearchParams.set(key, cleanString(value, ":", "_"));
        }
      }
      localStorage.setItem("totalPaymentTransactionSearchParams", newSearchParams.toString());
    }
  }, [searchParams]);

  const initialValues = {
    startDate: cleanString(searchParams.get("startDate"), "_", ":") || startOfDay,
    endDate: cleanString(searchParams.get("endDate"), "_", ":") || endOfDay,
    locationId: searchParams.get("locationId") || "",
    departmentId: +searchParams.get("departmentId") || "",
    entityId: +searchParams.get("entityId") || "",
    phoneNumber: searchParams.get("phoneNumber") || "",
    bookingSource: "",
  };

  const onSubmit = (values) => {
    // Update URL search params with form values
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach(key => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams + "&category=" + getValueFromQuery(totalTransactionSearchParams, "category"));
    localStorage.setItem("totalPaymentTransactionSearchParams", newSearchParams.toString() + "&category=" + getValueFromQuery(totalTransactionSearchParams, "category"));

    fetchPaymentTransactionDetailsByStatusResult({
      startDate: values.startDate,
      endDate: values.endDate,
      locationId: values.locationId,
      departmentId: values.departmentId,
      categoryId: values.entityId,
      phoneNumber: values.phoneNumber,
      bookingSource: values.bookingSource,
      status: getValueFromQuery(totalTransactionSearchParams, "category") || "",
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    SetcurrentPage(0);
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
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
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
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("startDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.endDate)) {
                    // Automatically update toDate if it's earlier than fromDate
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
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                  setFieldValue(
                    "departmentId",
                    selectedOption?.value || ""
                  );
                  // Clear entity and location when department changes
                  setFieldValue("entityId", "");
                  setFieldValue("locationId", "");
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
                  setFieldValue(
                    "entityId",
                    selectedOption?.value || ""
                  );
                  // Clear location when entity changes
                  setFieldValue("locationId", "");
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
                    ?.map((park) => ({
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
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("phoneNumber", e.target.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="bookingSource"
                className="block text-xs font-medium text-gray-700"
              >
                Mode of Transaction
              </label>
              <Field
                as="select"
                name="bookingSource"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("bookingSource", e.target.value);
                }}
              >
                <option value="">Select Mode</option>
                <option value="MeeTicketApp">MeeTicketApp</option>
                <option value="COUNTER">COUNTER</option>
              </Field>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isFetchPaymentTransactionDetailsByStatusResult}
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

export default TotalPaymentTransactionReportForm;