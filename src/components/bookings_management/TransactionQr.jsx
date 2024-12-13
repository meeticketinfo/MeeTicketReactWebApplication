import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import { useNavigate } from "react-router-dom";
function TransactionQr() {
  const navigate = useNavigate();
  const storedBookingPayload = JSON.parse(
    sessionStorage.getItem("bookingPayload")
  );
  const [counter, setCounter] = useState(240);
  const formatCounter = () => {
    const minutes = Math.floor(counter / 60);
    const seconds = counter % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Example: "1:30"
  };
  const {
    FirstStepTransactionResponse,
    VerifyPaymentStatus,
    PaymentStatus,
    saveBookingDetails,
    selectedBookingsList,
    setIsFirstStepTransaction,
    setIsTransactionFailed,
    setPaymentStatus,
    setIsBookingFormVisible,
  } = useBookingsStore();
  // console.log("FirstStepTransactionResponse", FirstStepTransactionResponse);
  const canvasRef = useRef(null);

  const redirectUrl = FirstStepTransactionResponse?.redirectUrl;

  // for verify status
  useEffect(() => {
    if (counter > 0 && PaymentStatus.resultStatus != "TXN_SUCCESS") {
      const timer = setTimeout(() => {
        setCounter((prev) => prev - 1); // Decrease the counter
        VerifyPaymentStatus(FirstStepTransactionResponse?.orderId); // Verify payment status
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer
    } else if (counter === 0) {
      // Timer is done, set the first step transaction to false
      setIsFirstStepTransaction(false);
      // setIsBookingFormVisible(false);
      sessionStorage.removeItem("bookingPayload");
    }
  }, [
    counter,
    // PaymentStatus.resultStatus,
    // VerifyPaymentStatus,
    // FirstStepTransactionResponse?.orderId,
    // setIsFirstStepTransaction,
  ]);
  //  formate to 2024-12-06T16:00:00.000
  // const formatBookingDate = (date) => {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");
  //   const seconds = String(date.getSeconds()).padStart(2, "0");

  //   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;
  // };
  // const specificTime = new Date();
  // specificTime.setHours(16, 0, 0, 0);

  function formatBookingDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:00:00.000`;
  }
  

  // for generate booking details qr
  useEffect(() => {
    async function handleSaveBookingDetails() {
      if (PaymentStatus.resultStatus === "TXN_SUCCESS") {
        try {
          const currentDate = new Date();
          const result = await saveBookingDetails({
            ...storedBookingPayload,
            transactionId: FirstStepTransactionResponse?.transId,
            transactionId: FirstStepTransactionResponse?.transId,
            bookingDate: formatBookingDate(currentDate),
          });
          if (result && result.data && result.data.status === 200) {
            const newBookingId = result?.data?.data?.data;
            // localStorage.removeItem("booking-process-store");
            navigate(`/entity-bookings/view-details/${newBookingId}`);
            // resetForm();
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
      }
    }

    handleSaveBookingDetails();
  }, [PaymentStatus.resultStatus]);

  //   useEffect(() => {
  //     if (counter === 10) {
  //       console.log("Counter reached 10. Setting TXN_FAILURE.");
  //       setPaymentStatus({ resultStatus: "TXN_FAILURE" });
  //     }
  //   }, [counter, setPaymentStatus]);

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
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold">Scan the QR Code for Payment</h3>
      <canvas className="border" ref={canvasRef}></canvas>
      <div className="text-center text-gray-600">
        {PaymentStatus.resultStatus !== "TXN_SUCCESS" ? (
          <p>
            Transaction Timeout in:{" "}
            <span className="font-medium text-blue-v2">{formatCounter()}</span>
            <span>sec</span>
          </p>
        ) : (
          <p>Payment Successful!</p>
        )}
      </div>
    </div>
  );
}

export default TransactionQr;
