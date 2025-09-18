import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useIntercityRefundReportStore } from "../../../../../../store/intercity/reports/IntercityRefundReportStore";
import { useIntercityMastersStore } from "../../../../../../store/intercity/masters/intercityMastersStore";
import SearchableDropdown from "../../../../../searchable_dropdown/SearchableDropdown";

const IntercityRefundOuterReportForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    refundIntercityTransactionsReport,
    isFetchIntercityRefundTransactionsReport,
    fetchIntercityRefundTransactionsReport,
  } = useIntercityRefundReportStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { fetchCitiesData, loadingCities } = useIntercityMastersStore();

  // Separate state for each dropdown to prevent interference
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);

  const fetchDepartureCities = async (q) => {
    try {
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setDepartureCities(response.response.result);
      }
    } catch (error) {
      console.error("Error fetching departure cities:", error);
      setDepartureCities([]);
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
      console.error("Error fetching arrival cities:", error);
      setArrivalCities([]);
    } finally {
    }
  };

  useEffect(() => {
    const preservedParams = localStorage.getItem("intercityRefundInnerTransactionSearchParams");
    if (preservedParams && !searchParams.toString()) {
      const urlParams = new URLSearchParams(preservedParams);
      urlParams.delete("RefundStatus");
      setSearchParams(urlParams);
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("RefundStatus");
      setSearchParams(newSearchParams);
    }
  }, [searchParams]);

  const getInitialValues = () => {
    const preservedParams = localStorage.getItem("intercityRefundInnerTransactionSearchParams");
    const paramsToUse = preservedParams && !searchParams.toString()
      ? new URLSearchParams(preservedParams)
      : searchParams;

    return {
      fromDate: cleanString(paramsToUse.get("fromDate"), "_", ":") || startOfDay,
      toDate: cleanString(paramsToUse.get("toDate"), "_", ":") || endOfDay,
      mobileNumber: paramsToUse.get("mobileNumber") || "",
      destinationLocation: paramsToUse.get("destinationLocation") || "",
      arrivalLocation: paramsToUse.get("arrivalLocation") || "",
    };
  };

  const initialValues = getInitialValues();

  const overAllOnSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    localStorage.setItem(
      "intercityRefundInnerTransactionSearchParams",
      newSearchParams
    );

    const payload = {
      fromDate: values.fromDate,
      toDate: values.toDate,
      destinationLocation: values.destinationLocation,
      arrivalLocation: values.arrivalLocation,
      mobileNumber: values.mobileNumber,
    };

    fetchIntercityRefundTransactionsReport(payload);
  };

  const resetForm = (setValues) => {
    const payload = {
      fromDate: startOfDay,
      toDate: endOfDay,
      destinationLocation: "",
      arrivalLocation: "",
      mobileNumber: "",
    };

    // Clear URL search params
    setSearchParams(new URLSearchParams());

    localStorage.setItem("intercityRefundInnerTransactionSearchParams", "");
    setValues(payload);
    fetchIntercityRefundTransactionsReport(payload);
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
                  min={values.fromDate}
                />
              </div>
              {/* mobile number */}
              <div>
                <label
                  htmlFor="mobileNumber"
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
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setFieldValue("mobileNumber", e.target.value);
                  }}
                />
              </div>
              {/* departure location */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Departure Location
                </label>
                <SearchableDropdown
                  key={`departure-${values.departureLocation || 'empty'}`}
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
                  loading={loadingCities}
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
                  key={`arrival-${values.arrivalLocation || 'empty'}`}
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
                  loading={isFetchIntercityRefundTransactionsReport}
                  noResultsText="No cities found"
                  loadingText="Searching cities..."
                  initialDisplayText={values.arrivalLocation}
                  uniqueId="arrival-location-dropdown"
                />
              </div>

              <div className="flex gap-2 items-end">
                <button
                  type="submit"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                //   disabled={isfetchIntercityRefundTransactionsReport}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                  onClick={() => resetForm(setValues)}
                //   disabled={isFetchIntercityRefundTransactionsReport}
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

export default IntercityRefundOuterReportForm;
