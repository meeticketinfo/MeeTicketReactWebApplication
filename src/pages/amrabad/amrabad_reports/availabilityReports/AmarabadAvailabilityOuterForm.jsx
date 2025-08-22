import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { useAmarabadAvailabilityReportsStore } from "./store/AmarabadAvailabilityReportsStore";

const AmarabadAvailabilityOuterForm = ({fromDate, toDate, month, year, onFiltersChange}) => {
  const { fetchAmarabadAvailabilityOuterReports, isFetchAmarabadAvailabilityOuterReportsLoading } = useAmarabadAvailabilityReportsStore();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [hiddenFields, setHiddenFields] = useState({
    month: false,
    year: false,
    fromDate: false,
    toDate: false,
  });

  // Set initial hidden fields based on saved values
  useEffect(() => {
    // Always show month and year fields, never hide them
    setHiddenFields(prev => ({
      ...prev,
      month: false,
      year: false,
      fromDate: false,
      toDate: false,
    }));
  }, []);

  // Function to update localStorage when any field changes
  const updateLocalStorage = (fieldName, value, currentFormValues) => {
    const currentValues = { ...currentFormValues };
    currentValues[fieldName] = value;
    
    // Only save to localStorage if there are actual values
    const hasValues = Object.values(currentValues).some(val => val !== "" && val !== undefined);
    if (hasValues) {
      localStorage.setItem('amarabad_availability_filters', JSON.stringify(currentValues));
      // Don't notify parent component on field changes, only on search button clicks
    } else {
      localStorage.removeItem('amarabad_availability_filters');
      // Don't notify parent component on field changes, only on search button clicks
    }
  };

  // Validation function for form submission
  const validateForm = (values) => {
    const errors = {};
    
    // Check if month or year is selected
    const hasMonth = values.month !== "" && values.month !== undefined;
    const hasYear = values.year !== "" && values.year !== undefined;
    const hasFromDate = values.fromDate && values.fromDate !== "";
    const hasToDate = values.toDate && values.toDate !== "";
    
    // If month is selected, year is mandatory
    if (hasMonth && !hasYear) {
      errors.year = "Year is required when month is selected";
    }
    
    // If year is selected, month is mandatory
    if (hasYear && !hasMonth) {
      errors.month = "Month is required when year is selected";
    }
    
    // If neither month/year nor date range is selected, show error
    if (!hasMonth && !hasYear && !hasFromDate && !hasToDate) {
      errors.general = "Please select either month/year or date range";
    }
    
    return errors;
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [];
  for (let year = currentYear; year <= currentYear + 15; year++) {
    years.push({ value: year, label: year.toString() });
  }

  const initialValues = {
    fromDate: fromDate || "",
    toDate: toDate || "",
    month: month || "",
    year: year || "",
  };

  // Function for date range search - sends only date values, others as empty
  const handleDateRangeSearch = async (values, setFieldValue) => {
    
    // Clear month and year filters when date search is clicked
    setFieldValue("month", "");
    setFieldValue("year", "");
    
    // Save updated values to localStorage
    const updatedValues = { ...values, month: "", year: "" };
    localStorage.setItem('amarabad_availability_filters', JSON.stringify(updatedValues));
    
    // Notify parent component only when search is clicked
    if (onFiltersChange) {
      onFiltersChange(updatedValues);
    }
    
    try {
      const filters = {
        startDate: values.fromDate || "",
        endDate: values.toDate || "",
        month: "", 
        year: "",
        PageIndex: 1,
        pageSize: 20
      };

      // Call the outer report API
      await fetchAmarabadAvailabilityOuterReports(filters);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  // Function for month/year search - sends only month/year values, dates as empty
  const handleMonthYearSearch = async (values, setFieldValue) => {
    console.log("Month/Year search:", values);
    
    // Clear date filters when month/year search is clicked
    setFieldValue("fromDate", "");
    setFieldValue("toDate", "");
    
    // Save updated values to localStorage
    const updatedValues = { ...values, fromDate: "", toDate: "" };
    localStorage.setItem('amarabad_availability_filters', JSON.stringify(updatedValues));
    
    // Notify parent component only when search is clicked
    if (onFiltersChange) {
      onFiltersChange(updatedValues);
    }
    
    try {
      const filters = {
        startDate: "", 
        endDate: "", 
        month: values.month || "", 
        year: values.year || "",
        PageIndex: 1,
        pageSize: 20
      };

      // Call the outer report API
      await fetchAmarabadAvailabilityOuterReports(filters);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  return (
    <div className="p-3 ">
      <Formik 
        initialValues={initialValues} 
        validate={validateForm}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ resetForm, values, setFieldValue, errors, touched }) => (
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3">
            
            {/* From Date field */}
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="date"
                name="fromDate"
                className="mt-1 block w-full px-2 py-1 border h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  
                  // Update toDate if fromDate is greater than toDate
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
                    setFieldValue("toDate", fromDateValue);
                  }
                  
                  // Update localStorage with new values
                  const newValues = { ...values, fromDate: fromDateValue };
                  updateLocalStorage("fromDate", fromDateValue, newValues);
                }}
              />
            </div>

            {/* To Date field */}
            <div>
              <label
                htmlFor="toDate"
                className="block text-xs font-medium text-gray-700"
              >
                To Date
              </label>
              <Field
                type="date"
                name="toDate"
                className="mt-1 block w-full px-2 py-1 border h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                  
                  // Update localStorage with new values
                  const newValues = { ...values, toDate: toDateValue };
                  updateLocalStorage("toDate", toDateValue, newValues);
                }}
              />
            </div>

            {/* Date Range Search Button and Reset Button */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 disabled:opacity-50 h-8"
                // disabled={!values.fromDate || !values.toDate}
                onClick={() => handleDateRangeSearch(values, setFieldValue)}
              >
                {isFetchAmarabadAvailabilityOuterReportsLoading ? "Loading..." : "Search"}
              </button>
            
            </div>
            
            {/* Month field */}
            <div>
              <label
                htmlFor="month"
                className="block text-xs font-medium text-gray-700"
              >
                Month
              </label>
              <Field
                as="select"
                name="month"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onChange={(e) => {
                  const monthValue = e.target.value;
                  setFieldValue("month", monthValue);
                  
                  // Update localStorage with new values
                  const newValues = { ...values, month: monthValue };
                  updateLocalStorage("month", monthValue, newValues);
                }}
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Field>
            </div>

            {/* Year field */}
            <div>
              <label
                htmlFor="year"
                className="block text-xs font-medium text-gray-700"
              >
                Year
              </label>
              <Field
                as="select"
                name="year"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-white text-sm"
                onChange={(e) => {
                  const yearValue = e.target.value;
                  setFieldValue("year", yearValue);
                  
                  // Update localStorage with new values
                  const newValues = { ...values, year: yearValue };
                  updateLocalStorage("year", yearValue, newValues);
                }}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </Field>
            </div>

            {/* Month/Year Search Button */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 disabled:opacity-50 h-8"
                // disabled={!values.month || !values.year}
                onClick={() => handleMonthYearSearch(values, setFieldValue)}
              >
                {isFetchAmarabadAvailabilityOuterReportsLoading ? "Loading..." : "Search"}
              </button>
             
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AmarabadAvailabilityOuterForm;
