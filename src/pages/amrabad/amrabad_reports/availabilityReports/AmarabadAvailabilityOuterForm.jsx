import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useAmarabadAvailabilityReportsStore } from "./store/AmarabadAvailabilityReportsStore";
import { getCurrentDate } from "../../../../utils/TypographyHelper";

const AmarabadAvailabilityOuterForm = ({ PageIndex = 1, pageSize = 20, SetcurrentPage }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [dateErrors, setDateErrors] = useState({});
  const [monthYearErrors, setMonthYearErrors] = useState({});

  const STORAGE_KEY = 'amarabad_availability_form_values';

  const { 
    fetchAmarabadAvailabilityOuterReports,
  } = useAmarabadAvailabilityReportsStore();

  const getNextMonthDate = (dateString) => {
    const date = new Date(dateString);
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);
    return nextMonth.toISOString().split("T")[0];
  };

  const fromDate = getCurrentDate();
  const toDate = getNextMonthDate(fromDate);

  // Load initial values from localStorage only once on mount
  const [initialFormValues, setInitialFormValues] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const lastUpdated = new Date(parsedData.lastUpdated);
        const now = new Date();
        const daysDiff = (now - lastUpdated) / (1000 * 60 * 60 * 24);

        if (daysDiff <= 7) {
          return {
            fromDate: parsedData.fromDate || "",
            toDate: parsedData.toDate || "",
            month: parsedData.month || "",
            year: parsedData.year || ""
          };
        }
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return {
      fromDate,
      toDate,
      month: "",
      year: ""
    };
  });

  // Perform default search only if no saved values exist
  useEffect(() => {
    if (!initialFormValues.fromDate && !initialFormValues.toDate && !initialFormValues.month && !initialFormValues.year) {
      const defaultSearchParams = {
        startDate: fromDate,
        endDate: toDate,
        searchType: 'dateRange',
        PageIndex: 1,
        pageSize
      };
      fetchAmarabadAvailabilityOuterReports(defaultSearchParams);
    }
  }, [fromDate, toDate, pageSize, fetchAmarabadAvailabilityOuterReports]);

  const saveToLocalStorage = (values) => {
    try {
      const dataToSave = {
        fromDate: values.fromDate || "",
        toDate: values.toDate || "",
        month: values.month || "",
        year: values.year || "",
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const validateDateRange = (values) => {
    const errors = {};
    if (!values.fromDate) {
      errors.fromDate = "From Date is required";
    }
    if (!values.toDate) {
      errors.toDate = "To Date is required";
    }
    if (values.fromDate && values.toDate && new Date(values.toDate) < new Date(values.fromDate)) {
      errors.toDate = "To Date must be after or equal to From Date";
    }
    return errors;
  };

  const validateMonthYear = (values) => {
    const errors = {};
    if (!values.month) {
      errors.month = "Month is required";
    } else if (values.month < 1 || values.month > 12) {
      errors.month = "Please select a valid month";
    }
    if (!values.year) {
      errors.year = "Year is required";
    } else if (values.year < currentYear || values.year > currentYear + 15) {
      errors.year = `Year must be between ${currentYear} and ${currentYear + 15}`;
    }
    return errors;
  };

  const handleDateRangeSearch = async (values, setFieldValue) => {
    try {
      const dateRangeErrors = validateDateRange(values);
      if (Object.keys(dateRangeErrors).length > 0) {
        setDateErrors(dateRangeErrors);
        return;
      }

      setDateErrors({});
      setMonthYearErrors({});
      SetcurrentPage(0);

      const searchParams = {
        startDate: values.fromDate,
        endDate: values.toDate,
        searchType: 'dateRange',
        PageIndex: 1,
        pageSize
      };

      // Update form values and save to localStorage
      setFieldValue("month", "");
      setFieldValue("year", "");
      saveToLocalStorage({ ...values, month: "", year: "" });

      await fetchAmarabadAvailabilityOuterReports(searchParams);
    } catch (error) {
      console.error('Error in date range search:', error);
    }
  };

  const handleMonthYearSearch = async (values, setFieldValue) => {
    try {
      const monthYearValidationErrors = validateMonthYear(values);
      if (Object.keys(monthYearValidationErrors).length > 0) {
        setMonthYearErrors(monthYearValidationErrors);
        return;
      }

      setDateErrors({});
      setMonthYearErrors({});
      SetcurrentPage(0);

      const searchParams = {
        month: values.month,
        year: values.year,
        searchType: 'monthYear',
        PageIndex: 1,
        pageSize
      };

      // Update form values and save to localStorage
      setFieldValue("fromDate", "");
      setFieldValue("toDate", "");
      saveToLocalStorage({ ...values, fromDate: "", toDate: "" });

      await fetchAmarabadAvailabilityOuterReports(searchParams);
    } catch (error) {
      console.error('Error in month/year search:', error);
    }
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

  return (
    <div>
      <Formik
        initialValues={initialFormValues}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={false}
      >
        {({ values, setFieldValue, handleChange }) => (
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3">
            <div>
              <label htmlFor="fromDate" className="block text-xs font-medium text-gray-700">
                From Date
              </label>
              <Field
                type="date"
                name="fromDate"
                className={`mt-1 block w-full px-2 py-1 border h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${
                  dateErrors.fromDate ? "border-red-500" : ""
                }`}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value && dateErrors.fromDate) {
                    setDateErrors(prev => ({ ...prev, fromDate: "" }));
                  }
                }}
              />
              {dateErrors.fromDate && (
                <div className="text-red-500 text-xs mt-1 absolute">{dateErrors.fromDate}</div>
              )}
            </div>

            <div>
              <label htmlFor="toDate" className="block text-xs font-medium text-gray-700">
                To Date
              </label>
              <Field
                type="date"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${
                  dateErrors.toDate ? "border-red-500" : ""
                }`}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value && dateErrors.toDate) {
                    setDateErrors(prev => ({ ...prev, toDate: "" }));
                  }
                }}
              />
              {dateErrors.toDate && (
                <div className="text-red-500 text-xs mt-1 absolute">{dateErrors.toDate}</div>
              )}
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 disabled:opacity-50 h-8"
                // disabled={isFetchAmarabadAvailabilityOuterReportsLoading}
                onClick={() => handleDateRangeSearch(values, setFieldValue)}
              >
                Search
                {/* {isFetchAmarabadAvailabilityOuterReportsLoading ? "Loading..." : "Search"} */}
              </button>
            </div>

            <div>
              <label htmlFor="month" className="block text-xs font-medium text-gray-700">
                Month
              </label>
              <Field
                as="select"
                name="month"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${
                  monthYearErrors.month ? "border-red-500" : ""
                }`}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value && monthYearErrors.month) {
                    setMonthYearErrors(prev => ({ ...prev, month: "" }));
                  }
                }}
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Field>
              {monthYearErrors.month && (
                <div className="text-red-500 text-xs mt-1 absolute">{monthYearErrors.month}</div>
              )}
            </div>

            <div>
              <label htmlFor="year" className="block text-xs font-medium text-gray-700">
                Year
              </label>
              <Field
                as="select"
                name="year"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-white text-sm ${
                  monthYearErrors.year ? "border-red-500" : ""
                }`}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value && monthYearErrors.year) {
                    setMonthYearErrors(prev => ({ ...prev, year: "" }));
                  }
                }}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </Field>
              {monthYearErrors.year && (
                <div className="text-red-500 text-xs mt-1 absolute">{monthYearErrors.year}</div>
              )}
            </div>

            <div className="flex items-end gap-2 ">
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 disabled:opacity-50 h-8"
                // disabled={isFetchAmarabadAvailabilityOuterReportsLoading}
                onClick={() => handleMonthYearSearch(values, setFieldValue)}
              >
                Search
                {/* {isFetchAmarabadAvailabilityOuterReportsLoading ? "Loading..." : "Search"} */}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AmarabadAvailabilityOuterForm;




