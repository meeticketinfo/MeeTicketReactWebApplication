import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useSlotBookingStore } from "../../store/masters/slotBookingStore";
import { toast } from "react-toastify";
import { getCurrentDate } from "../../utils/TypographyHelper";

const SlotSuspend = ({
  suspendModal,
  setSuspendModal,
  subRow,
  SuspendResumeAction,
  setSuspendResumeAction,
}) => {
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [hoveredSlotId, setHoveredSlotId] = useState(null);
  const {
    slots,
    getSlots,
    getSlotsLoading,
    suspendSlots,
    isSuspendSlotsLoading,
  } = useSlotBookingStore();


  useEffect(() => {
    if (suspendModal && subRow?.id) {
      getSlots(subRow?.id);
      setSelectedSlotIds([]);
    }
  }, [suspendModal, subRow?.id]);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleSlotToggle = (slotId, setFieldValue) => {
    const newSlotIds = selectedSlotIds.includes(slotId)
      ? selectedSlotIds.filter((id) => id !== slotId)
      : [...selectedSlotIds, slotId];
    setSelectedSlotIds(newSlotIds);
    setFieldValue("affectedSlots", newSlotIds);
  };

  const getSlotButtonClass = (slot) => {
    if (slot.isExpired)
      return "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60";
    if (selectedSlotIds.includes(slot.slotId)) return "bg-blue-v1 text-white";
    if (slot.isSuspended) return "bg-red-500 text-white hover:bg-red-600";
    return "bg-green-500 text-white hover:bg-green-600";
  };

  const getSlotTooltip = (slot) => {
    const isSelected = selectedSlotIds.includes(slot.slotId);
    let status = "";

    if (slot.isExpired) {
      status = "Expired";
    } else if (slot.isSuspended) {
      status = "Suspended";
    } else {
      status = "Resumed";
    }

    return isSelected ? `Selected - ${status}` : status;
  };

  const validationSchema = Yup.object({
    reason:
      SuspendResumeAction === "suspend" &&
      Yup.string().required("Reason for Suspension is required"),
    effectiveDate:
      SuspendResumeAction === "suspend" &&
      Yup.string().required("Effective Date is required"),
    affectedSlots: Yup.array()
      .min(1, "At least one slot must be selected")
      .required("Affected Slots is required"),
  });

  const onSubmit = async (values) => {
    const payload = {
      subfacilityId: subRow?.id,
      reason: values.reason,
      suspensionType: SuspendResumeAction==="suspend"?"suspended":"resumed",
      effectiveDateTime: SuspendResumeAction==="resume"?getCurrentDate():values.effectiveDate,
      affectedSlots: values.affectedSlots,
    };
    
    try {
      const res = await suspendSlots(payload);
      if (res?.data?.status === 200) {
        toast.success(`Slots ${SuspendResumeAction==="suspend"?"suspended":"resumed"} successfully`);
        setSuspendModal(false);
        if (subRow?.id) getSlots(subRow?.id);
      }
      setSuspendResumeAction("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to suspend slots");
    }
  };

  return (
    <PopupModal
      popupModalId="slot-suspend-modal"
      isOpen={suspendModal}
      onClose={() => {
        setSuspendModal(false);
        setSuspendResumeAction("");
      }}
      size="medium"
      overlayClassName="bg-gray-800 bg-opacity-60"
      contentClassName="bg-white"
      defaultBodyPadding={true}
    >
      <div className="container mx-auto px-8 py-6 bg-white">
        <Formik
          initialValues={{ reason: "", effectiveDate: "", affectedSlots: [] }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-6 capitalize">
              {`${SuspendResumeAction} Boating Service`}
              </h2>

              {SuspendResumeAction === "suspend" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Suspension{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="reason"
                    type="text"
                    placeholder="Add reason"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${
                      errors.reason && touched.reason
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              )}

              {SuspendResumeAction === "suspend" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="effectiveDate"
                    type="date"
                    min={getTodayDate()}
                    className={`w-1/4 px-3 py-1.5 border-none  rounded-md shadow-sm focus:outline-none  bg-[#E5E7EB] text-gray-400 text-sm `}
                  />
                  <ErrorMessage
                    name="effectiveDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Affected Slots <span className="text-red-500">*</span>
                </label>
                {getSlotsLoading ? (
                  <div className="text-center py-4">Loading slots...</div>
                ) : (() => {
                  const filteredSlots = slots.filter((slot) => {
                    if (SuspendResumeAction === "suspend") {
                      // Show only resumed slots (not suspended)
                      return !slot.isSuspended;
                    } else {
                      // Show only suspended slots
                      return slot.isSuspended;
                    }
                  });
                  return filteredSlots.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      {SuspendResumeAction === "suspend"
                        ? "No resumed slots available"
                        : "No suspended slots available"}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {filteredSlots.map((slot) => (
                      <div
                        key={slot.slotId}
                        className="relative"
                        onMouseEnter={() => setHoveredSlotId(slot.slotId)}
                        onMouseLeave={() => setHoveredSlotId(null)}
                      >
                        <button
                          type="button"
                          disabled={slot.isExpired}
                          onClick={() => {
                            !slot.isExpired &&
                              handleSlotToggle(slot.slotId, setFieldValue);
                            setFieldValue("isSuspended", slot.isSuspended);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${getSlotButtonClass(
                            slot
                          )}`}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                        {hoveredSlotId === slot.slotId && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                              {getSlotTooltip(slot)}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  );
                })()}
                <Field
                  name="affectedSlots"
                  type="hidden"
                  value={selectedSlotIds}
                />
                {errors.affectedSlots && touched.affectedSlots && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.affectedSlots}
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="submit"
                  disabled={isSuspendSlotsLoading}
                  className="bg-blue-v1 hover:bg-blue-v2 text-white px-4 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSuspendSlotsLoading
                    ? `${SuspendResumeAction}....`
                    : `Confirm ${
                        SuspendResumeAction === "suspend" ? "Suspend" : "Resume"
                      }`}
                </button>
                <button
                  type="button"
                  onClick={() => setSuspendModal(false)}
                  className="bg-[#C81005] hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </PopupModal>
  );
};

export default SlotSuspend;
