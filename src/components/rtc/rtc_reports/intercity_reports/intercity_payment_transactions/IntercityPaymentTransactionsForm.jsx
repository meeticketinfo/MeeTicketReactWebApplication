import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate, getCurrentDateStartTime, getCurrentDateEndTime } from "../../../../../utils/TypographyHelper";
import { useIntercityPaymentTransactionStore } from "../../../../../store/rtc/IntercityPaymentTransactionStore";
import DebounceSearchableDropdown from "../../../../sharedcomponents/DebounceSearchableDropdown";
import SearchableDropdown from "../../../../searchable_dropdown/SearchableDropdown";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import { getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
const IntercityPaymentTransactionsForm = ({
  PageIndex,
  pageSize,
  SetcurrentPage,
}) => {
  const {
    fetchIntercityPaymentTransactions,
  } = useIntercityPaymentTransactionStore();
  const { fetchCitiesData, loadingCities } = useIntercityMastersStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("intercity-payment-report-filters")
  );
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDateStartTime(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDateEndTime(),

    paymentStatus: savedFilters?.paymentStatus
      ? savedFilters.paymentStatus
      : null,
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
    arrivalLocation: savedFilters?.arrivalLocation ? savedFilters.arrivalLocation : "",
    destinationLocation: savedFilters?.destinationLocation ? savedFilters.destinationLocation : "",
  };
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [DepartureLoading, setDepartureLoading] = useState(false);
  const [ArrivalLoading, setArrivalLoading] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  
  const fetchDepartureCities = async (q) => {
    try {
      setDepartureLoading(true);
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setDepartureCities(response.response.result);
      }
    } catch (error) {
      console.error("Error fetching departure cities:", error);
      setDepartureCities([]);
    } finally {
       setDepartureLoading(false);
    }
  };

  const fetchArrivalCities = async (q) => {
    try {
      setArrivalLoading(true);
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setArrivalCities(response.response.result);
      }
    } catch (error) {
      console.error("Error fetching arrival cities:", error);
      setArrivalCities([]);
    } finally {
      setArrivalLoading(false);
    }
  };
  const onSubmit = (values, { resetForm }) => {
    console.log("values", values);

    localStorage.setItem(
      "intercity-payment-report-filters",
      JSON.stringify(values)
    );
    fetchIntercityPaymentTransactions({
      startDate: values.fromDate,
      endDate: values.toDate,
      paymentStatus: values.paymentStatus || "",
      phoneNumber: values.phoneNumber || "",
      arrivalLocation:values.arrivalLocation || "",
      destinationLocation:values.destinationLocation || "",
      PageIndex,
      pageSize,
    });
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 py-3">
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
                // min={getCurrentDate()}
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
                min={values.fromDate || getCurrentDateStartTime()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Payment Status
              </label>
              <Field
                as="select"
                name="paymentStatus"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select Payment Status</option>
                <option value="INITIATE">Initiate</option>
                <option value="INPROCESS">In Process</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="FAILED">Failed</option>
              </Field>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile No
              </label>
              <Field
                type="tel"
                name="phoneNumber"
                placeholder="Enter mobile number"
                className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow digits and ensure it starts with 6-9
                  const numericValue = value.replace(/[^0-9]/g, '');
                  
                  // Limit to 10 digits maximum
                  if (numericValue.length > 10) {
                    return; // Don't update if more than 10 digits
                  }
                  
                  // If the value is not empty, check if it starts with 6-9
                  if (numericValue.length > 0 && !/^[6-9]/.test(numericValue)) {
                    return; // Don't update if it doesn't start with 6-9
                  }
                  
                  setFieldValue("phoneNumber", numericValue);
                }}
              />
            </div>
          {/* departure location */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Departure Location
                </label>
                <SearchableDropdown
                  key={`departure-${resetTrigger}`}
                  name="destinationLocation"
                  value={values.destinationLocation}
                  onChange={(value) => setFieldValue("destinationLocation", value)}
                  onSearch={fetchDepartureCities}
                  options={departureCities}
                  displayKey="cityName"
                  valueKey="cityId"
                  placeholder="Search departure city..."
                  minSearchLength={2}
                  debounceMs={300}
                  className="mt-1"
                  inputClassName="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  dropdownClassName="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                  optionClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  loading={DepartureLoading}
                  noResultsText="No cities found"
                  loadingText="Searching cities..."
                  initialDisplayText={values.destinationLocation}
                />
              </div>
              {/* arrival location */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Arrival Location
                </label>
                <SearchableDropdown
                  key={`arrival-${resetTrigger}`}
                  name="arrivalLocation"
                  value={values.arrivalLocation}
                  onChange={(value) => setFieldValue("arrivalLocation", value)}
                  onSearch={fetchArrivalCities}
                  options={arrivalCities}
                  displayKey="cityName"
                  valueKey="cityId"
                  placeholder="Search arrival city..."
                  minSearchLength={2}
                  debounceMs={300}
                  className="mt-1"
                  inputClassName="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  dropdownClassName="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                  optionClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  loading={ArrivalLoading}
                  noResultsText="No cities found"
                  loadingText="Searching cities..."
                  initialDisplayText={values.arrivalLocation}
                  uniqueId="arrival-location-dropdown"
                />
              </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
              // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
                onClick={() => {
                  localStorage.removeItem(
                    "intercity-payment-report-filters"
                  );
                  resetForm({
                    values: {
                      fromDate: getCurrentDateStartTime(),
                      toDate: getCurrentDateEndTime(),
                      paymentStatus: "",
                      phoneNumber: "",
                      arrivalLocation: "",
                      destinationLocation: "",
                    },
                  });
                  fetchIntercityPaymentTransactions({
                    startDate: getCurrentDateStartTime(),
                    endDate: getCurrentDateEndTime(),
                    paymentStatus: "",
                    phoneNumber: "",
                    arrivalLocation: "",
                    destinationLocation: "",
                    PageIndex,
                    pageSize,
                  });
                  setDepartureCities([]);
                  setArrivalCities([]);
                  setResetTrigger(prev => prev + 1);
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

export default IntercityPaymentTransactionsForm;
