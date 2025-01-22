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
import Logo from "../../../images/MeeTicketLogo.svg";
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
    setIsBookingFormVisible,
    isCompleteBookings,
    setisCompleteBookings
  } = useBookingsStore();
  console.log(
    "isFetchCurrentBookingDetailsLoading",
    isFetchCurrentBookingDetailsLoading
  );
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
      console.log(content);
    });

    // Define styles for the handheld printer
    const printStyles = `
    <style>
      @page {
        size: 80mm auto; /* Adjust the width and height for ticket dimensions */
        margin: 0mm auto; /* Add small margins for better readability */
      }
      body {
        font-family: "Verdana";
        margin: 0;
        padding: 0;
        width: 220mm;
      }
      .printable-card {
        width: 100%; /* Fit within the 58mm width */
        padding: 3mm;
        margin-bottom: 3mm;
        page-break-inside: avoid;
   
        margin: 0 auto; 
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
      {isFetchCurrentBookingDetailsLoading ? (
        <TransactionProcessingLoader />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
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
                to={isCompleteBookings?"/completed-bookings":"/entity-bookings"}
                onClick={() => {
                  // setisCompleteBookings(false)
                  setIsFirstStepTransaction(false);
                  setPaymentStatus({});
                  sessionStorage.removeItem("bookingPayload");
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
              className="p-2 rounded-2xl bg-white/30 backdrop-blur-sm w-[400px] printable-card"
              style={{ width: 700 }}
            >
              <div style={{ textAlign: "center" }}>
                <img
                  src={Logo}
                  width={100}
                  height={100}
                  style={{ margin: "0 auto" }}
                />
              </div>
              <h2
                style={{
                  fontSize: 30,
                  color: "green",
                  textAlign: "center",
                  fontWeight: "600",
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                Ticket
              </h2>
              <div
                aria-label="header"
                className="flex items-center rounded-2xl border"
                style={{ width: 400, margin: "0 auto" }}
              >
                <div
                  className="backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent background
                  }}
                >
                  <QRCodeDisplay
                    binaryQRCode={bookingDetailsResponse?.binaryQRCode}
                  />
                </div>
              </div>

              <div
                aria-label="content"
                style={{ padding: 20 }}
                className="mt-2 grid gap-1 rounded-md overflow-hidden"
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 20 }}>
                    <span
                      style={{
                        color: "#4b5563",
                        paddingLeft: 10,
                        paddingTop: 15,
                        fontWeight: 700,
                      }}
                    >
                      Booking Date
                    </span>{" "}
                    <span
                      style={{
                        color: "#000",
                        paddingLeft: 10,
                        paddingTop: 15,
                        fontWeight: 800,
                      }}
                    >
                      : {bookingDetailsResponse?.bookingDate || "N/A"}
                    </span>
                  </div>
                  <div style={{ fontSize: 20 }}>
                    <span
                      style={{
                        color: "#4b5563",
                        paddingLeft: 10,
                        paddingTop: 15,
                        fontWeight: 700,
                      }}
                    >
                      Booking ID
                    </span>{" "}
                    <span
                      style={{
                        color: "#000",
                        paddingLeft: 10,
                        paddingTop: 15,
                        fontWeight: 700,
                      }}
                    >
                      : {bookingDetailsResponse?.referenceId ?bookingDetailsResponse?.referenceId:bookingDetailsResponse?.paymentOrderId||"N/A"}
                    </span>
                  </div>
                </div>
                <table
                  width={"100%"}
                  style={{
                    borderSpacing: 10,
                    fontSize: 23,
                    marginBottom: 20,
                    borderBottom: "1px solid #000",
                  }}
                >
                  {Array.isArray(consolidatedData) ? (
                    consolidatedData.map((item) => (
                      <tbody>
                        <>
                          <tr key={item.facilityId + item.serviceId}>
                            <td
                              style={{
                                color: "#4b5563",
                                paddingLeft: 10,
                                paddingTop: 15,
                                fontWeight: 700,
                              }}
                            >
                              Facility
                            </td>
                            <td style={{ color: "black", paddingTop: 15 }}>
                              : {toTitleCase(item.facilityName) || "N/A"}
                            </td>
                          </tr>
                          <tr key={item.facilityId + item.serviceId}>
                            <td
                              style={{
                                color: "#4b5563",
                                paddingLeft: 10,
                                fontWeight: 700,
                              }}
                            >
                              SubFacility
                            </td>
                            <td style={{ color: "black" }}>
                              : {toTitleCase(item.serviceName) || "N/A"}
                            </td>
                          </tr>
                          {item.details.map((detail, index) => (
                            <>
                              <tr>
                                <td
                                  style={{
                                    color: "#4b5563",
                                    paddingLeft: 10,
                                    fontWeight: 700,
                                  }}
                                >
                                  Ticket Type
                                </td>
                                <td style={{ color: "black" }}>
                                  :{" "}
                                  {toTitleCase(detail?.serviceVariantName) ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    color: "#4b5563",
                                    paddingLeft: 10,
                                    fontWeight: 700,
                                  }}
                                >
                                  Qty
                                </td>
                                <td style={{ color: "black" }}>
                                  : {detail?.quantity || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    color: "black",
                                    padding: 5,
                                    fontSize: 20,
                                    fontWeight: "bold",
                                  }}
                                >
                                  Total
                                </td>
                                <td
                                  style={{
                                    color: "black",
                                    padding: 5,
                                    fontSize: 20,
                                    fontWeight: "bold",
                                  }}
                                >
                                  :{" "}
                                  {formatToCurrency(
                                    detail?.amount * detail?.quantity
                                  ) || "N/A"}
                                </td>
                              </tr>
                            </>
                          ))}
                        </>
                      </tbody>
                    ))
                  ) : (
                    <p className="text-gray-200">
                      No booking details available.
                    </p>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
