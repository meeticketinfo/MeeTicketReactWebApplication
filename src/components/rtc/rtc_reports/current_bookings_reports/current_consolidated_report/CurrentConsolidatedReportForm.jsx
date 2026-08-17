import { Formik, Form, Field } from "formik";
import { useEffect, useMemo, useState } from "react";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import DebounceSearchableDropdown from "../../../../sharedcomponents/DebounceSearchableDropdown";

import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import { useCurrentConsolidateStore } from "./CurrentConsolidateStore";
import SearchableDropdown from "../../../../searchable_dropdown/SearchableDropdown";

const CurrentConsolidatedReportForm = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
}) => {

  const [resetTrigger, setResetTrigger] = useState(0);

  const { fetchCurrentConsolidateData } = useCurrentConsolidateStore();
  const {
    fetchIntercityBusTypesData,
    fetchIntercitySeatLayoutsData,
    IntercityBusTypesData,
    IntercitySeatLayoutsData,
    fetchMavenRoutes,
    departureStages,
    arrivalStages,
  } = useIntercityMastersStore();

  useEffect(() => {
    fetchIntercityBusTypesData();
    fetchIntercitySeatLayoutsData();
    fetchMavenRoutes();
  }, [fetchIntercityBusTypesData, fetchIntercitySeatLayoutsData, fetchMavenRoutes]);

  const initialValues = {
    purchaseOrBooking: "Purchase",
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    mobileNumber: "",
    bookingDate: "",
    PNRNumber: "",
    paymentMode: "",
    orderId: "",
    transactionId: "",
    typeOfBus: "",
    departureLocation: 0,
    arrivalLocation: 0,
  };

  const onSubmit = (values) => {
    console.log("values", values);
    fetchCurrentConsolidateData({
      ...values,
      pageNumber: pageNumber,
      PageSize: pageSize,
    });
    localStorage.setItem(
      "current-consolidated-filters",
      JSON.stringify(values)
    );
    SetcurrentPage(0);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
            {/* purchase date */}
            <div>
              <label className="block text-xs font-light uppercase">
                Date of Booking/Journey
              </label>
              <Field
                as="select"
                name="purchaseOrBooking"
                className={` block w-full px-2 py-1 border border-gray-300 uppercase
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="Purchase">Date of Booking</option>
                <option value="Booking">Date of Journey</option>
              </Field>
            </div>
            {/* from date */}
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700 uppercase"
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
                className="block text-xs font-medium text-gray-700 uppercase"
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
              <label className="block text-xs font-medium text-gray-700 uppercase">
                Mobile No
              </label>
              <Field
                type="text"
                name="mobileNumber"
                maxLength="10"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter mobile number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
              />
            </div>
            {/* pnr no / return pnr */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                PNR No / Return PNR No
              </label>
              <Field
                type="text"
                name="PNRNumber"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter PNR"
              />
            </div>
            {/* type of bus */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                Type of Bus
              </label>
              <Field
                as="select"
                name="typeOfBus"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
            {/* payment mode */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                Payment Mode
              </label>
              <Field
                as="select"
                name="paymentMode"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </Field>
            </div>
            {/* order id */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                Order ID
              </label>
              <Field
                type="text"
                name="orderId"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Order ID"
              />
            </div>
            {/* transaction id */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                Transaction ID
              </label>
              <Field
                type="text"
                name="transactionId"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Transaction ID"
              />
            </div>
            {/* departure location */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                Departure Location
              </label>
              <Field
                as="select"
                name="departureLocation"
                className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="0">All</option>
                {departureStages?.map((item) => (
                  <option key={item.FromStageID} value={item.FromStageID}>
                    {item.FromStageName}
                  </option>
                ))}
              </Field>
            </div>
            {/* arrival location */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase">
                Arrival Location
              </label>
              <Field
                as="select"
                name="arrivalLocation"
                className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="0">All</option>
                {arrivalStages?.map((item) => (
                  <option key={item.ToStageID} value={item.ToStageID}>
                    {item.ToStageName}
                  </option>
                ))}
              </Field>
            </div>

            {/* Optional fields like Department/Location removed to avoid undefined data sources */}
            {/* submit */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
              // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
                onClick={() => {
                  localStorage.removeItem("current-consolidated-filters");
                  setValues({
                    purchaseOrBooking: "Purchase",
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    mobileNumber: "",
                    bookingDate: "",
                    PNRNumber: "",
                    paymentMode: "",
                    orderId: "",
                    transactionId: "",
                    typeOfBus: "",
                    departureLocation: 0,
                    arrivalLocation: 0,
                  });
                  fetchCurrentConsolidateData({
                    purchaseOrBooking: "Purchase",
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    mobileNumber: "",
                    bookingDate: "",
                    PNRNumber: "",
                    paymentMode: "",
                    orderId: "",
                    transactionId: "",
                    typeOfBus: "",
                    departureLocation: 0,
                    arrivalLocation: 0,
                    pageNumber: pageNumber,
                    PageSize: pageSize,
                  });
                  SetcurrentPage(0);
                  setResetTrigger((prev) => prev + 1);
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

export default CurrentConsolidatedReportForm;
