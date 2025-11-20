import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import useAuthStore from "../../store/authStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { useQuantitiesStore } from "../../store/quantitiesStore";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "../../utils/apiErrorHandler";
import { useNavigate } from "react-router-dom";
import { useAccordionStore } from "../../store/accordionStore";
import { IoIosArrowDown } from "react-icons/io";
import {
  formatToCurrency,
  getCurrentDate,
  toTitleCase,
} from "../../utils/TypographyHelper";
import TransactionQr from "./TransactionQr";
import TransactionFailed from "./TransactionFailed";
import { Checkbox } from "@headlessui/react";
import upiIcon from "../../images/upi.svg";
import HandCash from "../../images/cash.svg";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useModalStore } from "../../store/modalStore";
import { useHolidayStore } from "../../store/masters/holidayStore";
import { launchPaytmPOS } from "../../utils/Helper";
const formatTime = (timeString) => {
  if (!timeString) return ""; // Handle empty cases
  const [hours, minutes, seconds] = timeString.split(":");
  const date = new Date();
  date.setHours(hours, minutes, seconds);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  });
};

const slots = [
  {
    slotId: "77B4B0E5-4FE3-46D6-8D1C-4384F1E93129",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    totalCapacity: 50,
    availableCapacity: 2,
    isExpired: true,
    isSuspended: true,
    bookingDate: "2025-11-14T00:00:00",
  },
  {
    slotId: "7988a62a-4c26-42b7-9dc4-c76cdcc2b11e",
    startTime: "08:00 PM",
    endTime: "09:00 PM",
    totalCapacity: 2147483647,
    availableCapacity: 2147483647,
    isExpired: false,
    isSuspended: false,
    bookingDate: "2025-11-14T00:00:00",
  },
];

