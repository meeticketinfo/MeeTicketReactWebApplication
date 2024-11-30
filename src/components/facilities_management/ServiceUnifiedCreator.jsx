import React, { useEffect } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import CheckboxInput from "./CheckboxInput";
import { MdDeleteForever } from "react-icons/md";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";
import useAuthStore from "../../store/authStore";
import { toast, ToastContainer } from "react-toastify";

const ticketTypeOptions = [
  { value: "child", label: "Child" },
  { value: "adult", label: "Adult" },
  { value: "others", label: "Others" },
];

const initialValues = {
  facilityDto: { facilityMasterId: "" },
  hasSubFacility: false,
  subFacilities: [{ name: "", ticketTypes: [] }],
};

const validationSchema = Yup.object({
  facilityDto: Yup.object({
    facilityMasterId: Yup.string().required("Facility is required"),
  }),
  hasSubFacility: Yup.boolean(),
  // subFacilities: Yup.array().of(
  //   Yup.object({
  //     name: Yup.string().when("hasSubFacility", {
  //       is: true,
  //       then: Yup.string().required("Sub-Facility Name is required"),
  //       otherwise: Yup.string(),
  //     }),
  //     ticketTypes: Yup.array()
  //       .of(
  //         Yup.object({
  //           type: Yup.string().required("Ticket Type is required"),
  //           customType: Yup.string().when("type", {
  //             is: "others",
  //             then: Yup.string().required("Custom Ticket Type is required"),
  //             otherwise: Yup.string(),
  //           }),
  //           chargedPerPerson: Yup.string().required(
  //             "Charged Per Person is required"
  //           ),
  //         })
  //       )
  //       .min(1, "At least one Ticket Type is required"),
  //   })
  // ),
});

const ServiceUnifiedCreator = () => {
  const { decodedTokenData } = useAuthStore();
  const { fetchAllDropdownFacilities, adminFacilities } = useFacilityStore();
  const {
    saveunifiedFacilityDetails,
    isSaveUnifiedFacilityDetailsLoading,
    saveUnifiedFacilityDetailsError,
  } = useUnifiedFacilityStore();
  useEffect(() => {
    fetchAllDropdownFacilities();
  }, []);
  const transformedOptions = adminFacilities?.map((facility) => ({
    value: facility.facilityMasterId,
    label: facility.facilityName,
  }));

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const transformedValues = {
      facilityDto: {
        facilityMasterId: values.facilityDto.facilityMasterId,
        name: values.facilityDto.name,
        parkId: decodedTokenData?.data?.ParkId,
        isActive: true,
      },
      services: values.subFacilities.map((subFacility) => ({
        name: values.hasSubFacility
          ? subFacility.name
          : values.facilityDto.facilityMasterId,
        displayName: values.hasSubFacility
          ? subFacility.name
          : values.facilityDto.facilityMasterId,
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
          isPriceFixed: ticketType.chargedPerPerson === "yes",
        })),
      })),
    };

    console.log(transformedValues, "valuess dropdwom");
    try {
      // Call the saveFacilityDetails function
      const result = await saveunifiedFacilityDetails(transformedValues);

      if (result && result.data && result.data.status === 200) {
        toast.success("Facility created successfully!");
        // setTimeout(() => {
        //   setIsFacilityCreateVisible(false);
        //   setIsFacilityEditVisible(false);
        // }, 3000);
        resetForm();
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        const formErrors = {};

        Object.entries(error.response.data.errors).forEach(
          ([key, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              // Map error keys to form fields if necessary
              const fieldKey = key.replace(/^\$\./, "").replace(/\./g, "_"); // Example: '$.facilityDto.facilityMasterId' -> 'facilityDto_facilityMasterId'
              formErrors[fieldKey] = messages[0];
              // Show error as a toast message
              toast.error(`${fieldKey}: ${messages[0]}`);
            }
          }
        );

        // Optionally, set the form errors in your state (if you're using Formik)
        setErrors(formErrors);
      } else if (error?.response?.data?.title) {
        // Handle other API errors with a title
        toast.error(error.response.data.title);
      } else {
        // Handle generic or unknown errors
        toast.error("An unknown error occurred. Please try again.");
      }
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
              <div className="flex justify-start items-end gap-4 mb-3">
                <div className="w-1/4">
                  {/* <SelectInput
                    name="facilityDto.facilityMasterId"
                    label="Select Facility"
                    options={transformedOptions ?? []}
                  /> */}
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
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <CheckboxInput name="hasSubFacility" label="Has Sub-Facility" />
              </div>
              <hr className="py-2"></hr>
              <FieldArray name="subFacilities">
                {({ push, remove }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => push({ name: "", ticketTypes: [] })}
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
                            className={`mb-3 ${
                              values.hasSubFacility
                                ? "flex justify-between"
                                : "hidden"
                            }`}
                          >
                            <TextInput
                              name={`subFacilities[${index}].name`}
                              label="Sub-Facility Name"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition duration-200"
                            >
                              <MdDeleteForever className="text-white" />
                            </button>
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
                                        className="mb-3 flex justify-between pb-2 border-b-2 border border-gray-200 rounded-2xl my-3  p-3"
                                      >
                                        <div className="grid grid-cols-3 gap-3">
                                          <SelectInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].type`}
                                            label="Ticket Type"
                                            options={ticketTypeOptions}
                                          />
                                          {values.subFacilities[index]
                                            .ticketTypes[ticketIndex].type ===
                                            "others" && (
                                            <TextInput
                                              name={`subFacilities[${index}].ticketTypes[${ticketIndex}].customType`}
                                              label="Custom Ticket Type"
                                            />
                                          )}
                                          <SelectInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].chargedPerPerson`}
                                            label="Charged Per Person"
                                            options={[
                                              { value: "yes", label: "Yes" },
                                              { value: "no", label: "No" },
                                            ]}
                                          />
                                        </div>

                                        <div className="flex items-center">
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
