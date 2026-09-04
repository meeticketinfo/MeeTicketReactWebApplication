import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate, getCurrentDateStartTime, getCurrentDateEndTime } from "../../../../../utils/TypographyHelper";
import { useCurrentPaymentTransactionStore } from "../../../../../store/rtc/CurrentPaymentTransactionStore";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import { getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import {
  CurrentBookingArrivalField,
  CurrentBookingCityBusField,
  CurrentBookingDepartureField,
  CurrentBookingIntercityBusField,
  getArrivalStagesForDeparture,
  getStageIdsFromSelection,
} from "../shared/CurrentBookingReportFilterFields";
const CurrentPaymentTransactionsForm = ({
  onIntercityBusChange,
}) => {
  const {
    fetchCurrentPaymentTransactions,
  } = useCurrentPaymentTransactionStore();
  const { fetchMavenRoutes, mavenRoutes, departureStages, intercityStageNames } = useIntercityMastersStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("current-payment-report-filters")
  );
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDateStartTime(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDateEndTime(),

    paymentStatus: savedFilters?.paymentStatus
      ? savedFilters.paymentStatus
      : null,
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
    arrivalLocation: savedFilters?.arrivalLocation ? savedFilters.arrivalLocation : 0,
    destinationLocation: savedFilters?.destinationLocation ? savedFilters.destinationLocation : 0,
    intercityBus: savedFilters?.intercityBus || "",
  };
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    fetchMavenRoutes();
  }, [fetchMavenRoutes]);

  const onSubmit = (values, { resetForm }) => {
    const { intercityBus, ...reportValues } = values;
    const stageIds = getStageIdsFromSelection(
      mavenRoutes,
      values.destinationLocation,
      values.arrivalLocation
    );

    localStorage.setItem(
      "current-payment-report-filters",
      JSON.stringify(values)
    );
    fetchCurrentPaymentTransactions({
      startDate: reportValues.fromDate,
      endDate: reportValues.toDate,
      paymentStatus: reportValues.paymentStatus || "",
      phoneNumber: reportValues.phoneNumber || "",
      destinationLocation: stageIds.FromStageBoardingID,
      arrivalLocation: stageIds.ToStageBoardingID,
    });
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => {
          const mappedArrivalStages = getArrivalStagesForDeparture(
            mavenRoutes,
            values.destinationLocation
          );
          return (
          <Form className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 py-3 uppercase">
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
                type="datetime-local"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border 
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                min={values.fromDate || getCurrentDateStartTime()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            <CurrentBookingCityBusField />
            <CurrentBookingIntercityBusField
              intercityStageNames={intercityStageNames}
              onValueChange={onIntercityBusChange}
            />

            <div>
              <label className="block text-sm font-medium">
                Payment Status
              </label>
              <Field
                as="select"
                name="paymentStatus"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select Payment Status</option>
                <option value="INITIATE">Initiate</option>
                <option value="INPROCESS">In Process</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="FAILED">Failed</option>
              </Field>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile No
              </label>
              <Field
                type="tel"
                name="phoneNumber"
                placeholder="Enter mobile number"
                className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow digits and ensure it starts with 6-9
                  const numericValue = value.replace(/[^0-9]/g, '');

                  // Limit to 10 digits maximum
                  if (numericValue.length > 10) {
                    return; // Don't update if more than 10 digits
                  }

                  // If the value is not empty, check if it starts with 6-9
                  if (numericValue.length > 0 && !/^[6-9]/.test(numericValue)) {
                    return; // Don't update if it doesn't start with 6-9
                  }

                  setFieldValue("phoneNumber", numericValue);
                }}
              />
            </div>
            <CurrentBookingDepartureField
              departureStages={departureStages}
              name="destinationLocation"
              arrivalFieldName="arrivalLocation"
              setFieldValue={setFieldValue}
            />
            <CurrentBookingArrivalField arrivalStages={mappedArrivalStages} />
            <div className="flex items-end gap-2 ">
              <button
                type="submit"
                className="bg-green-700 uppercase text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
              // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
                onClick={() => {
                  localStorage.removeItem(
                    "current-payment-report-filters"
                  );
                  resetForm({
                    values: {
                      fromDate: getCurrentDateStartTime(),
                      toDate: getCurrentDateEndTime(),
                      paymentStatus: "",
                      phoneNumber: "",
                      arrivalLocation: 0,
                      destinationLocation: 0,
                      intercityBus: "",
                    },
                  });
                  onIntercityBusChange?.("");
                  fetchCurrentPaymentTransactions({
                    startDate: getCurrentDateStartTime(),
                    endDate: getCurrentDateEndTime(),
                    paymentStatus: "",
                    phoneNumber: "",
                    arrivalLocation: 0,
                    destinationLocation: 0,
                  });
                  setResetTrigger(prev => prev + 1);
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

export default CurrentPaymentTransactionsForm;
