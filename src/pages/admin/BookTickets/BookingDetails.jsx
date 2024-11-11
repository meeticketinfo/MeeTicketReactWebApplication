import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";
import QRCodeDisplay from "./QrCodeDisplay";

export default function BookingDetails() {
  const { id } = useParams();
  const [isGridView, setIsGridView] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null); // Start with null to handle different data types
  const {
    fetchCurrentBookingDetailsByBookingId,
    isFetchCurrentBookingDetailsLoading,
  } = useBookingsStore();

  useEffect(() => {
    fetchQRsForBooking(id);
  }, []);

  const fetchQRsForBooking = async (bookingId) => {
    try {
      const result = await fetchCurrentBookingDetailsByBookingId(bookingId);
      if (result && result.data && result.data.status === 200) {
        setBookingDetails(result.data.data.data.bookingDetails);
        console.log("bookingDetails", result.data.data.data.bookingDetails);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      handleApiError(xhr);
    }
  };

  const handlePrint = () => {
    const printContents = document.querySelectorAll(".printable-card");

    // Create a temporary div to hold the content to print
    const printWindow = window.open("", "_blank");

    // Get the HTML of the printable cards
    let content = "";
    printContents.forEach((card) => {
      content += card.outerHTML; // Get outer HTML to include the whole card structure
    });

    // Set up the print content in the print window
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .printable-card {
            /* Your custom print styles here */
            margin: 10px;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
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
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Back
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          {/* <button
            onClick={() => setIsGridView(!isGridView)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none"
          >
            {isGridView ? "List View" : "Grid View"}
          </button> */}
          <button
            onClick={() => handlePrint()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Print QR Code Cards
          </button>
        </div>
        <div
          className={`grid gap-6 ${
            isGridView
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {Array.isArray(bookingDetails) ? (
            bookingDetails.map((item) => (
              <div
                key={item.id}
                className="printable-card bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center border border-gray-300 border-opacity-50 rounded-[20px] shadow-lg text-gray-800"
              >
                <div className="w-full">
                  <div className="flex justify-center bg-white m-2 rounded-[20px]">
                    <QRCodeDisplay binaryQRCode={item.binaryQRCode} />
                  </div>
                  <div className="p-5 bg-white m-2 rounded-[20px]">
                    <div className="grid grid-cols-1 gap-4">
                      <small className="mb-1 flex items-center">
                        <span className="w-1/2 font-semibold">Facility</span>:{" "}
                        {item.facilityName || "N/A"}
                      </small>
                      <small className="mb-1 flex items-center">
                        <span className="w-1/2 font-semibold">
                          Service Name
                        </span>
                        : {item.serviceName || "N/A"}
                      </small>
                      <small className="mb-1 flex items-center">
                        <span className="w-1/2 font-semibold">
                          Service Variant
                        </span>
                        : {item.serviceVariantName || "N/A"}
                      </small>
                      <small className="mb-1 flex items-center">
                        <span className="w-1/2 font-semibold">Total</span>:
                        &#8377;{item.totalAmount || "N/A"}
                      </small>
                    </div>
                    <hr />
                    <div className="flex justify-between gap-2 mt-4">
                      <small className="mb-1">
                        Amount : &#8377;{item.amount || "N/A"}
                      </small>

                      <small className="mb-1">
                        Quantity : {item.quantity || "N/A"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-200">No booking details available.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
