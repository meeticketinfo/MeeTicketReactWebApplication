import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AgGridTable from "../../../components/tables/AgGridTable"; // Adjust import path as needed
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { FacilityServices } from "../../../components/bookings_management/FacilityServices";
import { formatToCurrency } from "../../../utils/TypographyHelper";
import BackButton from "../../../components/BackButton";
import useAuthStore from "../../../store/authStore";

export default function AdminBookings() {
  const { allBookings, fetchAllBookings, isFetchAllBookingsLoading } = useBookingsStore();
  const [isBookingFormVisible, setIsBookingFormVisible] = useState(false); // State to toggle booking form visibility
  const { sidebarMenuItems, roleDetails } = useAuthStore();
  const role = roleDetails?.name;

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "bookingId",
      headerName: "Booking Id",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value && params.value.trim() !== "" ? params.value : "N/A",
    },
    {
      field: "userName",
      headerName: "User Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "parkName",
      headerName: "Entity Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "serviceVariantName",
      headerName: "Service Variant Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "bookingRegistredDate",
      headerName: "Booking Date",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "amount",
      headerName: "Booking Amount",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
  ]);

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
              role === "ROLE_ADMIN" && (<button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setIsBookingFormVisible(true)} // Show booking form
              >
                Book Tickets
              </button>)
            ) : (
              // <button
              //   className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
              //   onClick={() => setIsBookingFormVisible(false)} // Hide booking form
              // >
              //   Back
              // </button>
              <BackButton
                label="Back"
                onClick={() => setIsBookingFormVisible(false)}
                className="bg-blue-600 hover:bg-blue-700"
                // disabled={isSubmitting}
              />
            )}
          </div>
        </div>

        {/* Booking Form Section */}
        {isBookingFormVisible && <FacilityServices />}

        {/* Table Section - Show only if form is not visible */}
        {!isBookingFormVisible && (
          <div className="mb-8">
            <AgGridTable
              isFetchLoading={isFetchAllBookingsLoading}
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
