import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import AgGridTable from "../../../../tables/AgGridTable";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import { useBookingsStore } from "../../../../../store/masters/bookingsStore";
import { useEntityTypesStore } from "../../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../../store/masters/departmentTypesStore";
import useAuthStore from "../../../../../store/authStore";
import { useParkStore } from "../../../../../store/masters/parksStore";
import IntercityIndividualReportForm from "./IntercityIndividualReportForm";
function IntercityIndividualList() {
  const { roleDetails } = useAuthStore();

  const role = roleDetails?.name;
  const {
    fetchCompleteBookingsReport,
    allCompleteBookingsReports,
    setisCompleteBookings,
    isCompleteBookingsReportsLoading,
  } = useBookingsStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const {
    allParkBankTransactions,
    fetchParkBankTransactions,
    isFetchAllParkBankTransactionsLoading,
    allParks,
    fetchAllParks,
  } = useParkStore();
  const [isBookingDate, setIsBookingDate] = useState(false);
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
      departmentId: savedFilters?.departmentId
        ? savedFilters.departmentId
        : null,
      entityTypeId: savedFilters?.entityTypeId
        ? savedFilters.entityTypeId
        : null,
      parkId: savedFilters?.parkId ? savedFilters.parkId : null,
    });
    console.log("savedFilters", savedFilters);
  }, [fetchCompleteBookingsReport]);

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllParks();
    if (role === "ROLE_SUPERADMIN") {
      fetchAllDepartmentTypes();
    }
  }, []);
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
    fetchCompleteBookingsReport({
      startDate: !isBookingDate ? values.fromDate : null,
      endDate: !isBookingDate ? values.toDate : null,
      bookingDateFrom: isBookingDate ? values.fromDate : null,
      bookingDateTo: isBookingDate ? values.toDate : null,
      departmentId: values.departmentId,
      entityTypeId: values.entityId,
      bookingSource: values.typeOfBooking,
      mobileNumber: values.phoneNumber ? values.phoneNumber : null,
      parkId: values.parkId ? values.parkId : null,
    });
    console.log("values", values);
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
      field: "paymentTransactionId",
      headerName: "PNR Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "referencE_ID",
      headerName: "Return PNR No",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "parkName",
      headerName: "Departure Location",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "departmentName",
      headerName: "Arrival Location",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "entityTypeName",
      headerName: "Mobile number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "totalTicketsBooked",
      headerName: " Bus Type",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mid",
      headerName: "Seat Layout Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // -------------------

    {
      field: "mobileNumber",
      headerName: "Travel type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "purchaseDate",
      headerName: "MID",
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
      headerName: "Purchase Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "bookingSource",
      headerName: "Travel Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "createD_BY",
      headerName: "Return Journey Travel Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "totaL_AMOUNT",
      headerName: "Ticket Quantity",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "paymentType",
      headerName: "Order ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "status",
      headerName: "Payment Mode",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // valueFormatter: (params) =>
      //   formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "resultStatus",
      headerName: "Basic Fare",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
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
    <IntercityIndividualReportForm/>
      <AgGridTable
        ExportName="Individual Report"
        // isFetchLoading={isCompleteBookingsReportsLoading}
        // rowData={allCompleteBookingsReports || []}
        columnDefs={columnDefs}
        // onPageChange={handlePageChange}
        // totalRecords={totalEntityBookingRecords}
        // enableAdvancedFilter={true}
      />
    </div>
  );
}

export default IntercityIndividualList;
