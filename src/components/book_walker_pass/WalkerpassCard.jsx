import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useWalkerpassStore } from "./WalkerpassStore";
import QRCode from "qrcode";
import ForestLogo from "../../images/forestLogo.png";
import DeccanTrailsLogo from "../../images/DeccanTrailsLogo.png";
import TelanganaRisingLogo from "../../images/user/TS_rising_logo2.png";
import SignatureImage from "../../images/signature.png";
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
const PASS_HEADER_TEXT = "TELANGANA FOREST";
const PASS_HEADER_TEXT_LINE_2 = "DEVELOPMENT CORPORATION LTD.";
const PASS_SUBTITLE = "S.K.V.B.R BOTANICAL GARDEN";
const PASS_HEADER_GREEN = "#3d6b3b";
const PASS_BODY_BG = "#f7f5f1";
const PASS_TEXT_BROWN = "#2c1b0f";
const BACK_PAGE_RULES = [
    "Destroy or damage the wildlife or its habitat in the Botanical Garden.",
    "Set fire or candle any fire or leave any fire burning in the Botanical Garden.",
    "Enter the Botanical Garden with any weapon.",
    "Bring any chemicals or explosives into the Botanical Garden.",
    "Use any path other than the designated foot paths for walking in visitor zone.",
    "Litter in the Botanical Garden.",
    "Smoke or consume any alcohol in the Botanical Garden.",
    "Feed or tease any wild animals in the Botanical Garden.",
    "Distribute pamphlets or any other printed material in the Botanical Garden.",
    "Create any nuisance in the Botanical Garden.",
];
const BACK_PAGE_ABIDE_TEXT =
    "I shall abide by the provisions of Forest Act 1967 & Wildlife Protection Act 1972 and Rules made thereunder";
const BACK_PAGE_EMERGENCY_TEXT = "EMERGENCY CONTACT NUMBER +91 8008301605";

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

const getPassFormNo = (data) =>
    data?.assUserDetailsId ||
    data?.AssUserDetailsId ||
    data?.passUserDetailsId ||
    data?.PassUserDetailsId ||
    "";

