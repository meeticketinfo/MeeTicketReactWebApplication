import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useIntercityUserStore } from "../../../../../store/intercity/reports/IntercityUserReportStore";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import SearchableDropdown from "../../../../searchable_dropdown/SearchableDropdown";

const IntercityUserDetailedReportForm = ({
  pageNumber,
  pageSize,
  setcurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isIntercityUserDetailedReportsLoading,
    allIntercityUserDetailedReports,
    fetchIntercityUserDetailedReports,
  } = useIntercityUserStore();
  const { fetchCitiesData, loadingCities } = useIntercityMastersStore();
  useEffect(() => {
    if (searchParams.toString()) {
      const newSearchParams = new URLSearchParams();

      for (const [key, value] of searchParams.entries()) {
        if (value) {
          newSearchParams.set(key, cleanString(value, ":", "_"));
        }
      }
      localStorage.setItem(
        "userDetailedIntercityReportSearchParams",
        newSearchParams.toString()
      );
    }
  }, [searchParams]);

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    MobileNumber: searchParams.get("MobileNumber") || "",
    destinationLocation:searchParams.get("destinationLocation") || "",
    arrivalLocation:searchParams.get("arrivalLocation")||"",
  };
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [DepartureLoading,setDepartureLoading] = useState(false);
  const [ArrivalLoading,setArrivalLoading] = useState(false);
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

  const onSubmit = (values) => {
    // Validate date range
    if (values.fromDate && values.toDate && new Date(values.fromDate) > new Date(values.toDate)) {
      alert("From Date cannot be greater than To Date. Please select a valid date range.");
      return;
    }

    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key] && values[key] !== "") {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    localStorage.setItem("userDetailedIntercityReportSearchParams", newSearchParams.toString());

    fetchIntercityUserDetailedReports({
      fromDate: values.fromDate,
      toDate: values.toDate,
      MobileNumber: values.MobileNumber,
      departureLocation:values.destinationLocation,
      arrivalLocation:values.arrivalLocation,
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
                  // If fromDate is greater than toDate, update toDate to match fromDate
                  if (values.toDate && new Date(fromDateValue) > new Date(values.toDate)) {
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
                  // If toDate is less than fromDate, update fromDate to match toDate
                  if (values.fromDate && new Date(toDateValue) < new Date(values.fromDate)) {
                    setFieldValue("fromDate", toDateValue);
                  }
                  setFieldValue("toDate", toDateValue);
                }}
                min={values.fromDate}
              />
            </div>
            {/* mobile number */}
            <div>
              <label
                htmlFor="MobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="MobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter Mobile number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("MobileNumber", e.target.value);
                }}
              />
            </div>
            {/* departure location */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Departure Location
              </label>
              <SearchableDropdown
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
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isIntercityUserDetailedReportsLoading}
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

export default IntercityUserDetailedReportForm;
