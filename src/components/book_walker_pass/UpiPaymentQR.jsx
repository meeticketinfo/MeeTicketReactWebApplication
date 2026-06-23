import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import AdminLayout from "../../layouts/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useWalkerpassStore } from "./WalkerpassStore";

const UpiPaymentQR = () => {
    const location = useLocation();
    const passUserDetailsId =
        location.state?.passUserDetailsId ||
        localStorage.getItem("passUserDetailsId");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

    const navigate = useNavigate();
    const upiDeepLink = location.state?.redirectUrl;
    const orderId = location.state?.orderId;

    console.log("Location State:", location.state);
    console.log("UPI Deep Link:", upiDeepLink);

    const { checkOrderStatus, viewPass } = useWalkerpassStore();


    // Generate QR Code
    useEffect(() => {
        const generateQR = async () => {
            try {
                if (!upiDeepLink) return;

                const url = await QRCode.toDataURL(upiDeepLink);
                setQrCodeUrl(url);
            } catch (error) {
                console.error("QR Generation Error:", error);
            }
        };

        generateQR();
    }, [upiDeepLink]);

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
            alert("Payment session expired");

            navigate("/book-walker-pass", {
                replace: true,
            });
        }
    }, [timeLeft, navigate]);

    // Check Payment Status
    useEffect(() => {
        if (!orderId) return;

        const interval = setInterval(async () => {
            try {
                const response = await checkOrderStatus(orderId);

                console.log("Order Status Response:", response);
                console.log("Result Status:", response?.data?.resultStatus);

                if (response?.data?.resultStatus === "TXN_SUCCESS") {

                    // verify pass generated
                    const passResponse = await viewPass(passUserDetailsId);

                    if (passResponse?.status === 200 && passResponse?.data) {

                        navigate("/walker-pass-card", {
                            state: {
                                paymentResponse: response,
                                orderId,
                                passUserDetailsId,
                            },
                        });

                    } else {

                        alert(
                            "Payment was successful, but your pass is still being generated. Please check My Passes after a few minutes."
                        );

                        navigate("/my-passes");
                    }
                }
            } catch (error) {
                console.log("STATUS:", error.response?.status);
                console.log("ERROR:", error.response?.data);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [orderId, navigate, checkOrderStatus]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <AdminLayout>
            <div className="p-6">

                {/* Header */}
                <div className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Book Walker Pass
                    </h2>
                </div>

                {/* Full Width Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 min-h-[75vh]">

                    <div className="flex flex-col items-center justify-center min-h-[75vh]">

                        <h3 className="text-base font-semibold text-gray-700 mb-6">
                            Scan the QR Code for Payment
                        </h3>

                        {qrCodeUrl && (
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

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default UpiPaymentQR;