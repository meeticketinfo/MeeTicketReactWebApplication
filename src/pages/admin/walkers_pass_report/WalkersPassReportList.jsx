import { useRef, useState } from "react";
import AgGridTable4 from "../../../components/tables/AgGridTable4";
import { formatDateTime } from "../../../utils/Helper";
import WalkersPassReportForm from "./WalkersPassReportForm";
import { useWalkersPassReportStore } from "./WalkersPassReportStore";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { toast } from "react-toastify";
import { IoMdImages } from "react-icons/io";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";
import walkerPassBg from "../../../images/walker_pass_bg.png";
import MeeTicketLogo from "../../../images/MeeTicketLogo.png";
import ForestLogo from "../../../images/ForestLogo.png";



// Status cell renderer component
const StatusCellRenderer = (params) => {
  if (!params.value) return "N/A";

  const status = params.value.toLowerCase();
  const colorClass = status === 'confirmed' ? 'text-green-600' : ['expired', 'hold'].includes(status) ? 'text-red-600' : 'text-gray-600';

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

const getOrderId = (passData) => {
  if (!passData) return "";

  return (
    passData.OrderId ||
    passData.orderId ||
    passData.TransactionId ||
    Object.entries(passData).find(([key]) => key.toLowerCase() === "orderid")?.[1] ||
    ""
  );
};

const formatDateTimeCellValue = (dateValue) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";

  return formatDateTime(dateValue);
};

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkPdfLoading, setIsBulkPdfLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageRecord, setSelectedImageRecord] = useState(null);

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
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [isRegenerateLoading, setIsRegenerateLoading] = useState(false);
  const [regenerateMessage, setRegenerateMessage] = useState("");
  const [openRegenerateResultModal, setOpenRegenerateResultModal] = useState(false);
  const [refreshAfterRegenerate, setRefreshAfterRegenerate] = useState(false);
  const regenerateCloseTimerRef = useRef(null);

  const getRegenerateStatusStyle = () => {
    const message = regenerateMessage.toLowerCase();

    if (message.includes("success")) {
      return {
        label: "Success",
        icon: "✓",
        wrapper: "bg-green-50 border-green-200",
        badge: "bg-green-100 text-green-700",
        iconClass: "bg-green-600 text-white",
        text: "text-green-700",
      };
    }

    if (message.includes("fail") || message.includes("error") || message.includes("unable")) {
      return {
        label: "Failed",
        icon: "!",
        wrapper: "bg-red-50 border-red-200",
        badge: "bg-red-100 text-red-700",
        iconClass: "bg-red-600 text-white",
        text: "text-red-700",
      };
    }

    if (message.includes("pending")) {
      return {
        label: "Pending",
        icon: "i",
        wrapper: "bg-amber-50 border-amber-200",
        badge: "bg-amber-100 text-amber-700",
        iconClass: "bg-amber-500 text-white",
        text: "text-amber-700",
      };
    }

    return {
      label: "Status",
      icon: "i",
      wrapper: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      iconClass: "bg-blue-600 text-white",
      text: "text-blue-700",
    };
  };

  const clearRegenerateState = async (refreshReport = false) => {
    if (regenerateCloseTimerRef.current) {
      clearTimeout(regenerateCloseTimerRef.current);
      regenerateCloseTimerRef.current = null;
    }

    setOpenRegenerateModal(false);
    setOpenRegenerateResultModal(false);
    setSelectedPass(null);
    setSelectedOrderId("");
    setRegenerateMessage("");
    setRefreshAfterRegenerate(false);

    if (refreshReport && walkersPassReportFilters) {
      await fetchWalkersPassReportData(walkersPassReportFilters);
    }
  };

  const showRegenerateResult = (message, refreshReport = true) => {
    setOpenRegenerateModal(false);
    setRegenerateMessage(message);
    setRefreshAfterRegenerate(refreshReport);
    setOpenRegenerateResultModal(false);

    setTimeout(() => {
      setOpenRegenerateResultModal(true);
    }, 250);

    regenerateCloseTimerRef.current = setTimeout(() => {
      clearRegenerateState(refreshReport);
    }, 5000);
  };

  const handleConfirmRegenerate = async (orderId) => {
    const finalOrderId = orderId || selectedOrderId || getOrderId(selectedPass);

    if (!finalOrderId) {
      console.log("Regenerate selected row:", selectedPass);
      showRegenerateResult("Order ID not found for this booking.", false);
      return;
    }

    try {
      setIsRegenerateLoading(true);
      console.log("Checking walker pass order status:", finalOrderId);
      const response = await apiService.post(
        `${API_ENDPOINTS.WALKERS_PASS_BOOKING.ORDER_STATUS_CALL}/${finalOrderId}`
      );

      const message =
        response?.data?.message ||
        response?.data?.data?.resultMsg ||
        "Payment status checked successfully.";

      showRegenerateResult(message);
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to check payment status.";
      showRegenerateResult(message);
    } finally {
      setIsRegenerateLoading(false);
    }
  };

  const {
    WalkersPassReportData,
    totalCount,
    walkersPassReportFilters,
    isFetchWalkersPassReportData,
    fetchWalkersPassReportData,
    viewPassBulk,
    isViewPassBulkLoading,
  } = useWalkersPassReportStore();

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
      valueGetter: (params) => params.node.rowIndex + 1,
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

    // {
    //   field: "FacilityName",
    //   headerName: "Facility Name",
    //   // flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => (params.value ? params.value : "N/A"),
    // },
    // {
    //   field: "SubFacilityName",
    //   headerName: "Sub Facility Name",
    //   // flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => (params.value ? params.value : "N/A"),
    // },
    {
      field: "MobileNumber",
      headerName: "Mobile Number",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "BookingDate",
      headerName: "Booking Date & Time",
      headerClass: "text-blue-v2",
      valueGetter: (params) => formatDateTimeCellValue(params.data?.BookingDate),
    },

    {
      field: "ValidityStartDate",
      headerName: "Validity Start Date & Time",
      headerClass: "text-blue-v2",
      valueGetter: (params) =>
        formatDateTimeCellValue(params.data?.ValidityStartDate || params.data?.ValidFrom),
    },

    {
      field: "ValidTo",
      headerName: "Validity End Date & Time",
      headerClass: "text-blue-v2",
      valueGetter: (params) => formatDateTimeCellValue(params.data?.ValidTo),
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
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "ID Card Image",
      maxWidth: 140,
      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        params.data?.IdCardImage ? (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="mt-1.5"
              onClick={() => {
                setSelectedImageRecord(params.data);
                setImageModalOpen(true);
              }}
            >
              <IoMdImages className="text-[24px] text-blue-600" />
            </button>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-3">N/A</span>
        ),
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
                  const orderId = getOrderId(params.data);
                  console.log("Regenerate row selected:", params.data);
                  console.log("Regenerate order id:", orderId);
                  setSelectedPass(params.data);
                  setSelectedOrderId(orderId);
                  setRegenerateMessage("");
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
      <WalkersPassReportForm />
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
        isPagination={true}
        IsReactPaginate={false}
        showTotalCount={true}
        totalCount={totalCount || WalkersPassReportData.length}
        tableHeight={WalkersPassReportData.length > 10 ? 550 : 300}
        
        onSelectionChanged={setSelectedRows}
      />
      <PopupModal
        popupModalId="regenerate-pass-modal"
        isOpen={openRegenerateModal}
        onClose={() => clearRegenerateState()}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure you want to regenerate the pass for this booking?
          </h1>
          {selectedOrderId && (
            <p className="mt-2 text-xs text-gray-600 text-center">
              Order ID: {selectedOrderId}
            </p>
          )}

          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              type="button"
              onMouseDown={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                await handleConfirmRegenerate(selectedOrderId);
              }}
              disabled={isRegenerateLoading}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isRegenerateLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 inline-block animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Checking payment status...
                </span>
              ) : (
                "Proceed"
              )}
            </button>

            <button
              type="button"
              onClick={() => clearRegenerateState()}
              disabled={isRegenerateLoading}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>
      <PopupModal
        popupModalId="regenerate-result-modal"
        isOpen={openRegenerateResultModal}
        onClose={() => clearRegenerateState(refreshAfterRegenerate)}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-8 py-10 text-center">
          {(() => {
            const statusStyle = getRegenerateStatusStyle();

            return (
              <div className={`border rounded-xl px-5 py-6 ${statusStyle.wrapper}`}>
                <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${statusStyle.iconClass}`}>
                  {statusStyle.icon}
                </div>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}>
                  {statusStyle.label}
                </span>
                <h2 className="text-blue-v1 font-semibold mt-3 mb-2">Payment Status</h2>
                <p className={`text-sm font-medium ${statusStyle.text}`}>{regenerateMessage}</p>
              </div>
            );
          })()}
        </div>
      </PopupModal>
      <PopupModal
        popupModalId="id-card-image-modal"
        isOpen={imageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          setSelectedImageRecord(null);
        }}
        title={"ID Card Image"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={false}
        titleColour="text-blue-v1"
      >
        <div className="px-4 py-2">
          {selectedImageRecord?.IdCardImage ? (
            <img
              className="max-h-[70vh] w-full object-contain"
              src={selectedImageRecord.IdCardImage}
              alt="ID Card"
            />
          ) : (
            <p className="text-center text-sm text-gray-600">No image available.</p>
          )}
        </div>
      </PopupModal>
    </div>
  );
}

export default WalkersPassReportList;
