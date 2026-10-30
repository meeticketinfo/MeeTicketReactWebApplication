import { useEffect, useMemo, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import BackButton from "../BackButton";
import TransactionQr from "./TransactionQr";
import TransactionFailed from "./TransactionFailed";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import useAuthStore from "../../store/authStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { useQuantitiesStore } from "../../store/quantitiesStore";
import { useModalStore } from "../../store/modalStore";
import { handleApiError } from "../../utils/apiErrorHandler";
import { formatToCurrency } from "../../utils/TypographyHelper";
import { launchPaytmPOS } from "../../utils/Helper";
import upiIcon from "../../images/upi.svg";
import HandCash from "../../images/cash.svg";
import {
  buildBookingSummaryRows,
  calculateSelectedItemsTotal,
  clearTestZooParkBookingDraft,
  formatBookingDateTimePayload,
  formatDisplayBookingDate,
  getBookingMobileNumber,
  loadTestZooParkBookingDraft,
  saveTestZooParkBookingDraft,
} from "./testZooParkBookingDraft";

const focusConfirmBooking = () => {
  window.setTimeout(() => {
    document.querySelector('[data-enterflow="confirm"]')?.focus();
  }, 0);
};

export const BookingSummaryPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const { roleDetails, decodedTokenData } = useAuthStore();
  const role = roleDetails?.name;
  const { setQuantities } = useQuantitiesStore();

  const {
    saveCashBookingDetails,
    saveFirstBookingDetails,
    IsFirstStepTransaction,
    IsTransactionFailed,
    setisCash,
    isCash,
    setIsTransactionFailed,
    setPaymentStatus,
    Generate_deep_link,
    setCheckPosTsxStatusData,
    setIsBookingFormVisible,
    setPosIndividualNAvigate,
    setPosPaymentTransactionNAvigate,
    setisCompletedZooCounterBookings,
    setPaymentTransactionNAvigate,
    setisCompleteBookings,
  } = useBookingsStore();

  const clearReportBackFlags = () => {
    setPosIndividualNAvigate(false);
    setPosPaymentTransactionNAvigate(false);
    setisCompletedZooCounterBookings(false);
    setPaymentTransactionNAvigate(false);
    setisCompleteBookings(false);
  };

  const { LocationDetails, FetchLocationDetails } = useFacilityStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const { allServiceVariants, fetchAllServiceVariants } =
    useServiceVariantStore();

  const [upi, setUpi] = useState(false);
  const [pos, setPos] = useState(false);
  const [draft] = useState(
    () => location.state?.bookingDraft || loadTestZooParkBookingDraft()
  );

  useEffect(() => {
    fetchAllServices();
    fetchAllServiceVariants();
    const parkId = decodedTokenData?.data?.ParkId;
    if (parkId) {
      FetchLocationDetails(parkId);
    }
  }, []);

  useEffect(() => {
    if (!draft?.selectedItems?.length) {
      toast.error("No booking selection found. Please select tickets again.");
      navigate(draft?.returnPath || "/entity-bookings", { replace: true });
    }
  }, []);

  const summaryRows = useMemo(
    () =>
      buildBookingSummaryRows(draft?.selectedItems || [], {
        allServiceVariants,
        allServices,
      }),
    [draft?.selectedItems, allServiceVariants, allServices]
  );

  const totalAmount = useMemo(
    () => calculateSelectedItemsTotal(draft?.selectedItems || []),
    [draft?.selectedItems]
  );

  const bookingDateDisplay = formatDisplayBookingDate(
    draft?.bookingDateDisplay || new Date()
  );

  const visitorTypeLabel =
    draft?.visitorType === "foreigner" ? "Foreigner" : "Citizen / Indian";

  const displayMobile = getBookingMobileNumber(
    draft?.visitorType || "citizen",
    draft?.countryCode,
    draft?.mobileNumber
  );

  const validationSchema = Yup.object({
    paymentMethod: Yup.string().required("Please select a payment method"),
  });

  const goBackToSelection = () => {
    if (draft) {
      saveTestZooParkBookingDraft(draft);
    }
    setIsBookingFormVisible(true);
    const returnPath = draft?.returnPath || "/entity-bookings";
    navigate(returnPath);
  };

  const handleConfirmBooking = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    if (!draft?.selectedItems?.length) {
      toast.error("No tickets selected.");
      setSubmitting(false);
      return;
    }

    setPaymentStatus({});
    setIsTransactionFailed(false);
    setCheckPosTsxStatusData([]);

    const currentDate = new Date();
    const bookingMobileNumber = getBookingMobileNumber(
      draft.visitorType || "citizen",
      draft.countryCode,
      draft.mobileNumber
    );
    const selectedItems = draft.selectedItems;
    const amount = calculateSelectedItemsTotal(selectedItems);

    const bookingDetailsPayload = {
      amount,
      mobileNumber: bookingMobileNumber,
      customerId: "XYZ",
      departmentId: LocationDetails?.departmentId,
      isIOS: false,
      paymentType: "",
      bookingDate: formatBookingDateTimePayload(currentDate),
      parkId: decodedTokenData?.data?.ParkId,
    };

    if (values.paymentMethod === "pos") {
      try {
        const bookingPaylod = {
          mobileNumber: bookingMobileNumber,
          totalAmount: amount,
          userId: decodedTokenData?.data?.UserId,
          parkId: decodedTokenData?.data?.ParkId,
          transactionId: "",
          bookingDetailsReqDTOs: selectedItems,
        };

        sessionStorage.setItem("bookingPayload", JSON.stringify(bookingPaylod));

        const PosBookingPayload = {
          amount,
          mobileNumber: bookingMobileNumber,
          customerId: "XYZ",
          departmentId: LocationDetails?.departmentId,
          parkId: decodedTokenData?.data?.ParkId,
          bookingDate: formatBookingDateTimePayload(currentDate),
        };

        const redefinedPayload = {
          ...PosBookingPayload,
          bookingReqDTOs: bookingPaylod,
        };

        const res = await Generate_deep_link(redefinedPayload);
        const posQrResponse = res?.data?.data;

        if (posQrResponse?.status === 200) {
          clearTestZooParkBookingDraft();
          setQuantities({});
          if (posQrResponse?.deeplink) {
            launchPaytmPOS(posQrResponse.deeplink);
          }
          navigate(`/confirm-pos`);
        } else {
          console.error(
            "Unexpected response from Generate_deep_link",
            res?.data
          );
          toast.error("Failed to process POS booking. please try again");
        }
      } catch (error) {
        console.error("Error generating deep link or launching POS:", error);
        toast.error("Something went wrong while processing POS booking.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (values.paymentMethod === "cash") {
      const bookingDetailsCashPayload = {
        mobileNumber: bookingMobileNumber,
        totalAmount: amount,
        userId: decodedTokenData?.data?.UserId,
        parkId: decodedTokenData?.data?.ParkId,
        bookingDate: formatBookingDateTimePayload(currentDate),
        bookingDetailsReqDTOs: selectedItems,
      };

      try {
        const result = await saveCashBookingDetails(bookingDetailsCashPayload);

        if (result && result.data && result.data.status === 200) {
          const newBookingId = result?.data?.data?.data;
          clearTestZooParkBookingDraft();
          setQuantities({});
          resetForm();
          clearReportBackFlags();
          navigate(`/entity-bookings/view-details/${newBookingId}`, {
            state: { fromBookingFlow: true },
          });
        } else {
          toast.error(result.data.data.message);
        }
      } catch (xhr) {
        toast.error("Tickets are Not enough for the service");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // UPI
    const bookingPaylod = {
      mobileNumber: bookingMobileNumber,
      totalAmount: amount,
      userId: decodedTokenData?.data?.UserId,
      parkId: decodedTokenData?.data?.ParkId,
      transactionId: "",
      bookingDetailsReqDTOs: selectedItems,
    };
    sessionStorage.setItem("bookingPayload", JSON.stringify(bookingPaylod));

    try {
      const redefinedPayload = {
        ...bookingDetailsPayload,
        bookingReqDTOs: bookingPaylod,
      };
      const result = await saveFirstBookingDetails(redefinedPayload);

      if (result.data.data.status != 200) {
        toast.error(result.data.data.message);
      } else {
        clearTestZooParkBookingDraft();
        setQuantities({});
      }
      resetForm();
    } catch (xhr) {
      handleApiError(xhr);
    } finally {
      resetForm();
      setSubmitting(false);
    }
  };

  if (!draft?.selectedItems?.length) {
    return null;
  }

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-5xl mx-auto">
        {IsFirstStepTransaction ? (
          IsTransactionFailed ? (
            <TransactionFailed />
          ) : (
            <div className="Transaction Failed">
              <TransactionQr />
            </div>
          )
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-blue-v1">
                Booking Summary
              </h1>
              <BackButton
                label="Back"
                onClick={goBackToSelection}
                className="bg-blue-v1 hover:bg-blue-v2 rounded-lg"
              />
            </div>

            <div className="bg-white border border-blue-v1/30 rounded-md shadow-sm p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-blue-v1 min-w-[120px]">
                    Booking Date
                  </span>
                  <span className="text-gray-800">: {bookingDateDisplay}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-blue-v1 min-w-[120px]">
                    Mobile Number
                  </span>
                  <span className="text-gray-800">
                    : {displayMobile || "—"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-blue-v1 min-w-[120px]">
                    Visitor Type
                  </span>
                  <span className="text-gray-800">: {visitorTypeLabel}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-blue-v1/30 rounded-md shadow-sm overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-v1 text-white">
                      <th className="text-left font-semibold px-3 py-2 border border-blue-v1">
                        Ticket Type
                      </th>
                      <th className="text-center font-semibold px-3 py-2 border border-blue-v1 whitespace-nowrap">
                        No. of Adults
                      </th>
                      <th className="text-center font-semibold px-3 py-2 border border-blue-v1 whitespace-nowrap">
                        No. of Children
                      </th>
                      <th className="text-right font-semibold px-3 py-2 border border-blue-v1 whitespace-nowrap">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-4 text-center text-gray-500 border border-gray-200"
                        >
                          No selected tickets to display.
                        </td>
                      </tr>
                    ) : (
                      summaryRows.map((row) => (
                        <tr key={row.id} className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 border border-gray-200 text-blue-v1 font-medium">
                            {row.ticketType}
                            {row.isNonPerson && row.quantity != null
                              ? ` (Qty: ${row.quantity})`
                              : ""}
                          </td>
                          <td className="px-3 py-2 border border-gray-200 text-center text-gray-800">
                            {row.isNonPerson ? "—" : row.adults || 0}
                          </td>
                          <td className="px-3 py-2 border border-gray-200 text-center text-gray-800">
                            {row.isNonPerson ? "—" : row.children || 0}
                          </td>
                          <td className="px-3 py-2 border border-gray-200 text-right font-semibold text-gray-900">
                            {formatToCurrency(row.totalAmount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td
                        colSpan={3}
                        className="px-3 py-2 border border-gray-200 text-right font-bold text-blue-v1"
                      >
                        Total Amount
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-right font-bold text-blue-v1 text-base">
                        {formatToCurrency(totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <Formik
              initialValues={{ paymentMethod: "" }}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={handleConfirmBooking}
            >
              {({
                values,
                setFieldValue,
                isSubmitting,
                errors,
                touched,
                submitForm,
              }) => (
                <Form className="bg-gray-100 p-4 rounded-md shadow-md">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold text-blue-v1 mb-2">
                        Payment Method
                      </h2>
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="flex items-center">
                          <Field
                            id="summary-upi-radio"
                            name="paymentMethod"
                            type="radio"
                            value="upi"
                            tabIndex={-1}
                            onClick={() => {
                              setUpi(true);
                              setPos(false);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="summary-upi-radio"
                            tabIndex={0}
                            role="button"
                            className={`flex items-center gap-2 p-2 border rounded-md text-xs font-semibold cursor-pointer transition-all outline-none focus:ring-2 focus:ring-blue-v1 ${
                              values.paymentMethod === "upi"
                                ? "bg-blue-v1 text-white shadow-lg"
                                : "bg-white text-blue-v1 shadow-custom border border-[#c0c0c0] hover:bg-blue-v1 hover:text-white hover:shadow-custom "
                            }`}
                          >
                            <img
                              className="w-8"
                              src={upiIcon}
                              alt="UPI Icon"
                            />
                            UPI Payment
                          </label>
                        </div>

                        {(role === "ROLE_ZOOPARKADMIN" ||
                          role === "ROLE_COUNTERLOGIN") && (
                          <div className="flex items-center">
                            <Field
                              id="summary-pos-radio"
                              name="paymentMethod"
                              type="radio"
                              value="pos"
                              tabIndex={-1}
                              onClick={() => {
                                setPos(true);
                                setUpi(false);
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="summary-pos-radio"
                              tabIndex={0}
                              role="button"
                              className={`flex items-center gap-2 p-2 border rounded-md text-xs font-semibold cursor-pointer transition-all outline-none focus:ring-2 focus:ring-blue-v1 ${
                                values.paymentMethod === "pos"
                                  ? "bg-blue-v1 text-white shadow-lg"
                                  : "bg-white text-blue-v1 shadow-custom border border-[#c0c0c0] hover:bg-blue-v1 hover:text-white hover:shadow-custom "
                              }`}
                            >
                              <img
                                className="w-8"
                                src={upiIcon}
                                alt="POS Icon"
                              />
                              Pos Device
                            </label>
                          </div>
                        )}

                        <div className="flex items-center">
                          <Field
                            id="summary-cash-radio"
                            name="paymentMethod"
                            type="radio"
                            value="cash"
                            tabIndex={-1}
                            onClick={() => {
                              setOpenModalId("cash");
                              setisCash(false);
                              setUpi(false);
                              setPos(false);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="summary-cash-radio"
                            tabIndex={0}
                            role="button"
                            className={`flex items-center gap-2 p-2 rounded-md border text-xs font-semibold cursor-pointer transition-all outline-none focus:ring-2 focus:ring-blue-v1 ${
                              values.paymentMethod === "cash"
                                ? "bg-blue-v1 text-white shadow-lg"
                                : "bg-white text-blue-v1 shadow-custom border border-[#c0c0c0] hover:bg-blue-v1 hover:text-white hover:shadow-lg "
                            }`}
                          >
                            <img
                              className="w-[18px] fill-black"
                              src={HandCash}
                              alt="Cash Icon"
                            />
                            Cash Payment
                          </label>
                        </div>
                      </div>

                      {errors.paymentMethod && touched.paymentMethod && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.paymentMethod}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-stretch sm:items-end gap-2">
                      <p className="text-lg font-bold text-blue-v1">
                        Total: {formatToCurrency(totalAmount)}
                      </p>
                      <button
                        type="button"
                        data-enterflow="confirm"
                        disabled={!isCash && !upi && !pos}
                        onClick={() => submitForm()}
                        className={`text-base rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-v1 ${
                          !isCash && !upi && !pos
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : isSubmitting
                              ? "bg-gradient-to-r from-blue-v1 via-blue-800 to-blue-v1 animate-pulse text-white"
                              : "bg-blue-v1 text-white"
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="font-light">Loading . . .</span>
                        ) : values.paymentMethod === "cash" ? (
                          <span>Confirm Booking</span>
                        ) : (
                          <span>Proceed to Payment</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <PopupModal
                    popupModalId="summary-cash-modal"
                    isOpen={openModalId === "cash"}
                    onClose={closeModal}
                    size="small"
                    overlayClassName="bg-gray-800 bg-opacity-60"
                    contentClassName="bg-white"
                    defaultBodyPadding={true}
                  >
                    <div className="px-10 py-14">
                      <h1 className="text-blue-v1 font-semibold">
                        Are you sure that you have received the cash?
                      </h1>
                      <div className="flex justify-center gap-6 mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("paymentMethod", "cash");
                            setisCash(true);
                            closeModal();
                            focusConfirmBooking();
                          }}
                          className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
                        >
                          Proceed
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setisCash(false);
                            setFieldValue("paymentMethod", "");
                            closeModal();
                          }}
                          className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  </PopupModal>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default BookingSummaryPreview;
