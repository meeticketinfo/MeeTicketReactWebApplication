import { Fragment, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";
import QRCodeDisplay from "./QrCodeDisplay";
import { formatToCurrency, toTitleCase } from "../../../utils/TypographyHelper";
import { PaymentQR } from "./PaymentQR";
import Logo from "../../../images/MeeTicketLogo.svg";
import TransactionProcessingLoader from "../../../components/bookings_management/TransactionProcessingLoader";
import useAuthStore from "../../../store/authStore";

const normalizeText = (value) => String(value || "").trim();

const isTestZooPark = (parkName) =>
  normalizeText(parkName).toLowerCase() === "test zoo park";

const formatBookingDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).split("T")[0];
  }
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const buildBookingTypeRows = (bookingDetails = []) => {
  const rows = [];

  bookingDetails.forEach((item, index) => {
    const qty = Number(item?.quantity) || 0;
    if (qty <= 0) return;

    rows.push({
      key: `${item?.facilityId || ""}-${item?.serviceId || ""}-${
        item?.serviceVariantId || index
      }`,
      facilityName: normalizeText(item?.facilityName) || "N/A",
      serviceName: normalizeText(item?.serviceName) || "N/A",
      bookingType: normalizeText(item?.serviceVariantName) || "N/A",
      quantity: qty,
      totalAmount:
        Number(item?.totalAmount) ||
        (Number(item?.amount) || 0) * qty,
    });
  });

  return rows;
};

const getBookingTypeSortOrder = (bookingType = "") => {
  const type = normalizeText(bookingType).toLowerCase();
  if (/\badult\b/.test(type) && !/\bchild\b/.test(type)) return 0;
  if (/\bchild\b/.test(type) || /\bchildren\b/.test(type)) return 1;
  return 2; // other types after Adult/Child
};

/** Group rows by Sub Facility (serviceName) for rowSpan table layout */
const groupBookingRowsBySubFacility = (rows = []) => {
  const groups = [];
  const indexByService = new Map();

  rows.forEach((row) => {
    const groupKey = row.serviceName.toLowerCase();
    if (!indexByService.has(groupKey)) {
      indexByService.set(groupKey, groups.length);
      groups.push({
        serviceName: row.serviceName,
        items: [row],
      });
    } else {
      groups[indexByService.get(groupKey)].items.push(row);
    }
  });

  // Adult first, then Child, then other booking types
  groups.forEach((group) => {
    group.items.sort(
      (a, b) =>
        getBookingTypeSortOrder(a.bookingType) -
        getBookingTypeSortOrder(b.bookingType)
    );
  });

  return groups;
};

