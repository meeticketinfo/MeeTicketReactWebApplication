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
import NzpLogo from "../../../images/NzpHydLogo.jpg";
import TransactionProcessingLoader from "../../../components/bookings_management/TransactionProcessingLoader";
import useAuthStore from "../../../store/authStore";

const normalizeText = (value) => String(value || "").trim();

const isTestZooPark = (parkName) =>
  normalizeText(parkName).toLowerCase() === "test zoo park";

const NZP_TICKET_TERMS = [
  "Tickets once issued will not be cancelled or refunded or transferred to another date.",
  "Safari waiting time is a minimum of 30 minutes.",
  "Visitors must enter the safari before 4:00 PM. The last safari vehicle departs at 4:30 PM.",
  "E-ticket is valid up to 4:00 PM for the selected date.",
  "Zoo Park will be closed by 5:30 PM.",
  "BOV Non-Exclusive and BOV Exclusive bookings will be closed by 4:00 PM. Kindly avail the booking before the closing time.",
  "Battery Operated Vehicle (BOV) rides are subject to availability; exclusive BOV waiting time is a minimum of 1 hour.",
];

const formatBookingDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).replace("T", " ").slice(0, 16);
  }
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};

const isAdultVariant = (bookingType = "") => {
  const type = normalizeText(bookingType).toLowerCase();
  return /\badult\b/.test(type) && !/\bchild\b/.test(type);
};

const isChildVariant = (bookingType = "") => {
  const type = normalizeText(bookingType).toLowerCase();
  return /\bchild\b/.test(type) || /\bchildren\b/.test(type);
};

/** Pivot Adult / Children quantities per ticket type (sub facility) */
const buildAdultChildSummaryRows = (bookingDetails = []) => {
  const groups = new Map();

  bookingDetails.forEach((item, index) => {
    const qty = Number(item?.quantity) || 0;
    if (qty <= 0) return;

    const variant = item?.serviceVariantName;
    const baseType =
      normalizeText(item?.serviceName) ||
      normalizeText(item?.facilityName) ||
      "N/A";
    // Adult/Child share one ticket-type row; other variants keep their own row
    const ticketType =
      isAdultVariant(variant) || isChildVariant(variant)
        ? baseType
        : normalizeText(variant) || baseType;
    const key = ticketType.toLowerCase();

    if (!groups.has(key)) {
      groups.set(key, {
        key: `${key}-${item?.serviceId || index}`,
        ticketType,
        adultCount: 0,
        childCount: 0,
      });
    }

    const row = groups.get(key);
    if (isAdultVariant(variant)) {
      row.adultCount += qty;
    } else if (isChildVariant(variant)) {
      row.childCount += qty;
    } else {
      row.adultCount += qty;
    }
  });

  return Array.from(groups.values());
};

