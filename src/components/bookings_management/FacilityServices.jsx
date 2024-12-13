import { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
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
import { formatToCurrency, toTitleCase } from "../../utils/TypographyHelper";
import TransactionQr from "./TransactionQr";
import TransactionFailed from "./TransactionFailed";
import { Checkbox } from "@headlessui/react";
import upiIcon from "../../images/upi.svg";
import HandCash from "../../images/cash.svg";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useModalStore } from "../../store/modalStore";

export const FacilityServices = () => {
  const navigate = useNavigate();
  const { openModalId, setOpenModalId, closeModal } = useModalStore();

  const {
    saveBookingDetails,
    fetchCurrentBookingDetailsByBookingId,
    saveFirstBookingDetails,
    FirstStepTransactionResponse,
    IsFirstStepTransaction,
    setSelectedBookingsList,
    VerifyPaymentStatus,
    IsTransactionFailed,
    isSaveFirstTransactionDetailsLoading,
    setisUpi,
    isUpi,
    setisCash,
    isCash,
  } = useBookingsStore();
  // console.log("isUpi", isUpi);
  const { decodedTokenData, DepartmentId } = useAuthStore();

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
  const { expandedItems, toggleItem } = useAccordionStore();

  const accordionItems = [
    { id: 1, title: "Item 1", content: "This is the content for item 1" },
    { id: 2, title: "Item 2", content: "This is the content for item 2" },
    { id: 3, title: "Item 3", content: "This is the content for item 3" },
  ];
  const validationSchema = Yup.object({
    paymentMethod: Yup.string().required("Please select a payment method."), // Add validation for payment method
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveBookingDetails
  ) => {
    const totalAmount = calculateTotalAmount(values.selectedItems);
    const bookingDetailsPayload = {
      amount: totalAmount,
      customerId: "XYZ",
      departmentId: LocationDetails?.departmentId,
      isIOS: false,
      paymentType: "",
      parkId: decodedTokenData?.data?.ParkId,
    };

    if (values.paymentMethod==="cash") {
      const totalAmount = calculateTotalAmount(values.selectedItems);
    const currentDateTime = new Date().toISOString;
    const bookingDetailsPayload = {
      totalAmount: totalAmount,
      userId: decodedTokenData?.data?.UserId,
      parkId: decodedTokenData?.data?.ParkId,
      transactionId: "",
      bookingDate: currentDateTime,
      bookingDetailsReqDTOs: values.selectedItems,
    };
    console.log("Booking Details Payload:", bookingDetailsPayload);
    try {
      const result = await saveBookingDetails(bookingDetailsPayload);
      if (result && result.data && result.data.status === 200) {
        const newBookingId = result?.data?.data?.data;
        navigate(`/entity-bookings/view-details/${newBookingId}`);
        resetForm();
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      handleApiError(xhr);
    } finally {
      setSubmitting(false);
    }
    }
    else{
      const bookingPaylod = {
        totalAmount: totalAmount,
        userId: decodedTokenData?.data?.UserId,
        parkId: decodedTokenData?.data?.ParkId,
        transactionId: "",
  
        bookingDetailsReqDTOs: values.selectedItems,
      };
      sessionStorage.setItem("bookingPayload", JSON.stringify(bookingPaylod));
  
      // console.log("bookingDetailsPayload",bookingDetailsPayload)
  
      try {
        const result = await saveFirstBookingDetails(bookingDetailsPayload);
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


    // if (isCash) {
    //   const totalAmount = calculateTotalAmount(values.selectedItems);
    //   const currentDateTime = new Date().toISOString;
    //   const bookingDetailsPayload = {
    //     totalAmount: totalAmount,
    //     userId: decodedTokenData?.data?.UserId,
    //     parkId: decodedTokenData?.data?.ParkId,
    //     transactionId: "",
    //     bookingDate: currentDateTime,
    //     bookingDetailsReqDTOs: values.selectedItems,
    //   };
    //   // console.log("Booking Details Payload:", bookingDetailsPayload);
    //   try {
    //     const result = await saveBookingDetails(bookingDetailsPayload);
    //     if (result && result.data && result.data.status === 200) {
    //       const newBookingId = result?.data?.data?.data;
    //       navigate(`/entity-bookings/view-details/${newBookingId}`);
    //       resetForm();
    //     } else {
    //       toast.error("Unexpected response from the server.");
    //     }
    //   } catch (xhr) {
    //     handleApiError(xhr);
    //   } finally {
    //     setSubmitting(false);
    //   }
    // }
    // if (isUpi) {
    //   const bookingPaylod = {
    //     totalAmount: totalAmount,
    //     userId: decodedTokenData?.data?.UserId,
    //     parkId: decodedTokenData?.data?.ParkId,
    //     transactionId: "",

    //     bookingDetailsReqDTOs: values.selectedItems,
    //   };
    //   sessionStorage.setItem("bookingPayload", JSON.stringify(bookingPaylod));

    //   // console.log("bookingDetailsPayload",bookingDetailsPayload)

    //   try {
    //     const result = await saveFirstBookingDetails(bookingDetailsPayload);
    //     setQuantities({});
    //     values.selectedItems = [];
    //     resetForm();
    //   } catch (xhr) {
    //     handleApiError(xhr);
    //   } finally {
    //     resetForm();

    //     setSubmitting(false);
    //   }
    // }
  };

  return (
    <>
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
          <Formik
            initialValues={{
              selectedItems: [],
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
                  ?.filter((facility) => facility.isActive)
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
                                (service) => service.facilityId === facility.id
                              )
                              .map((service) => (
                                <div
                                  key={service.id}
                                  className="service bg-gray-200 border- border-blue-v2 p-2 rounded-md text-white"
                                >
                                  <h6 className="text-1xl text-blue-v1 font-semibold">
                                    {toTitleCase(service.displayName) ||
                                      toTitleCase(service.name)}
                                  </h6>

                                  <div className="service-variant-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
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
                                          className="service-variant bg-white rounded-md shadow-md border border-blue-v2 flex justify-between gap-4"
                                        >
                                          <h6 className="text-sm font-medium text-[#0c3771] p-2">
                                            {toTitleCase(variant.name) ||
                                              toTitleCase(variant.displayName)}
                                          </h6>
                                          <p className="text-gray-800 font-semibold p-2">
                                            {formatToCurrency(variant.amount)}
                                          </p>

                                          {variant.isPriceFixed ? (
                                            <>
                                              {/* <p className="text-gray-800 font-semibold p-2">
                                          {formatToCurrency(variant.amount)}
                                        </p> */}
                                              <div className="quantity-controls flex items-center gap-2 p-1 border border-gray-200 rounded">
                                                <Field
                                                  type="checkbox"
                                                  name="selectedItems"
                                                  checked={
                                                    values.selectedItems.some(
                                                      (item) =>
                                                        item.serviceVarientId ===
                                                        variant.id
                                                    ) || false
                                                  }
                                                  onChange={(e) => {
                                                    e.stopPropagation();
                                                    const exists =
                                                      values.selectedItems.find(
                                                        (item) =>
                                                          item.serviceVarientId ===
                                                          variant.id
                                                      );

                                                    if (exists) {
                                                      // If the item exists, remove it and reset the quantity
                                                      updateQuantity(
                                                        variant.id,
                                                        -1
                                                      );
                                                      setFieldValue(
                                                        "selectedItems",
                                                        values.selectedItems.filter(
                                                          (item) =>
                                                            item.serviceVarientId !==
                                                            variant.id
                                                        ) // Remove the item from selectedItems
                                                      );
                                                    } else {
                                                      // If the item does not exist, add it with initial values
                                                      updateQuantity(
                                                        variant.id,
                                                        0
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
                                                          },
                                                        ]
                                                      );
                                                    }
                                                  }}
                                                  className="bg-gray-300 text-gray-800 w-5 h-5 rounded hover:bg-gray-400"
                                                />
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div className="quantity-controls flex items-center gap-2 p-2 border border-gray-200 rounded">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      quantities[variant.id] ||
                                                      0;
                                                    if (currentQuantity > 0) {
                                                      updateQuantity(
                                                        variant.id,
                                                        -1
                                                      );
                                                      setFieldValue(
                                                        "selectedItems",
                                                        values.selectedItems.map(
                                                          (item) =>
                                                            item.serviceVarientId ===
                                                            variant.id
                                                              ? {
                                                                  ...item,
                                                                  quantity:
                                                                    item.quantity -
                                                                    1,
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

                                                <span className="text-gray-800 text-center font-medium w-[14px]">
                                                  {quantities[variant.id] || 0}
                                                </span>

                                                <button
                                                  type="button"
                                                  onClick={() => {
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
                                                  className="bg-gray-300 text-gray-800 px-2 rounded hover:bg-gray-400"
                                                >
                                                  +
                                                </button>
                                              </div>
                                            </>
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

                        <div className="flex items-center gap-6 mt-2">
                          <div className="flex items-center">
                            <Field
                              id="upi-radio"
                              name="paymentMethod"
                              type="radio"
                              value="upi"
                              onClick={() => {
                                setOpenModalId("upi");
                                setisCash(true)
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="upi-radio"
                              className={`flex items-center gap-2 p-2  border rounded-md text-xs font-medium cursor-pointer transition-all ${values.paymentMethod === 'upi' ? 'bg-blue-v1 text-white shadow-lg' : 'bg-white text-blue-v1 shadow-custom border '}
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

                          <div className="flex items-center">
                            <Field
                              id="cash-radio"
                              name="paymentMethod"
                              type="radio"
                              value="cash"
                              onClick={() => {
                                setOpenModalId("cash");
                                setisCash(false)
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="cash-radio"
                              className={`flex items-center gap-2 p-2 rounded-md  border text-xs font-medium cursor-pointer transition-all ${values.paymentMethod === 'cash' ? 'bg-blue-v1 text-white shadow-lg' : 'bg-white text-blue-v1 shadow-custom border '}
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
                  </div>
                )}

                <div className="flex justify-center p-2">
                  {/* <button
                    type="submit"
                   
                    disabled={!values.selectedItems?.length && !isUpi && !isCash}
                    className={`text-base rounded-lg px-3 py-1 ${
                      values.selectedItems.length > 0
                        ? `${
                            isSubmitting
                              ? "bg-gradient-to-r from-blue-v1 via-blue-800 to-blue-v1 animate-pulse text-white"
                              : "bg-blue-v1 text-white"
                          }`
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="font-light">Loading . . .</span>
                    ) : (
                      <span>Continue Booking</span>
                    )}
                  </button> */}
                  <button
                    type="submit"
                    disabled={!isCash} 
                    className={`text-base rounded-lg px-3 py-1 ${
                      !isCash
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        :
                         isSubmitting
                        ? "bg-gradient-to-r from-blue-v1 via-blue-800 to-blue-v1 animate-pulse text-white"
                        : "bg-blue-v1 text-white"
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
      {/* upi */}
      {/* <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "upi"}
        onClose={closeModal}
        // title={"Add Sub-Facility"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1  font-medium">
            Would you like to proceed with UPI payment?
          </h1>
          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={() => {
                setisUpi(true);
                closeModal();
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              Proceed
            </button>
            <button
              onClick={() => {
                setisUpi(false);
                closeModal();
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal> */}
    </>
  );
};

export default FacilityServices;
