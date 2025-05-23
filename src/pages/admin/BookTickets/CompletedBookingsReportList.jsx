import React, { useEffect, useState } from "react";
import AgGridTable from "../../../components/tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { NavLink } from "react-router-dom";
import { useEntityTypesStore } from "../../../store/masters/entityTypesStore";
import Select from "react-select";
import { useDepartmentTypesStore } from "../../../store/masters/departmentTypesStore";
function CompletedBookingsReportList() {
  const {
    fetchCompleteBookingsReport,
    allCompleteBookingsReports,
    setisCompleteBookings,
    isCompleteBookingsReportsLoading,
  } = useBookingsStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("completed-booking-report-filters")
  );

  useEffect(() => {
    fetchCompleteBookingsReport({
      startDate: savedFilters?.fromDate
        ? savedFilters.fromDate
        : getCurrentDate(),
      endDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
      bookingSource: savedFilters?.typeOfBooking
        ? savedFilters.typeOfBooking
        : "",
      mobileNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : null,
      departmentId: savedFilters?.departmentId ? savedFilters.departmentId : null,
      entityTypeId: savedFilters?.entityTypeId ? savedFilters.entityTypeId : null,
    });
  }, [fetchCompleteBookingsReport]);

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
  }, []);
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    entityId: savedFilters?.entityId ? savedFilters.entityId : null,
    departmentId: savedFilters?.departmentId ? savedFilters.departmentId : null,
    typeOfBooking: savedFilters?.typeOfBooking ? savedFilters.typeOfBooking: "",
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
      departmentId:values.departmentId,
      entityTypeId:values.entityId,
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
      field: "referencE_ID",
      headerName: "Reference ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "parkName",
      headerName: "Park Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "departmentName",
      headerName: "Department",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "entityTypeName",
      headerName: "Location category",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "totalTicketsBooked",
      headerName: "Total No Of Tickets",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mid",
      headerName: "MID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // -------------------

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
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },

    {
      field: "bookinG_DATE",
      headerName: "Booking Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "bookingSource",
      headerName: "Booking Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "createD_BY",
      headerName: "Booked By",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "totaL_AMOUNT",
      headerName: "Total Amount",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "paymentType",
      headerName: "Payment Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "paymentTransactionId",
      headerName: "Payment Transaction ID",
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
      field: "resultStatus",
      headerName: "Actual Paytm Status",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? "Success" : "Failed"),
     
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
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
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
            {/* department */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Department
              </label>

              <Select
                name="departmentId"
                value={
                  allDepartmentTypes
                    ?.filter((dept) => dept.isActive)
                    .map((dept) => ({
                      value: dept.departmentId,
                      label: dept.departmentName,
                    }))
                    .find((option) => option.value === values.departmentId) ||
                  null // Set the selected value
                }
                options={allDepartmentTypes
                  ?.filter((dept) => dept.isActive)
                  .map((dept) => ({
                    value: dept.departmentId,
                    label: dept.departmentName,
                  }))}
                onChange={(selectedOption) =>
                  setFieldValue("departmentId", selectedOption?.value || null)
                }
                isClearable
                placeholder="Department"
                className="mt-[4px] text-sm"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    outline: "none",
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    borderRadius: "6px",
                    height: "30px",
                    minHeight: "33px",
                  }),

                  menu: (base) => ({
                    ...base,
                    // padding: "4px 0",
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    fontSize: "0.775rem",
                    backgroundColor: isFocused ? "#F8F8F8" : "white",
                    color: isFocused ? "#0C3771" : "#000",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>
            {/* location category */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Location Category
              </label>

              <Select
                name="entityId"
                value={
                  allEntityTypes
                    ?.filter((dept) => dept.isActive)
                    .map((dept) => ({
                      value: dept.entityTypeId,
                      label: dept.entityTypeName,
                    }))
                    .find((option) => option.value === values.entityId) || null // Use values.entityId
                }
                options={allEntityTypes
                  ?.filter((entity) => entity.isActive)
                  .map((entity) => ({
                    value: entity.entityTypeId,
                    label: entity.entityTypeName,
                  }))}
                onChange={(selectedOption) =>
                  setFieldValue("entityId", selectedOption?.value || null)
                }
                isClearable
                placeholder="Location Category"
                className="mt-[4px] text-sm"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    outline: "none",
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    borderRadius: "6px",
                    height: "30px",
                    minHeight: "33px",
                  }),

                  menu: (base) => ({
                    ...base,
                    // padding: "4px 0",
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    fontSize: "0.775rem",
                    backgroundColor: isFocused ? "#F8F8F8" : "white",
                    color: isFocused ? "#0C3771" : "#6D7072",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>
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
                      entityId:null,
                      departmentId:null,
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
        ExportName="Completed Bookings Details"
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
