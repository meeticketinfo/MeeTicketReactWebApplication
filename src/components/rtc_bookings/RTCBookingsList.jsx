import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useBookingsStore } from "../../store/masters/bookingsStore";

const RTCBookingsList = () => {
  const { allBookings, fetchAllBookings } = useBookingsStore();

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "id",
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
      headerName: "Ticket Type",
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
        headerName: "Seat Number",
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
        headerName: "Bus Type",
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "00:00",
      },
  ]);
  return (
    <>
      <AgGridTable rowData={allBookings} columnDefs={columnDefs} />
    </>
  );
};
export default RTCBookingsList;
