import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import { ToastContainer } from "react-toastify";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useIntercityTotalTransactionStore } from "../store/IntercityTotalTransactionStore";
import IntercityTotalCommonStore from "../../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";
import { useIntercityMastersStore } from "../../../../../../store/intercity/masters/intercityMastersStore";
import SearchableDropdown from "../../../../../../components/searchable_dropdown/SearchableDropdown";
import Select from "react-select";
const IntercityTotalTransactionForm = ({
  pageNumber,
  pageSize,
  mobileNumber,
  fromDate,
  toDate,
  arrivalLocation,
  departureLocation,
  busType,
  status,
}) => {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { setOuterFilters, outerFilters, resetOuterFilters, setInnerFilters, deepInnerFilters, innerFilters } =
    IntercityTotalCommonStore();
  const {
    fetchTotalTransactionsReport,
  } = useIntercityTotalTransactionStore();

  const { fetchCitiesData, fetchIntercityBusTypesData, IntercityBusTypesData } = useIntercityMastersStore();

  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [selectedBusType, setSelectedBusType] = useState(null);

  const fetchDepartureCities = async (q) => {
    try {
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setDepartureCities(response.response.result);
        setArrivalCities(response.response.result);
      }
    } catch (error) {
      console.error("Error fetching departure locations:", error);
      setDepartureCities([]);
      setArrivalCities([]);
    } finally {
    }
  };

  const fetchArrivalCities = async (q) => {
    try {
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setArrivalCities(response.response.result);
      }
    } catch (error) {
      console.error("Error fetching arrival locations:", error);
      setArrivalCities([]);
    } finally {
    }
  };

  const initialValues = {
    startDate:
      fromDate ??
      deepInnerFilters.startDate ??
      innerFilters.fromDate ??
      startOfDay,
    endDate:
      toDate ?? deepInnerFilters.endDate ?? innerFilters.toDate ?? endOfDay,
    phoneNumber:
      mobileNumber ??
      deepInnerFilters.mobileNumber ??
      innerFilters.mobileNumber ??
      "",
    arrivalLocation:
        arrivalLocation ??
      innerFilters.arrivalLocation ??
      outerFilters.arrivalLocation ??
      "",
    departureLocation:
      departureLocation ??
      innerFilters.departureLocation ??
      outerFilters.departureLocation ??
      "",
    busType: busType ?? innerFilters.busType ?? outerFilters.busType ?? "",
  };
  const onSubmit = (values) => {
    fetchTotalTransactionsReport({
      ...values,
      status: status ?? innerFilters.status,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
  };
  return (
    <>
      <ToastContainer />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 py-3 uppercase">
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
              />
            </div>

            {/* mobile number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile No
              </label>
              <Field
                type="text"
                maxLength="10"
                name="phoneNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter Mobile No"
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
              <label className="block text-xs font-medium text-gray-700">
                Bus Type
              </label>
              <Field
                as="select"
                name="busType"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                {IntercityBusTypesData?.filter((item) => item.isActive).map(
                  (item) => (
                    <option value={item.busTypesName}>
                      {item.busTypesName}
                    </option>
                  )
                )}
              </Field>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700">
                  Departure Location
                </label>
                <SearchableDropdown
                  key={`departure-${values.departureLocation || 'empty'}`}
                  name="departureLocation"
                  value={values.departureLocation}
                  onChange={(value) => setFieldValue("departureLocation", value)}
                  onSearch={fetchDepartureCities}
                  options={departureCities}
                  displayKey="cityName"
                  valueKey="cityId"
                  placeholder="Search"
                  minSearchLength={2}
                  debounceMs={300}
                  className="mt-1"
                  inputClassName="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  dropdownClassName="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                  optionClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  // loading={isIntercityTotalTransactionsLoading}
                  noResultsText="No cities found"
                  loadingText="Searching cities..."
                  initialDisplayText={values.departureLocation}
                />
              </div>
            <div>
              <label
                htmlFor="arrivalLocation"
                className="block text-xs font-medium text-gray-700"
              >
                Arrival Location
              </label>
              <SearchableDropdown
                key={`arrival-${values.arrivalLocation || 'empty'}`}
                  name="arrivalLocation"
                value={values.arrivalLocation}
                onChange={(value) =>
                  setFieldValue("arrivalLocation", value)
                }
                onSearch={fetchArrivalCities}
                options={arrivalCities}
                displayKey="cityName"
                valueKey="cityId"
                placeholder="Search"
                minSearchLength={2}
                debounceMs={300}
                className="mt-1"
                inputClassName="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                dropdownClassName="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                optionClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                // loading={isIntercityTotalTransactionsLoading}
                noResultsText="No cities found"
                loadingText="Searching cities..."
                initialDisplayText={values.arrivalLocation}
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
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

export default IntercityTotalTransactionForm;
