import React, { useEffect, useState } from "react";
import AgGridTable from "../../../components/tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { NavLink } from "react-router-dom";

function CompletedBookingsReportList() {
  const {
    fetchCompleteBookingsReport,
    allCompleteBookingsReports,
    setisCompleteBookings,
    isCompleteBookingsReportsLoading,
  } = useBookingsStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("completed-booking-report-filters")
  );
  console.log("getSavedFilters", savedFilters);
  useEffect(() => {
    fetchCompleteBookingsReport({
      startDate: savedFilters?.fromDate
        ? savedFilters.fromDate
        : getCurrentDate(),
      endDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
      bookingSource: savedFilters?.typeOfBooking
        ? savedFilters.typeOfBooking
        : "Counter",
      mobileNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : null,
    });
  }, [fetchCompleteBookingsReport]);
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    typeOfBooking: savedFilters?.typeOfBooking
      ? savedFilters.typeOfBooking
      : "Counter",
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : null,
  };

  const onSubmit = (values, { resetForm }) => {
    localStorage.setItem(
      "completed-booking-report-filters",
      JSON.stringify(values)
    );
    fetchCompleteBookingsReport({
      startDate: values.fromDate,
      endDate: values.toDate,
      bookingSource: values.typeOfBooking,
      mobileNumber: values.phoneNumber ? values.phoneNumber : null,
    });
  };

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value && params.value.trim() !== "" ? params.value : "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "bookinG_DATE",
      headerName: "Booking Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "totaL_AMOUNT",
      headerName: "Total Amount",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "bookingSource",
      headerName: "Booking Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "bookingRegistredDate",
      headerName: "Payment Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "status",
      headerName: "Payment Status",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // valueFormatter: (params) =>
      //   formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "referencE_ID",
      headerName: "Reference ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            to={`/entity-bookings/view-details/${params.data.bookingID}`}
            onClick={() => {
              setisCompleteBookings(true);
            }}
            className="bg-gray-100 text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-100 transition"
          >
            <span className="text-blue-v2"> Booking Details</span>
          </NavLink>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
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
              <label className="block text-sm font-medium">
                Type of Booking
              </label>
              <Field
                as="select"
                name="typeOfBooking"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
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
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-green-700 hover:border hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-green-700 hover:border hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
                onClick={() => {
                  localStorage.removeItem("completed-booking-report-filters");
                  resetForm({
                    values: {
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      typeOfBooking: true,
                      phoneNumber: "",
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
      <AgGridTable
        isFetchLoading={isCompleteBookingsReportsLoading}
        rowData={allCompleteBookingsReports || []}
        columnDefs={columnDefs}
        // onPageChange={handlePageChange}
        // totalRecords={totalEntityBookingRecords}
        // enableAdvancedFilter={true}
      />
    </div>
  );
}

export default CompletedBookingsReportList;
