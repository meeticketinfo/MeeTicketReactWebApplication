import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useWalkerpassStore } from "./WalkerpassStore";
import QRCode from "qrcode";
import walkerPassBg from "../../images/walker_pass_bg.png";
import MeeTicketLogo from "../../images/MeeTicketLogo.png";
import ForestLogo from "../../images/ForestLogo.png";
import jsPDF from "jspdf";

const WalkerPassCard = () => {
    const location = useLocation();
    const passUserDetailsId =
        location.state?.passUserDetailsId ||
        localStorage.getItem("passUserDetailsId");

    const { viewPass } = useWalkerpassStore();

    const [passData, setPassData] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [userImageBase64, setUserImageBase64] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    const canvasRef = useRef(null);

    // ─── Get auth token from auth-store ──────────────────────────────────
    const getAuthToken = () => {
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
                if (token) {
                    console.log("Token found in auth-store ✅");
                    return token;
                }
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

        console.log("Token from fallback:", fallback ? "✅ found" : "❌ not found");
        return fallback;
    };

    // ─── Fetch any URL → base64 WITH auth token ──────────────────────────
    const fetchToBase64 = async (url) => {
        try {
            const token = getAuthToken();
            console.log("Fetching image:", url);
            console.log("Using token:", token ? token.substring(0, 30) + "..." : "NO TOKEN");

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            console.log("Image response status:", res.status);

            if (!res.ok) {
                console.error("❌ Image fetch failed:", res.status, res.statusText);
                return null;
            }

            const blob = await res.blob();
            console.log("Blob size:", blob.size, "| type:", blob.type);

            if (blob.size === 0) {
                console.error("❌ Blob is empty");
                return null;
            }

            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    console.log("✅ Base64 ready:", reader.result?.substring(0, 40));
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error("fetchToBase64 error:", e);
            return null;
        }
    };

    // ─── Load base64 → HTMLImageElement ──────────────────────────────────
    const loadImage = (src) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

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

        // Load all images in parallel
        const [bgImg, forestImg, meeImg, userImg, qrImg] = await Promise.all([
            fetchToBase64(walkerPassBg).then((b) => loadImage(b || walkerPassBg)),
            fetchToBase64(ForestLogo).then((b) => loadImage(b || ForestLogo)),
            fetchToBase64(MeeTicketLogo).then((b) => loadImage(b || MeeTicketLogo)),
            userImageBase64 ? loadImage(userImageBase64) : Promise.resolve(null),
            loadImage(qrCodeUrl),
        ]);

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

            // Forest logo circle
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x + 28 * SCALE, y + 26 * SCALE, 20 * SCALE, 0, Math.PI * 2);
            ctx.fill();
            ctx.drawImage(forestImg, x + 8 * SCALE, y + 6 * SCALE, 40 * SCALE, 40 * SCALE);

            // MeeTicket logo circle
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x + w - 28 * SCALE, y + 26 * SCALE, 20 * SCALE, 0, Math.PI * 2);
            ctx.fill();
            ctx.drawImage(meeImg, x + w - 48 * SCALE, y + 7 * SCALE, 40 * SCALE, 40 * SCALE);

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
                ctx.drawImage(userImg, x + 9 * SCALE, bodyY + 8 * SCALE, 62 * SCALE, 76 * SCALE);
            } else {
                ctx.strokeStyle = "#cccccc";
                ctx.lineWidth = 1 * SCALE;
                ctx.strokeRect(x + 9 * SCALE, bodyY + 8 * SCALE, 62 * SCALE, 76 * SCALE);
            }

            // Name label
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.font = `bold ${9 * SCALE}px Arial`;
            ctx.fillText((passData?.userName || "").toUpperCase(), x + 9 * SCALE, bodyY + 92 * SCALE);
            ctx.fillStyle = "#666666";
            ctx.font = `${8 * SCALE}px Arial`;
            ctx.fillText("Name", x + 9 * SCALE, bodyY + 103 * SCALE);

            // DOB
            ctx.fillStyle = "#000000";
            ctx.font = `bold ${9 * SCALE}px Arial`;
            ctx.fillText(passData?.dateOfBirth || "", x + 9 * SCALE, bodyY + 118 * SCALE);
            ctx.fillStyle = "#666666";
            ctx.font = `${8 * SCALE}px Arial`;
            ctx.fillText("Date Of Birth", x + 9 * SCALE, bodyY + 129 * SCALE);

            // QR code
            ctx.drawImage(qrImg, x + w - 120 * SCALE, bodyY + 6 * SCALE, 108 * SCALE, 108 * SCALE);

            // Amount
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.font = `bold ${10 * SCALE}px Arial`;
            ctx.fillText(`Amount: ₹${passData?.price || ""}`, x + w - 66 * SCALE, bodyY + 122 * SCALE);

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

            // MeeTicket logo circle
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x + w - 28 * SCALE, y + 26 * SCALE, 20 * SCALE, 0, Math.PI * 2);
            ctx.fill();
            ctx.drawImage(meeImg, x + w - 48 * SCALE, y + 7 * SCALE, 40 * SCALE, 40 * SCALE);

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
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = (canvas.height * pdfW) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
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
                            body { display: flex; justify-content: center; background: #fff; }
                            img { max-width: 100%; height: auto; display: block; }
                            @media print {
                                body { margin: 0; }
                                img { width: 100%; page-break-inside: avoid; }
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${imgData}" />
                        <script>
                            window.onload = function () {
                                setTimeout(function () {
                                    window.print();
                                    window.close();
                                }, 500);
                            };
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
                const response = await viewPass(passUserDetailsId);
                const data = response?.data;
                setPassData(data);

                console.log("userImage URL:", data?.userImage);

                if (data?.userImage) {
                    const base64 = await fetchToBase64(data.userImage);
                    if (base64) {
                        console.log("✅ User image base64 set successfully");
                        setUserImageBase64(base64);
                    } else {
                        console.error("❌ User image base64 is null — image will be blank");
                    }
                }

                if (data?.bookingId) {
                    const qr = await QRCode.toDataURL(data.bookingId);
                    setQrCodeUrl(qr);
                }
            } catch (error) {
                console.error("View Pass Error:", error);
            }
        };
        fetchPassDetails();
    }, [passUserDetailsId, viewPass]);

    // ─── Debug: log auth-store on mount ──────────────────────────────────
    useEffect(() => {
        try {
            const authStore = localStorage.getItem("auth-store");
            const parsed = JSON.parse(authStore);
            console.log("auth-store keys:", Object.keys(parsed?.state || {}));
            console.log("auth-store state:", JSON.stringify(parsed?.state)?.substring(0, 200));
        } catch (e) {
            console.error("Could not parse auth-store");
        }
    }, []);

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
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 min-h-[75vh] p-6">
                    <div className="flex flex-col items-center">

                        {/* Pass Card Preview */}
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
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <img
                                                src={userImageBase64 || passData?.userImage}
                                                alt="User"
                                                className="w-[62px] h-[76px] border border-gray-300 object-cover"
                                            />
                                            <div className="mt-1 leading-[7px]">
                                                <p className="text-[9px] font-bold uppercase">{passData?.userName}</p>
                                                <p className="text-[8px] text-gray-600 mt-[1px]">Name</p>
                                                <p className="text-[9px] font-bold mt-2">{passData?.dateOfBirth}</p>
                                                <p className="text-[8px] text-gray-600 mt-[1px]">Date Of Birth</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <img src={qrCodeUrl} alt="QR Code" className="w-[108px] h-[108px]" />
                                            <div className="w-[108px] flex justify-center items-center gap-1 mt-[2px]">
                                                <span className="text-[10px] font-bold">Amount:</span>
                                                <span className="text-[10px] font-bold">₹{passData?.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#091A8C] text-white text-center py-[7px] -mt-[7px] relative z-10">
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

                        {/* Buttons */}
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={downloadPass}
                                disabled={isDownloading || !passData || !qrCodeUrl}
                                className={`text-white text-[10px] px-4 py-1 rounded transition-all ${
                                    isDownloading || !passData || !qrCodeUrl
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                }`}
                            >
                                {isDownloading ? "Downloading..." : "DOWNLOAD PDF"}
                            </button>

                            <button
                                onClick={printPass}
                                disabled={isPrinting || !passData || !qrCodeUrl}
                                className={`text-white text-[10px] px-4 py-1 rounded transition-all ${
                                    isPrinting || !passData || !qrCodeUrl
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                }`}
                            >
                                {isPrinting ? "Preparing..." : "PRINT PASS"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default WalkerPassCard;