import { Formik, Form, Field } from "formik";
import { useEffect, useMemo, useState } from "react";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import DebounceSearchableDropdown from "../../../../sharedcomponents/DebounceSearchableDropdown";
import { useIntercityConsolidateStore } from "./IntercityConsolidateStore";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";

const IntercityConsolidatedReportForm = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
}) => {
  const savedFilters = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("intercity-individual-filters"));
    } catch {
      return null;
    }
  }, []);
  const { fetchIntercityIndividualData } = useIntercityConsolidateStore();
  const {
    fetchCitiesData,
    fetchIntercityBusTypesData,
    fetchIntercitySeatLayoutsData,
    IntercitySeatLayoutsData,
    IntercityBusTypesData,
  } = useIntercityMastersStore();

  // Separate state for each dropdown to prevent interference
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);

  useEffect(() => {
    fetchIntercityBusTypesData();
    fetchIntercitySeatLayoutsData();
  }, [fetchIntercityBusTypesData, fetchIntercitySeatLayoutsData]);

  const fetchDepartureCities = async (q) => {
    try {
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setDepartureCities(response?.response?.result);
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
        setArrivalCities(response?.response?.result);
      }
    } catch (error) {
      console.error("Error fetching arrival cities:", error);
      setArrivalCities([]);
    } finally {
    }
  };

  const initialValues = {
    purchaseOrBooking:savedFilters?.purchaseOrBooking ? savedFilters.purchaseOrBooking : "",
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    mobileNumber: savedFilters?.mobileNumber ? savedFilters.mobileNumber : "",
    bookingDate: savedFilters?.bookingDate ? savedFilters.bookingDate : "",
    PNRNumber: savedFilters?.PNRNumber
      ? savedFilters.PNRNumber
      : "",
    paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
    orderId: savedFilters?.orderId ? savedFilters.orderId : "",
    transactionId: savedFilters?.transactionId
      ? savedFilters.transactionId
      : "",
    typeOfBus: savedFilters?.typeOfBus ? savedFilters.typeOfBus : "",
    departureLocation: savedFilters?.departureLocation
      ? savedFilters.departureLocation
      : "",
    arrivalLocation: savedFilters?.arrivalLocation
      ? savedFilters.arrivalLocation
      : "",
  };

  const onSubmit = (values) => {
    console.log("values", values);
    fetchIntercityIndividualData(values);
    localStorage.setItem(
      "intercity-individual-filters",
      JSON.stringify(values)
    );
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
            {/* purchase date */}
            <div>
              <label className="block text-sm font-medium">
                Purchase Date/ Booking Date
              </label>
              <Field
                as="select"
                name="typeOfBooking"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="Purchase">Purchase Date</option>
                <option value="Booking">Booking Date</option>
              </Field>
            </div>
            {/* from date */}
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
            {/* to date */}
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
                className={`mt-1 block w-full px-2 py-1 border
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            {/* mobile no */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Mobile No
              </label>
              <Field
                type="text"
                name="mobileNumber"
                maxLength="10"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter mobile number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
              />
            </div>
            {/* pnr no / return pnr */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                PNR No / Return PNR No
              </label>
              <Field
                type="text"
                name="PNRNumber"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter PNR"
              />
            </div>
             {/* type of bus */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Type of Bus
              </label>
              <Field
                as="select"
                name="typeOfBus"
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
        
            {/* order id */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Order ID
              </label>
              <Field
                type="text"
                name="orderId"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Order ID"
              />
            </div>
            {/* transaction id */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Transaction ID
              </label>
              <Field
                type="text"
                name="transactionId"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Transaction ID"
              />
            </div>
            {/* departure location */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Departure Location
              </label>
              <DebounceSearchableDropdown
                name="departureLocation"
                value={values.departureLocation}
                onChange={(v) => setFieldValue("departureLocation", v)}
                options={departureCities}
                onSearch={fetchDepartureCities}
                Label="cityName"
                Value="cityId"
                placeholder="Search departure city..."
                uniqueId="departure-location-dropdown"
              />
            </div>
            {/* arrival location */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Arrival Location
              </label>
              <DebounceSearchableDropdown
                name="arrivalLocation"
                value={values.arrivalLocation}
                onChange={(v) => setFieldValue("arrivalLocation", v)}
                options={arrivalCities}
                onSearch={fetchArrivalCities}
                Label="cityName"
                Value="cityId"
                placeholder="Search arrival city..."
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
            {/* Optional fields like Department/Location removed to avoid undefined data sources */}
            {/* submit */}
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
                  localStorage.removeItem("intercity-individual-filters");
                  setValues({
                    purchaseOrBooking:"",
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    mobileNumber: "",
                    bookingDate: "",
                    PNRNumber: "",
                    paymentMode: "",
                    orderId: "",
                    transactionId: "",
                    typeOfBus: "",
                    departureLocation: "",
                    arrivalLocation: "",
                  });
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

export default IntercityConsolidatedReportForm;
