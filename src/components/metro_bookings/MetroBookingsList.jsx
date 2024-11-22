import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import { useMetroBookingsStore } from "../../store/reports/metroBookingsStore";
import { Field, Form, Formik } from "formik";
import FiltersForm from "./FiltersForm";

const MetroBookingsList = () => {
  const { allBookings, fetchAllBookings } = useBookingsStore();
  const { allMetroBookings, fetchAllMetroBookings } = useMetroBookingsStore();
  useEffect(() => {
    fetchAllBookings();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 70,
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "user",
      headerName: "Date & Time",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "amount",
      headerName: "From Station",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "park",
      headerName: "To Station",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingStatus",
      headerName: "Fare Paid",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingDate",
      headerName: "Passenger Name",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingDate",
      headerName: "Passenger Contact",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingDate",
      headerName: "Transaction Status",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingDate",
      headerName: "Metro Line",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
  ]);
  return (
    <>
     <FiltersForm />
      <AgGridTable rowData={allBookings} columnDefs={columnDefs} />
    </>
  );
};
export default MetroBookingsList;