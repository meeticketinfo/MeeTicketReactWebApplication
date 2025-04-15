import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import { useNavigate } from "react-router-dom";
import TransactionProcessingLoader from "./TransactionProcessingLoader";
import TransactionQrLoader from "./TransactionQrLoader";
import BackButton from "../BackButton";
import useAuthStore from "../../store/authStore";

function formatBookingDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:00:00.000`;
}

function TransactionQr() {
  const navigate = useNavigate();
  const storedBookingPayload = JSON.parse(
    sessionStorage.getItem("bookingPayload")
  );
  const [counter, setCounter] = useState(240);
  const formatCounter = () => {
    const minutes = Math.floor(counter / 60);
    const seconds = counter % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const {
    FirstStepTransactionResponse,
    VerifyPaymentStatus,
    PaymentStatus,
    saveBookingDetails,
    setIsFirstStepTransaction,
    setIsTransactionFailed,
    setPaymentStatus,
    setIsBookingFormVisible,
  } = useBookingsStore();
  const { roleDetails } = useAuthStore();
  const role = roleDetails?.name;
  const canvasRef = useRef(null);

  const redirectUrl = FirstStepTransactionResponse?.redirectUrl;

  // for verify status
  useEffect(() => {
    if (counter > 0 && PaymentStatus.resultStatus != "TXN_SUCCESS") {
      const timer = setTimeout(() => {
        setCounter((prev) => prev - 1);
        VerifyPaymentStatus(FirstStepTransactionResponse?.orderId);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (counter === 0) {
      setIsFirstStepTransaction(false);
      setPaymentStatus({});
      sessionStorage.removeItem("bookingPayload");
    }
  }, [counter]);

  

  // for generate booking details qr
  useEffect(() => {
    async function handleSaveBookingDetails() {
      if (PaymentStatus.resultStatus === "TXN_SUCCESS") {
        try {
          const currentDate = new Date();
          const result = await saveBookingDetails({
            ...storedBookingPayload,
            transactionId: FirstStepTransactionResponse?.orderId
              ? FirstStepTransactionResponse?.orderId
              : "CounterUpi",

            bookingDate: formatBookingDate(currentDate),
          });
          if (result && result.data && result.data.status === 200) {
            setPaymentStatus({});
            const newBookingId = result?.data?.data?.data;
           
            navigate(`/entity-bookings/view-details/${newBookingId}`);
           
          } else {
            toast.error("Unexpected response from the server.");
          }
        } catch (xhr) {
          handleApiError(xhr);
        } finally {
          setSubmitting(false);
        }
      } else if (PaymentStatus.resultStatus === "TXN_FAILURE") {
        setIsTransactionFailed(true);
        setPaymentStatus({});
      }
    }

    handleSaveBookingDetails();
  }, [PaymentStatus.resultStatus]);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        redirectUrl,
        { width: 356, margin: 4 },
        (error) => {
          if (error) {
            console.error("Error generating QR code:", error);
          }
        }
      );
    }
  }, [redirectUrl]);

  return (
    <>
      {role === "ROLE_ZOOPARKADMIN" && (
        <div className="flex justify-end">
          <BackButton
            label="Back"
            onClick={() => {
              setIsBookingFormVisible(false);
              setIsFirstStepTransaction(false);
              setPaymentStatus({});
              localStorage.removeItem("booking-process-store");
            }}
            className="bg-blue-600 hover:bg-blue-700 flex items-end"
            // disabled={isSubmitting}
          />
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold">Scan the QR Code for Payment</h3>
        <canvas className="border" ref={canvasRef}></canvas>
        <div className="text-center text-gray-600">
          {PaymentStatus.resultStatus !== "TXN_SUCCESS" ? (
            <p>
              Transaction Timeout in:{" "}
              <span className="font-medium text-blue-v2">
                {formatCounter()}
              </span>
              <span>sec</span>
            </p>
          ) : (
            <TransactionQrLoader />
          )}
        </div>
      </div>
    </>
  );
}

export default TransactionQr;
