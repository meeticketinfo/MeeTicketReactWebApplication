import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import AdminLayout from "../../layouts/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useWalkerpassStore } from "./WalkerpassStore";
import { getStoredWalkerPassImage } from "./walkerPassImageUtils";
import PopupModal from "../utils/popup_modal/PopupModal";

const renderSpinner = (className = "h-4 w-4") => (
    <span
        className={`${className} inline-block animate-spin rounded-full border-2 border-current border-t-transparent`}
        aria-hidden="true"
    />
);

const UpiPaymentQR = () => {
    const location = useLocation();
    const passUserDetailsId =
        location.state?.passUserDetailsId ||
        localStorage.getItem("passUserDetailsId");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [paymentModal, setPaymentModal] = useState(null);
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);
    const [isCheckingPayment, setIsCheckingPayment] = useState(false);
    const [isVerifyingPass, setIsVerifyingPass] = useState(false);
    const hasHandledPaymentRef = useRef(false);

    const navigate = useNavigate();
    const upiDeepLink = location.state?.redirectUrl;
    const orderId = location.state?.orderId;
    const userImageBase64 =
        location.state?.userImageBase64 ||
        getStoredWalkerPassImage(passUserDetailsId);

    console.log("Location State:", location.state);
    console.log("UPI Deep Link:", upiDeepLink);

    const { checkOrderStatus } = useWalkerpassStore();

    const openPaymentModal = useCallback((modalDetails) => {
        hasHandledPaymentRef.current = true;
        setPaymentModal(modalDetails);
    }, []);

    const navigateToPassCard = useCallback((paymentResponse) => {
        navigate("/walker-pass-card", {
            replace: true,
            state: {
                paymentResponse,
                orderId,
                passUserDetailsId,
                userImageBase64,
                backTo: "/walkers-pass-report",
            },
        });
    }, [navigate, orderId, passUserDetailsId, userImageBase64]);

    const verifyPassAndNavigate = useCallback(async (paymentResponse) => {
        try {
            setIsVerifyingPass(true);
            navigateToPassCard(paymentResponse);
        }
        finally {
            setIsVerifyingPass(false);
        }
    }, [navigateToPassCard]);

    const handleRetryPassVerification = useCallback(async () => {
        const paymentResponse = paymentModal?.paymentResponse;
        setPaymentModal(null);
        hasHandledPaymentRef.current = false;
        await verifyPassAndNavigate(paymentResponse);
    }, [paymentModal, verifyPassAndNavigate]);



    // Generate QR Code
    useEffect(() => {
        const generateQR = async () => {
            try {
                if (!upiDeepLink) {
                    openPaymentModal({
                        type: "upi-link-missing",
                        title: "Payment Information Missing",
                        message:
                            "Unable to generate the payment QR code. Please start the booking process again.",
                    });
                    return;
                }

                setIsGeneratingQR(true);

                const url = await QRCode.toDataURL(upiDeepLink);
                setQrCodeUrl(url);
            } catch (error) {
                console.error("QR Generation Error:", error);

                openPaymentModal({
                    type: "qr-failed",
                    title: "Unable to Generate QR Code",
                    message:
                        "We couldn't generate the payment QR code. Please try again.",
                });
            } finally {
                setIsGeneratingQR(false);
            }
        };

        generateQR();
    }, [upiDeepLink, openPaymentModal]);

    // Countdown Timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Timeout Handling
    useEffect(() => {
        if (timeLeft === 0) {
            openPaymentModal({
                type: "timeout",
                title: "Payment Session Expired",
                message:
                    "Payment was not completed within the allowed time. Please start the walker pass booking again.",
            });
        }
    }, [timeLeft, openPaymentModal]);

    // Check Payment Status
    useEffect(() => {
        if (!orderId || paymentModal || hasHandledPaymentRef.current) return;

        const interval = setInterval(async () => {
            try {
                if (hasHandledPaymentRef.current) return;
                setIsCheckingPayment(true);
                const response = await checkOrderStatus(orderId);

                console.log("Order Status Response:", response);
                console.log("Result Status:", response?.data?.resultStatus);

                if (response?.data?.resultStatus === "TXN_SUCCESS") {
                    if (hasHandledPaymentRef.current) return;
                    hasHandledPaymentRef.current = true;
                    await verifyPassAndNavigate(response);
                    return;
                }

                if (response?.data?.resultStatus === "TXN_FAILURE") {
                    openPaymentModal({
                        type: "payment-failed",
                        title: "Payment Failed",
                        message:
                            response?.data?.resultMsg ||
                            "Payment failed. Please try booking the walker pass again.",
                    });
                }
            } catch (error) {
                console.log("STATUS:", error.response?.status);
                console.log("ERROR:", error.response?.data);
            } finally {
                setIsCheckingPayment(false);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [orderId, paymentModal, checkOrderStatus, openPaymentModal, verifyPassAndNavigate]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <AdminLayout>
            <div className="p-6">

                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Book Walker's Pass
                    </h2>

                    <button
                        onClick={() => navigate("/book-walker-pass", { replace: true })}
                        className="bg-[#09094D] hover:bg-[#07073D] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                {/* Full Width Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 min-h-[75vh]">

                    <div className="flex flex-col items-center justify-center min-h-[75vh]">

                        <h3 className="text-base font-semibold text-gray-700 mb-6">
                            Scan the QR Code for Payment
                        </h3>

                        {isGeneratingQR && (
                            <div className="w-64 h-64 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-600">
                                {renderSpinner("h-8 w-8 text-[#09094D]")}
                                <p className="mt-3 text-xs font-medium">
                                    Generating payment QR...
                                </p>
                            </div>
                        )}

                        {!isGeneratingQR && qrCodeUrl && (
                            <img
                                src={qrCodeUrl}
                                alt="UPI QR Code"
                                className="w-64 h-64 border"
                            />
                        )}

                        <p className="mt-6 text-sm font-medium text-gray-600">
                            Transaction Timeout :
                            {" "}
                            {minutes}:{seconds.toString().padStart(2, "0")}sec
                        </p>
                        <div className="mt-3 min-h-[28px] flex items-center gap-2 text-xs font-medium text-[#09094D]">
                            {(isCheckingPayment || isVerifyingPass) && (
                                <>
                                    {renderSpinner("h-4 w-4")}
                                    <span>
                                        {isVerifyingPass
                                            ? "Payment successful. Generating pass..."
                                            : "Checking payment status..."}
                                    </span>
                                </>
                            )}
                        </div>

                    </div>
                </div>

            </div>
            <PopupModal
                popupModalId="walker-pass-payment-status"
                isOpen={Boolean(paymentModal)}
                onClose={() => setPaymentModal(null)}
                size="small"
                closeButton={false}
                contentClassName="bg-white rounded-lg shadow-lg"
                overlayClassName="bg-gray-800 bg-opacity-60"
            >
                <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {paymentModal?.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600">
                        {paymentModal?.message}
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        {["ticket-pending", "ticket-api-failed"].includes(paymentModal?.type) && (
                            <button
                                type="button"
                                onClick={handleRetryPassVerification}
                                disabled={isVerifyingPass}
                                className="bg-[#09094D] text-white px-4 py-2 rounded text-xs font-semibold disabled:opacity-60"
                            >
                                <span className="inline-flex items-center gap-2">
                                    {isVerifyingPass && renderSpinner("h-3 w-3")}
                                    {isVerifyingPass ? "Verifying..." : "Retry Ticket"}
                                </span>
                            </button>
                        )}

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

export default UpiPaymentQR;