import { Formik, Form, Field } from "formik";
import {  useMemo, useState } from "react";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import DebounceSearchableDropdown from "../../../../sharedcomponents/DebounceSearchableDropdown";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";

const IntercityConsolidatedReportForm = ({
  
  pageNumber,
  pageSize,
  SetcurrentPage,
}) => {
  const savedFilters = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("intercity-consolidated-filters")
      );
    } catch {
      return null;
    }
  }, []); 
  const { fetchCitiesData } = useIntercityMastersStore();

  // Separate state for each dropdown to prevent interference
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);

  const fetchDepartureCities = async (q) => {
    try {
      const response = await fetchCitiesData(q);
      console.log("q",q)
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

  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    mobileNumber: savedFilters?.mobileNumber ? savedFilters.mobileNumber : null,
    bookingDate: savedFilters?.bookingDate ? savedFilters.bookingDate : null,
    pnrOrReturnPnr: savedFilters?.pnrOrReturnPnr
      ? savedFilters.pnrOrReturnPnr
      : null,
    typeOfBooking: savedFilters?.typeOfBooking
      ? savedFilters.typeOfBooking
      : null,
    paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : null,
    orderId: savedFilters?.orderId ? savedFilters.orderId : null,
    transactionId: savedFilters?.transactionId
      ? savedFilters.transactionId
      : null,
    seatLayoutType: savedFilters?.seatLayoutType
      ? savedFilters.seatLayoutType
      : null,
    busType: savedFilters?.busType ? savedFilters.busType : null,
    bookingStatus: savedFilters?.bookingStatus
      ? savedFilters.bookingStatus
      : null,
    departureLocation: savedFilters?.departureLocation
      ? savedFilters.departureLocation
      : "",
    arrivalLocation: savedFilters?.arrivalLocation
      ? savedFilters.arrivalLocation
      : "",
      ticketId: savedFilters?.ticketId ? savedFilters.ticketId : "",
      returnTicketId: savedFilters?.returnTicketId
        ? savedFilters.returnTicketId
        : "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log("values", values);

    localStorage.setItem(
      "intercity-consolidated-filters",
      JSON.stringify(values)
    );
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
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
            {/* booking/purchase date */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Booking/Purchase Date
              </label>
              <select
                onChange={(e) => {
                  setIsBookingDate(e.target.value === "true");
                }}
                name="bookingDate"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="false">Purchase Date</option>
                <option value="true">Booking Date</option>
              </select>
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
                name="pnrOrReturnPnr"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter PNR"
              />
            </div>
            {/* type of booking */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Type of Booking
              </label>
              <Field
                as="select"
                name="typeOfBooking"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onChange={(e) => setFieldValue("typeOfBooking", e.target.value)}
              >
                <option value="">ALL</option>
                <option value="Counter">Counter</option>
                <option value="MeeTicketApp">Mee TicketApp</option>
              </Field>
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
             {/* Ticket id */}
             <div>
              <label className="block text-xs font-medium text-gray-700">
                Ticket Id
              </label>
              <Field
                type="text"
                name="ticketId"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Ticket Id"
              />
            </div>
            {/* Return Ticket Id id */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Return Ticket Id
              </label>
              <Field
                type="text"
                name="returnTicketId"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Return Ticket Id"
              />
            </div>
            {/* seat layout type */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Seat Layout type
              </label>
              <Field
                as="select"
                name="seatLayoutType"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                <option value="Seater">Seater</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Seater, Sleeper">Seater, Sleeper</option>
              </Field>
            </div>
            {/* type of bus */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Type of Bus
              </label>
              <Field
                as="select"
                name="busType"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                <option value="Garuda">Garuda</option>
                <option value="Super Luxury">Super Luxury</option>
                <option value="Ultra Deluxe">Ultra Deluxe</option>
                <option value="Indra">Indra</option>
              </Field>
            </div>
            {/* booking status */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Booking Status
              </label>
              <Field
                as="select"
                name="bookingStatus"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </Field>
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
                  localStorage.removeItem("intercity-consolidated-filters");
                  setValues({
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    typeOfBooking: "",
                    mobileNumber: "",
                    bookingDate: "",
                    pnrOrReturnPnr: "",
                    paymentMode: "",
                    orderId: "",
                    transactionId: "",
                    seatLayoutType: "",
                    entityId: null,
                    departmentId: null,
                    departureLocation: "",
                    arrivalLocation: "",
                    ticketId: "",
                    returnTicketId: "",
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
