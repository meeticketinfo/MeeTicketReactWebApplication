import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useBookingsStore } from "../../store/masters/bookingsStore";

const BookingsList = () => {
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
    // {
    //   field: "id",
    //   headerName: "Booking ID",
    //   flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value || "N/A",
    // },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "park",
      headerName: "Park",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingStatus",
      headerName: "Booking Status",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingDate",
      headerName: "Booing Date",
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
export default BookingsList;
