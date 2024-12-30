import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import CheckboxInput from "./CheckboxInput";
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

const initialValues = {
  facilityDto: {
    facilityMasterId: "",
    facilitySequenceNumber: null,
  },
  hasSubFacility: false,
  subFacilities: [
    { name: "", Limit: null, subFacilitySequenceNumber: null, ticketTypes: [] },
  ],
};

// const validationSchema = Yup.object({
//   facilityDto: Yup.object().shape({
//     facilityMasterId: Yup.string().required("Facility is required"),
//     name: Yup.string().required("Facility Name is required"),
//   }),
//   hasSubFacility: Yup.boolean(),
//   subFacilities: Yup.array().of(
//     Yup.object().shape({
//       name: Yup.string().required("Sub-Facility Name is required"),
//       ticketTypes: Yup.array().of(
//         Yup.object().shape({
//           type: Yup.string().required("Ticket Type is required"),
//           customType: Yup.string().when("type", {
//             is: "others",
//             then: Yup.string().required("Custom Ticket Type is required"),
//           }),
//           amount: Yup.number()
//             .required("Amount is required")
//             .positive("Amount must be a positive number"),
//           chargedPerPerson: Yup.string().required(
//             "Charged Per Person is required"
//           ),
//         })
//       ),
//     })
//   ),
//   // .min(1, "At least one sub-facility is required"),
// });

const ServiceUnifiedCreator = ({ setIsFacilityCreateVisible }) => {
  const LocationId = localStorage.getItem("locationid");
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const role = roleDetails?.name;
  console.log("role", role);
  const { fetchAllDropdownFacilities, adminFacilities } = useFacilityStore();
  const [isSubfacility, setIsSubfacility] = useState(false);

  const {
    saveunifiedFacilityDetails,
    isSaveUnifiedFacilityDetailsLoading,
    saveUnifiedFacilityDetailsError,
  } = useUnifiedFacilityStore();
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
        .required("Sequence is required")
        .max(200, "Sequence Number cannot exceed 200"),
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
            Yup.number()
              .nullable()
              .required("Sequence is required")
              .max(200, "Sequence Number cannot exceed 200"),
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
        });
      })
    ),
  });
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const transformedValues = {
      facilityDto: {
        facilityMasterId: values.facilityDto.facilityMasterId,
        facilitySequenceNumber: values.facilityDto.facilitySequenceNumber,
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
      // if (error?.response?.data?.errors) {
      //   const formErrors = {};

      //   Object.entries(error.response.data.errors).forEach(
      //     ([key, messages]) => {
      //       if (Array.isArray(messages) && messages.length > 0) {
      //         // Map error keys to form fields if necessary
      //         const fieldKey = key.replace(/^\$\./, "").replace(/\./g, "_"); // Example: '$.facilityDto.facilityMasterId' -> 'facilityDto_facilityMasterId'
      //         formErrors[fieldKey] = messages[0];
      //         // Show error as a toast message
      //         toast.error(`${fieldKey}: ${messages[0]}`);
      //       }
      //     }
      //   );

      //   // Optionally, set the form errors in your state (if you're using Formik)
      //   setErrors(formErrors);
      // } else if (error?.response?.data?.title) {
      //   // Handle other API errors with a title
      //   toast.error(error.response.data.title);
      // } else {
      //   // Handle generic or unknown errors
      //   toast.error("An unknown error occurred. Please try again.");
      // }
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
          onSubmit={
            (values, actions) =>
              onSubmit(values, actions, saveunifiedFacilityDetails)
            //console.log(values, 'values')
          }
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="flex justify-start items-center gap-4 mb-6">
                <div className="w-1/4">
                  {/* <SelectInput
                    name="facilityDto.facilityMasterId"
                    label="Select Facility"
                    options={transformedOptions ?? []}
                  /> */}
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
                    maxlength={3}
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
                        setFieldValue("subFacilities", [
                          values.subFacilities[0],
                        ]);
                        setFieldValue(
                          "subFacilities[0].name",
                          Selectedfacility.facilityName
                        );
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
              {/* <div className="md:col-span-3">
                <label className="text-gray-700 dark:text-gray-300 text-sm">
                  Terms&Conditions
                </label>
                <Field
                  name="facilityDto.TermsConditions"
                  placeholder="Enter terms&conditions"
                  maxLength={255}
                  as="textarea"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 "
                />
              </div> */}
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
                              maxlength={3}
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
                                maxlength={3}
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
                            {/* <button
                              type="button"
                              onClick={() => remove(index)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition duration-200"
                            >
                              <MdDeleteForever className="text-white" />
                            </button> */}
                            {values.subFacilities.length > 1 && (
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
                            )}
                          </div>
                          <FieldArray
                            name={`subFacilities[${index}].ticketTypes`}
                          >
                            {({ push: pushTicket, remove: removeTicket }) => (
                              <>
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
                                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                                >
                                  Add Ticket Type
                                </button>
                                <div className="">
                                  {subFacility.ticketTypes.map(
                                    (_, ticketIndex) => (
                                      <div
                                        key={ticketIndex}
                                        className="mb-3 flex justify-between items-center  border-b-2 border border-gray-200 rounded-2xl my-3  p-3"
                                      >
                                        <div className="grid grid-cols-4 gap-3 mb-4">
                                          <SelectInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].type`}
                                            label="Ticket Type"
                                            astrix={true}
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
                                            maxlength={3}
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
