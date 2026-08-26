import { Formik, Form, Field } from "formik";
import { useEffect, useMemo, useState } from "react";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import { useCurrentIndividualStore } from "./CurrentIndividualStore";
import {
  CurrentBookingArrivalField,
  CurrentBookingCityBusField,
  CurrentBookingDepartureField,
  CurrentBookingIntercityBusField,
  getArrivalStagesForDeparture,
  getStageIdsFromSelection,
} from "../shared/CurrentBookingReportFilterFields";

const CurrentIndividualReportForm = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
  onIntercityBusChange,
}) => {
  const savedFilters = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("current-individual-filters"));
    } catch {
      return null;
    }
  }, []);
  const { fetchCurrentIndividualData } = useCurrentIndividualStore();
  const {
    fetchIntercityBusTypesData,
    fetchIntercitySeatLayoutsData,
    IntercitySeatLayoutsData,
    IntercityBusTypesData,
    fetchMavenRoutes,
    mavenRoutes,
    departureStages,
    intercityStageNames,
  } = useIntercityMastersStore();
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    fetchIntercityBusTypesData();
    fetchIntercitySeatLayoutsData();
    fetchMavenRoutes();
  }, [fetchIntercityBusTypesData, fetchIntercitySeatLayoutsData, fetchMavenRoutes]);

  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    mobileNumber: savedFilters?.mobileNumber ? savedFilters.mobileNumber : "",
    bookingDate: savedFilters?.bookingDate ? savedFilters.bookingDate : "",
    pnrNumber: savedFilters?.pnrNumber ? savedFilters.pnrNumber : "",
    returnPnrNumber: savedFilters?.returnPnrNumber
      ? savedFilters.returnPnrNumber
      : "",
    paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
    orderId: savedFilters?.orderId ? savedFilters.orderId : "",
    transactionId: savedFilters?.transactionId
      ? savedFilters.transactionId
      : "",
    seatLayoutType: savedFilters?.seatLayoutType
      ? savedFilters.seatLayoutType
      : "",
    busType: savedFilters?.busType ? savedFilters.busType : "",
    bookingStatus: savedFilters?.bookingStatus
      ? savedFilters.bookingStatus
      : "",
    departureLocation: savedFilters?.departureLocation
      ? savedFilters.departureLocation
      : 0,
    arrivalLocation: savedFilters?.arrivalLocation
      ? savedFilters.arrivalLocation
      : 0,
    intercityBus: savedFilters?.intercityBus || "",
    ticketId: savedFilters?.ticketId ? savedFilters.ticketId : "",
    returnTicketId: savedFilters?.returnTicketId
      ? savedFilters.returnTicketId
      : "",
  };

  const onSubmit = (values) => {
    const { intercityBus, ...reportValues } = values;
    const stageIds = getStageIdsFromSelection(
      mavenRoutes,
      values.departureLocation,
      values.arrivalLocation
    );
    fetchCurrentIndividualData({
      ...reportValues,
      departureLocation: stageIds.FromStageBoardingID,
      arrivalLocation: stageIds.ToStageBoardingID,
      pageNumber: pageNumber,
      PageSize: pageSize,
    });
    localStorage.setItem(
      "current-individual-filters",
      JSON.stringify(values)
    );
    SetcurrentPage(0);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => {
          const mappedArrivalStages = getArrivalStagesForDeparture(
            mavenRoutes,
            values.departureLocation
          );
          return (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3 uppercase">
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
                  border-gray-300 rounded-md shadow-sm uppercase focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
            <CurrentBookingCityBusField labelClassName="block text-xs font-medium text-gray-700" />
            <CurrentBookingIntercityBusField
              intercityStageNames={intercityStageNames}
              labelClassName="block text-xs font-medium text-gray-700"
              onValueChange={onIntercityBusChange}
            />

            {/* mobile no */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Mobile No
              </label>
              <Field
                type="text"
                name="mobileNumber"
                maxLength="10"
                className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter mobile number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
              />
            </div>
            {/* type of bus */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Type of Bus
              </label>
              <Field
                as="select"
                name="busType"
                className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
            {/* seat layout type */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Seat Layout type
              </label>
              <Field
                as="select"
                name="seatLayoutType"
                className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                {IntercitySeatLayoutsData?.filter((item) => item.isActive).map(
                  (item) => (
                    <option value={item.seatLayoutTypesName}>
                      {item.seatLayoutTypesName}
                    </option>
                  )
                )}
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
              <label className="block text-xs font-medium text-gray-700">
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
              <label className="block text-xs font-medium text-gray-700">
                Transaction ID
              </label>
              <Field
                type="text"
                name="transactionId"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Transaction ID"
              />
            </div>
            {/* booking status */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Booking Status
              </label>
              <Field
                as="select"
                name="bookingStatus"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="-1">All</option>
                <option value="0">Pending</option>
                <option value="2">Used</option>
                <option value="3">Expired</option>
                <option value="4">Cancelled</option>
                <option value="1">Confirmed</option>
                <option value="5">Failed</option>
              </Field>
            </div>
            {/* pnr no */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                PNR No
              </label>
              <Field
                type="text"
                name="pnrNumber"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter PNR"
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
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Ticket Id"
              />
            </div>
            {/*  return pnr */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Return PNR No
              </label>
              <Field
                type="text"
                name="returnPnrNumber"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Return PNR"
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
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                placeholder="Enter Return Ticket Id"
              />
            </div>

            <CurrentBookingDepartureField
              departureStages={departureStages}
              setFieldValue={setFieldValue}
              labelClassName="block text-xs font-medium text-gray-700"
            />
            <CurrentBookingArrivalField
              arrivalStages={mappedArrivalStages}
              labelClassName="block text-xs font-medium text-gray-700"
            />
            {/* Optional fields like Department/Location removed to avoid undefined data sources */}
            {/* submit */}
            <div className="flex items-end gap-2 ">
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
                  localStorage.removeItem("current-individual-filters");
                  setValues({
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    mobileNumber: "",
                    bookingDate: "",
                    pnrNumber: "",
                    returnPnrNumber: "",
                    paymentMode: "",
                    orderId: "",
                    transactionId: "",
                    seatLayoutType: "",
                    busType: "",
                    bookingStatus: "",
                    departureLocation: 0,
                    arrivalLocation: 0,
                    intercityBus: "",
                    ticketId: "",
                    returnTicketId: "",
                  });
                  onIntercityBusChange?.("");
                  fetchCurrentIndividualData({
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    mobileNumber: "",
                    bookingDate: "",
                    pnrNumber: "",
                    returnPnrNumber: "",
                    paymentMode: "",
                    orderId: "",
                    transactionId: "",
                    seatLayoutType: "",
                    busType: "",
                    bookingStatus: "",
                    departureLocation: 0,
                    arrivalLocation: 0,
                    ticketId: "",
                    returnTicketId: "",
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
          );
        }}
      </Formik>
    </>
  );
};

export default CurrentIndividualReportForm;
