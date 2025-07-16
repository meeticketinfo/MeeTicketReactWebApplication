import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../utils/apiErrorHandler";
import TransactionQrLoader from "./TransactionQrLoader";
import { launchPaytmPOS } from "../../utils/Helper";
import PosTransactionFailed from "./PosTransactionFailed";
import { toast, ToastContainer } from "react-toastify";
import BackButton from "../BackButton";
import useOnlineStatus from "../../utils/useOnlineStatus";
import PosLoader from "../../web_app_loaders/PosLoader";

function formatBookingDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:00:00.000`;
}
const PosConfirmation = () => {
  const isOnline = useOnlineStatus();
  console.log("isOnline", isOnline);
  const [counter, setCounter] = useState(120);
  const [Timercounter, setTimercounter] = useState(120);
  const [isPosTransactionFailed, setIsPosTransactionFailed] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatCounter = () => {
    const minutes = Math.floor(counter / 60);
    const seconds = counter % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const storedBookingPayload = JSON.parse(
    sessionStorage.getItem("bookingPayload")
  );

  // for timer

  const TimerformatCounter = () => {
    const minutes = Math.floor(Timercounter / 60);
    const seconds = Timercounter % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const {
    setIsFirstStepTransaction,
    setPaymentStatus,
    setIsBookingFormVisible,
    savePosBookingDetails,
    CheckPosTsxStatus,
    Generate_deep_link_data,
    CheckPosTsxStatusData,
  } = useBookingsStore();

  const { roleDetails } = useAuthStore();
  // const role = roleDetails?.name;

  if (!isOnline) {
    launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
    navigate(`/book-tickets`);
    sessionStorage.removeItem("bookingPayload");
    setPaymentStatus({});
    localStorage.removeItem("booking-process-store");
  }

  useEffect(() => {
    if (counter > 0 && CheckPosTsxStatusData.resultStatus !== "TXN_SUCCESS") {
      const timer = setTimeout(() => {
        setCounter((prev) => prev - 1);
        CheckPosTsxStatus(Generate_deep_link_data?.orderId);
      }, 5000);

      return () => clearTimeout(timer);
    } else if (counter === 0) {
      launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
      navigate(`/book-tickets`);
      sessionStorage.removeItem("bookingPayload");
    }
  }, [counter]);

  // for Timmer
  useEffect(() => {
    if (
      Timercounter > 0 &&
      CheckPosTsxStatusData.resultStatus !== "TXN_SUCCESS"
    ) {
      const timer = setTimeout(() => {
        setTimercounter((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (Timercounter === 0) {
      launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
      navigate(`/book-tickets`);
      sessionStorage.removeItem("bookingPayload");
    }
  }, [Timercounter]);

  // for generate booking details qr
  // console.log("Generate_deep_link_data", Generate_deep_link_data);
  useEffect(() => {
    async function handleSaveBookingDetails() {
      if (CheckPosTsxStatusData.resultStatus === "TXN_SUCCESS") {
        setIsLoading(true);
        try {
          const currentDate = new Date();
          const result = await savePosBookingDetails({
            ...storedBookingPayload,
            posOrderId: Generate_deep_link_data?.orderId
              ? Generate_deep_link_data?.orderId
              : "CounterUpi",
            bookingDate: formatBookingDate(currentDate),
          });
          setIsLoading(false);
          setLoader(true);
          if (result && result.data && result.data.status === 200) {
            launchPaytmPOS(CheckPosTsxStatusData.successDeeplink);
            setTimeout(() => {
              launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
            }, 1000);
            const newBookingId = result?.data?.data?.data;

            navigate(`/entity-bookings/view-details/${newBookingId}`);
          } else {
            toast.error("Unexpected response from the server.");
            setIsPosTransactionFailed(true);
          }
        } catch (xhr) {
          setIsPosTransactionFailed(true);
           
          launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
        } finally {
          //   setSubmitting(false);
          setIsPosTransactionFailed(true);
          launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
        }
      } else if (CheckPosTsxStatusData.resultStatus === "TXN_FAILURE") {
        setIsPosTransactionFailed(true);
        launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
      }
    }

    handleSaveBookingDetails();
  }, [CheckPosTsxStatusData.resultStatus]);
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              POS CONFIRMATION
            </h1>
          </div>
          {true && (
            <div className="flex justify-end">
              <BackButton
                label="Back"
                onClick={() => {
                  // console.log("logged");
                  launchPaytmPOS(Generate_deep_link_data.homeScreenDeeplink);
                  navigate(`/book-tickets`);
                  sessionStorage.removeItem("bookingPayload");
                  setPaymentStatus({});
                  localStorage.removeItem("booking-process-store");
                }}
                className="bg-blue-600 hover:bg-blue-700 flex items-end"
                //  disabled={isSubmitting}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-center text-gray-600">
          {isPosTransactionFailed ? (
            <PosTransactionFailed />
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-gray-700">
              {IsLoading && <PosLoader />}
              <p className="text-lg font-semibold">
                Hang tight! We're waiting for the transaction to complete.
              </p>
              <p className="mt-2 text-sm">This may take a few moments.</p>
              <p className="mt-1 text-sm text-gray-500">
                Auto timeout in{" "}
                <span className="font-bold text-blue-v2">
                  {TimerformatCounter()}
                </span>{" "}
                seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PosConfirmation;
