import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";
import QRCodeDisplay from "./QrCodeDisplay";
import { formatToCurrency, toTitleCase } from "../../../utils/TypographyHelper";
import { PaymentQR } from "./PaymentQR";
import { MdOutlineDownloadDone } from "react-icons/md";
import TransactionProcessingLoader from "../../../components/bookings_management/TransactionProcessingLoader";

export default function BookingDetails() {
  const { id } = useParams();
  const [isGridView, setIsGridView] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingDetailsResponse, setBookingDetailsResponse] = useState(null);

  const {
    fetchCurrentBookingDetailsByBookingId,
    isFetchCurrentBookingDetailsLoading,
    setIsFirstStepTransaction,
    setSelectedBookingsList,
    setIsBookingFormVisible
  } = useBookingsStore();
console.log("isFetchCurrentBookingDetailsLoading",isFetchCurrentBookingDetailsLoading)
  useEffect(() => {
    fetchQRsForBooking(id);
  }, []);

  const fetchQRsForBooking = async (bookingId) => {
    try {
      const result = await fetchCurrentBookingDetailsByBookingId(bookingId);
      if (result && result.data && result.data.status === 200) {
        setBookingDetails(result.data.data.data.bookingDetails);
        setBookingDetailsResponse(result.data.data.data);
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
        size: 200mm 400mm; /* Adjust the width and height for ticket dimensions */
        margin: 5mm; /* Add small margins for better readability */
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        width: 220mm; /* Match the page size */
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

  const consolidatedData = [];

  bookingDetails?.forEach((item) => {
    // Find if there is already an entry with the same facilityId and serviceId
    const existingEntry = consolidatedData.find(
      (entry) =>
        entry.facilityId === item.facilityId &&
        entry.serviceId === item.serviceId
    );

    if (existingEntry) {
      // Push details to the arrays in the existing entry
      existingEntry.details.push({
        serviceVariantId: item.serviceVariantId,
        serviceVariantName: item.serviceVariantName,
        amount: item.amount,
        quantity: item.quantity,
      });
    } else {
      // Create a new entry for the first occurrence
      consolidatedData.push({
        facilityId: item.facilityId,
        serviceId: item.serviceId,
        facilityName: item.facilityName,
        serviceName: item.serviceName,
        details: [
          {
            serviceVariantId: item.serviceVariantId,
            serviceVariantName: item.serviceVariantName,
            amount: item.amount,
            quantity: item.quantity,
            totalAmount: item.totalAmount,
          },
        ],
      });
    }
  });

  return (
    <AdminLayout>

      {isFetchCurrentBookingDetailsLoading?<TransactionProcessingLoader/>:<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Bookings
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <PaymentQR />
            <NavLink
              end
              to="/entity-bookings"
              onClick={() => {
                setIsFirstStepTransaction(false)
                setPaymentStatus({})
                sessionStorage.removeItem("bookingPayload")
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Back
            </NavLink>
          </div>
        </div>
        {/* <div className="flex  justify-center items-center py-4">
        <MdOutlineDownloadDone className="text-green-700 text-2xl " />
            <h1>Payment Succesefull</h1>
          </div> */}
        <div className="flex justify-center gap-4">
          
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handlePrint()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Print QR Code Cards
          </button>
        </div>
        {/* <div className="flex justify-center mb-6">
          <button
            onClick={() => {setIsFirstStepTransaction(false)}}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
           Continue Bookings
          </button>
        </div> */}
        </div>
        <div className="flex justify-center">
          <div
            aria-label="card"
            className="p-2 rounded-2xl bg-white/30 backdrop-blur-sm w-[400px] border printable-card"
          >
            <div
              aria-label="header"
              className="flex items-center rounded-2xl overflow-hidden"
            >
              <div className=" ">
                <QRCodeDisplay
                  binaryQRCode={bookingDetailsResponse?.binaryQRCode}
                />
              </div>
            </div>
            <div
              aria-label="content"
              className="mt-2 grid gap-1 rounded-md overflow-hidden"
            >
              {Array.isArray(consolidatedData) ? (
                consolidatedData.map((item) => (
                  <div key={item.facilityId + item.serviceId}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6", // Equivalent to bg-gray-100
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "1.25rem", // Equivalent to text-sm
                            fontWeight: "500", // Equivalent to font-medium
                          }}
                        >
                          {toTitleCase(item.facilityName) || "N/A"}
                        </h3>
                        <h5
                          style={{
                            fontSize: "1rem", // Equivalent to text-xs
                          }}
                        >
                          {toTitleCase(item.serviceName) || "N/A"}
                        </h5>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            paddingTop: "0.5rem",
                            borderTop: "1px solid #e5e7eb", // Equivalent to divide-gray-200
                          }}
                        >
                          {item.details.map((detail, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: "0.5rem",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.875rem", // Equivalent to text-sm
                                  fontWeight: "400", // Equivalent to font-normal
                                }}
                              >
                                Ticket Type:{" "}
                                {toTitleCase(detail?.serviceVariantName) ||
                                  "N/A"}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "400",
                                }}
                              >
                                Total:{" "}
                                {formatToCurrency(
                                  detail?.amount * detail?.quantity
                                ) || "N/A"}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "400",
                                }}
                              >
                                Qnty: {detail?.quantity || "N/A"}
                              </span>
                            </div>
                          ))}
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
        </div>
      </div>}
    </AdminLayout>
  );
}
