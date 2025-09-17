import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useIntercityTotalTransactionStore } from "../store/IntercityTotalTransactionStore";
import IntercityTotalCommonStore from "../../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";

const IntercityTotalTransactionForm = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
  mobileNumber,
  fromDate,
  toDate,
  arrivalLocation,
  departureLocation,
  busType,
  status,
}) => {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { setOuterFilters, outerFilters, resetOuterFilters, setInnerFilters, deepInnerFilters, innerFilters } =
    IntercityTotalCommonStore();
  const {
    fetchTotalTransactionsReport,
    totalTransactionsReport,
    isIntercityTotalTransactionsLoading,
  } = useIntercityTotalTransactionStore();

  // Mock location data - you can replace this with actual API calls
  const departureLocations = [
    { id: "hyd", name: "Hyderabad" },
    { id: "mum", name: "Mumbai" },
    { id: "del", name: "Delhi" },
    { id: "ban", name: "Bangalore" },
    { id: "che", name: "Chennai" },
  ];

  const arrivalLocations = [
    { id: "hyd", name: "Hyderabad" },
    { id: "mum", name: "Mumbai" },
    { id: "del", name: "Delhi" },
    { id: "ban", name: "Bangalore" },
    { id: "che", name: "Chennai" },
  ];



  const initialValues = {
    startDate:
      fromDate ??
      deepInnerFilters.startDate ??
      innerFilters.fromDate ??
      startOfDay,
    endDate:
      toDate ?? deepInnerFilters.endDate ?? innerFilters.toDate ?? endOfDay,
    phoneNumber:
      mobileNumber ??
      deepInnerFilters.mobileNumber ??
      innerFilters.mobileNumber ??
      "",
    arrivalLocation:
      arrivalLocation ??
      innerFilters.arrivalLocation ??
      outerFilters.arrivalLocation ??
      "",
    departureLocation:
      departureLocation ??
      innerFilters.departureLocation ??
      outerFilters.departureLocation ??
      "",
    busType: busType ?? innerFilters.busType ?? outerFilters.busType ?? "",
  };
  const onSubmit = (values) => {
    fetchTotalTransactionsReport({
      ...values,
      status: status ?? innerFilters.status,
      arrivalLocation: arrivalLocation ?? innerFilters.arrivalLocation,
      departureLocation: departureLocation ?? innerFilters.departureLocation,
      busType: busType ?? innerFilters.busType,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
  };
  return (
    <>
      <ToastContainer />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 py-3">
            <div>
              <label
                htmlFor="startDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="datetime-local"
                name="startDate"
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("startDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.endDate)) {
                    // Automatically update toDate if it's earlier than fromDate
                    setFieldValue("endDate", fromDateValue);
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
                name="endDate"
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("endDate", toDateValue);
                }}
              />
            </div>

            {/* mobile number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile No
              </label>
              <Field
                type="text"
                maxLength="10"
                name="phoneNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter Mobile No"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("phoneNumber", e.target.value);
                }}
              />
            </div>

            {/* Arrival Location */}
            <div>
              <label
                htmlFor="arrivalLocation"
                className="block text-xs font-medium text-gray-700"
              >
                Arrival Location
              </label>
              <Field
                as="select"
                name="arrivalLocation"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("arrivalLocation", e.target.value);
                }}
              >
                <option value="">Select </option>
                <option value="hyderabad">Hyderabad</option>
                <option value="warangal">Warangal</option>
                <option value="karimnagar">Karimnagar</option>
                <option value="nizamabad">Nizamabad</option>
                <option value="adilabad">Adilabad</option>
                <option value="khammam">Khammam</option>
                <option value="medak">Medak</option>
                <option value="rangareddy">Rangareddy</option>
                <option value="nalgonda">Nalgonda</option>
                <option value="mahabubnagar">Mahabubnagar</option>
                <option value="siddipet">Siddipet</option>
                <option value="yadadri">Yadadri</option>
                <option value="suryapet">Suryapet</option>
                <option value="jagtial">Jagtial</option>
                <option value="rajanna">Rajanna</option>
                <option value="peddapalli">Peddapalli</option>
                <option value="jayashankar">Jayashankar</option>
                <option value="bhupalpally">Bhupalpally</option>
                <option value="mulugu">Mulugu</option>
                <option value="bhadradri">Bhadradri</option>
                <option value="ashwaraopet">Ashwaraopet</option>
                <option value="kothagudem">Kothagudem</option>
                <option value="mancherial">Mancherial</option>
                <option value="komaram">Komaram</option>
                <option value="kumuram">Kumuram</option>
                <option value="other">Other</option>
              </Field>
            </div>

            {/* Departure Location */}
            <div>
              <label
                htmlFor="departureLocation"
                className="block text-xs font-medium text-gray-700"
              >
                Departure Location
              </label>
              <Field
                as="select"
                name="departureLocation"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("departureLocation", e.target.value);
                }}
              >
                <option value="">Select</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="warangal">Warangal</option>
                <option value="karimnagar">Karimnagar</option>
                <option value="nizamabad">Nizamabad</option>
                <option value="adilabad">Adilabad</option>
                <option value="khammam">Khammam</option>
                <option value="medak">Medak</option>
                <option value="rangareddy">Rangareddy</option>
                <option value="nalgonda">Nalgonda</option>
                <option value="mahabubnagar">Mahabubnagar</option>
                <option value="siddipet">Siddipet</option>
                <option value="yadadri">Yadadri</option>
                <option value="suryapet">Suryapet</option>
                <option value="jagtial">Jagtial</option>
                <option value="rajanna">Rajanna</option>
                <option value="peddapalli">Peddapalli</option>
                <option value="jayashankar">Jayashankar</option>
                <option value="bhupalpally">Bhupalpally</option>
                <option value="mulugu">Mulugu</option>
                <option value="bhadradri">Bhadradri</option>
                <option value="ashwaraopet">Ashwaraopet</option>
                <option value="kothagudem">Kothagudem</option>
                <option value="mancherial">Mancherial</option>
                <option value="komaram">Komaram</option>
                <option value="kumuram">Kumuram</option>
                <option value="other">Other</option>
              </Field>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default IntercityTotalTransactionForm;
