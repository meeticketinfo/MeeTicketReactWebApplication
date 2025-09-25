import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ToastContainer } from "react-toastify";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import IntercityTotalTransactionChart from "../charts/IntercityTotalTransactionChart";
import SearchableDropdown from "../../../../../../components/searchable_dropdown/SearchableDropdown";
import { useIntercityTotalTransactionStore } from "../store/IntercityTotalTransactionStore";
import IntercityTotalCommonStore from "../../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";
import { useIntercityMastersStore } from "../../../../../../store/intercity/masters/intercityMastersStore";

const IntercityOuterReportForm = () => {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { setOuterFilters, outerFilters, resetOuterFilters, setInnerFilters } =
    IntercityTotalCommonStore();

  const {
    fetchIntercityTotalTransactions,
    intercityTotalTransactions,
    isIntercityTotalTransactionsLoading,
  } = useIntercityTotalTransactionStore();

  const { fetchCitiesData, fetchIntercityBusTypesData, IntercityBusTypesData } =
    useIntercityMastersStore();

  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [selectedBusType, setSelectedBusType] = useState(null);

  const busTypeOptions =
    IntercityBusTypesData?.map((item) => ({
      value: item.busTypesName,
      label: item.busTypesName,
    })) || [];

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

  useEffect(() => {
    const sanitizedFilters = {
      fromDate: outerFilters.fromDate ?? startOfDay,
      toDate: outerFilters.toDate ?? endOfDay,
      departureLocation: outerFilters.departureLocation ?? "",
      arrivalLocation: outerFilters.arrivalLocation ?? "",
      mobileNumber: outerFilters.mobileNumber ?? "",
      busType: outerFilters.busType ?? "",
    };

    setInnerFilters(sanitizedFilters);
    fetchIntercityTotalTransactions(sanitizedFilters);
    fetchIntercityBusTypesData();
    fetchDepartureCities();
    // fetchArrivalCities();
  }, []);

  // Initialize selected bus type when data is available
  useEffect(() => {
    if (IntercityBusTypesData && outerFilters.busType) {
      const busType = IntercityBusTypesData.find(
        (item) => item.busTypesName === outerFilters.busType && item.isActive
      );
      if (busType) {
        setSelectedBusType({
          value: busType.busTypesName,
          label: busType.busTypesName,
        });
      }
    }
  }, [IntercityBusTypesData, outerFilters.busType]);

  const initialValues = {
    fromDate: outerFilters.fromDate ?? startOfDay,
    toDate: outerFilters.toDate ?? endOfDay,
    departureLocation: outerFilters.departureLocation ?? "",
    arrivalLocation: outerFilters.arrivalLocation ?? "",
    mobileNumber: outerFilters.mobileNumber ?? "",
    busType: outerFilters.busType ?? "",
  };
  const onSubmit = (values) => {
    const sanitizedValues = {
      fromDate: values.fromDate || "",
      toDate: values.toDate || "",
      departureLocation: values.departureLocation || "",
      arrivalLocation: values.arrivalLocation || "",
      mobileNumber: values.mobileNumber || "",
      busType: values.busType || "",
    };
    setOuterFilters(sanitizedValues);
    setInnerFilters(sanitizedValues);
    fetchIntercityTotalTransactions(sanitizedValues);
  };
  const totalCount = Array.isArray(intercityTotalTransactions)
    ? intercityTotalTransactions.reduce((sum, item) => sum + item.count, 0)
    : 0;
  return (
    <>
      <ToastContainer />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
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
                onChange={(value) => setFieldValue("arrivalLocation", value)}
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
                    busType: "",
                  };

                  setValues(resetValues);
                  setSelectedBusType(null);
                  // Clear the city arrays to force dropdowns to reset
                  setDepartureCities([]);
                  setArrivalCities([]);
                  resetOuterFilters(resetValues);
                  setInnerFilters(resetValues);
                  fetchIntercityTotalTransactions(resetValues);
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
        <div className="flex">
          <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
            {/* <Loader/> */}

            {isIntercityTotalTransactionsLoading && (
              <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                <div className="loader"></div>
              </div>
            )}
            <IntercityTotalTransactionChart
              data={totalCount !== 0 ? intercityTotalTransactions : []}
              title="Total Transactions"
              angleKey="count"
              calloutLabelKey="paymentCategory"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default IntercityOuterReportForm;
