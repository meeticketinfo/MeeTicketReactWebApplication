import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useWalkerpassStore } from "./WalkerpassStore";
import QRCode from "qrcode";
import walkerPassBg from "../../images/walker_pass_bg.png";
import MeeTicketLogo from "../../images/MeeTicketLogo.png";
import ForestLogo from "../../images/ForestLogo.png";
import jsPDF from "jspdf";
import useAuthStore from "../../store/authStore";
import { amrabadAuthStore } from "../../store/amarabad/user/amrabadAuthStore";
import { API_BASE_URL } from "../../constants/apiEndpoints";
import {
    getWalkerPassImageStorageKey,
    getStoredWalkerPassImage,
    storeWalkerPassImage,
} from "./walkerPassImageUtils";

const renderSpinner = (className = "h-4 w-4") => (
    <span
        className={`${className} inline-block animate-spin rounded-full border-2 border-current border-t-transparent`}
        aria-hidden="true"
    />
);

const CARD_PRINT_WIDTH_MM = 85.6;
const CARD_PRINT_HEIGHT_MM = 53.98;
const CARD_CANVAS_HEIGHT = 214;
const CARD_CANVAS_GAP = 12;
const CARD_PRINT_GAP_MM = (CARD_CANVAS_GAP / CARD_CANVAS_HEIGHT) * CARD_PRINT_HEIGHT_MM;
const PASS_PRINT_HEIGHT_MM = CARD_PRINT_HEIGHT_MM * 2 + CARD_PRINT_GAP_MM;
const PDF_PAGE_MARGIN_MM = 5;

const normalizePassResponse = (response) => response?.data || response;

const getPassImageValue = (data) =>
    data?.userImage ||
    data?.userImageUrl ||
    data?.userImagePath ||
    data?.profileImageUrl ||
    data?.profileImgUrl ||
    data?.photoUrl ||
    data?.imageUrl ||
    "";