export const FacilityServices = () => {
  const navigate = useNavigate();
  function formatBookingDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:00:00.000`;
  }
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const { roleDetails } = useAuthStore();
  const role = roleDetails?.name;

  const {
    saveBookingDetails,
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
  } = useBookingsStore();

  const [upi, SetUpi] = useState(false);
  const [pos, SetPos] = useState(false);
  const { decodedTokenData } = useAuthStore();
  const { fetchAllRecurringHolidays, allRecurringHolidays } = useHolidayStore();
  // disableing button for recurriing holidays

  const currentDay = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  const {
    allFacilities,
    fetchAllFacilities,
    FetchLocationDetails,
    LocationDetails,
  } = useFacilityStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const { allServiceVariants, fetchAllServiceVariants } =
    useServiceVariantStore();
  const { quantities, updateQuantity, setQuantities } = useQuantitiesStore();
  useEffect(() => {
    // Reset quantities when unmounting or component rerenders
    return () => setQuantities({});
  }, []);

  useEffect(() => {
    fetchAllRecurringHolidays();
    fetchAllFacilities();
    fetchAllServices();
    fetchAllServiceVariants();
    FetchLocationDetails(decodedTokenData?.data?.ParkId);
  }, []);

  const calculateTotalAmount = (selectedItems) => {
    return selectedItems.reduce((total, item) => {
      return total + item.quantity * item.unitAmount;
    }, 0);
  };
  const { toggleItem } = useAccordionStore();

  const validationSchema = Yup.object({
    paymentMethod: Yup.string().required("Please select a payment method"), // Add validation for payment method

    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Please enter mobile number"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveBookingDetails
  ) => {
    setPaymentStatus({});
    setIsTransactionFailed(false);
    setCheckPosTsxStatusData([]);

    const currentDate = new Date();
    const totalAmount = calculateTotalAmount(values.selectedItems);
    const bookingDetailsPayload = {
      amount: totalAmount,
      mobileNumber: values.mobileNumber,
      customerId: "XYZ",
      departmentId: LocationDetails?.departmentId,
      isIOS: false,
      paymentType: "",
      bookingDate: formatBookingDate(currentDate),
      parkId: decodedTokenData?.data?.ParkId,
    };

    if (values.paymentMethod === "pos") {
      try {
        const bookingPaylod = {
          mobileNumber: values.mobileNumber,
          totalAmount: totalAmount,
          userId: decodedTokenData?.data?.UserId,
          parkId: decodedTokenData?.data?.ParkId,
          transactionId: "",
          bookingDetailsReqDTOs: values.selectedItems,
        };

        sessionStorage.setItem("bookingPayload", JSON.stringify(bookingPaylod));

        const PosBookingPayload = {
          amount: totalAmount,
          mobileNumber: values.mobileNumber,
          customerId: "XYZ",
          departmentId: LocationDetails?.departmentId,
          parkId: decodedTokenData?.data?.ParkId,
          bookingDate: formatBookingDate(currentDate),
        };

        const redefinedPayload = {
          ...PosBookingPayload,
          bookingReqDTOs: bookingPaylod,
        };

        const res = await Generate_deep_link(redefinedPayload);

        if (res?.data?.data?.status === 200) {
          launchPaytmPOS(res.data.data.deeplink);
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
      const totalAmount = calculateTotalAmount(values.selectedItems);
      const currentDate = new Date();

      const bookingDetailsPayload = {
        mobileNumber: values.mobileNumber,
        totalAmount: totalAmount,
        userId: decodedTokenData?.data?.UserId,
        parkId: decodedTokenData?.data?.ParkId,
        // transactionId: "",
        bookingDate: formatBookingDate(currentDate),
        bookingDetailsReqDTOs: values.selectedItems,
      };

      try {
        const result = await saveCashBookingDetails(bookingDetailsPayload);

        if (result && result.data && result.data.status === 200) {
          const newBookingId = result?.data?.data?.data;
          navigate(`/entity-bookings/view-details/${newBookingId}`);
          resetForm();
        } else {
          toast.error(result.data.data.message);
        }
      } catch (xhr) {
        // handleApiError(xhr);
        toast.error("Tickets are Not enough for the service");
      } finally {
        setSubmitting(false);
      }
    } else {
      const bookingPaylod = {
        mobileNumber: values.mobileNumber,
        totalAmount: totalAmount,
        userId: decodedTokenData?.data?.UserId,
        parkId: decodedTokenData?.data?.ParkId,
        transactionId: "",
        bookingDetailsReqDTOs: values.selectedItems,
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
        }
        setQuantities({});
        values.selectedItems = [];
        resetForm();
      } catch (xhr) {
        handleApiError(xhr);
      } finally {
        resetForm();

        setSubmitting(false);
      }
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        {IsFirstStepTransaction ? (
          IsTransactionFailed ? (
            <TransactionFailed />
          ) : (
            <div className="Transaction Failed">
              <TransactionQr />
            </div>
          )
        ) : (
          <div>
            {LocationDetails?.openTime && LocationDetails?.closedTime && (
              <div className="flex justify-center items-center gap-1 mb-1">
                <h1 className="text-xl font-semibold text-blue-v2">
                  Park Timings:
                </h1>
                <div className="flex justify-center items-center gap-1 text-xl font-semibold text-blue-v2 ">
                  <h1>{formatTime(LocationDetails?.openTime)} -</h1>
                  <h1>{formatTime(LocationDetails?.closedTime)}</h1>
                </div>
              </div>
            )}
            <Formik
              initialValues={{
                selectedItems: [],
                mobileNumber: "",
                paymentMethod: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                handleSubmit(values, actions, saveBookingDetails);
              }}
            >
              {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                <Form className="facility-container space-y-6 px-4 lg:px-0">
                  {allFacilities
                    ?.filter((facility) =>
                      allServices.some(
                        (service) => service.facilityId === facility.id
                      )
                    )
                    ?.filter((facility) => facility.isCounterEnable)
                    .map((facility) => {
                      return (
                        <div
                          key={facility.id}
                          className="facility backdrop-blur-sm bg-white/30 border border-blue-v1 p-2 rounded-md shadow-md text-white cursor-pointer"
                        >
                          <div className="bg-white p-3 rounded-lg">
                            <div
                              className="flex justify-between"
                              onClick={() => toggleItem(facility.id)}
                            >
                              <h4 className="text-1xl font-bold text-blue-v1 cursor-pointer">
                                {toTitleCase(facility.displayName) ||
                                  toTitleCase(facility.name)}
                              </h4>
                            </div>
                            {/* <p className="text-sm opacity-80">{facility.description}</p> */}

                            <div className="services-container space-y-4 mt-4">
                              {allServices
                                ?.filter((service) => service.isActive)
                                ?.filter(
                                  (service) =>
                                    service.facilityId === facility.id
                                )
                                .map((service) => (
                                  <div
                                    key={service.id}
                                    className="service bg-gray-200 border- border-blue-v2 p-2 rounded-md text-white"
                                  >
                                    <div className="flex justify-between">
                                      <h6 className="text-1xl text-blue-v1 font-semibold">
                                        {toTitleCase(service.displayName) ||
                                          toTitleCase(service.name)}
                                      </h6>

                                      {service.limit >= 0 &&
                                      service.limit != null ? (
                                        <div className="flex gap-2">
                                          <h1 className="text-blue-v1 text-sm">
                                            Available Tickets:
                                          </h1>
                                          <h1 className="text-blue-v2 font-bold">
                                            {service.limit}
                                          </h1>
                                        </div>
                                      ) : (
                                        <span className="text-sm text-blue-v1 font-bold">
                                          No Limit
                                        </span>
                                      )}
                                    </div>
                                    <div className="service-variant-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 mt-3">
                                      {allServiceVariants
                                        ?.filter(
                                          (serviceVariant) =>
                                            serviceVariant.isActive
                                        )
                                        ?.filter(
                                          (variant) =>
                                            variant.serviceId === service.id
                                        )
                                        .map((variant) => (
                                          <div
                                            key={variant.id}
                                            className="service-variant bg-white rounded-md shadow-md border border-blue-v2 flex flex-col gap-0 min-w-0"
                                          >
                                            <div className="flex items-center gap-3 p-2">
                                              <h6 className="text-sm font-medium text-[#0c3771] whitespace-nowrap">
                                                {toTitleCase(variant.name) ||
                                                  toTitleCase(
                                                    variant.displayName
                                                  )}
                                              </h6>
                                              {variant.isPriceFixed ? (
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                  <Field
                                                    type="checkbox"
                                                    name="selectedItems"
                                                    checked={values.selectedItems.some(
                                                      (item) =>
                                                        item.serviceVarientId ===
                                                        variant.id
                                                    )}
                                                    onChange={(e) => {
                                                      e.stopPropagation();
                                                      const currentQuantity =
                                                        quantities[
                                                          variant.id
                                                        ] || 0;

                                                      const exists =
                                                        values.selectedItems.find(
                                                          (item) =>
                                                            item.serviceVarientId ===
                                                            variant.id
                                                        );

                                                      if (exists) {
                                                        // Remove item & reset quantity
                                                        updateQuantity(
                                                          variant.id,
                                                          -currentQuantity
                                                        );

                                                        setFieldValue(
                                                          "selectedItems",
                                                          values.selectedItems.filter(
                                                            (item) =>
                                                              item.serviceVarientId !==
                                                              variant.id
                                                          )
                                                        );
                                                      } else {
                                                        // Add new item
                                                        updateQuantity(
                                                          variant.id,
                                                          1
                                                        );

                                                        setFieldValue(
                                                          "selectedItems",
                                                          [
                                                            ...values.selectedItems,
                                                            {
                                                              quantity: 1,
                                                              unitAmount:
                                                                variant.amount ||
                                                                0,
                                                              facilityId:
                                                                facility.id,
                                                              serviceId:
                                                                service.id,
                                                              serviceVarientId:
                                                                variant.id,
                                                              selectedSlots: [],
                                                            },
                                                          ]
                                                        );
                                                      }
                                                    }}
                                                    className="bg-gray-100 outline-none text-blue-v2 w-4 h-4 rounded hover:bg-gray-200"
                                                  />
                                                </div>
                                              ) : (
                                                <div className="quantity-controls flex items-center gap-2 flex-shrink-0">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const currentQuantity =
                                                        quantities[
                                                          variant.id
                                                        ] || 0;

                                                      if (currentQuantity > 0) {
                                                        const updatedQuantity =
                                                          currentQuantity - 1;

                                                        // Update quantity
                                                        updateQuantity(
                                                          variant.id,
                                                          -1
                                                        );

                                                        // Remove from selectedItems if quantity is 0
                                                        const existingItem =
                                                          values.selectedItems.find(
                                                            (item) =>
                                                              item.serviceVarientId ===
                                                              variant.id
                                                          );

                                                        setFieldValue(
                                                          "selectedItems",
                                                          updatedQuantity === 0
                                                            ? values.selectedItems.filter(
                                                                (item) =>
                                                                  item.serviceVarientId !==
                                                                  variant.id
                                                              )
                                                            : values.selectedItems.map(
                                                                (item) =>
                                                                  item.serviceVarientId ===
                                                                  variant.id
                                                                    ? {
                                                                        ...item,
                                                                        quantity:
                                                                          updatedQuantity,
                                                                        selectedSlots:
                                                                          existingItem?.selectedSlots ||
                                                                          [],
                                                                      }
                                                                    : item
                                                              )
                                                        );
                                                      }
                                                    }}
                                                    className="bg-gray-300 text-gray-800 px-2 rounded hover:bg-gray-400"
                                                  >
                                                    -
                                                  </button>

                                                  <input
                                                    type="text"
                                                    className="text-blue-v2 p-1  text-center font-medium w-[80px] border border-blue-v2  rounded-md placeholder:text-blue-v2"
                                                    value={
                                                      quantities[variant.id] ??
                                                      ""
                                                    }
                                                    placeholder="0"
                                                    onChange={(e) => {
                                                      const input =
                                                        e.target.value;

                                                      // Allow only numbers (optional: also allow empty input for better UX)
                                                      if (
                                                        !/^\d*$/.test(input)
                                                      ) {
                                                        return; // Skip update if non-numeric character detected
                                                      }

                                                      let newValue =
                                                        parseInt(input, 10) ||
                                                        0;

                                                      // Enforce limit
                                                      if (
                                                        service.limit !== -1 &&
                                                        service.limit !==
                                                          null &&
                                                        newValue > service.limit
                                                      ) {
                                                        newValue =
                                                          service.limit; // Automatically correct to max limit
                                                      }

                                                      // Update quantities state directly
                                                      updateQuantity(
                                                        variant.id,
                                                        newValue -
                                                          (quantities[
                                                            variant.id
                                                          ] || 0)
                                                      );

                                                      if (newValue > 0) {
                                                        // Get existing item to preserve selectedSlots
                                                        const existingItem =
                                                          values.selectedItems.find(
                                                            (item) =>
                                                              item.serviceVarientId ===
                                                              variant.id
                                                          );

                                                        // Add or update the item in selectedItems
                                                        const newItem = {
                                                          quantity: newValue,
                                                          unitAmount:
                                                            variant.amount || 0,
                                                          facilityId:
                                                            facility.id,
                                                          serviceId: service.id,
                                                          serviceVarientId:
                                                            variant.id,
                                                          selectedSlots:
                                                            existingItem?.selectedSlots ||
                                                            [],
                                                        };

                                                        const updatedItems =
                                                          values.selectedItems
                                                            .filter(
                                                              (item) =>
                                                                item.serviceVarientId !==
                                                                variant.id
                                                            )
                                                            .concat(newItem);

                                                        setFieldValue(
                                                          "selectedItems",
                                                          updatedItems
                                                        );
                                                      } else {
                                                        // Remove item if quantity is 0
                                                        setFieldValue(
                                                          "selectedItems",
                                                          values.selectedItems.filter(
                                                            (item) =>
                                                              item.serviceVarientId !==
                                                              variant.id
                                                          )
                                                        );
                                                      }
                                                    }}
                                                  />

                                                  <button
                                                    type="button"
                                                    // disabled={service.limit === 0}
                                                    disabled={
                                                      service.limit !== -1 &&
                                                      service.limit !== null && // Allow increment if "No Limit"
                                                      (quantities[variant.id] ||
                                                        0) >= service.limit // Check against limit only if it's not "No Limit"
                                                    }
                                                    onClick={() => {
                                                      // Get existing item to preserve selectedSlots
                                                      const existingItem =
                                                        values.selectedItems.find(
                                                          (item) =>
                                                            item.serviceVarientId ===
                                                            variant.id
                                                        );

                                                      const newItem = {
                                                        quantity:
                                                          (quantities[
                                                            variant.id
                                                          ] || 0) + 1,
                                                        unitAmount:
                                                          variant.amount || 0,
                                                        facilityId: facility.id,
                                                        serviceId: service.id,
                                                        serviceVarientId:
                                                          variant.id,
                                                        selectedSlots:
                                                          existingItem?.selectedSlots ||
                                                          [],
                                                      };

                                                      updateQuantity(
                                                        variant.id,
                                                        1
                                                      );

                                                      const updatedItems =
                                                        values.selectedItems
                                                          .filter(
                                                            (item) =>
                                                              item.serviceVarientId !==
                                                              variant.id
                                                          )
                                                          .concat(newItem);

                                                      setFieldValue(
                                                        "selectedItems",
                                                        updatedItems
                                                      );
                                                    }}
                                                    className={` ${
                                                      service.limit !== -1 &&
                                                      service.limit !== null && // Allow increment if "No Limit"
                                                      (quantities[variant.id] ||
                                                        0) >= service.limit
                                                        ? "bg-gray-200"
                                                        : "bg-gray-300 hover:bg-gray-400"
                                                    } text-gray-800 px-2 rounded  `}
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              )}
                                              <p className="text-gray-800 font-semibold flex-shrink-0">
                                                {formatToCurrency(
                                                  variant.amount
                                                )}
                                              </p>
                                            </div>
                                            {!variant.isPriceFixed && (
                                              <div className="text-black">
                                                <h1 className="text-sm font-semibold px-2 mb-2 text-gray-800">
                                                  Slots
                                                </h1>
                                                <div className="flex flex-wrap gap-2 p-2">
                                                  {variant.slots.map((slot) => {
                                                    const currentItem =
                                                      values.selectedItems.find(
                                                        (item) =>
                                                          item.serviceVarientId ===
                                                          variant.id
                                                      );
                                                    const itemSlots =
                                                      currentItem?.selectedSlots ||
                                                      [];
                                                    const isSelected =
                                                      itemSlots.includes(
                                                        slot.slotId
                                                      );
                                                    const isDisabled =
                                                      slot.isExpired ||
                                                      slot.isSuspended ||
                                                      slot.availableCapacity ===
                                                        0 ||
                                                      !currentItem;

                                                    return (
                                                      <label
                                                        key={slot.slotId}
                                                        className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                                                          isSelected
                                                            ? "bg-gradient-to-r from-blue-v1 to-blue-600 text-white shadow-md"
                                                            : isDisabled
                                                            ? "bg-gray-100 text-gray-400 shadow-sm"
                                                            : "bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm border border-gray-200"
                                                        } ${
                                                          isDisabled
                                                            ? "opacity-100 cursor-not-allowed"
                                                            : "cursor-pointer hover:shadow-md"
                                                        }`}
                                                      >
                                                        <input
                                                          type="radio"
                                                          name={`slot-${variant.id}`}
                                                          checked={isSelected}
                                                          onChange={() => {
                                                            if (currentItem) {
                                                              // Set only this slot (radio button behavior - single selection)
                                                              setFieldValue(
                                                                "selectedItems",
                                                                values.selectedItems.map(
                                                                  (item) =>
                                                                    item.serviceVarientId ===
                                                                    variant.id
                                                                      ? {
                                                                          ...item,
                                                                          selectedSlots:
                                                                            [
                                                                              slot.slotId,
                                                                            ],
                                                                        }
                                                                      : item
                                                                )
                                                              );
                                                            }
                                                          }}
                                                          disabled={isDisabled}
                                                          className="hidden"
                                                        />
                                                        <div className="flex gap-[2px]">
                                                          <span
                                                            className={`text-[11px] font-bold ${
                                                              isSelected
                                                                ? "text-white"
                                                                : isDisabled
                                                                ? "text-gray-400"
                                                                : "text-blue-v1"
                                                            }`}
                                                          >
                                                            {slot.startTime}
                                                          </span>
                                                          <span
                                                            className={`text-[9px] font-extrabold ${
                                                              isSelected
                                                                ? "text-white/90"
                                                                : isDisabled
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                            }`}
                                                          >
                                                            (
                                                            {
                                                              slot.availableCapacity
                                                            }
                                                            )
                                                          </span>
                                                        </div>
                                                      </label>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* Preview Section */}
                  {values.selectedItems.length > 0 && (
                    <div className="preview-section bg-gray-100 p-4 rounded-md shadow-md mt-6">
                      <h3 className="text-xl font-bold text-blue-v1 mb-4">
                        Selected Items
                      </h3>
                      <ul className="space-y-4">
                        {values.selectedItems.map((item, index) => {
                          const facility = allFacilities.find(
                            (fac) => fac.id === item.facilityId
                          );
                          const service = allServices.find(
                            (srv) => srv.id === item.serviceId
                          );
                          const variant = allServiceVariants.find(
                            (varnt) => varnt.id === item.serviceVarientId
                          );

                          return (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
                            >
                              <div>
                                <p className="text-sm font-semibold text-blue-v1">
                                  Facility: {toTitleCase(facility?.name || "")}
                                </p>
                                <p className="text-sm text-gray-700">
                                  Service: {toTitleCase(service?.name || "")}
                                </p>
                                <p className="text-sm text-gray-700">
                                  Variant: {toTitleCase(variant?.name || "")}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-700">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-sm text-gray-700">
                                  Amount: {formatToCurrency(item.unitAmount)}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex justify-between mt-4">
                        <div className="">
                          <h1>Payment Method</h1>

                          <div className="flex items-end gap-6 mt-2">
                            <div className="flex items-center">
                              <Field
                                id="upi-radio"
                                name="paymentMethod"
                                type="radio"
                                value="upi"
                                onClick={() => {
                                  SetUpi(true);
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor="upi-radio"
                                className={`flex items-center gap-2 p-2  border rounded-md text-xs font-semibold cursor-pointer transition-all ${
                                  values.paymentMethod === "upi"
                                    ? "bg-blue-v1 text-white shadow-lg"
                                    : "bg-white text-blue-v1 shadow-custom border border-[#c0c0c0] hover:bg-blue-v1 hover:text-white hover:shadow-custom "
                                }
                              `}
                              >
                                <img
                                  className="w-8"
                                  src={upiIcon}
                                  alt="UPI Icon"
                                />
                                UPI Payment
                              </label>
                            </div>
                            {/* POS Device */}
                            {
                              <div className="flex items-center">
                                <Field
                                  id="pos-radio"
                                  name="paymentMethod"
                                  type="radio"
                                  value="pos"
                                  onClick={() => {
                                    SetPos(true);
                                  }}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="pos-radio"
                                  className={`flex items-center gap-2 p-2  border rounded-md text-xs font-semibold cursor-pointer transition-all ${
                                    values.paymentMethod === "pos"
                                      ? "bg-blue-v1 text-white shadow-lg"
                                      : "bg-white text-blue-v1 shadow-custom border border-[#c0c0c0] hover:bg-blue-v1 hover:text-white hover:shadow-custom "
                                  }
                              `}
                                >
                                  <img
                                    className="w-8"
                                    src={upiIcon}
                                    alt="UPI Icon"
                                  />
                                  Pos Device
                                </label>
                              </div>
                            }
                            {/* CASH */}
                            <div className="flex items-center">
                              <Field
                                id="cash-radio"
                                name="paymentMethod"
                                type="radio"
                                value="cash"
                                onClick={() => {
                                  setOpenModalId("cash");
                                  setisCash(false);
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor="cash-radio"
                                className={`flex items-center gap-2 p-2 rounded-md  border text-xs font-semibold cursor-pointer transition-all ${
                                  values.paymentMethod === "cash"
                                    ? "bg-blue-v1 text-white shadow-lg"
                                    : "bg-white text-blue-v1 shadow-custom border border-[#c0c0c0] hover:bg-blue-v1 hover:text-white hover:shadow-lg "
                                }
                              `}
                              >
                                <img
                                  className="w-[18px] fill-black "
                                  src={HandCash}
                                  alt="Cash Icon"
                                />
                                Cash Payment
                              </label>
                            </div>
                            {/* Phone Number */}
                            <div>
                              <label
                                htmlFor="mobileNumber"
                                className="block text-xs font-medium text-gray-700"
                              >
                                Mobile number{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                type="text"
                                maxLength="10"
                                name="mobileNumber"
                                className={`mt-1 block w-full px-2 py-1 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                                placeholder="Enter mobile number"
                                onKeyPress={(e) => {
                                  if (!/^\d$/.test(e.key)) {
                                    e.preventDefault(); // Prevent non-numeric characters
                                  }
                                }}
                              />
                              {/* {errors.mobileNumber && touched.mobileNumber && (
                              <p className="text-red-500 text-xs   absolute z-10 ">
                                {errors.mobileNumber}
                              </p>
                             
                            )} */}
                              <ErrorMessage
                                name="mobileNumber"
                                component="div"
                                className="text-red-500 text-xs absolute"
                              />

                              {/* </div> */}
                            </div>
                          </div>

                          {errors.paymentMethod && touched.paymentMethod && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.paymentMethod}
                            </p>
                          )}
                        </div>

                        <p className="text-lg font-bold text-blue-v1">
                          Total:{" "}
                          {formatToCurrency(
                            calculateTotalAmount(values.selectedItems)
                          )}
                        </p>
                      </div>
                      {/* {saveBookingDetailsError&&<p className="">{saveBookingDetailsError}</p>} */}
                    </div>
                  )}

                  <div className="flex justify-center p-2">
                    <button
                      type="submit"
                      disabled={!isCash && !upi && !pos}
                      className={`text-base rounded-lg px-3 py-1 ${
                        !isCash && !upi && !pos
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : isSubmitting
                          ? "bg-gradient-to-r from-blue-v1 via-blue-800 to-blue-v1 animate-pulse text-white"
                          : "bg-blue-v1 text-white "
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="font-light">Loading . . .</span>
                      ) : (
                        <span>Continue Booking</span>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
        {/* cash */}
        <PopupModal
          popupModalId="first-modal"
          isOpen={openModalId === "cash"}
          onClose={closeModal}
          // title={"Add Sub-Facility"}
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
                onClick={() => {
                  setisCash(true);
                  closeModal();
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
              >
                Proceed
              </button>
              <button
                onClick={() => {
                  setisCash(false);
                  closeModal();
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
              >
                Deny
              </button>
            </div>
          </div>
        </PopupModal>
      </div>
    </>
  );
};

export default FacilityServices;
