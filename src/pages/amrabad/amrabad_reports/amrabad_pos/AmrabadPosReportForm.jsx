import React from "react";
import { Formik, Form, Field } from "formik";
import { useEffect, useMemo, useState } from "react";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { useAmrabadPosStore } from "./AmrabadPosStore";

const AmrabadPosReportForm = ({ pageNumber, pageSize, SetcurrentPage }) => {
  const savedFilters =  JSON.parse(localStorage.getItem("amrabad-pos-report-filters"));
  const {
    fetchAmrabadPosReportData,
    fetchAmrabadPosVehicleTypesData,
    AmrabadPosVehicleTypesData,
  } = useAmrabadPosStore();
  useEffect(() => {
    fetchAmrabadPosVehicleTypesData();
  }, []);
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getCurrentDateAtMidnight = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00`;
  };

  const initialValues = {
    fromDate: savedFilters?.fromDate || getCurrentDateAtMidnight(),
    toDate: savedFilters?.toDate || getCurrentDate(),
    adminMobileNumber: savedFilters?.adminMobileNumber
      ? savedFilters.mobileNumber
      : "",
    userMobileNumber: savedFilters?.userMobileNumber
      ? savedFilters.mobileNumber
      : "",
    paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
    vehicleNumber: savedFilters?.vehicleNumber
      ? savedFilters.vehicleNumber
      : "",
    transactionStatus: savedFilters?.transactionStatus
      ? savedFilters.transactionStatus
      : "",
    ticketType: savedFilters?.ticketType ? savedFilters.ticketType : "",
  };

  const onSubmit = (values) => {
    console.log("values", values);
    fetchAmrabadPosReportData({
      ...values,
      pageNumber: pageNumber,
      PageSize: pageSize,
    });
    SetcurrentPage(0)
    localStorage.setItem("amrabad-pos-report-filters", JSON.stringify(values));
  };
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setFieldValue, setValues }) => (
        <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
          {/* from date */}
          <div>
            <label
              htmlFor="fromDate"
              className="block text-xs font-medium text-gray-700"
            >
              From Date & Time
            </label>
            <Field
              type="datetime-local"
              name="fromDate"
              className={`mt-1 block w-full px-2 py-1 border
              border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              // min={getCurrentDateTime()}
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
              To Date & Time
            </label>
            <Field
              type="datetime-local"
              name="toDate"
              className={`mt-1 block w-full px-2 py-1 border
                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              min={values.fromDate || getCurrentDateAtMidnight()}
              onChange={(e) => {
                const toDateValue = e.target.value;
                setFieldValue("toDate", toDateValue);
              }}
            />
          </div>
          {/* mobile no */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Admin login Mobile Number
            </label>
            <Field
              type="text"
              name="adminMobileNumber"
              maxLength="10"
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              placeholder="Enter Adimn mobile Num..."
              onKeyPress={(e) => {
                if (!/^\d$/.test(e.key)) e.preventDefault();
              }}
            />
          </div>

          {/* Ticket Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Ticket Type(2 or 4 wheeler etc..)
            </label>
            <Field
              as="select"
              name="ticketType"
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="">All</option>
              {AmrabadPosVehicleTypesData?.map((item) => (
                <option value={item.vehicleTypeId}>
                  {item.vehicleTypeName}
                </option>
              ))}
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
              <option value="credit card">Credit Card</option>
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
            </Field>
          </div>
          {/* Transaction Status */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Transaction Status
            </label>
            <Field
              as="select"
              name="transactionStatus"
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="">All</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </Field>
          </div>
          {/* Vehicle Number */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Vehicle Number
            </label>
            <Field
              type="text"
              name="vehicleNumber"
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              placeholder="Enter Vehicle Number"
            />
          </div>
          {/* User Mobile Number */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              User Mobile Number
            </label>
            <Field
              type="text"
              name="userMobileNumber"
              maxLength="10"
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              placeholder="Enter User mobile number"
              onKeyPress={(e) => {
                if (!/^\d$/.test(e.key)) e.preventDefault();
              }}
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
                localStorage.removeItem("amrabad-pos-report-filters");
                setValues({
                  fromDate: getCurrentDateAtMidnight(),
                  toDate: getCurrentDate(),
                  adminMobileNumber: "",
                  userMobileNumber: "",
                  paymentMode: "",
                  vehicleNumber: "",
                  transactionStatus: "",
                  ticketType: "",
                });
                fetchAmrabadPosReportData({
                  fromDate: getCurrentDateAtMidnight(),
                  toDate: getCurrentDate(),
                  adminMobileNumber: "",
                  userMobileNumber: "",
                  paymentMode: "",
                  vehicleNumber: "",
                  transactionStatus: "",
                  ticketType: "",
                  pageNumber: pageNumber,
                  PageSize: pageSize,
                });
                SetcurrentPage(0)
              }}
            >
              Reset
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AmrabadPosReportForm;