const isRawBase64Image = (value) =>
    /^[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length > 100;

const getImageUrlCandidates = (url) => {
    if (!url || typeof url !== "string") return [];

    const trimmedUrl = url.trim().replace(/(%22|")/g, "");
    if (!trimmedUrl) return [];

    if (/^data:/i.test(trimmedUrl)) {
        return [trimmedUrl];
    }

    if (isRawBase64Image(trimmedUrl)) {
        return [`data:image/jpeg;base64,${trimmedUrl}`];
    }

    if (/^(blob:|https?:\/\/)/i.test(trimmedUrl)) {
        return [trimmedUrl];
    }

    const candidates = [];
    const appBaseUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/`
            : API_BASE_URL;

    try {
        candidates.push(new URL(trimmedUrl, appBaseUrl).href);
    } catch (error) {
        console.error("Invalid image URL:", trimmedUrl, error);
    }

    try {
        candidates.push(new URL(trimmedUrl.replace(/^\/+/, ""), API_BASE_URL).href);
    } catch (error) {
        console.error("Invalid API image URL:", trimmedUrl, error);
    }

    return [...new Set(candidates)];
};

// ─── Get auth token from active auth stores ───────────────────────────
const getAuthToken = () => {
    const amrabadState = amrabadAuthStore.getState();
    if (amrabadState?.tokenType === "amrabad" && amrabadState?.token) {
        return amrabadState.token;
    }

    const parkToken = useAuthStore.getState()?.token;
    if (parkToken) {
        return parkToken;
    }

    try {
        const authStore = localStorage.getItem("auth-store");
        if (authStore) {
            const parsed = JSON.parse(authStore);
            // Try common token paths inside auth-store
            const token =
                parsed?.state?.token ||
                parsed?.state?.accessToken ||
                parsed?.state?.authToken ||
                parsed?.state?.data?.token ||
                parsed?.state?.user?.token ||
                parsed?.token ||
                parsed?.accessToken ||
                "";
            if (token) return token;
        }

        const amrabadStore = localStorage.getItem("amrabadlogin-store");
        if (amrabadStore) {
            const parsed = JSON.parse(amrabadStore);
            if (parsed?.state?.token) return parsed.state.token;
        }
    } catch (e) {
        console.error("Failed to parse auth-store:", e);
    }

    // Fallback: check other common keys
    const fallback =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("accessToken") ||
        "";

    return fallback;
};

const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

// ─── Fetch any URL → base64 ──────────────────────────────────────────
const fetchToBase64 = async (url) => {
    const imageUrls = getImageUrlCandidates(url);
    if (imageUrls.length === 0) return null;

    for (const imageUrl of imageUrls) {
        if (imageUrl.startsWith("data:")) return imageUrl;

        const token = getAuthToken();
        const requestOptions = [
            {
                method: "GET",
                credentials: "omit",
                headers: {
                    Accept: "image/*",
                },
            },
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "image/*",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            },
        ];

        for (const options of requestOptions) {
            try {
                const res = await fetch(imageUrl, options);

                if (!res.ok) {
                    console.error("Image fetch failed:", imageUrl, res.status, res.statusText);
                    continue;
                }

                const blob = await res.blob();

                if (blob.size === 0 || (blob.type && !blob.type.startsWith("image/"))) {
                    console.error("Image blob is invalid:", imageUrl, blob.type, blob.size);
                    continue;
                }

                return await blobToDataUrl(blob);
            } catch (e) {
                console.error("fetchToBase64 error:", imageUrl, e);
            }
        }
    }

    return null;
};

// ─── Load base64 → HTMLImageElement ──────────────────────────────────
const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        if (!src?.startsWith("data:")) {
            img.crossOrigin = "anonymous";
        }
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

const isMostlyBlackImage = async (src) => {
    try {
        const img = await loadImage(src);
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let opaquePixels = 0;
        let blackPixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 20) continue;

            opaquePixels += 1;
            if (pixels[i] < 12 && pixels[i + 1] < 12 && pixels[i + 2] < 12) {
                blackPixels += 1;
            }
        }

        return opaquePixels > 0 && blackPixels / opaquePixels > 0.9;
    } catch (error) {
        console.error("Unable to inspect user image:", error);
        return false;
    }
};

const prepareImageForCanvas = async (src) => {
    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width || 1;
    canvas.height = img.naturalHeight || img.height || 1;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.92);
};

const removeEdgeWhiteBackground = (img) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    const visited = new Uint8Array(width * height);
    const queue = [];

    const isWhitePixel = (index) =>
        data[index] > 245 &&
        data[index + 1] > 245 &&
        data[index + 2] > 245 &&
        data[index + 3] > 0;

    const enqueue = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return;

        const pixelIndex = y * width + x;
        if (visited[pixelIndex]) return;

        const dataIndex = pixelIndex * 4;
        if (!isWhitePixel(dataIndex)) return;

        visited[pixelIndex] = 1;
        queue.push([x, y]);
    };

    for (let x = 0; x < width; x += 1) {
        enqueue(x, 0);
        enqueue(x, height - 1);
    }

    for (let y = 0; y < height; y += 1) {
        enqueue(0, y);
        enqueue(width - 1, y);
    }

    while (queue.length) {
        const [x, y] = queue.pop();
        const dataIndex = (y * width + x) * 4;
        data[dataIndex + 3] = 0;

        enqueue(x + 1, y);
        enqueue(x - 1, y);
        enqueue(x, y + 1);
        enqueue(x, y - 1);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
};

const WalkerPassCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const passUserDetailsId =
        location.state?.passUserDetailsId ||
        localStorage.getItem("passUserDetailsId");
    const backTo = location.state?.backTo || "/walkers-pass-report";

    const { viewPass } = useWalkerpassStore();

    const [passData, setPassData] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [userImageBase64, setUserImageBase64] = useState(
        () =>
            location.state?.userImageBase64 ||
            getStoredWalkerPassImage(passUserDetailsId) ||
            ""
    );
    const [passLoadError, setPassLoadError] = useState("");
    const [isPassLoading, setIsPassLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    const canvasRef = useRef(null);

    const getUserImageSource = async (data = passData) => {
        if (userImageBase64 && !(await isMostlyBlackImage(userImageBase64))) {
            return prepareImageForCanvas(userImageBase64);
        }

        const storedImage = getStoredWalkerPassImage(passUserDetailsId);
        if (storedImage && !(await isMostlyBlackImage(storedImage))) {
            const preparedImage = await prepareImageForCanvas(storedImage);
            setUserImageBase64(preparedImage);
            storeWalkerPassImage(passUserDetailsId, preparedImage);
            return preparedImage;
        }

        if (storedImage) {
            const storageKey = getWalkerPassImageStorageKey(passUserDetailsId);
            if (storageKey) {
                sessionStorage.removeItem(storageKey);
            }
        }

        const imageUrls = getImageUrlCandidates(getPassImageValue(data));

        for (const imageUrl of imageUrls) {
            const base64 = await fetchToBase64(imageUrl);
            if (!base64) continue;

            try {
                const preparedImage = await prepareImageForCanvas(base64);
                if (await isMostlyBlackImage(preparedImage)) {
                    continue;
                }

                setUserImageBase64(preparedImage);
                storeWalkerPassImage(passUserDetailsId, preparedImage);
                return preparedImage;
            } catch (error) {
                console.error("Fetched user image is not drawable:", imageUrl, error);
            }
        }

        return "";
    };

    // ─── Format date ──────────────────────────────────────────────────────
    const fmtDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-GB") : "-";

    // ─── Rounded rect helpers ─────────────────────────────────────────────
    const roundRect = (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };

    const roundRectTop = (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };

    const roundRectBottom = (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y);
        ctx.closePath();
    };

    // ─── Draw both cards onto canvas ──────────────────────────────────────
    const drawCanvas = async () => {
        const SCALE = 3;
        const W = 340 * SCALE;
        const GAP = 12 * SCALE;
        const CARD_H = 214 * SCALE;
        const TOTAL_H = CARD_H * 2 + GAP;

        const canvas = canvasRef.current;
        canvas.width = W;
        canvas.height = TOTAL_H;
        const ctx = canvas.getContext("2d");

        const userImageSourcePromise = getUserImageSource();

        // Load all images in parallel
        const [bgImg, forestImg, meeImg, userImageSource, qrImg] = await Promise.all([
            fetchToBase64(walkerPassBg).then((b) => loadImage(b || walkerPassBg)),
            fetchToBase64(ForestLogo).then((b) => loadImage(b || ForestLogo)),
            fetchToBase64(MeeTicketLogo).then((b) => loadImage(b || MeeTicketLogo)),
            userImageSourcePromise,
            loadImage(qrCodeUrl),
        ]);
        const userImg = userImageSource ? await loadImage(userImageSource).catch(() => null) : null;
        const forestLogoImg = removeEdgeWhiteBackground(forestImg);
        const meeLogoImg = removeEdgeWhiteBackground(meeImg);

        // ════════════════════════════════════════════
        // CARD 1 — Pass Card
        // ════════════════════════════════════════════
        const drawCard1 = () => {
            const x = 0, y = 0, w = W, h = CARD_H;
            const HEADER_H = 52 * SCALE;
            const FOOTER_H = 22 * SCALE;

            // White background
            ctx.fillStyle = "#ffffff";
            roundRect(ctx, x, y, w, h, 12 * SCALE);
            ctx.fill();

            // Header
            ctx.fillStyle = "#091A8C";
            roundRectTop(ctx, x, y, w, HEADER_H, 12 * SCALE);
            ctx.fill();

            // Logos
            ctx.drawImage(forestLogoImg, x + 8 * SCALE, y + 6 * SCALE, 40 * SCALE, 40 * SCALE);
            ctx.drawImage(meeLogoImg, x + w - 48 * SCALE, y + 7 * SCALE, 40 * SCALE, 40 * SCALE);

            // Park name + pass name
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.font = `bold ${14 * SCALE}px Arial`;
            ctx.fillText(passData?.parkName || "", x + w / 2, y + 20 * SCALE);
            ctx.font = `${13 * SCALE}px Arial`;
            ctx.fillText(passData?.passName || "", x + w / 2, y + 38 * SCALE);

            // Body background
            const bodyY = y + HEADER_H;
            const bodyH = h - HEADER_H - FOOTER_H;
            ctx.drawImage(bgImg, x, bodyY, w, bodyH);

            // User photo
            if (userImg) {
                ctx.drawImage(
                    userImg,
                    x + 9 * SCALE,
                    bodyY + 8 * SCALE,
                    95 * SCALE,
                    95 * SCALE
                );
            } else {
                ctx.strokeStyle = "#cccccc";
                ctx.lineWidth = 1 * SCALE;
                ctx.strokeRect(x + 9 * SCALE, bodyY + 8 * SCALE, 80 * SCALE, 80 * SCALE);
            }

            // Name & DOB between Image and QR
            const textX = x + 115 * SCALE;

            ctx.textAlign = "left";

            // Name
            ctx.fillStyle = "#000000";
            ctx.font = `bold ${10 * SCALE}px Arial`;
            ctx.fillText(
                (passData?.userName || "").toUpperCase(),
                textX,
                bodyY + 35 * SCALE
            );

            // Name Label
            ctx.fillStyle = "#666666";
            ctx.font = `${8 * SCALE}px Arial`;
            ctx.fillText(
                "Name",
                textX,
                bodyY + 50 * SCALE
            );

            // DOB
            ctx.fillStyle = "#000000";
            ctx.font = `bold ${10 * SCALE}px Arial`;
            ctx.fillText(
                passData?.dateOfBirth || "",
                textX,
                bodyY + 75 * SCALE
            );

            // DOB Label
            ctx.fillStyle = "#666666";
            ctx.font = `${8 * SCALE}px Arial`;
            ctx.fillText(
                "Date Of Birth",
                textX,
                bodyY + 90 * SCALE
            );

            // QR code
            const qrSize = 110 * SCALE;
            const qrX = x + w - qrSize - 8 * SCALE;
            const qrY = bodyY + 4 * SCALE;

            ctx.drawImage(
                qrImg,
                qrX,
                qrY,
                qrSize,
                qrSize
            );

            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.font = `bold ${10 * SCALE}px Arial`;

            ctx.fillText(
                `Amount: ₹${passData?.price || ""}`,
                qrX + qrSize / 2,
                qrY + qrSize + 20 * SCALE
            );

            // Footer
            ctx.fillStyle = "#091A8C";
            roundRectBottom(ctx, x, y + h - FOOTER_H, w, FOOTER_H, 12 * SCALE);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.font = `bold ${8 * SCALE}px Arial`;
            ctx.fillText(
                `VALIDITY: ${fmtDate(passData?.validFrom)} TO ${fmtDate(passData?.validTo)}`,
                x + w / 2,
                y + h - 8 * SCALE
            );
        };

        // ════════════════════════════════════════════
        // CARD 2 — Instructions
        // ════════════════════════════════════════════
        const drawCard2 = () => {
            const x = 0, y = CARD_H + GAP, w = W, h = CARD_H;
            const HEADER_H = 52 * SCALE;
            const FOOTER_H = 22 * SCALE;

            // White background
            ctx.fillStyle = "#ffffff";
            roundRect(ctx, x, y, w, h, 12 * SCALE);
            ctx.fill();

            // Header
            ctx.fillStyle = "#091A8C";
            roundRectTop(ctx, x, y, w, HEADER_H, 12 * SCALE);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.font = `bold ${14 * SCALE}px Arial`;
            ctx.fillText("Pass Instruction", x + 12 * SCALE, y + 32 * SCALE);

            // MeeTicket logo
            ctx.drawImage(meeLogoImg, x + w - 48 * SCALE, y + 7 * SCALE, 40 * SCALE, 40 * SCALE);

            // Body
            const bodyY = y + HEADER_H;
            const bodyH = h - HEADER_H - FOOTER_H;
            ctx.drawImage(bgImg, x, bodyY, w, bodyH);

            // Terms heading
            ctx.fillStyle = "#dc2626";
            ctx.font = `bold ${10 * SCALE}px Arial`;
            ctx.textAlign = "left";
            ctx.fillText("Terms and Conditions", x + 12 * SCALE, bodyY + 16 * SCALE);

            // Terms lines
            ctx.fillStyle = "#333333";
            ctx.font = `bold ${7 * SCALE}px Arial`;
            const lines = [
                "Monthly Walker pass Validity is only till the end of the month,",
                "irrespective of the date of purchase",
                "",
                "Monthly Walker pass Validity is only till 30th of June Next Year,",
                "irrespective of the Month of purchase",
                "",
                "The Walker pass is only valid once a Day.",
                "",
                "Park Timings: Open daily from 06:00 am - 6:00 pm",
            ];
            lines.forEach((line, i) => {
                ctx.fillText(line, x + 12 * SCALE, bodyY + 30 * SCALE + i * 10 * SCALE);
            });

            // Footer
            ctx.fillStyle = "#091A8C";
            roundRectBottom(ctx, x, y + h - FOOTER_H, w, FOOTER_H, 12 * SCALE);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.font = `bold ${8 * SCALE}px Arial`;
            ctx.fillText(
                `VALIDITY: ${fmtDate(passData?.validFrom)} TO ${fmtDate(passData?.validTo)}`,
                x + w / 2,
                y + h - 8 * SCALE
            );
        };

        drawCard1();
        drawCard2();
        return canvas;
    };

    // ─── Download as PDF ──────────────────────────────────────────────────
    const downloadPass = async () => {
        setIsDownloading(true);
        try {
            const canvas = await drawCanvas();
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [
                    CARD_PRINT_WIDTH_MM + PDF_PAGE_MARGIN_MM * 2,
                    PASS_PRINT_HEIGHT_MM + PDF_PAGE_MARGIN_MM * 2,
                ],
            });
            pdf.addImage(
                imgData,
                "PNG",
                PDF_PAGE_MARGIN_MM,
                PDF_PAGE_MARGIN_MM,
                CARD_PRINT_WIDTH_MM,
                PASS_PRINT_HEIGHT_MM
            );
            pdf.save("WalkerPass.pdf");
        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    // ─── Print ────────────────────────────────────────────────────────────
    const printPass = async () => {
        setIsPrinting(true);
        try {
            const canvas = await drawCanvas();
            const imgData = canvas.toDataURL("image/png");
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Walker Pass</title>
                        <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            @page {
                                size: ${CARD_PRINT_WIDTH_MM}mm ${PASS_PRINT_HEIGHT_MM}mm;
                                margin: 0;
                            }
                            html, body {
                                width: ${CARD_PRINT_WIDTH_MM}mm;
                                min-height: ${PASS_PRINT_HEIGHT_MM}mm;
                                background: #fff;
                            }
                            body {
                                display: flex;
                                justify-content: center;
                                align-items: flex-start;
                            }
                            img {
                                width: ${CARD_PRINT_WIDTH_MM}mm;
                                height: ${PASS_PRINT_HEIGHT_MM}mm;
                                max-width: none;
                                display: block;
                            }
                            @media print {
                                html, body {
                                    width: ${CARD_PRINT_WIDTH_MM}mm;
                                    min-height: ${PASS_PRINT_HEIGHT_MM}mm;
                                }
                                img {
                                    width: ${CARD_PRINT_WIDTH_MM}mm;
                                    height: ${PASS_PRINT_HEIGHT_MM}mm;
                                    page-break-inside: avoid;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <img id="walker-pass-print-image" src="${imgData}" />
                        <script>
                            var passImage = document.getElementById("walker-pass-print-image");
                            function printPass() {
                                setTimeout(function () {
                                    window.print();
                                    window.close();
                                }, 500);
                            }
                            if (passImage.complete) {
                                printPass();
                            } else {
                                passImage.onload = printPass;
                                passImage.onerror = printPass;
                            }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } catch (err) {
            console.error("Print failed:", err);
        } finally {
            setIsPrinting(false);
        }
    };

    // ─── Fetch pass data on load ──────────────────────────────────────────
    useEffect(() => {
        const fetchPassDetails = async () => {
            if (!passUserDetailsId) return;
            try {
                setIsPassLoading(true);
                const response = await viewPass(passUserDetailsId);
                const data = normalizePassResponse(response);
                if (!data) {
                    setPassLoadError(
                        "Payment may be successful, but the walker pass is not available yet. Please retry after a few seconds."
                    );
                    return;
                }

                setPassLoadError("");
                setPassData(data);

                const storedImage = getStoredWalkerPassImage(passUserDetailsId);
                let hasLoadedStoredImage = false;
                if (storedImage && !(await isMostlyBlackImage(storedImage))) {
                    const preparedImage = await prepareImageForCanvas(storedImage);
                    setUserImageBase64(preparedImage);
                    storeWalkerPassImage(passUserDetailsId, preparedImage);
                    hasLoadedStoredImage = true;
                } else if (storedImage) {
                    const storageKey = getWalkerPassImageStorageKey(passUserDetailsId);
                    if (storageKey) {
                        sessionStorage.removeItem(storageKey);
                    }
                }

                if (!hasLoadedStoredImage && getPassImageValue(data)) {
                    const imageUrls = getImageUrlCandidates(getPassImageValue(data));
                    for (const imageUrl of imageUrls) {
                        const base64 = await fetchToBase64(imageUrl);
                        if (!base64) continue;

                        try {
                            const preparedImage = await prepareImageForCanvas(base64);
                            if (await isMostlyBlackImage(preparedImage)) {
                                continue;
                            }

                            setUserImageBase64(preparedImage);
                            storeWalkerPassImage(passUserDetailsId, preparedImage);
                            break;
                        } catch (error) {
                            console.error("Fetched user image is not drawable:", imageUrl, error);
                        }
                    }
                }

                if (data?.bookingId) {
                    const qr = await QRCode.toDataURL(data.bookingId);
                    setQrCodeUrl(qr);
                }
            } catch (error) {
                console.error("View Pass Error:", error);
                setPassLoadError(
                    "Payment may be successful, but we could not fetch the walker pass details right now. Please retry after a few seconds."
                );
            } finally {
                setIsPassLoading(false);
            }
        };
        fetchPassDetails();
    }, [passUserDetailsId, viewPass]);

    return (
        <AdminLayout>
            {/* Hidden canvas for drawing */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Book Walker Pass
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate(backTo, { replace: true })}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-gray-700"
                    >
                        Back
                    </button>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 min-h-[75vh] p-6">
                    <div className="flex flex-col items-center relative">
                        {(isDownloading || isPrinting) && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
                                {renderSpinner("h-8 w-8 text-[#09094D]")}
                                <p className="mt-3 text-sm font-semibold text-gray-700">
                                    {isDownloading
                                        ? "Preparing PDF..."
                                        : "Preparing print..."}
                                </p>
                            </div>
                        )}

                        {/* Pass Card Preview */}
                        {isPassLoading ? (
                            <div className="w-[340px] space-y-3">
                                <div className="h-[214px] rounded-[12px] border border-gray-200 bg-gray-100 animate-pulse flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        {renderSpinner("h-7 w-7 text-[#09094D]")}
                                        <p className="mt-3 text-xs font-medium">
                                            Loading walker pass...
                                        </p>
                                    </div>
                                </div>
                                <div className="h-[214px] rounded-[12px] border border-gray-200 bg-gray-100 animate-pulse" />
                            </div>
                        ) : (
                            <div className="w-[340px]">
                                <div className="bg-white rounded-[12px] overflow-hidden shadow border border-gray-300 w-[340px] h-[214px] flex flex-col">
                                    <div className="bg-[#091A8C] text-white px-2 py-1">
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                                <img src={ForestLogo} alt="Forest Logo" className="w-10 h-10 rounded-full object-contain" />
                                            </div>
                                            <div className="text-center flex-1">
                                                <h1 className="text-[14px] font-bold leading-tight">{passData?.parkName}</h1>
                                                <p className="text-[14px] font-semibold">{passData?.passName}</p>
                                            </div>
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                                <img src={MeeTicketLogo} alt="Mee Ticket" className="w-9 h-9 rounded-full object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-2 flex-1" style={{ backgroundImage: `url(${walkerPassBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                                        <div className="flex justify-between items-start">
                                            {/* User Photo */}
                                            <div>
                                                <img
                                                    src={userImageBase64 || getPassImageValue(passData)}
                                                    alt="User"
                                                    className="w-[95px] h-[95px] border border-gray-300 object-cover"
                                                />
                                            </div>

                                            {/* Name & DOB */}
                                            <div className="flex flex-col ml-2 mt-2 flex-1">
                                                <p className="text-[10px] font-bold uppercase">
                                                    {passData?.userName}
                                                </p>
                                                <p className="text-[8px] text-gray-600">
                                                    Name
                                                </p>

                                                <p className="text-[10px] font-bold mt-3">
                                                    {passData?.dateOfBirth}
                                                </p>
                                                <p className="text-[8px] text-gray-600">
                                                    Date Of Birth
                                                </p>
                                            </div>

                                            {/* QR */}
                                            <div className="flex flex-col items-center">
                                                {qrCodeUrl ? (
                                                    <img
                                                        src={qrCodeUrl}
                                                        alt="QR Code"
                                                        className="w-[110px] h-[110px]"
                                                    />
                                                ) : (
                                                    <div className="w-[120px] h-[120px] border border-dashed border-gray-300 flex items-center justify-center bg-white">
                                                        {renderSpinner("h-5 w-5 text-[#09094D]")}
                                                    </div>
                                                )}

                                                <div className="w-[108px] flex justify-center items-center gap-1 mt-[2px]">
                                                    <span className="text-[10px] font-bold">
                                                        Amount:
                                                    </span>
                                                    <span className="text-[10px] font-bold">
                                                        ₹{passData?.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#091A8C] text-white text-center py-[4px] -mt-[7px] relative z-10">
                                        <p className="text-[8px] font-bold">
                                            VALIDITY: {fmtDate(passData?.validFrom)} TO {fmtDate(passData?.validTo)}
                                        </p>
                                    </div>
                                </div>

                                {/* Instructions Card Preview */}
                                <div className="mt-3 bg-white rounded-[12px] overflow-hidden shadow border border-gray-300 w-[340px] h-[214px] flex flex-col">
                                    <div className="bg-[#091A8C] text-white px-3 py-2">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-[14px] font-semibold">Pass Instruction</h1>
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                                <img src={MeeTicketLogo} alt="Mee Ticket" className="w-9 h-9 rounded-full object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 px-3 py-3 text-[7px] font-bold text-[#333]" style={{ backgroundImage: `url(${walkerPassBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                                        <p className="text-red-600 font-bold text-[10px] mb-1">Terms and Conditions</p>
                                        <p className="leading-[10px]">Monthly Walker pass Validity is only till the end of the month,<br />irrespective of the date of purchase</p>
                                        <p className="leading-[10px] mt-1">Monthly Walker pass Validity is only till 30th of June Next Year,<br />irrespective of the Month of purchase</p>
                                        <p className="leading-[10px] mt-1">The Walker pass is only valid once a Day.</p>
                                        <p className="leading-[10px] mt-1">Park Timings: Open daily from 06:00 am – 6:00 pm</p>
                                    </div>
                                    <div className="bg-[#091A8C] text-white py-[5px] flex justify-center items-center">
                                        <p className="text-[8px] font-bold text-center">
                                            VALIDITY: {fmtDate(passData?.validFrom)} TO {fmtDate(passData?.validTo)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={downloadPass}
                                disabled={isDownloading || isPrinting || isPassLoading || !passData || !qrCodeUrl}
                                className={`text-white text-[10px] px-4 py-1 rounded transition-all ${isDownloading || isPrinting || isPassLoading || !passData || !qrCodeUrl
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                    }`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    {isDownloading && renderSpinner("h-3 w-3")}
                                    {isDownloading ? "Downloading..." : "DOWNLOAD PDF"}
                                </span>
                            </button>

                            <button
                                onClick={printPass}
                                disabled={isPrinting || isDownloading || isPassLoading || !passData || !qrCodeUrl}
                                className={`text-white text-[10px] px-4 py-1 rounded transition-all ${isPrinting || isDownloading || isPassLoading || !passData || !qrCodeUrl
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    }`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    {isPrinting && renderSpinner("h-3 w-3")}
                                    {isPrinting ? "Preparing..." : "PRINT PASS"}
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <PopupModal
                popupModalId="walker-pass-load-status"
                isOpen={Boolean(passLoadError)}
                onClose={() => setPassLoadError("")}
                size="small"
                closeButton={false}
                contentClassName="bg-white rounded-lg shadow-lg"
                overlayClassName="bg-gray-800 bg-opacity-60"
            >
                <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Ticket Not Ready
                    </h3>
                    <p className="mt-3 text-sm text-gray-600">
                        {passLoadError}
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="bg-[#09094D] text-white px-4 py-2 rounded text-xs font-semibold"
                        >
                            Retry
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/book-walker-pass", { replace: true })}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-xs font-semibold"
                        >
                            Back To Booking
                        </button>
                    </div>
                </div>
            </PopupModal>
        </AdminLayout>
    );
};

export default WalkerPassCard;