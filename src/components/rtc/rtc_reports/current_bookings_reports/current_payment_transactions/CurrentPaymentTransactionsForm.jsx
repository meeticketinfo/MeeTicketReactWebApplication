import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  getCurrentDateStartTime,
  getCurrentDateEndTime,
} from "../../../../../utils/TypographyHelper";
import { useCurrentPaymentTransactionStore } from "../../../../../store/rtc/CurrentPaymentTransactionStore";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import {
  CurrentBookingArrivalField,
  CurrentBookingDepartureField,
  getArrivalStagesForDeparture,
  getStageIdsFromSelection,
} from "../shared/CurrentBookingReportFilterFields";

const CurrentPaymentTransactionsForm = () => {
  const { fetchCurrentPaymentTransactions } =
    useCurrentPaymentTransactionStore();
  const { fetchMavenRoutes, mavenRoutes, departureStages } =
    useIntercityMastersStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("current-payment-report-filters")
  );
  const initialValues = {
    fromDate: savedFilters?.fromDate
      ? savedFilters.fromDate
      : getCurrentDateStartTime(),
    toDate: savedFilters?.toDate
      ? savedFilters.toDate
      : getCurrentDateEndTime(),
    paymentStatus: savedFilters?.paymentStatus
      ? savedFilters.paymentStatus
      : "",
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
    arrivalLocation: savedFilters?.arrivalLocation
      ? savedFilters.arrivalLocation
      : 0,
    destinationLocation: savedFilters?.destinationLocation
      ? savedFilters.destinationLocation
      : 0,
  };
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    fetchMavenRoutes();
  }, [fetchMavenRoutes]);

  const onSubmit = (values) => {
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
      startDate: values.fromDate,
      endDate: values.toDate,
      paymentStatus: values.paymentStatus || "",
      phoneNumber: values.phoneNumber || "",
      destinationLocation: stageIds.FromStageBoardingID,
      arrivalLocation: stageIds.ToStageBoardingID,
    });
  };

  return (
    <>
      <Formik
        key={resetTrigger}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
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
                    setFieldValue("toDate", e.target.value);
                  }}
                />
              </div>

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
                    const numericValue = value.replace(/[^0-9]/g, "");

                    if (numericValue.length > 10) {
                      return;
                    }

                    if (
                      numericValue.length > 0 &&
                      !/^[6-9]/.test(numericValue)
                    ) {
                      return;
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
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  onClick={() => {
                    localStorage.removeItem("current-payment-report-filters");
                    resetForm({
                      values: {
                        fromDate: getCurrentDateStartTime(),
                        toDate: getCurrentDateEndTime(),
                        paymentStatus: "",
                        phoneNumber: "",
                        arrivalLocation: 0,
                        destinationLocation: 0,
                      },
                    });
                    fetchCurrentPaymentTransactions({
                      startDate: getCurrentDateStartTime(),
                      endDate: getCurrentDateEndTime(),
                      paymentStatus: "",
                      phoneNumber: "",
                      arrivalLocation: 0,
                      destinationLocation: 0,
                    });
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

export default CurrentPaymentTransactionsForm;
