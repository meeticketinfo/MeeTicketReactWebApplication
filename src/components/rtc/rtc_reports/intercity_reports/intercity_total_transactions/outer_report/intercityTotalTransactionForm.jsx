import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useIntercityTotalTransactionStore } from "../store/IntercityTotalTransactionStore";
import IntercityTotalCommonStore from "../../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";

const IntercityTotalTransactionForm = () => {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const {
    setOuterFilters,
    outerFilters,
    resetOuterFilters,
    setInnerFilters,
  } = IntercityTotalCommonStore();

  const {
    fetchTotalTransactionsReport,
    totalTransactionsReport,
    isIntercityTotalTransactionsLoading,
  } = useIntercityTotalTransactionStore();

  // Mock location data - you can replace this with actual API calls
  const departureLocations = [
    { id: "hyd", name: "Hyderabad" },
    { id: "mum", name: "Mumbai" },
    { id: "del", name: "Delhi" },
    { id: "ban", name: "Bangalore" },
    { id: "che", name: "Chennai" },
  ];

  const arrivalLocations = [
    { id: "hyd", name: "Hyderabad" },
    { id: "mum", name: "Mumbai" },
    { id: "del", name: "Delhi" },
    { id: "ban", name: "Bangalore" },
    { id: "che", name: "Chennai" },
  ];

  useEffect(() => {
    const sanitizedFilters = {
      fromDate: outerFilters.fromDate ?? startOfDay,
      toDate: outerFilters.toDate ?? endOfDay,
      departureLocation: outerFilters.departureLocation ?? "",
      arrivalLocation: outerFilters.arrivalLocation ?? "",
      mobileNumber: outerFilters.mobileNumber ?? "",
    };
    
    setInnerFilters(sanitizedFilters);
  }, []);
  
  console.log("outerFilters", outerFilters);

  const initialValues = {
    fromDate: outerFilters.fromDate ?? startOfDay,
    toDate: outerFilters.toDate ?? endOfDay,
    status: outerFilters.status ?? "",
    departureLocation: outerFilters.departureLocation ?? "",
    arrivalLocation: outerFilters.arrivalLocation ?? "",
    mobileNumber: outerFilters.mobileNumber ?? "",
  };
  const onSubmit = (values) => {
    const sanitizedValues = {
      fromDate: values.fromDate || "",
      toDate: values.toDate || "",
      departureLocation: values.departureLocation || "",
      arrivalLocation: values.arrivalLocation || "",
      mobileNumber: values.mobileNumber || "",
    };
    setOuterFilters(sanitizedValues);
    setInnerFilters(sanitizedValues);
    fetchTotalTransactionsReport(initialValues);
  };
  return (
    <>
      <ToastContainer />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-2">
            <div>
              <label
                htmlFor="startDate"
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
                  if (new Date(fromDateValue) > new Date(values.endDate)) {
                    // Automatically update toDate if it's earlier than fromDate
                    setFieldValue("toDate", fromDateValue);
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
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
               Mobile No
              </label>
              <Field
                type="text"
                name="mobileNumber"
                placeholder="Enter Mobile No"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="departureLocation"
                className="block text-xs font-medium text-gray-700"
              >
                Departure Location
              </label>
              <Field
                as="select"
                name="departureLocation"
                placeholder="Select"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                {departureLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Field>
            </div>
            <div>
              <label
                htmlFor="arrivalLocation"
                className="block text-xs font-medium text-gray-700"
              >
                Arrival Location
              </label>
              <Field
                as="select"
                name="arrivalLocation"
                placeholder="Select"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                {arrivalLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Field>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isfetchAllMetroBookingDetailsReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                onClick={() => {
                  const resetValues = {
                    fromDate: startOfDay,
                    toDate: endOfDay,
                    departureLocation: "",
                    arrivalLocation: "",
                    mobileNumber: "",
                  };
                  
                  setValues(resetValues);
                  resetOuterFilters(resetValues);
                  setInnerFilters(resetValues);
                  fetchTotalTransactionsReport(resetValues);
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>

    </>
  );
};

export default IntercityTotalTransactionForm;
