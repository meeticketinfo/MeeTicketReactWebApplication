import { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import useAuthStore from "../../store/authStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { useQuantitiesStore } from "../../store/quantitiesStore";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "../../utils/apiErrorHandler";
import { useNavigate } from "react-router-dom";

export const FacilityServices = () => {
  const navigate = useNavigate();
  const { saveBookingDetails, fetchCurrentBookingDetailsByBookingId } =
    useBookingsStore();
  const { decodedTokenData } = useAuthStore();
  const { allFacilities, fetchAllFacilities } = useFacilityStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const { allServiceVariants, fetchAllServiceVariants } =
    useServiceVariantStore();
  const { quantities, updateQuantity } = useQuantitiesStore();

  useEffect(() => {
    fetchAllFacilities();
    fetchAllServices();
    fetchAllServiceVariants();
  }, []);

  const calculateTotalAmount = (selectedItems) => {
    return selectedItems.reduce((total, item) => {
      return total + item.quantity * item.unitAmount;
    }, 0);
  };

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveBookingDetails
  ) => {
    console.log("Form values:", values.selectedItems);
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
        navigate(`/booktickets/view-details/${newBookingId}`);
        resetForm();
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      handleApiError(xhr);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        selectedItems: [],
      }}
      onSubmit={(values, actions) => {
        handleSubmit(values, actions, saveBookingDetails);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="facility-container space-y-6 px-4 lg:px-0">
          {allFacilities?.map((facility) => (
            <div
              key={facility.id}
              className="facility backdrop-blur-sm bg-white/30 border border-gray-100 p-5 rounded-md shadow-md text-white"
            >
              <h2 className="text-2xl font-bold text-blue-v1">
                {facility.displayName || facility.name}
              </h2>
              <p className="text-sm opacity-80">{facility.description}</p>

              <div className="services-container space-y-4 mt-4">
                {allServices
                  .filter((service) => service.facilityId === facility.id)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="service bg-gray-200 border- border-blue-v2 p-4 rounded-md text-white"
                    >
                      <h3 className="text-xl text-blue-v1 font-semibold">
                        {service.displayName || service.name}
                      </h3>

                      <div className="service-variant-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        {allServiceVariants
                          .filter((variant) => variant.serviceId === service.id)
                          .map((variant) => (
                            <div
                              key={variant.id}
                              className="service-variant bg-white rounded-md shadow-md border border-blue-v2 flex justify-between gap-4"
                            >
                              <h4 className="text-base font-medium text-[#0c3771] p-4">
                                {variant.displayName || variant.name}
                              </h4>

                              {variant.isPriceFixed ? (
                                <>
                                  <p className="text-gray-800 font-semibold p-4">
                                    ${variant.amount}
                                  </p>
                                  <div className="quantity-controls flex items-center gap-2 p-1 border border-gray-200 rounded">
                                    <Field
                                      type="checkbox"
                                      name="selectedItems"
                                      checked={
                                        values.selectedItems.some(
                                          (item) =>
                                            item.serviceVarientId === variant.id
                                        ) || false
                                      }
                                      onChange={() => {
                                        const exists =
                                          values.selectedItems.find(
                                            (item) =>
                                              item.serviceVarientId ===
                                              variant.id
                                          );

                                        if (exists) {
                                          // If the item exists, remove it and reset the quantity
                                          updateQuantity(variant.id, -1);
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
                                          updateQuantity(variant.id, 1);
                                          setFieldValue("selectedItems", [
                                            ...values.selectedItems,
                                            {
                                              quantity: 1,
                                              unitAmount: variant.amount || 0,
                                              facilityId: facility.id,
                                              serviceId: service.id,
                                              serviceVarientId: variant.id,
                                            },
                                          ]);
                                        }
                                      }}
                                      className="bg-gray-300 text-gray-800 w-12 h-full rounded hover:bg-gray-400"
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="quantity-controls flex items-center gap-2 p-4 border border-gray-200 rounded">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentQuantity =
                                        quantities[variant.id] || 0;
                                      if (currentQuantity > 0) {
                                        updateQuantity(variant.id, -1);
                                        setFieldValue(
                                          "selectedItems",
                                          values.selectedItems.map((item) =>
                                            item.serviceVarientId === variant.id
                                              ? {
                                                  ...item,
                                                  quantity: item.quantity - 1,
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
                                          (quantities[variant.id] || 0) + 1,
                                        unitAmount: variant.amount || 0,
                                        facilityId: facility.id,
                                        serviceId: service.id,
                                        serviceVarientId: variant.id,
                                      };

                                      updateQuantity(variant.id, 1);

                                      const updatedItems = values.selectedItems
                                        .filter(
                                          (item) =>
                                            item.serviceVarientId !== variant.id
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
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <div className="flex justify-center p-2">
            <button
              type="submit"
              className="bg-blue-v1 text-base text-white rounded-lg px-3 py-1 "
            >
              Confirm Booking
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FacilityServices;
