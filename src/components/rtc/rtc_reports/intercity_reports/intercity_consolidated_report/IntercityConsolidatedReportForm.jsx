import { Formik, Form, Field } from "formik";
import { useEffect, useMemo, useState } from "react";
const IntercityConsolidatedReportForm = ({
  onSearch,
  pageNumber,
  pageSize,
  SetcurrentPage,
}) => {
  // Local helper to get today's date in YYYY-MM-DD
  const getCurrentDate = useMemo(() => {
    return () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };
  }, []);

  const savedFilters = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("completed-booking-report-filters"));
    } catch {
      return null;
    }
  }, []);

  const [isBookingDate, setIsBookingDate] = useState(false);

  // No initial API call here; just preparing initial values and letting user submit
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    entityId: savedFilters?.entityId ? savedFilters.entityId : null,
    departmentId: savedFilters?.departmentId ? savedFilters.departmentId : null,
    typeOfBooking: savedFilters?.typeOfBooking
      ? savedFilters.typeOfBooking
      : "",
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : null,
    parkId: savedFilters?.parkId ? savedFilters.parkId : null,
  };

  const onSubmit = (values, { resetForm }) => {
    console.log("values", values);

    localStorage.setItem(
      "completed-booking-report-filters",
      JSON.stringify(values)
    );
    if (typeof onSearch === "function") {
      onSearch(values);
    }
    console.log("values", values);
  };

  return (
    <>
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Booking/Purchase Date</label>
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
            <div>
              <label className="block text-xs font-medium text-gray-700">Mobile No</label>
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
            <div>
              <label className="block text-xs font-medium text-gray-700">PNR No / Return PNR No</label>
              <Field
                type="text"
                name="pnrOrReturnPnr"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter PNR"
              />
            </div>
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
            <div>
              <label
                className="block text-xs font-medium text-gray-700"
              >
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
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="phoneNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Payment Mode</label>
              <Field as="select" name="paymentMode" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
                <option value="">All</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </Field>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Order ID</label>
              <Field type="text" name="orderId" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Enter Order ID" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Transaction ID</label>
              <Field type="text" name="transactionId" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Enter Transaction ID" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Seat Layout type</label>
              <Field as="select" name="seatLayoutType" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
                <option value="">All</option>
                <option value="Seater">Seater</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Seater, Sleeper">Seater, Sleeper</option>
              </Field>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Type of Bus</label>
              <Field as="select" name="busType" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
                <option value="">All</option>
                <option value="Garuda">Garuda</option>
                <option value="Super Luxury">Super Luxury</option>
                <option value="Ultra Deluxe">Ultra Deluxe</option>
                <option value="Indra">Indra</option>
              </Field>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Booking Status</label>
              <Field as="select" name="bookingStatus" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
                <option value="">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </Field>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Departure Location</label>
              <Field type="text" name="departureLocation" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="e.g. Hyderabad" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Arrival Location</label>
              <Field type="text" name="arrivalLocation" className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="e.g. Vijayawada" />
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
                  localStorage.removeItem("completed-booking-report-filters");
                  resetForm({
                    values: {
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      typeOfBooking: "",
                      phoneNumber: "",
                      entityId: null,
                      departmentId: null,
                    },
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
