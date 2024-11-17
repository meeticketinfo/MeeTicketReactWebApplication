import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";
import QRCodeDisplay from "./QrCodeDisplay";
import { formatToCurrency, toTitleCase } from "../../../utils/TypographyHelper";

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

    // Create a temporary print window
    const printWindow = window.open("", "_blank");

    // Prepare the content to print
    let content = "";
    printContents.forEach((card) => {
      content += card.outerHTML; // Get the entire HTML structure of the card
    });

    // Define styles for the handheld printer
    const printStyles = `
    <style>
      @page {
        size: 58mm 100mm; /* Adjust the width and height for ticket dimensions */
        margin: 5mm; /* Add small margins for better readability */
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        width: 58mm; /* Match the page size */
      }
      .printable-card {
        width: 100%; /* Fit within the 58mm width */
        padding: 5mm;
        border: 1px solid #ccc; /* Optional border */
        margin-bottom: 5mm;
        page-break-inside: avoid;
        font-size: 12px; /* Adjust font size for readability */
      }
      .printable-card ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      .printable-card li {
        margin-bottom: 5px;
      }
      .printable-card hr {
        border: none;
        border-top: 1px solid #ccc;
        margin: 5px 0;
      }
    </style>
  `;

    // Write the content and styles to the print window
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        ${printStyles}
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
            <NavLink
              end
              to="/entity-bookings"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Back
            </NavLink>
          </div>
        </div>

        <div className="flex justify-center mb-6">
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
                  <div className="p-2 bg-white m-2 rounded-[20px]">
                    <ul className="space-y-1">
                      <li>
                        <div
                          className=""
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "20px",
                          }}
                        >
                          {toTitleCase(item.facilityName) || "N/A"}
                        </div>
                      </li>
                      <li>
                        <div
                          className=""
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          <small className="">
                            {toTitleCase(item.serviceName) || "N/A"}
                          </small>
                        </div>
                      </li>
                      <li>
                        <div
                          className=""
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          <small className="">
                            {toTitleCase(item.serviceVariantName) || "N/A"}
                          </small>
                        </div>
                      </li>
                    </ul>

                    <hr />
                    <div className="grid">
                      <ul style={{ paddingTop: "10px" }}>
                        <li>
                          <small className="" style={{float: "left"}}>
                            Total : {formatToCurrency(item.amount) || "N/A"}
                          </small>
                          <small className="" style={{float:"right"}}>
                            Qnty : {item.quantity || "N/A"}
                          </small>
                        </li>
                       
                      </ul>
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
