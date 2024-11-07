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
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Book Tickets
            </h2>

            {/* Entry Ticket Section */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Entry Ticket</h3>

              {/* Adult Quantity with Cost */}
              <div className="flex justify-between items-center mb-2">
                <span>Adult</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(setAdultEntry, -1)}
                    className="px-2 text-lg"
                  >
                    -
                  </button>
                  <span className="mx-2">{adultEntry}</span>
                  <button
                    onClick={() => handleQuantityChange(setAdultEntry, 1)}
                    className="px-2 text-lg"
                  >
                    +
                  </button>
                  {/* Displaying cost beside Adult */}
                  <span className="ml-2">₹50.0</span>
                </div>
                {/* <FacilityServices /> */}
                {/* Booking Form Section */}
                {isBookingFormVisible && (
                    <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                            Book Tickets
                        </h2>

                        {/* Entry Ticket Section */}
                        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Entry Ticket</h3>

                            {/* Adult Quantity with Cost */}
                            <div className="flex justify-between items-center mb-2">
                                <span>Adult</span>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(setAdultEntry, -1)}
                                        className="px-2 text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{adultEntry}</span>
                                    <button
                                        onClick={() => handleQuantityChange(setAdultEntry, 1)}
                                        className="px-2 text-lg"
                                    >
                                        +
                                    </button>
                                    {/* Displaying cost beside Adult */}
                                    <span className="ml-2">
                                        ₹50.0
                                    </span>
                                </div>
                            </div>

                            {/* Children Quantity with Cost */}
                            <div className="flex justify-between items-center">
                                <span>Children</span>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(setChildrenEntry, -1)}
                                        className="px-2 text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{childrenEntry}</span>
                                    <button
                                        onClick={() => handleQuantityChange(setChildrenEntry, 1)}
                                        className="px-2 text-lg"
                                    >
                                        +
                                    </button>
                                    {/* Displaying cost beside Children */}
                                    <span className="ml-2">
                                        ₹30.0
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Kids Playground Section */}
                        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Kids Playground</h3>

                            {/* Playground Type Selection */}
                            <div className="flex mb-4">
                                <label className="flex items-center mr-4">
                                    <input
                                        type="radio"
                                        name="playgroundType"
                                        value="AC"
                                        checked={playgroundType === "AC"}
                                        onChange={() => setPlaygroundType("AC")}
                                        className="mr-2"
                                    />
                                    AC
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="playgroundType"
                                        value="Non-AC"
                                        checked={playgroundType === "Non-AC"}
                                        onChange={() => setPlaygroundType("Non-AC")}
                                        className="mr-2"
                                    />
                                    Non-AC
                                </label>
                            </div>

                            {/* Adult Playground Quantity with Cost */}
                            <div className="flex justify-between items-center mb-2">
                                <span>Adult</span>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(setAdultPlayground, -1)}
                                        className="px-2 text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{adultPlayground}</span>
                                    <button
                                        onClick={() => handleQuantityChange(setAdultPlayground, 1)}
                                        className="px-2 text-lg"
                                    >
                                        +
                                    </button>
                                    {/* Displaying cost beside Adult */}
                                    <span className="ml-2">
                                        {playgroundType === "AC" ? "₹30.0" : "₹20.0"}
                                    </span>
                                </div>
                            </div>

                            {/* Children Playground Quantity with Cost */}
                            <div className="flex justify-between items-center">
                                <span>Children</span>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(setChildrenPlayground, -1)}
                                        className="px-2 text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{childrenPlayground}</span>
                                    <button
                                        onClick={() => handleQuantityChange(setChildrenPlayground, 1)}
                                        className="px-2 text-lg"
                                    >
                                        +
                                    </button>
                                    {/* Displaying cost beside Children */}
                                    <span className="ml-2">
                                        {playgroundType === "AC" ? "₹15.0" : "₹10.0"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="text-right mt-4">
                            <div className="font-semibold text-xl">
                                Total Tickets: {calculateTotalTickets()}
                            </div>
                            <div className="font-semibold text-lg">
                                Total Amount: ₹{calculateTotalAmount()}
                            </div>
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" 
                             onClick={() => setIsBookingFormVisible(false)} 
                             >
                                
                                Book Ticket
                            </button>
                        </div>
                    </div>
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

              {/* Children Quantity with Cost */}
              <div className="flex justify-between items-center">
                <span>Children</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(setChildrenEntry, -1)}
                    className="px-2 text-lg"
                  >
                    -
                  </button>
                  <span className="mx-2">{childrenEntry}</span>
                  <button
                    onClick={() => handleQuantityChange(setChildrenEntry, 1)}
                    className="px-2 text-lg"
                  >
                    +
                  </button>
                  {/* Displaying cost beside Children */}
                  <span className="ml-2">₹30.0</span>
                </div>
              </div>
            </div>

            {/* Kids Playground Section */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Kids Playground</h3>

              {/* Playground Type Selection */}
              <div className="flex mb-4">
                <label className="flex items-center mr-4">
                  <input
                    type="radio"
                    name="playgroundType"
                    value="AC"
                    checked={playgroundType === "AC"}
                    onChange={() => setPlaygroundType("AC")}
                    className="mr-2"
                  />
                  AC
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="playgroundType"
                    value="Non-AC"
                    checked={playgroundType === "Non-AC"}
                    onChange={() => setPlaygroundType("Non-AC")}
                    className="mr-2"
                  />
                  Non-AC
                </label>
              </div>

              {/* Adult Playground Quantity with Cost */}
              <div className="flex justify-between items-center mb-2">
                <span>Adult</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(setAdultPlayground, -1)}
                    className="px-2 text-lg"
                  >
                    -
                  </button>
                  <span className="mx-2">{adultPlayground}</span>
                  <button
                    onClick={() => handleQuantityChange(setAdultPlayground, 1)}
                    className="px-2 text-lg"
                  >
                    +
                  </button>
                  {/* Displaying cost beside Adult */}
                  <span className="ml-2">
                    {playgroundType === "AC" ? "₹30.0" : "₹20.0"}
                  </span>
                </div>
              </div>

              {/* Children Playground Quantity with Cost */}
              <div className="flex justify-between items-center">
                <span>Children</span>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(setChildrenPlayground, -1)
                    }
                    className="px-2 text-lg"
                  >
                    -
                  </button>
                  <span className="mx-2">{childrenPlayground}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(setChildrenPlayground, 1)
                    }
                    className="px-2 text-lg"
                  >
                    +
                  </button>
                  {/* Displaying cost beside Children */}
                  <span className="ml-2">
                    {playgroundType === "AC" ? "₹15.0" : "₹10.0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="text-right mt-4">
              <div className="font-semibold text-xl">
                Total Tickets: {calculateTotalTickets()}
              </div>
              <div className="font-semibold text-lg">
                Total Amount: ₹{calculateTotalAmount()}
              </div>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setIsBookingFormVisible(false)}
              >
                Book Ticket
              </button>
            </div>
          </div>
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