export default function BookingDetails() {
  const { id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingDetailsResponse, setBookingDetailsResponse] = useState(null);

  const {
    fetchCurrentBookingDetailsByBookingId,
    isFetchCurrentBookingDetailsLoading,
    setIsFirstStepTransaction,
    isCompletedZooCounterBookings,
    isCompleteBookings,
    setCheckPosTsxStatusData,
    PosPaymentTransactionNAvigate,
    PaymentTransactionNAvigate,
    PosIndividualNAvigate,
    setPaymentStatus,
  } = useBookingsStore();

  const { roleDetails, decodedTokenData } = useAuthStore();
  const role = roleDetails?.name;

  useEffect(() => {
    fetchQRsForBooking(id);
  }, []);

  const fetchQRsForBooking = async (bookingId) => {
    try {
      const result = await fetchCurrentBookingDetailsByBookingId(bookingId);
      if (result && result.data && result.data.status === 200) {
        setBookingDetails(result.data.data.data.bookingDetails);
        setBookingDetailsResponse(result.data.data.data);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      handleApiError(xhr);
    }
  };

  const parkName =
    bookingDetailsResponse?.parkName ||
    bookingDetailsResponse?.ParkName ||
    bookingDetailsResponse?.locationName ||
    decodedTokenData?.data?.ParkName ||
    "";

  const useNewTicketPrint = isTestZooPark(parkName);

  const bookingTypeRows = useMemo(
    () => buildBookingTypeRows(bookingDetails || []),
    [bookingDetails]
  );

  const bookingTypeGroups = useMemo(
    () => groupBookingRowsBySubFacility(bookingTypeRows),
    [bookingTypeRows]
  );

  const parkLocation =
    bookingDetailsResponse?.parkLocation ||
    bookingDetailsResponse?.cityState ||
    bookingDetailsResponse?.address ||
    "Hyderabad - Telangana";

  const counterId =
    bookingDetailsResponse?.counterId ||
    bookingDetailsResponse?.counterName ||
    bookingDetailsResponse?.CounterId ||
    bookingDetailsResponse?.CounterName ||
    bookingDetailsResponse?.deskName ||
    decodedTokenData?.data?.UserName ||
    decodedTokenData?.data?.CounterName ||
    "N/A";

  const bookingId =
    bookingDetailsResponse?.referenceId ||
    bookingDetailsResponse?.bookingId ||
    bookingDetailsResponse?.id ||
    "N/A";

  const transactionStatus =
    bookingDetailsResponse?.transactionStatus ||
    bookingDetailsResponse?.TransactionStatus ||
    bookingDetailsResponse?.paymentStatus ||
    bookingDetailsResponse?.PaymentStatus ||
    bookingDetailsResponse?.status ||
    "SUCCESS";

  const totalAmount =
    bookingDetailsResponse?.totalAmount ??
    bookingDetailsResponse?.amount ??
    bookingDetailsResponse?.TotalAmount ??
    bookingTypeRows.reduce((sum, row) => sum + (row.totalAmount || 0), 0);

  // Existing (legacy) consolidated layout data
  const consolidatedData = [];
  bookingDetails?.forEach((item) => {
    const existingEntry = consolidatedData.find(
      (entry) =>
        entry.facilityId === item.facilityId &&
        entry.serviceId === item.serviceId
    );

    if (existingEntry) {
      existingEntry.details.push({
        serviceVariantId: item.serviceVariantId,
        serviceVariantName: item.serviceVariantName,
        amount: item.amount,
        quantity: item.quantity,
      });
    } else {
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

  const grandTotal = consolidatedData?.reduce((sum, item) => {
    return (
      sum +
      item.details?.reduce(
        (detailSum, detail) =>
          detailSum +
          (detail.totalAmount || detail.amount * detail.quantity || 0),
        0
      )
    );
  }, 0);

  const handlePrint = () => {
    const printContents = document.querySelectorAll(".printable-card");
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print the ticket.");
      return;
    }

    let content = "";
    printContents.forEach((card) => {
      content += card.outerHTML;
    });

    const legacyPrintStyles = `
    <style>
      @page {
        size: 80mm auto;
        margin: 0mm auto;
      }
      body {
        font-family: "Verdana";
        margin: 0;
        padding: 0;
        width: 220mm;
      }
      .printable-card {
        width: 100%;
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

    const newPrintStyles = `
    <style>
      @page {
        size: 80mm auto;
        margin: 2mm;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
        color: #000;
        background: #fff;
      }
      .printable-card {
        width: 76mm;
        max-width: 76mm;
        margin: 0 auto;
        padding: 2mm;
        page-break-inside: avoid;
      }
      .nzp-ticket {
        width: 100%;
        color: #000;
        font-size: 11px;
        line-height: 1.35;
      }
      .nzp-logo-wrap {
        text-align: center;
        margin-bottom: 4px;
      }
      .nzp-logo-wrap img {
        width: 28mm !important;
        height: auto !important;
        margin: 0 auto;
        display: block;
      }
      .nzp-ticket .ticket-title {
        margin: 2px 0 8px;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        color: #15803d;
        text-transform: uppercase;
      }
      .nzp-ticket h1.park-name {
        margin: 6px 0 0;
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
      }
      .nzp-ticket .park-location {
        margin: 2px 0 6px;
        text-align: center;
        font-size: 11px;
      }
      .nzp-ticket .divider {
        border: none;
        border-top: 1px solid #000;
        margin: 6px 0;
      }
      .nzp-ticket .info-row {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin: 2px 0;
        font-size: 11px;
        flex-wrap: nowrap;
      }
      .nzp-ticket .info-label {
        flex: 0 0 auto;
        min-width: 95px;
        font-weight: 600;
        white-space: nowrap;
      }
      .nzp-ticket .info-value {
        flex: 1 1 auto;
        white-space: nowrap;
        overflow: visible;
      }
      .nzp-ticket .booking-id-value {
        white-space: nowrap !important;
        font-size: 9px;
        letter-spacing: -0.2px;
      }
      .nzp-ticket .section-title {
        margin: 8px 0 4px;
        font-size: 12px;
        font-weight: 700;
        text-align: left;
      }
      .nzp-summary-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 10px;
      }
      .nzp-summary-table th,
      .nzp-summary-table td {
        border: 1px solid #000;
        padding: 3px 4px;
        vertical-align: middle;
        word-break: break-word;
      }
      .nzp-summary-table th {
        font-weight: 700;
        text-align: center;
        background: #fff;
      }
      .nzp-summary-table td.label {
        text-align: left;
      }
      .nzp-summary-table td.count {
        text-align: center;
      }
      .nzp-qr-wrap {
        text-align: center;
        margin: 4px 0 8px;
      }
      .nzp-qr-wrap img {
        width: 42mm !important;
        height: 42mm !important;
        max-width: 42mm !important;
        object-fit: contain;
        margin: 0 auto;
        display: block;
      }
      .nzp-empty {
        text-align: center;
        font-size: 10px;
        padding: 6px 0;
      }
    </style>
  `;

    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <title>Ticket</title>
        ${useNewTicketPrint ? newPrintStyles : legacyPrintStyles}
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
    printWindow.document.close();

    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
    };
    const images = printWindow.document.images;
    if (!images.length) {
      triggerPrint();
      return;
    }
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded >= images.length) triggerPrint();
    };
    Array.from(images).forEach((img) => {
      if (img.complete) done();
      else {
        img.onload = done;
        img.onerror = done;
      }
    });
  };

  const backLink =
    PosIndividualNAvigate
      ? "/pos-individual-booking-reports"
      : PosPaymentTransactionNAvigate
      ? "/pos-payment-transactions-reports"
      : isCompletedZooCounterBookings
      ? "/pos-consolidated-booking-reports"
      : PaymentTransactionNAvigate
      ? "/payment-transaction-report"
      : isCompleteBookings
      ? "/completed-bookings"
      : role === "ROLE_ZOOPARKADMIN"
      ? "/book-tickets"
      : "/entity-bookings";

  return (
    <AdminLayout>
      {useNewTicketPrint && (
        <style>{`
          .nzp-ticket {
            width: 100%;
            color: #000;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.35;
          }
          .nzp-logo-wrap {
            text-align: center;
            margin-bottom: 4px;
          }
          .nzp-logo-wrap img {
            width: 100px;
            height: auto;
            margin: 0 auto;
            display: block;
          }
          .nzp-ticket .ticket-title {
            margin: 2px 0 8px;
            font-size: 22px;
            font-weight: 700;
            text-align: center;
            color: #15803d;
            text-transform: uppercase;
          }
          .nzp-ticket h1.park-name {
            margin: 8px 0 0;
            font-size: 14px;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
          }
          .nzp-ticket .park-location {
            margin: 2px 0 6px;
            text-align: center;
            font-size: 12px;
          }
          .nzp-ticket .divider {
            border: none;
            border-top: 1px solid #000;
            margin: 6px 0;
          }
          .nzp-ticket .info-row {
            display: flex;
            align-items: baseline;
            gap: 4px;
            margin: 2px 0;
            font-size: 12px;
            flex-wrap: nowrap;
          }
          .nzp-ticket .info-label {
            flex: 0 0 auto;
            min-width: 110px;
            font-weight: 600;
            white-space: nowrap;
          }
          .nzp-ticket .info-value {
            flex: 1 1 auto;
            white-space: nowrap;
          }
          .nzp-ticket .booking-id-value {
            white-space: nowrap !important;
            font-size: 11px;
            letter-spacing: -0.2px;
          }
          .nzp-ticket .section-title {
            margin: 8px 0 4px;
            font-size: 13px;
            font-weight: 700;
            text-align: left;
          }
          .nzp-summary-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 11px;
          }
          .nzp-summary-table th,
          .nzp-summary-table td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: middle;
            word-break: break-word;
          }
          .nzp-summary-table th {
            font-weight: 700;
            text-align: center;
            background: #fff;
          }
          .nzp-summary-table td.label {
            text-align: left;
          }
          .nzp-summary-table td.count {
            text-align: center;
          }
          .nzp-qr-wrap {
            text-align: center;
            margin: 4px 0 10px;
          }
          .nzp-empty {
            text-align: center;
            font-size: 11px;
            padding: 8px 0;
            color: #4b5563;
          }
        `}</style>
      )}
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
                to={backLink}
                onClick={() => {
                  setIsFirstStepTransaction(false);
                  setPaymentStatus({});
                  setCheckPosTsxStatusData([]);
                  sessionStorage.removeItem("bookingPayload");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                Back
              </NavLink>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => handlePrint()}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                Print QR Code Cards
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            {useNewTicketPrint ? (
              /* ========== NEW print layout: TEST ZOO PARK only ========== */
              <div
                aria-label="card"
                className="p-3 rounded-md bg-white border border-gray-300 printable-card"
                style={{ width: 380 }}
              >
                <div className="nzp-ticket">
                  <div className="nzp-logo-wrap">
                    <img src={Logo} alt="Mee Ticket" />
                  </div>
                  <div className="ticket-title">Ticket</div>
                  <div className="nzp-qr-wrap">
                    <div
                      style={{
                        width: 200,
                        margin: "0 auto",
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        padding: 4,
                      }}
                    >
                      <QRCodeDisplay
                        binaryQRCode={bookingDetailsResponse?.binaryQRCode}
                      />
                    </div>
                  </div>

                  <h1 className="park-name">
                    {String(parkName).toUpperCase()}
                  </h1>
                  <div className="park-location">{parkLocation}</div>
                  <hr className="divider" />
{/* 
                  <div className="info-row">
                    <span className="info-label">Counter Id</span>
                    <span className="info-value">: {counterId || "N/A"}</span>
                  </div> */}
                  <div className="info-row">
                    <span className="info-label">Booking Date</span>
                    <span className="info-value">
                      : {formatBookingDate(bookingDetailsResponse?.bookingDate)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Amount ₹</span>
                    <span className="info-value">
                      :{" "}
                      {totalAmount !== undefined && totalAmount !== null
                        ? Number(totalAmount).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Booking ID</span>
                    <span className="info-value booking-id-value">
                      : {bookingId || "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Transaction Status</span>
                    <span className="info-value">
                      : {String(transactionStatus || "N/A").toUpperCase()}
                    </span>
                  </div>

                  <div className="section-title">Ticket Summary</div>
                  {bookingTypeGroups.length > 0 ? (
                    <table className="nzp-summary-table">
                      <thead>
                        <tr>
                          <th style={{ width: "34%" }}>Sub Facility</th>
                          <th style={{ width: "40%" }}>Booking Type</th>
                          <th style={{ width: "26%" }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingTypeGroups.map((group) =>
                          group.items.map((row, itemIndex) => (
                            <tr key={row.key}>
                              {itemIndex === 0 && (
                                <td
                                  className="label"
                                  rowSpan={group.items.length}
                                  style={{
                                    verticalAlign: "middle",
                                    fontWeight: 600,
                                  }}
                                >
                                  {toTitleCase(group.serviceName) ||
                                    group.serviceName}
                                </td>
                              )}
                              <td className="label">
                                {toTitleCase(row.bookingType) ||
                                  row.bookingType}
                              </td>
                              <td className="count">{row.quantity}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="nzp-empty">No booking types available.</div>
                  )}
                </div>
              </div>
            ) : (
              /* ========== EXISTING print layout (all other parks) ========== */
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
                    alt="Mee Ticket"
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
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
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
                    <div style={{ fontSize: 20, whiteSpace: "nowrap" }}>
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        :{" "}
                        {bookingDetailsResponse?.referenceId ||
                          bookingDetailsResponse?.id ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                  <table
                    width={"100%"}
                    style={{
                      borderSpacing: 10,
                      fontSize: 23,
                      marginBottom: 20,
                    }}
                  >
                    <tbody>
                      {Array.isArray(consolidatedData) &&
                        consolidatedData.map((item) => (
                          <Fragment
                            key={`${item.facilityId}-${item.serviceId}`}
                          >
                            <tr>
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
                            <tr>
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
                              <Fragment
                                key={`${item.serviceId}-detail-${index}`}
                              >
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
                              </Fragment>
                            ))}
                          </Fragment>
                        ))}
                      <tr
                        style={{
                          border: "0px solid black",
                          background: "#D3D3D3",
                        }}
                      >
                        <td
                          style={{
                            color: "black",
                            padding: 5,
                            fontSize: 22,
                            fontWeight: "bold",
                          }}
                        >
                          Grand Total
                        </td>
                        <td
                          style={{
                            color: "black",
                            padding: 5,
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                        >
                          : {formatToCurrency(grandTotal) || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
