import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AgGridTable from "../../../components/tables/AgGridTable"; // Adjust import path as needed
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { FacilityServices } from "../../../components/bookings_management/FacilityServices";

export default function AdminBookings() {
  const { allBookings, fetchAllBookings } = useBookingsStore();
  const [isBookingFormVisible, setIsBookingFormVisible] = useState(false); // State to toggle booking form visibility

  const [adultEntry, setAdultEntry] = useState(0);
  const [childrenEntry, setChildrenEntry] = useState(0);
  const [adultPlayground, setAdultPlayground] = useState(0);
  const [childrenPlayground, setChildrenPlayground] = useState(0);
  const [playgroundType, setPlaygroundType] = useState("AC"); // default to "AC"

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
      headerName: "Booking ID",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
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
      headerName: "Booking Date",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
  ]);

  const handleQuantityChange = (setter, value) => {
    setter((prev) => Math.max(0, prev + value));
  };

  const calculateTotalTickets = () =>
    adultEntry + childrenEntry + adultPlayground + childrenPlayground;

  const calculateTotalAmount = () => {
    // Entry ticket amount (₹50 for adult, ₹30 for children)
    const entryTicketAmount = adultEntry * 50 + childrenEntry * 30;

    // Playground ticket amount (₹30 for adult and ₹15 for children if AC, ₹20 and ₹10 if Non-AC)
    const playgroundTicketAmount =
      adultPlayground * (playgroundType === "AC" ? 30 : 20) +
      childrenPlayground * (playgroundType === "AC" ? 15 : 10);

    // Total amount
    return entryTicketAmount + playgroundTicketAmount;
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Bookings
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {!isBookingFormVisible ? (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setIsBookingFormVisible(true)} // Show booking form
              >
                Add Booking
              </button>
            ) : (
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                onClick={() => setIsBookingFormVisible(false)} // Hide booking form
              >
                Back
              </button>
            )}
          </div>
        </div>

        {/* Booking Form Section */}
        {isBookingFormVisible && (
            <FacilityServices />
        )}

        {/* Table Section - Show only if form is not visible */}
        {!isBookingFormVisible && (
          <div className="mb-8">
            <AgGridTable
              columnDefs={columnDefs}
              rowData={allBookings || []}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
              pagination={true}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