const normalizePaymentType = (value) => {
  const raw = normalizeText(value);
  if (!raw) return "N/A";
  const lower = raw.toLowerCase();
  if (lower.includes("upi")) return "UPI";
  if (lower.includes("pos") || lower.includes("card")) return "POS";
  if (lower.includes("cash")) return "Cash";
  return raw.toUpperCase();
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

  const adultChildSummaryRows = useMemo(
    () => buildAdultChildSummaryRows(bookingDetails || []),
    [bookingDetails]
  );

  const parkLocation =
    bookingDetailsResponse?.parkLocation ||
    bookingDetailsResponse?.cityState ||
    bookingDetailsResponse?.address ||
    "Hyderabad - Telangana";

  const BookedByCounterName = bookingDetailsResponse?.BookedByCounterName|| "N/A";

  // Booking ID – current API fields
  const bookingId =
    bookingDetailsResponse?.referenceId ||
    bookingDetailsResponse?.bookingId ||
    bookingDetailsResponse?.id ||
    "N/A";

  // Order ID / Trans ID – separate field; not in API yet, will come later
  const orderOrTransId = bookingDetailsResponse?.OrderId || "N/A";

  const transactionStatus =
    bookingDetailsResponse?.transactionStatus ||
    bookingDetailsResponse?.TransactionStatus ||
    "SUCCESS";

  const paymentType = normalizePaymentType(
    bookingDetailsResponse?.PaymentType || "N/A"
  );

  const totalAmount =
    bookingDetailsResponse?.totalAmount ??
    bookingDetailsResponse?.amount ??
    bookingDetailsResponse?.TotalAmount ??
    (bookingDetails || []).reduce(
      (sum, item) =>
        sum +
        (Number(item?.totalAmount) ||
          (Number(item?.amount) || 0) * (Number(item?.quantity) || 0)),
      0
    );

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
        font-family: Tahoma, Geneva, Verdana, sans-serif;
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
        font-family: Tahoma, Geneva, Verdana, sans-serif;
        font-size: 11.5px;
        line-height: 1.45;
        letter-spacing: 0.15px;
      }
      .nzp-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 3px;
        margin-bottom: 4px;
      }
      .nzp-header .nzp-header-logo-left {
        flex: 0 0 28mm;
        width: 28mm;
        height: 18mm;
        object-fit: contain;
        object-position: left center;
        display: block;
      }
      .nzp-header .nzp-header-logo-right {
        flex: 0 0 16mm;
        width: 16mm;
        height: 16mm;
        object-fit: contain;
        object-position: right center;
        display: block;
      }
      .nzp-header .nzp-header-mid {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-width: 0;
        padding: 0 2px;
      }
      .nzp-ticket h1.park-name {
        margin: 0;
        font-size: 9.5px;
        font-weight: 800;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.2px;
        line-height: 1.15;
        color: #000;
      }
      .nzp-ticket .park-location {
        margin: 1px 0 0;
        text-align: center;
        font-size: 7.5px;
        font-weight: 600;
        color: #222;
        line-height: 1.15;
      }
      .nzp-ticket .ticket-title {
        margin: 4px 0 6px;
        font-size: 17px;
        font-weight: 800;
        text-align: center;
        color: #0f7a2f;
        text-transform: uppercase;
        letter-spacing: 0.7px;
      }
      .nzp-ticket .divider {
        border: none;
        border-top: 1.5px solid #000;
        margin: 6px 0;
      }
      .nzp-ticket .info-row {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin: 3px 0;
        font-size: 11px;
        flex-wrap: nowrap;
        white-space: nowrap;
      }
      .nzp-ticket .info-label {
        flex: 0 0 auto;
        min-width: 0;
        font-weight: 800;
        white-space: nowrap;
        color: #000;
      }
      .nzp-ticket .info-value {
        flex: 1 1 auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
        color: #111;
      }
      .nzp-ticket .info-id-value {
        font-size: 9.5px;
        letter-spacing: -0.1px;
      }
      .nzp-ticket .section-title {
        margin: 8px 0 4px;
        font-size: 12px;
        font-weight: 800;
        text-align: left;
        text-transform: uppercase;
        color: #000;
      }
      .nzp-summary-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 10.5px;
      }
      .nzp-summary-table th,
      .nzp-summary-table td {
        border: 1.5px solid #000;
        padding: 4px 3px;
        vertical-align: middle;
        word-break: break-word;
      }
      .nzp-summary-table th {
        font-weight: 800;
        text-align: center;
        background: #f3f4f6;
      }
      .nzp-summary-table td.label {
        text-align: left;
        font-weight: 700;
      }
      .nzp-summary-table td.count {
        text-align: center;
        font-weight: 700;
      }
      .nzp-qr-wrap {
        text-align: center;
        margin: 4px 0 6px;
      }
      .nzp-qr-wrap img {
        width: 40mm !important;
        height: 40mm !important;
        max-width: 40mm !important;
        object-fit: contain;
        margin: 0 auto;
        display: block;
      }
      .nzp-empty {
        text-align: center;
        font-size: 10px;
        padding: 6px 0;
      }
      .nzp-terms {
        margin-top: 8px;
        padding-top: 4px;
        border-top: 1px dashed #000;
        font-size: 9.5px;
        line-height: 1.4;
        color: #000;
      }
      .nzp-terms-title {
        font-weight: 800;
        font-size: 11px;
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      .nzp-terms ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .nzp-terms li {
        margin: 0 0 3px;
        font-weight: 600;
      }
      .nzp-terms .nzp-term-dot {
        font-weight: 800;
        margin-right: 2px;
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
            font-family: Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            line-height: 1.45;
            letter-spacing: 0.15px;
          }
          .nzp-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            margin-bottom: 6px;
          }
          .nzp-header .nzp-header-logo-left {
            flex: 0 0 120px;
            width: 120px;
            height: 72px;
            object-fit: contain;
            object-position: left center;
            display: block;
          }
          .nzp-header .nzp-header-logo-right {
            flex: 0 0 68px;
            width: 68px;
            height: 68px;
            object-fit: contain;
            object-position: right center;
            display: block;
          }
          .nzp-header .nzp-header-mid {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-width: 0;
            padding: 0 4px;
          }
          .nzp-ticket h1.park-name {
            margin: 0;
            font-size: 12px;
            font-weight: 800;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.25px;
            line-height: 1.15;
            color: #000;
          }
          .nzp-ticket .park-location {
            margin: 2px 0 0;
            text-align: center;
            font-size: 9px;
            font-weight: 600;
            color: #222;
            line-height: 1.15;
          }
          .nzp-ticket .ticket-title {
            margin: 6px 0 8px;
            font-size: 22px;
            font-weight: 800;
            text-align: center;
            color: #0f7a2f;
            text-transform: uppercase;
            letter-spacing: 0.7px;
          }
          .nzp-ticket .divider {
            border: none;
            border-top: 2px solid #000;
            margin: 8px 0;
          }
          .nzp-ticket .info-row {
            display: flex;
            align-items: baseline;
            gap: 4px;
            margin: 4px 0;
            font-size: 13px;
            flex-wrap: nowrap;
            white-space: nowrap;
          }
          .nzp-ticket .info-label {
            flex: 0 0 auto;
            min-width: 0;
            font-weight: 800;
            white-space: nowrap;
            color: #000;
          }
          .nzp-ticket .info-value {
            flex: 1 1 auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
            color: #111;
          }
          .nzp-ticket .info-id-value {
            font-size: 11px;
            letter-spacing: -0.1px;
          }
          .nzp-ticket .section-title {
            margin: 12px 0 6px;
            font-size: 14px;
            font-weight: 800;
            text-align: left;
            text-transform: uppercase;
            color: #000;
          }
          .nzp-summary-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 12px;
          }
          .nzp-summary-table th,
          .nzp-summary-table td {
            border: 1.5px solid #000;
            padding: 6px 4px;
            vertical-align: middle;
            word-break: break-word;
          }
          .nzp-summary-table th {
            font-weight: 800;
            text-align: center;
            background: #f3f4f6;
          }
          .nzp-summary-table td.label {
            text-align: left;
            font-weight: 700;
          }
          .nzp-summary-table td.count {
            text-align: center;
            font-weight: 700;
          }
          .nzp-qr-wrap {
            text-align: center;
            margin: 4px 0 10px;
          }
          .nzp-empty {
            text-align: center;
            font-size: 12px;
            padding: 8px 0;
            color: #374151;
          }
          .nzp-terms {
            margin-top: 14px;
            padding-top: 8px;
            border-top: 1px dashed #000;
            font-size: 11px;
            line-height: 1.45;
            color: #000;
          }
          .nzp-terms-title {
            font-weight: 800;
            font-size: 13px;
            margin-bottom: 6px;
            text-transform: uppercase;
          }
          .nzp-terms ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .nzp-terms li {
            margin: 0 0 4px;
            font-weight: 600;
          }
          .nzp-terms .nzp-term-dot {
            font-weight: 800;
            margin-right: 2px;
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
                style={{ width: 440 }}
              >
                <div className="nzp-ticket">
                  <div className="nzp-header">
                    <img
                      className="nzp-header-logo-left"
                      src={NzpLogo}
                      alt="NZP Hyd"
                    />
                    <div className="nzp-header-mid">
                      <h1 className="park-name">
                        {String(parkName).toUpperCase()}
                      </h1>
                      <div className="park-location">{parkLocation}</div>
                    </div>
                    <img
                      className="nzp-header-logo-right"
                      src={Logo}
                      alt="Mee Ticket"
                    />
                  </div>
                  <div className="ticket-title">QR Ticket</div>
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
                  <hr className="divider" />

                  <div className="info-row">
                    <span className="info-label">Booking Date</span>
                    <span className="info-value">
                      :{" "}
                      {formatBookingDateTime(
                        bookingDetailsResponse?.bookingDate
                      )}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Counter</span>
                    <span className="info-value">: {BookedByCounterName || "N/A"}</span>
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
                    <span className="info-value info-id-value">
                      : {bookingId || "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Order ID / Trans ID</span>
                    <span className="info-value info-id-value">
                      : {orderOrTransId || "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Transaction Status</span>
                    <span className="info-value">
                      : {String(transactionStatus || "N/A").toUpperCase()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Payment Type</span>
                    <span className="info-value">: {paymentType}</span>
                  </div>

                  <div className="section-title">Ticket Summary</div>
                  {adultChildSummaryRows.length > 0 ? (
                    <table className="nzp-summary-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40%" }}>Ticket Type</th>
                          <th style={{ width: "30%" }}>No. of Adult</th>
                          <th style={{ width: "30%" }}>No. of Children</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adultChildSummaryRows.map((row) => (
                          <tr key={row.key}>
                            <td className="label">
                              {toTitleCase(row.ticketType) || row.ticketType}
                            </td>
                            <td className="count">{row.adultCount}</td>
                            <td className="count">{row.childCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="nzp-empty">No booking types available.</div>
                  )}

                  <div className="nzp-terms">
                    <div className="nzp-terms-title">Terms & Conditions</div>
                    <ul>
                      {NZP_TICKET_TERMS.map((term) => (
                        <li key={term}>
                          <span aria-hidden="true" className="nzp-term-dot">
                            •{" "}
                          </span>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
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
