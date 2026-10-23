import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import { useCurrentConsolidateStore } from "./CurrentConsolidateStore";
import {
  CurrentBookingArrivalField,
  CurrentBookingDepartureField,
  getArrivalStagesForDeparture,
  getStageIdsFromSelection,
} from "../shared/CurrentBookingReportFilterFields";

const BOOKING_STATUS_OPTIONS = [
  { value: "-1", label: "All" },
  { value: "0", label: "Pending" },
  { value: "1", label: "Confirmed" },
  { value: "2", label: "Used" },
  { value: "3", label: "Expired" },
  { value: "4", label: "Cancelled" },
  { value: "5", label: "Failed" },
];

const CurrentConsolidatedReportForm = () => {
  const [resetTrigger, setResetTrigger] = useState(0);

  const { fetchCurrentConsolidateData } = useCurrentConsolidateStore();
  const {
    fetchCurrentBusTypes,
    currentBusTypesData,
    fetchMavenRoutes,
    mavenRoutes,
    departureStages,
  } = useIntercityMastersStore();

  useEffect(() => {
    fetchCurrentBusTypes();
    fetchMavenRoutes();
  }, [fetchCurrentBusTypes, fetchMavenRoutes]);

  const initialValues = {
    purchaseOrBooking: "Purchase",
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    mobileNumber: "",
    bookingDate: "",
    PNRNumber: "",
    orderId: "",
    transactionId: "",
    busType: "",
    bookingStatus: "-1",
    departureLocation: 0,
    arrivalLocation: 0,
  };

  const onSubmit = (values) => {
    const stageIds = getStageIdsFromSelection(
      mavenRoutes,
      values.departureLocation,
      values.arrivalLocation
    );
    fetchCurrentConsolidateData({
      ...values,
      departureLocation: stageIds.FromStageBoardingID,
      arrivalLocation: stageIds.ToStageBoardingID,
    });
    localStorage.setItem(
      "current-consolidated-filters",
      JSON.stringify(values)
    );
  };

  return (
    <>
      <Formik
        key={resetTrigger}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, setValues }) => {
          const mappedArrivalStages = getArrivalStagesForDeparture(
            mavenRoutes,
            values.departureLocation
          );
          return (
            <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
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
                    setFieldValue("toDate", e.target.value);
                  }}
                />
              </div>
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
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  Bus Type
                </label>
                <Field
                  as="select"
                  name="busType"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="">All</option>
                  {currentBusTypesData?.map((item) => (
                    <option
                      key={item.serviceCategory}
                      value={item.serviceCategory}
                    >
                      {item.serviceCategory}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  Booking Status
                </label>
                <Field
                  as="select"
                  name="bookingStatus"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  {BOOKING_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>
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
              <CurrentBookingDepartureField
                departureStages={departureStages}
                setFieldValue={setFieldValue}
              />
              <CurrentBookingArrivalField arrivalStages={mappedArrivalStages} />

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  onClick={() => {
                    localStorage.removeItem("current-consolidated-filters");
                    const resetValues = {
                      purchaseOrBooking: "Purchase",
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      mobileNumber: "",
                      bookingDate: "",
                      PNRNumber: "",
                      orderId: "",
                      transactionId: "",
                      busType: "",
                      bookingStatus: "-1",
                      departureLocation: 0,
                      arrivalLocation: 0,
                    };
                    setValues(resetValues);
                    fetchCurrentConsolidateData(resetValues);
                    setResetTrigger((prev) => prev + 1);
                  }}
                >
                  Reset
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default CurrentConsolidatedReportForm;