const getPassActualName = (data) =>
    data?.passName ||
    data?.PassName ||
    data?.passActualName ||
    data?.PassActualName ||
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
            console.error("Invalid walker pass image URL:", imageUrl, error);
        }

        return "";
    };

    if (/^(blob:|https?:\/\/)/i.test(trimmedUrl)) {
        return [getLocalProxyUrl(trimmedUrl), trimmedUrl].filter(Boolean);
    }

    const candidates = [];
    const appBaseUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/`
            : API_BASE_URL;

    try {
        const appUrl = new URL(trimmedUrl, appBaseUrl).href;
        candidates.push(getLocalProxyUrl(appUrl), appUrl);
    } catch (error) {
        console.error("Invalid image URL:", trimmedUrl, error);
    }

    try {
        const apiUrl = new URL(trimmedUrl.replace(/^\/+/, ""), API_BASE_URL).href;
        candidates.push(getLocalProxyUrl(apiUrl), apiUrl);
    } catch (error) {
        console.error("Invalid API image URL:", trimmedUrl, error);
    }

    return [...new Set(candidates.filter(Boolean))];
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
                cache: "no-store",
                headers: {
                    Accept: "image/*",
                },
            },
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
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

const isBlankUserImage = async (src) => {
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
        let whitePixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 20) continue;

            opaquePixels += 1;
            if (pixels[i] < 12 && pixels[i + 1] < 12 && pixels[i + 2] < 12) {
                blackPixels += 1;
            }
            if (pixels[i] > 245 && pixels[i + 1] > 245 && pixels[i + 2] > 245) {
                whitePixels += 1;
            }
        }

        if (opaquePixels < 50) return true;

        const blackRatio = blackPixels / opaquePixels;
        const whiteRatio = whitePixels / opaquePixels;

        return blackRatio > 0.9 || whiteRatio > 0.98;
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
    const fetchedPassIdRef = useRef(null);

    const getUserImageSource = async (data = passData) => {
        if (userImageBase64 && !(await isBlankUserImage(userImageBase64))) {
            return prepareImageForCanvas(userImageBase64);
        }

        const storedImage = getStoredWalkerPassImage(passUserDetailsId);
        if (storedImage && !(await isBlankUserImage(storedImage))) {
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
                if (await isBlankUserImage(preparedImage)) {
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
    const formatDate = (date) => {
        if (!date) return "-";

        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };

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

    const drawText = (ctx, text, x, y, options = {}) => {
        const {
            size = 26,
            weight = "700",
            color = PASS_TEXT_BROWN,
            align = "left",
            letterSpacing = 0,
            font = "Arial",
            maxWidth = null,
            minSize = 5,
        } = options;

        ctx.fillStyle = color;
        let effectiveSize = size;
        ctx.font = `${weight} ${effectiveSize}px ${font}`;
        if (maxWidth && !letterSpacing) {
            while (ctx.measureText(text).width > maxWidth && effectiveSize > minSize) {
                effectiveSize -= 0.5;
                ctx.font = `${weight} ${effectiveSize}px ${font}`;
            }
        }
        ctx.textAlign = align;
        ctx.textBaseline = "alphabetic";

        if (!letterSpacing) {
            ctx.fillText(text, x, y);
            return;
        }

        const chars = String(text).split("");
        const textWidth = chars.reduce((width, char, index) => (
            width + ctx.measureText(char).width + (index < chars.length - 1 ? letterSpacing : 0)
        ), 0);
        let cursorX = x;
        if (align === "center") {
            cursorX = x - textWidth / 2;
        } else if (align === "right") {
            cursorX = x - textWidth;
        }

        chars.forEach((char) => {
            ctx.fillText(char, cursorX, y);
            cursorX += ctx.measureText(char).width + letterSpacing;
        });
    };

    // ─── Draw both original-size cards onto canvas ────────────────────────
    const drawCanvas = async () => {
        const SCALE = 3;
        const W = 340 * SCALE;
        const GAP = CARD_CANVAS_GAP * SCALE;
        const CARD_H = CARD_CANVAS_HEIGHT * SCALE;
        const TOTAL_H = CARD_H * 2 + GAP;

        const canvas = canvasRef.current;
        canvas.width = W;
        canvas.height = TOTAL_H;
        const ctx = canvas.getContext("2d");

        const userImageSourcePromise = getUserImageSource();

        const [forestImg, deccanImg, risingImg, signatureImg, userImageSource, qrImg] = await Promise.all([
            fetchToBase64(ForestLogo).then((b) => loadImage(b || ForestLogo)),
            fetchToBase64(DeccanTrailsLogo).then((b) => loadImage(b || DeccanTrailsLogo)),
            fetchToBase64(TelanganaRisingLogo).then((b) => loadImage(b || TelanganaRisingLogo)),
            fetchToBase64(SignatureImage).then((b) => loadImage(b || SignatureImage)),
            userImageSourcePromise,
            loadImage(qrCodeUrl),
        ]);
        const userImg = userImageSource ? await loadImage(userImageSource).catch(() => null) : null;
        const forestLogoImg = removeEdgeWhiteBackground(forestImg);
        const deccanLogoImg = removeEdgeWhiteBackground(deccanImg);
        const risingLogoImg = removeEdgeWhiteBackground(risingImg);

        const drawClippedCircleImage = (image, imageX, imageY, imageSize) => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(image, imageX, imageY, imageSize, imageSize);
            ctx.restore();
        };

        const drawWhiteLogo = (image, imageX, imageY, imageW, imageH) => {
            const logoCanvas = document.createElement("canvas");
            logoCanvas.width = imageW;
            logoCanvas.height = imageH;
            const logoCtx = logoCanvas.getContext("2d");
            logoCtx.drawImage(image, 0, 0, imageW, imageH);
            logoCtx.globalCompositeOperation = "source-in";
            logoCtx.fillStyle = "#f7f4e9";
            logoCtx.fillRect(0, 0, imageW, imageH);
            ctx.drawImage(logoCanvas, imageX, imageY, imageW, imageH);
        };

        const drawFrontCard = () => {
            const x = 0;
            const y = 0;
            const w = W;
            const h = CARD_H;
            const headerH = 57 * SCALE;
            const bodyY = y + headerH;

            ctx.fillStyle = PASS_BODY_BG;
            roundRect(ctx, x, y, w, h, 12 * SCALE);
            ctx.fill();

            ctx.fillStyle = PASS_HEADER_GREEN;
            roundRectTop(ctx, x, y, w, headerH, 12 * SCALE);
            ctx.fill();

            drawClippedCircleImage(forestLogoImg, x + 8 * SCALE, y + 6 * SCALE, 45 * SCALE);
            drawWhiteLogo(deccanLogoImg, x + w - 49 * SCALE, y + 8 * SCALE, 38 * SCALE, 38 * SCALE);

            drawText(ctx, PASS_HEADER_TEXT, x + w / 2, y + 18 * SCALE, {
                size: 11 * SCALE,
                weight: "800",
                color: "#f7f4e9",
                align: "center",
                letterSpacing: 0.6 * SCALE,
            });
            drawText(ctx, PASS_HEADER_TEXT_LINE_2, x + w / 2, y + 34 * SCALE, {
                size: 9.2 * SCALE,
                weight: "800",
                color: "#f7f4e9",
                align: "center",
                letterSpacing: 0.25 * SCALE,
            });
            drawText(ctx, PASS_SUBTITLE, x + w / 2, y + 48 * SCALE, {
                size: 7 * SCALE,
                weight: "800",
                color: "#f7f4e9",
                align: "center",
                letterSpacing: 0.15 * SCALE,
            });

            const drawDetailLine = (label, value, textX, textY) => {
                const maxWidth = 238 * SCALE;
                const lineHeight = 8 * SCALE;
                const labelText = `${label}: `;
                const labelWidth = ctx.measureText("Pass Type: ").width;
                const valueX = textX + labelWidth;
                const words = String(value || "").split(" ");
                let line = "";
                let currentY = textY;
                ctx.fillStyle = PASS_TEXT_BROWN;
                ctx.font = `800 ${7 * SCALE}px Arial`;
                ctx.textAlign = "left";
                ctx.textBaseline = "alphabetic";
                ctx.fillText(label, textX, currentY);
                ctx.fillText(":", textX + labelWidth - ctx.measureText(": ").width, currentY);

                words.forEach((word) => {
                    const testLine = line ? `${line} ${word}` : word;
                    if (ctx.measureText(testLine).width > maxWidth - labelWidth && line) {
                        ctx.fillText(line, valueX, currentY);
                        line = word;
                        currentY += lineHeight;
                    } else {
                        line = testLine;
                    }
                });

                if (line) {
                    ctx.fillText(line, valueX, currentY);
                    currentY += lineHeight;
                }

                return currentY;
            };

            const name = passData?.userName || passData?.UserName || "";
            let detailY = bodyY + 13 * SCALE;
            detailY = drawDetailLine("Name", name, x + 14 * SCALE, detailY) + 3 * SCALE;
            detailY = drawDetailLine(
                "Pass Type",
                getPassActualName(passData),
                x + 14 * SCALE,
                detailY
            ) + 3 * SCALE;
            drawDetailLine("Form No", getPassFormNo(passData), x + 14 * SCALE, detailY);

            const photoX = x + 14 * SCALE;
            const photoY = bodyY + 49 * SCALE;
            const photoW = 60 * SCALE;
            const photoH = 60 * SCALE;
            if (userImg) {
                ctx.drawImage(userImg, photoX, photoY, photoW, photoH);
            } else {
                ctx.fillStyle = "#000000";
                roundRect(ctx, photoX, photoY, photoW, photoH, 2 * SCALE);
                ctx.fill();
            }
            ctx.drawImage(
                signatureImg,
                390,
                390,
                260,
                330,
                x + 24 * SCALE,
                y + 166 * SCALE,
                38 * SCALE,
                10 * SCALE
            );

            ctx.drawImage(risingLogoImg, x + 145 * SCALE, bodyY + 49 * SCALE, 58 * SCALE, 52 * SCALE);
            ctx.drawImage(qrImg, x + 258 * SCALE, bodyY + 49 * SCALE, 60 * SCALE, 60 * SCALE);

            ctx.strokeStyle = "#111111";
            ctx.lineWidth = 1 * SCALE;
            ctx.beginPath();
            ctx.moveTo(x + 18 * SCALE, y + 179 * SCALE);
            ctx.lineTo(x + 63 * SCALE, y + 179 * SCALE);
            ctx.stroke();
            drawText(ctx, "Authorized Signatory", x + 40.5 * SCALE, y + 185 * SCALE, {
                size: 4.3 * SCALE,
                weight: "400",
                color: "#111111",
                align: "center",
            });
            drawText(ctx, "L.RANJEET NAYAK, IFS", x + 13 * SCALE, y + 192 * SCALE, {
                size: 5 * SCALE,
                weight: "800",
                color: "#111111",
            });
            drawText(ctx, "EXECUTIVE DIRECTOR,", x + 14 * SCALE, y + 198 * SCALE, {
                size: 4.2 * SCALE,
                weight: "800",
                color: "#111111",
            });
            drawText(ctx, "ECO-TOURISM, TGFDC LTD.", x + 14 * SCALE, y + 204 * SCALE, {
                size: 4.2 * SCALE,
                weight: "800",
                color: "#111111",
            });

            drawText(ctx, `Valid up to ${formatDate(passData?.validTo)}`, x + 96 * SCALE, y + 199 * SCALE, {
                size: 8 * SCALE,
                weight: "800",
                letterSpacing: 0.3 * SCALE,
            });
            drawText(ctx, "•", x + 220 * SCALE, y + 198 * SCALE, {
                size: 10 * SCALE,
                weight: "800",
                color: "#d60000",
            });
            drawText(ctx, "NOT TRANSFERABLE", x + 228 * SCALE, y + 199 * SCALE, {
                size: 8 * SCALE,
                weight: "800",
                letterSpacing: 0.55 * SCALE,
            });
        };

        const drawInstructionCard = () => {
            const x = 0;
            const y = CARD_H + GAP;
            const w = W;
            const h = CARD_H;

            ctx.fillStyle = PASS_BODY_BG;
            roundRect(ctx, x, y, w, h, 12 * SCALE);
            ctx.fill();

            const wrapText = (text, textX, textY, maxWidth, lineHeight, options = {}) => {
                const { indent = 0, after = 0 } = options;
                const words = String(text).split(" ");
                let line = "";
                let currentY = textY;

                words.forEach((word) => {
                    const testLine = line ? `${line} ${word}` : word;
                    if (ctx.measureText(testLine).width > maxWidth && line) {
                        ctx.fillText(line, textX, currentY);
                        line = word;
                        currentY += lineHeight;
                        textX += indent;
                        maxWidth -= indent;
                    } else {
                        line = testLine;
                    }
                });

                if (line) {
                    ctx.fillText(line, textX, currentY);
                    currentY += lineHeight;
                }

                return currentY + after;
            };

            drawText(ctx, "I Shall not:", x + 8 * SCALE, y + 18 * SCALE, {
                size: 11 * SCALE,
                weight: "800",
                color: "#245f35",
            });

            ctx.fillStyle = PASS_TEXT_BROWN;
            ctx.font = `800 ${6.8 * SCALE}px Arial`;
            ctx.textAlign = "left";
            let currentY = y + 35 * SCALE;
            BACK_PAGE_RULES.forEach((rule, index) => {
                currentY = wrapText(
                    `${index + 1}. ${rule}`,
                    x + 8 * SCALE,
                    currentY,
                    w - 16 * SCALE,
                    9.8 * SCALE,
                    { indent: 8 * SCALE, after: 1.8 * SCALE }
                );
            });

            currentY += 6 * SCALE;
            ctx.font = `800 ${7.2 * SCALE}px Arial`;
            wrapText(
                BACK_PAGE_ABIDE_TEXT,
                x + 8 * SCALE,
                currentY,
                w - 16 * SCALE,
                9.6 * SCALE
            );

            drawText(ctx, BACK_PAGE_EMERGENCY_TEXT, x + 8 * SCALE, y + h - 8 * SCALE, {
                size: 8.2 * SCALE,
                weight: "800",
                color: "#e60000",
                letterSpacing: 0.25 * SCALE,
            });
        };

        drawFrontCard();
        drawInstructionCard();

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
                                align-items: center;
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
            if (fetchedPassIdRef.current === passUserDetailsId) return;

            try {
                fetchedPassIdRef.current = passUserDetailsId;
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
                if (storedImage && !(await isBlankUserImage(storedImage))) {
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
                            if (await isBlankUserImage(preparedImage)) {
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
                        Book Walker's Pass
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
                                <div className="relative h-[214px] w-[340px] overflow-hidden rounded-[12px] border border-gray-300 bg-[#f7f5f1] shadow">
                                    <div className="absolute left-0 top-0 h-[57px] w-full bg-[#3d6b3b]" />
                                    <img src={ForestLogo} alt="Forest Logo" className="absolute left-2 top-1.5 h-[45px] w-[45px] rounded-full object-cover" />
                                    <img src={DeccanTrailsLogo} alt="Deccan Woods and Trails" className="absolute right-[11px] top-2 h-[38px] w-[38px] object-contain brightness-0 invert" />

                                    <div className="absolute left-[58px] top-[8px] w-[224px] text-center font-extrabold uppercase text-[#f7f4e9]">
                                        <p className="text-[11px] leading-[12px] tracking-[0.06em]">{PASS_HEADER_TEXT}</p>
                                        <p className="mt-1 text-[9px] leading-[10px] tracking-[0.025em]">{PASS_HEADER_TEXT_LINE_2}</p>
                                        <p className="mt-1 text-[7px] leading-[8px] tracking-[0.015em]">{PASS_SUBTITLE}</p>
                                    </div>

                                    <div className="absolute left-[14px] top-[64px] max-w-[238px] text-[#2c1b0f]">
                                        <p className="grid grid-cols-[46px_1fr] text-[7px] font-extrabold leading-[8px]">
                                            <span className="flex justify-between pr-1"><span>Name</span><span>:</span></span>
                                            <span>{passData?.userName || passData?.UserName || ""}</span>
                                        </p>
                                        <p className="mt-[3px] grid grid-cols-[46px_1fr] text-[7px] font-extrabold leading-[8px]">
                                            <span className="flex justify-between pr-1"><span>Pass Type</span><span>:</span></span>
                                            <span>{getPassActualName(passData)}</span>
                                        </p>
                                        <p className="mt-[3px] grid grid-cols-[46px_1fr] text-[7px] font-extrabold leading-[8px]">
                                            <span className="flex justify-between pr-1"><span>Form No</span><span>:</span></span>
                                            <span>{getPassFormNo(passData)}</span>
                                        </p>
                                    </div>

                                    {userImageBase64 || getPassImageValue(passData) ? (
                                        <img
                                            src={userImageBase64 || getPassImageValue(passData)}
                                            alt="User"
                                            className="absolute left-[14px] top-[106px] h-[60px] w-[60px] rounded-sm object-cover"
                                        />
                                    ) : (
                                        <div className="absolute left-[14px] top-[106px] h-[60px] w-[60px] rounded-sm bg-black" />
                                    )}
                                    <img src={SignatureImage} alt="Authorized Signature" className="absolute left-[24px] top-[166px] h-[10px] w-[38px] object-cover object-center" />

                                    <div className="absolute left-[18px] top-[179px] w-[45px] border-t border-black text-center text-black">
                                        <p className="mt-[2px] text-[4px] leading-none">Authorized Signatory</p>
                                    </div>
                                    <div className="absolute left-[13px] top-[189px] text-black">
                                        <p className="text-[5px] font-extrabold leading-[5px]">L.RANJEET NAYAK, IFS</p>
                                        <p className="text-[4px] font-extrabold leading-[5px]">EXECUTIVE DIRECTOR,</p>
                                        <p className="text-[4px] font-extrabold leading-[5px]">ECO-TOURISM, TGFDC LTD.</p>
                                    </div>

                                    <img src={TelanganaRisingLogo} alt="Telangana Rising" className="absolute left-[145px] top-[106px] h-[52px] w-[58px] object-contain mix-blend-multiply" />
                                    {qrCodeUrl ? (
                                        <img src={qrCodeUrl} alt="QR Code" className="absolute left-[258px] top-[106px] h-[60px] w-[60px] object-contain" />
                                    ) : (
                                        <div className="absolute left-[258px] top-[106px] flex h-[60px] w-[60px] items-center justify-center bg-white">
                                            {renderSpinner("h-5 w-5 text-[#09094D]")}
                                        </div>
                                    )}

                                    <p className="absolute bottom-[14px] left-[96px] text-[8px] font-extrabold tracking-[0.04em] text-[#2c1b0f]">
                                        Valid up to {formatDate(passData?.validTo)}
                                    </p>
                                    <span className="absolute bottom-[15px] left-[220px] text-[10px] font-extrabold leading-none text-[#d60000]">•</span>
                                    <p className="absolute bottom-[14px] left-[228px] text-[8px] font-extrabold tracking-[0.07em] text-[#2c1b0f]">
                                        NOT TRANSFERABLE
                                    </p>
                                </div>

                                <div className="mt-3 h-[214px] w-[340px] overflow-hidden rounded-[12px] border border-gray-300 bg-[#f7f5f1] px-2 py-2 shadow">
                                    <h1 className="text-[11px] font-extrabold leading-[12px] text-[#245f35]">
                                        I Shall not:
                                    </h1>
                                    <ol className="mt-1 list-decimal space-y-[1.8px] pl-4 text-[6.8px] font-extrabold leading-[9.8px] text-[#2c1b0f]">
                                        {BACK_PAGE_RULES.map((rule) => (
                                            <li key={rule}>{rule}</li>
                                        ))}
                                    </ol>
                                    <p className="mt-2 text-[7.2px] font-extrabold leading-[9.6px] text-[#2c1b0f]">
                                        {BACK_PAGE_ABIDE_TEXT}
                                    </p>
                                    <p className="mt-1 text-[8.2px] font-extrabold leading-[9px] tracking-[0.04em] text-[#e60000]">
                                        {BACK_PAGE_EMERGENCY_TEXT}
                                    </p>
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