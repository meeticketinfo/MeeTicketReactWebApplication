import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

import { MdDeleteForever } from "react-icons/md";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";

import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "../../utils/apiErrorHandler";
import useAuthStore from "../../store/authStore";

const ticketTypeOptions = [
  { value: "child", label: "Child" },
  { value: "adult", label: "Adult" },
  { value: "others", label: "Others" },
];



const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const daysOfWeek = [
  { value: "sun", label: "Sun" },
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
];

const initialValues = {
  facilityDto: {
    facilityMasterId: "",
    facilitySequenceNumber: null,
    description: "",
    disclaimer: "",
  },
  hasSubFacility: false,
  subFacilities: [
    {
      name: "",
      Limit: null,
      subFacilitySequenceNumber: null,
      ticketTypes: [],
      slots: [],
    },
  ],
};

const ServiceUnifiedCreator = ({ setIsFacilityCreateVisible }) => {
  const LocationId = localStorage.getItem("locationid");
  const { roleDetails, decodedTokenData } = useAuthStore();
  const role = roleDetails?.name;
  console.log("role", role);
  const { fetchAllDropdownFacilities, adminFacilities } = useFacilityStore();
  const [isSubfacility, setIsSubfacility] = useState(false);

  const { saveunifiedFacilityDetails, isSaveUnifiedFacilityDetailsLoading } =
    useUnifiedFacilityStore();
  useEffect(() => {
    fetchAllDropdownFacilities(role);
  }, []);
  const transformedOptions = adminFacilities?.map((facility) => ({
    value: facility.facilityMasterId,
    label: facility.facilityName, 
  }));
  const validationSchema = Yup.object({
    facilityDto: Yup.object().shape({
      facilityMasterId: Yup.string().required("Facility is required"),
      // facilitySequenceNumber: Yup.string().required("Sequence is required").max(200, ' Sequence Number cannot exceed 200'),
      facilitySequenceNumber: Yup.number()
        .nullable()
        .required("Sequence is required"),

      name: Yup.string().required("Facility Name is required"),
    }),
    hasSubFacility: Yup.boolean(),
    subFacilities: Yup.array().of(
      Yup.lazy((value, { parent }) => {
        return Yup.object().shape({
          name:
            isSubfacility &&
            Yup.string().required("Sub-Facility Name is required"),
          subFacilitySequenceNumber:
            isSubfacility &&
            Yup.number().nullable().required("Sequence is required"),

          ticketTypes: Yup.array().of(
            Yup.object().shape({
              type: Yup.string().required("Ticket Type is required"),
              typeOfTicketSequenceNumber: Yup.string().required(
                "Sequence is required"
              ),
              amount: Yup.number()
                .required("Amount is required")
                .positive("Amount must be a positive number"),
              chargedPerPerson: Yup.string().required(
                "Charged Per Person is required"
              ),
            })
          ),
          slots: Yup.array().of(
            Yup.object().shape({
              startTime: Yup.string().required("Start Time is required"),
              endTime: Yup.string().required("End Time is required"),
              totalCapacity: Yup.number()
                .typeError("Total Capacity must be a number")
                .nullable()
                .required("Total Capacity is required")
                .positive("Total Capacity must be a positive number")
                .integer("Total Capacity must be an integer"),
              availableCapacity: Yup.number()
                .typeError("Available Capacity must be a number")
                .nullable()
                .required("Available Capacity is required")
                .positive("Available Capacity must be a positive number")
                .integer("Available Capacity must be an integer"),
              status: Yup.string().required("Status is required"),

              isRecurring: Yup.boolean(),
              recurringStatus: Yup.string().when("isRecurring", {
                is: true,
                then: (schema) =>
                  schema.required("Recurring Status is required"),
                otherwise: (schema) => schema.notRequired(),
              }),
              recurringStartDate: Yup.string().when("isRecurring", {
                is: true,
                then: (schema) =>
                  schema.required("Recurring Start Date is required"),
                otherwise: (schema) => schema.notRequired(),
              }),
              recurringEndDate: Yup.string().when("isRecurring", {
                is: true,
                then: (schema) =>
                  schema.required("Recurring End Date is required"),
                otherwise: (schema) => schema.notRequired(),
              }),
            })
          ),
        });
      })
    ),
  }); 
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, "values");
    const transformedValues = {
      facilityDto: {
        facilityMasterId: values.facilityDto.facilityMasterId,
        facilitySequenceNumber: values.facilityDto.facilitySequenceNumber,
        description: values.facilityDto.description,
        disclaimer: values.facilityDto.disclaimer,
        name: values.facilityDto.name,
        parkId:
          role === "ROLE_NODALOFFICER"
            ? LocationId
            : decodedTokenData?.data?.ParkId,
        isActive: true,
      },
      services: values.subFacilities.map((subFacility) => ({
        name: values.hasSubFacility
          ? subFacility.name
          : values.facilityDto.name,
        Limit: values.hasSubFacility ? subFacility.Limit : -1,
        subFacilitySequenceNumber: values.hasSubFacility
          ? subFacility.subFacilitySequenceNumber
          : 1,
        displayName: values.hasSubFacility
          ? subFacility.name
          : values.facilityDto.name,
        isActive: true,

        serviceVariants: subFacility.ticketTypes.map((ticketType) => ({
          name:
            ticketType.type === "others"
              ? ticketType.customType
              : ticketType.type,
          displayName:
            ticketType.type === "others"
              ? ticketType.customType
              : ticketType.type,
          description: "lorem",
          amount: ticketType.amount,
          typeOfTicketSequenceNumber: ticketType.typeOfTicketSequenceNumber,
          isPriceFixed: ticketType.chargedPerPerson === "yes",
          isActive: true,
        })),

        slot: subFacility.slots.map((slots) => ({
          startTime: slots.startTime || "15:26",
          endTime: slots.endTime || "16:26",
          totalCapacity: slots.totalCapacity || "",
          availableCapacity: slots.availableCapacity || "",
          cutoffTimeforBooking: slots.cutOffTime || "",
          status: (slots.status === "active"?true:false) || null,
          isRecurring: slots.isRecurring || null,
          recurrenceStatus: (slots.recurringStatus === "active"?true:false) || null,
          recurringStartDate: slots.recurringStartDate || "",
          recurrenceEndDate: slots.recurringEndDate || "",
          recurringDays:slots.selectedDays || [],
        })),
      })),
    };
    console.log(transformedValues, "valuess dropdwom");
    try {
      // Call the saveFacilityDetails function
      const result = await saveunifiedFacilityDetails(transformedValues, role);

      if (result && result.data && result.data.status === 200) {
        toast.success("Facility created successfully!");
        setTimeout(() => {
          setIsFacilityCreateVisible(false);
          // setIsFacilityEditVisible(false);
        }, 1000);
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
    <div className="bg-white/30 p-3 rounded-2xl ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveunifiedFacilityDetails)
          }
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              <div className="flex justify-start items-center gap-4 mb-6">
                <div className="w-1/4">
                  <label htmlFor="User" className="block text-xs font-medium">
                    Facility <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="facilityDto.facilityMasterId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                    onChange={(e) => {
                      const id = e.target.value;

                      setFieldValue("facilityDto.facilityMasterId", id);

                      const Selectedfacility = adminFacilities.find(
                        (facility) => facility.facilityMasterId === Number(id)
                      );

                      setFieldValue(
                        "facilityDto.name",
                        Selectedfacility.facilityName
                      );
                      if (
                        values.subFacilities.length === 1 &&
                        !values.hasSubFacility
                      ) {
                        setFieldValue(
                          "subFacilities[0].name",
                          Selectedfacility.facilityName
                        );
                      }
                    }}
                  >
                    <option value="">Select Facility</option>
                    {adminFacilities?.map((facility) => (
                      <option
                        key={facility.facilityMasterId}
                        value={facility.facilityMasterId}
                      >
                        {facility.facilityName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="facilityDto.facilityMasterId"
                    component="div"
                    className="text-red-500 text-xs mt-1 absolute "
                  />
                </div>
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    Sequence <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="facilityDto.facilitySequenceNumber"
                    type="text"
                    maxlength={5}
                    onChange={(e) => {
                      setFieldValue(
                        "facilityDto.facilitySequenceNumber",
                        e.target.value.replace(/[^0-9]/g, "")
                      );
                    }}
                    className={`mt-1 block w-[80%] px-2 py-1 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Sequence"
                  />
                  <ErrorMessage
                    name="facilityDto.facilitySequenceNumber"
                    component="div"
                    className="text-red-500 text-xs absolute"
                  />
                </div>

                {/* has sub facility */}
                <div className="flex items-center mt-5">
                  <Field
                    type="checkbox"
                    id="hasSubFacility"
                    name="hasSubFacility"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsSubfacility(isChecked);
                      setFieldValue("hasSubFacility", isChecked);
                      if (isChecked) {
                        setFieldValue("subFacilities[0].name", "");
                      } else {
                        const selectedFacilityId =
                          values.facilityDto.facilityMasterId;
                        const selectedFacility = adminFacilities.find(
                          (facility) =>
                            facility.facilityMasterId ===
                            Number(selectedFacilityId)
                        );
                        setFieldValue("subFacilities", [
                          values.subFacilities[0],
                        ]);
                        if (selectedFacility) {
                          setFieldValue(
                            "subFacilities[0].name",
                            selectedFacility.facilityName
                          );
                        }
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="hasSubFacility"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Has Sub-Facility
                  </label>
                </div>

                {/* <CheckboxInput name="hasSubFacility" label="Has Sub-Facility" onChange={handleSubFacilityName} /> */}
              </div>
             
              {/* discription */}
              <div className="col-span-3">
                <label className="block text-sm font-medium">Description</label>
                <Field
                  as="textarea"
                  maxlength={100}
                  name="facilityDto.description"
                  onChange={(e) => {
                    setFieldValue("facilityDto.description", e.target.value);
                  }}
                  className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter description"
                />
              </div>
                <div className="md:col-span-3">
                <label className="text-gray-700 dark:text-gray-300 text-sm">
                Disclaimer
                </label>
                <Field
                  name="facilityDto.disclaimer"
                  placeholder="Enter Disclaimer"
                  maxLength={255}
                  as="textarea"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 "
                />
              </div>
              <hr className="py-2"></hr>
              <FieldArray name="subFacilities">
                {({ push, remove }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        push({ name: "", ticketTypes: [] });
                      }}
                      className={`${
                        values.hasSubFacility ? "" : "hidden"
                      } bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 my-3`}
                    >
                      Add Sub-Facility
                    </button>
                    <div className={`${values.hasSubFacility ? "" : ""}`}>
                      {values.subFacilities.map((subFacility, index) => (
                        <div
                          key={index}
                          className="card mb-3 p-3 border border-gray-100 rounded-2xl shadow-md"
                        >
                          <div
                            className={`mb-6 ${
                              values.hasSubFacility
                                ? "flex justify-start items-end gap-4"
                                : "hidden"
                            }`}
                          >
                            <TextInput
                              name={`subFacilities[${index}].name`}
                              label="Sub-Facility Name"
                              placeholder="Enter Sub-Facility"
                              astrix={true}
                            />
                            <TextInput
                              maxlength={5}
                              placeholder="Enter Limit"
                              name={`subFacilities[${index}].Limit`}
                              label="Limit"
                              onKeyDown={(e) => {
                                // Allow only numbers and backspace
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  e.key !== "Backspace"
                                ) {
                                  e.preventDefault(); // Block other keys
                                }
                              }}
                            />
                            <div className="w-1/5">
                              <TextInput
                                maxlength={5}
                                placeholder="Enter Sequence"
                                name={`subFacilities[${index}].subFacilitySequenceNumber`}
                                label="Sequence"
                                astrix={true}
                                onKeyDown={(e) => {
                                  // Allow only numbers and backspace
                                  if (
                                    !/[0-9]/.test(e.key) &&
                                    e.key !== "Backspace"
                                  ) {
                                    e.preventDefault(); // Block other keys
                                  }
                                }}
                              />
                            </div>
                           
                            {values.subFacilities.length > 1 && (
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    remove(index); // Remove the sub-facility at the given index

                                    // New logic: Check if there are no sub-facilities left, then reset the state
                                    if (values.subFacilities.length === 1) {
                                      setFieldValue("hasSubFacility", false);
                                    }
                                  }}
                                  className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition duration-200"
                                >
                                  <MdDeleteForever className="text-white" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Buttons Container */}
                          <div className="flex gap-3 mb-3">
                            <FieldArray
                              name={`subFacilities[${index}].ticketTypes`}
                            >
                              {({ push: pushTicket }) => (
                                <button
                                  type="button"
                                  onClick={() =>
                                    pushTicket({
                                      type: "",
                                      customType: "",
                                      chargedPerPerson: "",
                                      amount: "",
                                      typeOfTicketSequenceNumber: "",
                                    })
                                  }
                                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1"
                                >
                                  Add Ticket Type
                                </button>
                              )}
                            </FieldArray>
                            <FieldArray name={`subFacilities[${index}].slots`}>
                              {({ push: pushSlot }) => (
                                <button
                                  type="button"
                                  onClick={() =>
                                    pushSlot({
                                      startTime: "",
                                      endTime: "",
                                      totalCapacity: null,
                                      availableCapacity: null,
                                      cutOffTime: null,
                                      status: "",
                                      description: "",
                                      isRecurring: false,
                                      recurringStatus: "",
                                      recurringStartDate: "",
                                      recurringEndDate: "",
                                      selectedDays: [],
                                    })
                                  }
                                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-8 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1"
                                >
                                  Add Slot
                                </button>
                              )}
                            </FieldArray>
                          </div>

                          <FieldArray
                            name={`subFacilities[${index}].ticketTypes`}
                          >
                            {({ push: pushTicket, remove: removeTicket }) => (
                              <>
                                <div className="">
                                  {subFacility.ticketTypes.map(
                                    (_, ticketIndex) => (
                                      <div
                                        key={ticketIndex}
                                        className="mb-3 flex gap-4 items-center  border-b-2 border border-gray-200 rounded-2xl my-3  p-3"
                                      >
                                        <div className="grid grid-cols-4 gap-3 mb-4">
                                          <SelectInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].type`}
                                            label="Ticket Type"
                                            astrix={true}
                                            options={ticketTypeOptions}
                                          />
                                          {values.subFacilities[index]
                                            .ticketTypes[ticketIndex].type ===
                                            "others" && (
                                            <TextInput
                                              name={`subFacilities[${index}].ticketTypes[${ticketIndex}].customType`}
                                              label="Custom Ticket Type"
                                              placeholder="Enter customType"
                                            />
                                          )}
                                          <TextInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].amount`}
                                            label="Amount"
                                            maxLength={5}
                                            astrix={true}
                                            placeholder="Enter Amount"
                                            onKeyDown={(e) => {
                                              // Allow only numbers and backspace
                                              if (
                                                !/[0-9]/.test(e.key) &&
                                                e.key !== "Backspace"
                                              ) {
                                                e.preventDefault(); // Block other keys
                                              }
                                            }}
                                          />
                                          <SelectInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].chargedPerPerson`}
                                            label="Charged Per Person"
                                            astrix={true}
                                            options={[
                                              { value: "no", label: "Yes" },
                                              { value: "yes", label: "No" },
                                            ]}
                                          />
                                          <TextInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].typeOfTicketSequenceNumber`}
                                            label="Sequence"
                                            maxlength={5}
                                            type="text"
                                            astrix={true}
                                            placeholder="Enter Sequence"
                                            onKeyDown={(e) => {
                                              // Allow only numbers and backspace
                                              if (
                                                !/[0-9]/.test(e.key) &&
                                                e.key !== "Backspace"
                                              ) {
                                                e.preventDefault(); // Block other keys
                                              }
                                            }}
                                          />
                                        </div>
                                        <div className="flex items-center mt-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeTicket(ticketIndex)
                                            }
                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition duration-200"
                                          >
                                            <MdDeleteForever className="text-white w-5 h-5" />
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </FieldArray>
                          <FieldArray name={`subFacilities[${index}].slots`}>
                            {({ push: pushSlot, remove: removeSlot }) => (
                              <>
                                <div className="">
                                  {subFacility.slots?.map((_, slotIndex) => (
                                    <div
                                      key={slotIndex}
                                      className="mb-3 flex gap-4 items-start border-b-2 border border-gray-200 rounded-2xl my-3 p-3"
                                    >
                                      <div className="flex-1">
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                          <TextInput
                                            name={`subFacilities[${index}].slots[${slotIndex}].startTime`}
                                            label="Start Time"
                                            astrix={true}
                                            type="time"
                                            placeholder="-- : --"
                                            onChange={(e) => {
                                              const startTime = e.target.value;
                                              setFieldValue(
                                                `subFacilities[${index}].slots[${slotIndex}].startTime`,
                                                startTime
                                              );

                                              // Calculate end time as exactly 1 hour after start time
                                              if (startTime) {
                                                const [hours, minutes] =
                                                  startTime
                                                    .split(":")
                                                    .map(Number);
                                                let endHours = hours + 1;
                                                let endMinutes = minutes;

                                                // Handle hour overflow (24-hour format)
                                                if (endHours >= 24) {
                                                  endHours = endHours % 24;
                                                }

                                                // Format back to HH:MM
                                                const endTime = `${String(
                                                  endHours
                                                ).padStart(2, "0")}:${String(
                                                  endMinutes
                                                ).padStart(2, "0")}`;
                                                setFieldValue(
                                                  `subFacilities[${index}].slots[${slotIndex}].endTime`,
                                                  endTime
                                                );
                                              }
                                            }}
                                          />
                                          <TextInput
                                            name={`subFacilities[${index}].slots[${slotIndex}].endTime`}
                                            label="End Time"
                                            astrix={true}
                                            type="time"
                                            placeholder="-- : --"
                                          />
                                          <TextInput
                                            name={`subFacilities[${index}].slots[${slotIndex}].totalCapacity`}
                                            label="Total Capacity"
                                            astrix={true}
                                            placeholder="No. of people allowed"
                                            type="text"
                                            onKeyDown={(e) => {
                                              if (
                                                !/[0-9]/.test(e.key) &&
                                                e.key !== "Backspace" &&
                                                e.key !== "Delete" &&
                                                e.key !== "ArrowLeft" &&
                                                e.key !== "ArrowRight"
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                            onChange={(e) => {
                                              const value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                              setFieldValue(
                                                `subFacilities[${index}].slots[${slotIndex}].totalCapacity`,
                                                value === ""
                                                  ? null
                                                  : Number(value)
                                              );
                                            }}
                                          />
                                          <TextInput
                                            name={`subFacilities[${index}].slots[${slotIndex}].availableCapacity`}
                                            label="Available Capacity"
                                            astrix={true}
                                            placeholder="Enter available capacity"
                                            type="text"
                                            onKeyDown={(e) => {
                                              if (
                                                !/[0-9]/.test(e.key) &&
                                                e.key !== "Backspace" &&
                                                e.key !== "Delete" &&
                                                e.key !== "ArrowLeft" &&
                                                e.key !== "ArrowRight"
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                            onChange={(e) => {
                                              const value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                              setFieldValue(
                                                `subFacilities[${index}].slots[${slotIndex}].availableCapacity`,
                                                value === ""
                                                  ? null
                                                  : Number(value)
                                              );
                                            }}
                                          />

                                          <TextInput
                                            name={`subFacilities[${index}].slots[${slotIndex}].cutOffTime`}
                                            label="Cut-off Time for Booking (Minutes)"
                                            astrix={true}
                                            placeholder="Enter cut-off time (max 60 Minutes)"
                                            type="text"
                                            onKeyDown={(e) => {
                                              // Allow only numbers and navigation keys
                                              if (
                                                !/[0-9]/.test(e.key) &&
                                                e.key !== "Backspace" &&
                                                e.key !== "Delete" &&
                                                e.key !== "ArrowLeft" &&
                                                e.key !== "ArrowRight" &&
                                                e.key !== "Tab"
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                            onChange={(e) => {
                                              const value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                              // Only allow values up to 60
                                              const numValue =
                                                value === ""
                                                  ? null
                                                  : Number(value);
                                              if (
                                                numValue === null ||
                                                numValue <= 60
                                              ) {
                                                setFieldValue(
                                                  `subFacilities[${index}].slots[${slotIndex}].cutOffTime`,
                                                  numValue
                                                );
                                              }
                                            }}
                                          />
                                          <SelectInput
                                            name={`subFacilities[${index}].slots[${slotIndex}].status`}
                                            label="Status"
                                            astrix={true}
                                            options={statusOptions}
                                          />
                                        </div>

                                        {/* Recurring Slot Section */}
                                        <div className="mb-3 p-3 border border-gray-200 rounded-lg">
                                          <div className="flex items-center mb-3">
                                            <Field
                                              type="checkbox"
                                              name={`subFacilities[${index}].slots[${slotIndex}].isRecurring`}
                                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="ms-2 text-sm font-medium text-gray-900">
                                              Repeat/Recurring Slot
                                            </label>
                                          </div>

                                          {values.subFacilities[index].slots[
                                            slotIndex
                                          ]?.isRecurring && (
                                            <div className="grid grid-cols-3 gap-3">
                                              <SelectInput
                                                name={`subFacilities[${index}].slots[${slotIndex}].recurringStatus`}
                                                label="Recurring Status"
                                                astrix={true}
                                                options={statusOptions}
                                              />
                                              <TextInput
                                                name={`subFacilities[${index}].slots[${slotIndex}].recurringStartDate`}
                                                label="Recurring Start Date"
                                                astrix={true}
                                                type="date"
                                                placeholder="mm/dd/yyyy"
                                              />
                                              <TextInput
                                                name={`subFacilities[${index}].slots[${slotIndex}].recurringEndDate`}
                                                label="Recurring End Date"
                                                astrix={true}
                                                type="date"
                                                placeholder="mm/dd/yyyy"
                                              />
                                              <div className="col-span-3">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                  Select Days{" "}
                                                  <span className="text-red-500">
                                                    *
                                                  </span>
                                                </label>
                                                <div className="flex gap-4 flex-wrap">
                                                  {daysOfWeek.map((day) => {
                                                    const fieldName = `subFacilities[${index}].slots[${slotIndex}].selectedDays`;
                                                    const selectedDays =
                                                      values.subFacilities[
                                                        index
                                                      ]?.slots[slotIndex]
                                                        ?.selectedDays || [];
                                                    const isChecked =
                                                      selectedDays.includes(
                                                        day.value
                                                      );

                                                    return (
                                                      <div
                                                        key={day.value}
                                                        className="flex items-center"
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          checked={isChecked}
                                                          onChange={(e) => {
                                                            const currentDays =
                                                              selectedDays ||
                                                              [];
                                                            let newDays;
                                                            if (
                                                              e.target.checked
                                                            ) {
                                                              newDays = [
                                                                ...currentDays,
                                                                day.value,
                                                              ];
                                                            } else {
                                                              newDays =
                                                                currentDays.filter(
                                                                  (d) =>
                                                                    d !==
                                                                    day.value
                                                                );
                                                            }
                                                            setFieldValue(
                                                              fieldName,
                                                              newDays
                                                            );
                                                          }}
                                                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label className="ms-2 text-sm font-medium text-gray-900">
                                                          {day.label}
                                                        </label>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                                <ErrorMessage
                                                  name={`subFacilities[${index}].slots[${slotIndex}].selectedDays`}
                                                  component="span"
                                                  className="text-red-500 text-xs mt-1 block"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center mt-2">
                                        <button
                                          type="button"
                                          onClick={() => removeSlot(slotIndex)}
                                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition duration-200"
                                        >
                                          <MdDeleteForever className="text-white w-5 h-5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </FieldArray>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </FieldArray>

              <div className="flex justify-center mt-3">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveUnifiedFacilityDetailsLoading}
                >
                  {isSaveUnifiedFacilityDetailsLoading ? "Saving..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ServiceUnifiedCreator;
