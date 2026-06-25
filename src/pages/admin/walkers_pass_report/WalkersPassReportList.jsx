import { useEffect, useState } from "react";
import AgGridTable4 from "../../../components/tables/AgGridTable4";
import { formatToStandardDate, getCurrentDate } from "../../../utils/TypographyHelper";
import WalkersPassReportForm from "./WalkersPassReportForm";
import { useWalkersPassReportStore } from "./WalkersPassReportStore";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import { useNavigate } from "react-router-dom";
import { useWalkerpassStore } from "../../../components/book_walker_pass/WalkerpassStore";
import QRCode from "qrcode";
import { toast } from "react-toastify";
import walkerPassBg from "../../../images/walker_pass_bg.png";
import MeeTicketLogo from "../../../images/MeeTicketLogo.png";
import ForestLogo from "../../../images/ForestLogo.png";



// Status cell renderer component
const StatusCellRenderer = (params) => {
  if (!params.value) return "N/A";

  const status = params.value.toLowerCase();
  const colorClass = status === 'confirmed' ? 'text-green-600' : status === 'expired' ? 'text-red-600' : 'text-gray-600';

  return (
    <span className={`${colorClass} font-medium`}>
      {params.value}
    </span>
  );
};

const getPassUserDetailsId = (passData) =>
  passData?.PassUserDetailsId ||
  passData?.passUserDetailsId ||
  passData?.BookingId;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sanitizeImageSrc = (value) =>
  typeof value === "string" ? value.trim().replace(/(%22|")/g, "") : "";

const isRawBase64Image = (value) =>
  /^[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length > 100;

const getImageUrlCandidates = (url) => {
  if (!url || typeof url !== "string") return [];

  const trimmedUrl = sanitizeImageSrc(url);
  if (!trimmedUrl) return [];

  if (/^data:/i.test(trimmedUrl)) {
    return [trimmedUrl];
  }

  if (isRawBase64Image(trimmedUrl)) {
    return [`data:image/jpeg;base64,${trimmedUrl}`];
  }

  const getLocalProxyUrl = (imageUrl) => {
    if (typeof window === "undefined") return "";

    try {
      const parsedUrl = new URL(imageUrl, window.location.origin);
      const imagePath = parsedUrl.pathname;
      const marker = "/parkapi/WalkerPassParkImages/";

      if (
        window.location.hostname === "localhost" &&
        imagePath.includes(marker)
      ) {
        const fileName = imagePath.split(marker).pop();
        return `/parkapi-image-proxy/${fileName}${parsedUrl.search || ""}`;
      }
    } catch (error) {
      console.error("Invalid bulk pass image URL:", imageUrl, error);
    }

    return "";
  };

  if (/^(blob:|https?:\/\/)/i.test(trimmedUrl)) {
    return [getLocalProxyUrl(trimmedUrl), trimmedUrl].filter(Boolean);
  }

  try {
    const appUrl = new URL(trimmedUrl, window.location.origin).href;
    return [getLocalProxyUrl(appUrl), appUrl].filter(Boolean);
  } catch (error) {
    console.error("Invalid bulk pass image URL:", trimmedUrl, error);
    return [];
  }
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const fetchImageAsDataUrl = async (url) => {
  const imageUrls = getImageUrlCandidates(url);

  for (const imageUrl of imageUrls) {
    if (imageUrl.startsWith("data:")) return imageUrl;

    try {
      const response = await fetch(imageUrl, {
        method: "GET",
        credentials: "omit",
        cache: "no-store",
        headers: {
          Accept: "image/*",
        },
      });

      if (!response.ok) {
        console.error("Bulk image fetch failed:", imageUrl, response.status);
        continue;
      }

      const blob = await response.blob();
      if (blob.size === 0 || (blob.type && !blob.type.startsWith("image/"))) {
        console.error("Bulk image blob is invalid:", imageUrl, blob.type, blob.size);
        continue;
      }

      return await blobToDataUrl(blob);
    } catch (error) {
      console.error("Bulk image fetch error:", imageUrl, error);
    }
  }

  return "";
};

const prepareImageForOutput = async (url) => {
  const dataUrl = await fetchImageAsDataUrl(url);
  if (!dataUrl) return "";

  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width || 1;
  canvas.height = img.naturalHeight || img.height || 1;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", 0.9);
};

const prepareBulkPassImages = async (passes) =>
  Promise.all(
    passes.map(async (pass) => ({
      ...pass,
      preparedUserImage: await prepareImageForOutput(pass?.userImage),
    }))
  );

const fmtDate = (date) => (date ? new Date(date).toLocaleDateString("en-GB") : "-");

const getInstructionLines = (passDescription) => {
  const lines = String(passDescription || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0
    ? lines
    : [
      "Monthly Walker pass Validity is only till the end of the month, irrespective of the date of purchase",
      "Monthly Walker pass Validity is only till 30th of June Next Year, irrespective of the Month of purchase",
      "The Walker pass is only valid once a Day.",
      "Park Timings: Open daily from 06:00 am - 6:00 pm",
    ];
};

const waitForImages = (documentRef) => {
  const images = Array.from(documentRef.images || []);

  return Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });
    })
  );
};

const yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve, 0));

const buildBulkPrintHtml = (passes, qrCodes, { autoPrint = true } = {}) => `
<!doctype html>
<html>
  <head>
    <title>Bulk Walker Pass Print</title>
    <style>
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      body {
        margin: 0;
        padding: 18px;
        font-family: Arial, sans-serif;
        background: #f8fafc !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .pass-sheet {
        width: 372px;
        margin: 0 auto 28px;
        padding: 14px;
        border: 1px dashed #94a3b8;
        border-radius: 14px;
        background: #ffffff !important;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .pass-sheet:not(:last-child) {
        page-break-after: always;
        break-after: page;
      }
      .pass-card {
        width: 340px;
        height: 214px;
        overflow: hidden;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.18);
        background: #ffffff !important;
        display: flex;
        flex-direction: column;
      }
      .pass-card + .pass-card { margin-top: 12px; }
      .card-header {
        background: #091A8C !important;
        color: #ffffff !important;
        padding: 4px 8px;
      }
      .header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .logo-wrap {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background: #ffffff !important;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }
      .logo-wrap img { width: 36px; height: 36px; object-fit: contain; border-radius: 999px; }
      .header-title {
        flex: 1;
        min-width: 0;
        text-align: center;
        padding: 0 6px;
      }
      .header-title h1 {
        margin: 0;
        font-size: 14px;
        line-height: 16px;
        font-weight: 700;
      }
      .header-title p {
        margin: 1px 0 0;
        font-size: 14px;
        line-height: 15px;
        font-weight: 600;
      }
      .card-body {
        flex: 1;
        padding: 8px 12px;
        background-image: url("${walkerPassBg}") !important;
        background-color: #ffffff !important;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .details-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }
      .user-photo {
        width: 95px;
        height: 95px;
        border: 1px solid #d1d5db;
        object-fit: cover;
        background: #ffffff !important;
      }
      .user-copy {
        flex: 1;
        min-width: 0;
        margin: 8px 4px 0 8px;
      }
      .value {
        margin: 0;
        color: #000000;
        font-size: 10px;
        line-height: 12px;
        font-weight: 700;
        text-transform: uppercase;
        word-break: break-word;
      }
      .label {
        margin: 0 0 10px;
        color: #4b5563;
        font-size: 8px;
        line-height: 10px;
      }
      .qr-wrap {
        width: 110px;
        text-align: center;
      }
      .qr-wrap img {
        width: 108px;
        height: 108px;
        object-fit: contain;
      }
      .amount {
        margin-top: 2px;
        font-size: 10px;
        line-height: 12px;
        font-weight: 700;
      }
      .card-footer {
        margin-top: -7px;
        position: relative;
        z-index: 1;
        background: #091A8C !important;
        color: #ffffff !important;
        text-align: center;
        padding: 4px 6px;
        font-size: 8px;
        line-height: 10px;
        font-weight: 700;
      }
      .instruction-header {
        background: #091A8C !important;
        color: #ffffff !important;
        padding: 8px 12px;
      }
      .instruction-header h1 {
        margin: 0;
        font-size: 14px;
        line-height: 18px;
        font-weight: 600;
      }
      .instruction-body {
        flex: 1;
        padding: 12px;
        color: #333333;
        font-size: 7px;
        line-height: 10px;
        font-weight: 700;
        background-image: url("${walkerPassBg}") !important;
        background-color: #ffffff !important;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .terms-title {
        margin: 0 0 4px;
        color: #dc2626 !important;
        font-size: 10px;
        font-weight: 700;
      }
      .instruction-body p { margin: 4px 0 0; }
      @media print {
        body {
          padding: 0;
          background: #ffffff !important;
        }
        .pass-sheet {
          margin-bottom: 0;
          border: 1px solid #cbd5e1;
        }
      }
    </style>
  </head>
  <body>
    ${passes.map((pass, index) => {
      const instructions = getInstructionLines(pass?.passDescription);
      const validity = `${fmtDate(pass?.validFrom)} TO ${fmtDate(pass?.validTo)}`;

      return `
        <section class="pass-sheet">
          <div class="pass-card">
            <div class="card-header">
              <div class="header-row">
                <div class="logo-wrap"><img src="${ForestLogo}" alt="Forest Logo" /></div>
                <div class="header-title">
                  <h1>${escapeHtml(pass?.parkName)}</h1>
                  <p>${escapeHtml(pass?.passName)}</p>
                </div>
                <div class="logo-wrap"><img src="${MeeTicketLogo}" alt="Mee Ticket" /></div>
              </div>
            </div>
            <div class="card-body">
              <div class="details-row">
                ${pass?.preparedUserImage
          ? `<img class="user-photo" src="${escapeHtml(pass.preparedUserImage)}" alt="User" />`
          : `<div class="user-photo"></div>`}
                <div class="user-copy">
                  <p class="value">${escapeHtml(pass?.userName)}</p>
                  <p class="label">Name</p>
                  <p class="value">${escapeHtml(pass?.dateOfBirth)}</p>
                  <p class="label">Date Of Birth</p>
                </div>
                <div class="qr-wrap">
                  ${qrCodes[index] ? `<img src="${qrCodes[index]}" alt="QR Code" />` : ""}
                  <div class="amount">Amount: &#8377;${escapeHtml(pass?.price)}</div>
                </div>
              </div>
            </div>
            <div class="card-footer">VALIDITY: ${escapeHtml(validity)}</div>
          </div>
          <div class="pass-card">
            <div class="instruction-header">
              <div class="header-row">
                <h1>Pass Instruction</h1>
                <div class="logo-wrap"><img src="${MeeTicketLogo}" alt="Mee Ticket" /></div>
              </div>
            </div>
            <div class="instruction-body">
              <p class="terms-title">Terms and Conditions</p>
              ${instructions.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
            </div>
            <div class="card-footer">VALIDITY: ${escapeHtml(validity)}</div>
          </div>
        </section>
      `;
    }).join("")}
    ${autoPrint ? `<script>
      window.onload = function () {
        setTimeout(function () {
          window.print();
        }, 500);
      };
    </script>` : ""}
  </body>
</html>
`;

function WalkersPassReportList() {
  const [responseModal, setResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkPdfLoading, setIsBulkPdfLoading] = useState(false);

  const navigate = useNavigate();

  const handleViewPass = (passData) => {
    navigate("/walker-pass-card", {
      state: {
        passUserDetailsId:
          passData?.PassUserDetailsId ||
          passData?.passUserDetailsId ||
          passData?.BookingId,
        backTo: "/walkers-pass-report",
      },
    });
  };

  const [openRegenerateModal, setOpenRegenerateModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const handleConfirmRegenerate = async () => {
    try {
      const passUserDetailsId =
        selectedPass?.PassUserDetailsId ||
        selectedPass?.passUserDetailsId ||
        selectedPass?.BookingId;

      const response = await viewPass(passUserDetailsId);

      console.log("Regenerate Response:", response);

      // Close confirmation popup
      setOpenRegenerateModal(false);

      // Show API response popup
      setResponseMessage(
        response?.message ||
        response?.data?.message ||
        "Pass generated successfully."
      );

      setResponseModal(true);

      // Navigate only when success
      if (
        response?.status === 200 ||
        response?.data?.statusCode === 200
      ) {
        navigate("/walker-pass-card", {
          state: {
            passUserDetailsId,
            backTo: "/walkers-pass-report",
          },
        });
      }
    } catch (error) {
      setOpenRegenerateModal(false);

      setResponseMessage(
        error?.response?.data?.message ||
        "Something went wrong."
      );

      setResponseModal(true);
    }
  };

  const savedFilters = JSON.parse(
    localStorage.getItem("walkers-pass-report-filters") || "{}"
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const {
    fetchWalkersPassReportData,
    WalkersPassReportData,
    totalCount,
    isFetchWalkersPassReportData,
    viewPassBulk,
    isViewPassBulkLoading,
  } = useWalkersPassReportStore();

  const { viewPass } = useWalkerpassStore();

  const fetchSelectedBulkPasses = async () => {
    const passUserDetailsIds = selectedRows
      .map(getPassUserDetailsId)
      .filter(Boolean);

    if (passUserDetailsIds.length === 0) {
      toast.warning("Please select at least one pass to print.");
      return null;
    }

    const response = await viewPassBulk(passUserDetailsIds);
    const passes = Array.isArray(response?.data) ? response.data : [];

    if (passes.length === 0) {
      toast.warning("No pass details found for selected records.");
      return null;
    }

    const [passesWithImages, qrCodes] = await Promise.all([
      prepareBulkPassImages(passes),
      Promise.all(
        passes.map((pass) =>
          pass?.bookingId ? QRCode.toDataURL(pass.bookingId) : Promise.resolve("")
        )
      ),
    ]);

    return { passes: passesWithImages, qrCodes };
  };

  const handleBulkPrint = async () => {
    try {
      const bulkPasses = await fetchSelectedBulkPasses();
      if (!bulkPasses) return;

      const printWindow = window.open("", "_blank", "width=900,height=900");
      if (!printWindow) {
        toast.error("Please allow popups to print the selected passes.");
        return;
      }

      printWindow.document.open();
      printWindow.document.write(buildBulkPrintHtml(bulkPasses.passes, bulkPasses.qrCodes));
      printWindow.document.close();
    } catch (error) {
      console.error("Unable to bulk print walker passes:", error);
      toast.error(
        error?.response?.data?.message ||
        "Unable to print selected passes. Please try again."
      );
    }
  };

  const handleBulkPdfDownload = async () => {
    let iframe = null;

    try {
      setIsBulkPdfLoading(true);

      const bulkPasses = await fetchSelectedBulkPasses();
      if (!bulkPasses) return;

      const [{ default: html2canvas }, jsPdfModule] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const JsPDF = jsPdfModule.jsPDF || jsPdfModule.default;

      iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-10000px";
      iframe.style.top = "0";
      iframe.style.width = "430px";
      iframe.style.height = "900px";
      iframe.setAttribute("aria-hidden", "true");
      document.body.appendChild(iframe);

      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      iframeDocument.open();
      iframeDocument.write(
        buildBulkPrintHtml(bulkPasses.passes, bulkPasses.qrCodes, { autoPrint: false })
      );
      iframeDocument.close();

      await waitForImages(iframeDocument);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const sheets = Array.from(iframeDocument.querySelectorAll(".pass-sheet"));
      if (sheets.length === 0) {
        toast.error("Unable to prepare PDF layout.");
        return;
      }

      const pdf = new JsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pdfCardWidth = 95;

      for (let index = 0; index < sheets.length; index += 1) {
        await yieldToBrowser();

        const canvas = await html2canvas(sheets[index], {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#ffffff",
          imageTimeout: 3000,
        });

        const imageData = canvas.toDataURL("image/jpeg", 0.92);
        const imageHeight = (canvas.height * pdfCardWidth) / canvas.width;
        const x = (pageWidth - pdfCardWidth) / 2;

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imageData, "JPEG", x, 10, pdfCardWidth, imageHeight);
      }

      pdf.save("Walkers-Pass-Bulk.pdf");
    } catch (error) {
      console.error("Unable to download bulk walker pass PDF:", error);
      toast.error("Unable to download selected passes as PDF. Please try again.");
    } finally {
      if (iframe?.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      setIsBulkPdfLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data for pagination changes (not initial load)
    // Initial load is handled by the form component
    if (currentPage > 0) {
      const savedBookingDate = savedFilters?.purchaseOrBooking || 'Purchase';
      const isBookingDateValue = savedBookingDate === 'Booking';

      const formattedValues = {
        fromDate: !isBookingDateValue ? savedFilters?.fromDate ?? getCurrentDate() : "",
        toDate: !isBookingDateValue ? savedFilters?.toDate ?? getCurrentDate() : "",
        bookingDateFrom: isBookingDateValue ? savedFilters?.fromDate ?? getCurrentDate() : null,
        bookingDateTo: isBookingDateValue ? savedFilters?.toDate ?? getCurrentDate() : null,
        passTypeId: savedFilters?.passTypeId ?? "",
        subFacilityId: savedFilters?.subFacilityId ?? "",
        locationId: savedFilters?.locationId ?? "",
        status: savedFilters?.status ?? "CONFIRMED",
        pageNumber: currentPage + 1,
        PageSize: PAGE_LIMIT,
      };

      fetchWalkersPassReportData(formattedValues);
    }
  }, [currentPage, PAGE_LIMIT, fetchWalkersPassReportData]);

  const columnDefs = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 60,
      pinned: "left",
    },
    {
      field: "sno",
      headerName: "S.No",
      maxWidth: 70,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
    },
    {
      field: "TransactionId",
      headerName: "Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "UserName",
      headerName: "User Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "FacilityName",
      headerName: "Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "SubFacilityName",
      headerName: "Sub Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "MobileNumber",
      headerName: "Mobile Number",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "BookingDate",
      headerName: "Booking Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        try {
          return formatToStandardDate(params.value);
        } catch {
          return "N/A";
        }
      },
    },

    {
      field: "ValidityStartDate",
      headerName: "Validity Start Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        try {
          return formatToStandardDate(params.value);
        } catch {
          return "N/A";
        }
      },
    },

    {
      field: "ValidTo",
      headerName: "Validity End Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        try {
          return formatToStandardDate(params.value);
        } catch {
          return "N/A";
        }
      },
    },
    {
      field: "PassAmount",
      headerName: "Pass Amount",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        return `₹${params.value}`;
      },
    },
    {
      field: "Status",
      headerName: "Status",
      maxWidth: 180,
      // flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "PassType",
      headerName: "Pass Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "Mode",
      headerName: "Mode",
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      headerName: "Generate Pass",
      minWidth: 180,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const isDisabled =
          params.data?.IsEligibleForRegenerate !== 1;

        return (
          <div className="flex justify-center">
            <button
              className={`px-6 py-1.5 mt-1 text-sm font-semibold rounded-md transition-all duration-200 ${isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-v2 text-white hover:bg-blue-v1"
                }`}
              onClick={() => {
                if (!isDisabled) {
                  setSelectedPass(params.data);
                  setOpenRegenerateModal(true);
                }
              }}
              disabled={isDisabled}
            >
              Regenerate Pass
            </button>
          </div>
        );
      },
    },
    {
      headerName: "Action",
      minWidth: 180,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const isDisabled =
          !(
            params.data?.Status === "CONFIRMED" &&
            params.data?.BookingId
          );

        return (
          <div className="flex justify-center">
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-v2 text-white hover:bg-blue-v1"
                }`}
              onClick={() => {
                if (!isDisabled) {
                  handleViewPass(params.data);
                }
              }}
              disabled={isDisabled}
            >
              View Pass
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <WalkersPassReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <div className="flex justify-end items-center gap-3 my-3">
        {selectedRows.length > 0 && (
          <span className="text-xs font-semibold text-gray-600">
            {selectedRows.length} pass{selectedRows.length > 1 ? "es" : ""} selected
          </span>
        )}
        <button
          type="button"
          onClick={handleBulkPdfDownload}
          disabled={selectedRows.length === 0 || isViewPassBulkLoading || isBulkPdfLoading}
          className={`text-xs rounded-lg px-4 py-2 border font-semibold shadow-sm transition-all ${selectedRows.length === 0 || isViewPassBulkLoading || isBulkPdfLoading
            ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
            : "bg-green-700 text-white border-green-700 hover:bg-green-800"
            }`}
        >
          {isBulkPdfLoading ? "Downloading PDF..." : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={handleBulkPrint}
          disabled={selectedRows.length === 0 || isViewPassBulkLoading || isBulkPdfLoading}
          className={`text-xs rounded-lg px-4 py-2 border font-semibold shadow-sm transition-all ${selectedRows.length === 0 || isViewPassBulkLoading || isBulkPdfLoading
            ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
            : "bg-blue-v2 text-white border-blue-v2 hover:bg-blue-v1"
            }`}
        >
          {isViewPassBulkLoading ? "Preparing Print..." : "Bulk Print"}
        </button>
      </div>
      <AgGridTable4
        ExportName="Walkers Pass Report"
        rowData={WalkersPassReportData}
        columnDefs={columnDefs}
        rowSelection="multiple"
        isFetchLoading={isFetchWalkersPassReportData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={totalCount}
        tableHeight={WalkersPassReportData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
        onSelectionChanged={setSelectedRows}
      />
      <PopupModal
        popupModalId="regenerate-pass-modal"
        isOpen={openRegenerateModal}
        onClose={() => {
          setOpenRegenerateModal(false);
          setSelectedPass(null);
        }}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure you want to regenerate the pass for this booking?
          </h1>

          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              onClick={handleConfirmRegenerate}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              Proceed
            </button>

            <button
              onClick={() => {
                setOpenRegenerateModal(false);
                setSelectedPass(null);
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>
      <PopupModal
        popupModalId="response-modal"
        isOpen={responseModal}
        onClose={() => setResponseModal(false)}
        size="small"
      >
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold mb-4">
            Message
          </h2>

          <p className="text-red-600 font-medium">
            {responseMessage}
          </p>

          <div className="mt-6">
            <button
              onClick={() => setResponseModal(false)}
              className="bg-blue-v1 text-white px-4 py-2 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      </PopupModal>
    </div>
  );
}

export default WalkersPassReportList;
