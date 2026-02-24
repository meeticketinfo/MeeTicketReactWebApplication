import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useIntercityRefundReportStore } from "../../../../../../store/intercity/reports/IntercityRefundReportStore";
import { useIntercityMastersStore } from "../../../../../../store/intercity/masters/intercityMastersStore";
import SearchableDropdown from "../../../../../searchable_dropdown/SearchableDropdown";

const IntercityRefundTransactionsReportForm = ({
  pageNumber,
  pageSize,
  setCurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isFetchIntercityRefundTransactionsInnerReport,
    fetchIntercityRefundTransactionsInnerReport,
  } = useIntercityRefundReportStore();
  const refundTransactionSearchParams = localStorage.getItem(
    "intercityRefundInnerTransactionSearchParams"
  );
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const {fetchCitiesData, loadingCities}=useIntercityMastersStore();

// Separate state for each dropdown to prevent interference
 const [resetTrigger, setResetTrigger] = useState(0);
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [DepartureLoading, setDepartureLoading] = useState(false);
  const [ArrivalLoading, setArrivalLoading] = useState(false);
  const fetchDepartureCities = async (q) => {
    setDepartureLoading(true);
    try {
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
     setArrivalLoading(true);
    try {
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

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    mobileNumber: searchParams.get("mobileNumber") || "",
    departureLocation: searchParams.get("departureLocation") || "",
    arrivalLocation: searchParams.get("arrivalLocation") || "",
    paymentMode:searchParams.get("paymentMode") || "",
    refundStatus:
      (searchParams.get("RefundStatus") !== "null" &&
        searchParams.get("RefundStatus")) ||
      "",
  };

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    
    // Call the Intercity refund inner report API with proper parameters
    fetchIntercityRefundTransactionsInnerReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber,
      departureLocation: values.departureLocation?values.departureLocation:"",
      arrivalLocation: values.arrivalLocation?values.arrivalLocation:"",
      paymentMode:values.paymentMode?values.paymentMode:"",
      refundStatus: values.refundStatus,
      pageNumber: 1, // Reset to first page on new search
      pageSize: pageSize,
    });
    setCurrentPage(0);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3 uppercase">
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
                min={values.fromDate}
              />
            </div>
            {/* mobile number */}

            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile Number
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
            {/* departure location */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Departure Location
              </label>
              <SearchableDropdown
                key={`departure-${resetTrigger}-${values.departureLocation || 'empty'}`}
                name="departureLocation"
                value={values.departureLocation}
                onChange={(value) => setFieldValue("departureLocation", value)}
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
                initialDisplayText={values.departureLocation}
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
             {/* payment mode */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Payment Mode
              </label>
              <Field
                as="select"
                name="paymentMode"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </Field>
            </div>
            {/* status */}
            <div>
              <label
                htmlFor="refundStatus"
                className="block text-xs font-medium text-gray-700"
              >
                Refund Status
              </label>
              <Field
                as="select"
                name="refundStatus"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("refundStatus", e.target.value);
                }}
              >
                <option value="">Select Status</option>
                <option value="Refund">Refunded</option>
                <option value="NotRefund">Not Refunded</option>
              </Field>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isFetchIntercityRefundTransactionsInnerReport}
              >
                {isFetchIntercityRefundTransactionsInnerReport ? "Searching..." : "Search"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default IntercityRefundTransactionsReportForm;
