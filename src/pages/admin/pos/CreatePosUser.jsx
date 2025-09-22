import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useFacilityStore } from "../../../store/masters/facilitiesStore";
import useAuthStore from "../../../store/authStore";
const CreatePosUser = ({ setIsPosCreateVisible }) => {
  const { fetchAllDropdownFacilities, adminFacilities } = useFacilityStore();
  const { roleDetails } = useAuthStore();
  const role = roleDetails?.name;

  useEffect(() => {
    if (role) {
      fetchAllDropdownFacilities(role);
    }
  }, [role, fetchAllDropdownFacilities]);

  const facilityOptions =
    adminFacilities?.map((facility) => ({
      value: facility.facilityMasterId,
      label: facility.facilityName,
    })) || [];

  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    password: "",
    assignedFacilities: [],
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    emailId: Yup.string().required("Email Id is required"),

    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Phone Number must contain exactly 10 digits"),
    password: Yup.string()
      .required("Pin is required")
      .matches(/^\d{4}$/, "Passcode must be exactly 4 digits"),
    assignedFacilities: Yup.array()
      .min(1, "At least one facility must be assigned")
      .required("Facility assignment is required"),
  });

  const onSubmit = async (values) => {
    console.log("values", values);
    toast.success(values);
  };
  return (
    <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
              {/* User Select */}
              <div>
                <label htmlFor="User" className="block text-xs font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="firstName"
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter first name"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/*Last Name */}
              <div>
                <label htmlFor="User" className="block text-xs font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="lastName"
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter last name"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Email Id */}
              <div>
                <label
                  htmlFor="emailId"
                  className="block text-xs font-medium text-gray-700"
                >
                  Email Id <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  name="emailId"
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Enter email Id"
                />
                <ErrorMessage
                  name="emailId"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  maxLength="10"
                  name="phoneNumber"
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Enter phone number"
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault(); // Prevent non-numeric characters
                    }
                  }}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700"
                >
                  4-digit Pin
                  {false ? "" : <span className="text-red-500">*</span>}
                </label>
                <Field
                  type="text"
                  name="password"
                  maxLength={4}
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault(); // Prevent non-numeric characters
                    }
                  }}
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Four-digit-pin"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Assigned Facilities */}
              <div>
                <label
                  htmlFor="assignedFacilities"
                  className="block text-xs font-medium text-gray-700"
                >
                  Assign Facility <span className="text-red-500">*</span>
                </label>
                <Field name="assignedFacilities">
                  {({ field, form, meta }) => (
                    <div>
                      <Select
                        {...field}
                        isMulti
                        options={facilityOptions}
                        value={facilityOptions.filter((option) =>
                          field.value.includes(option.value)
                        )}
                        onChange={(selectedOptions) => {
                          const facilityIds = selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : [];
                          form.setFieldValue(field.name, facilityIds);
                        }}
                        onBlur={() => form.setFieldTouched(field.name, true)}
                        placeholder="Select facilities..."
                        className="mt-1"
                        classNamePrefix="react-select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: "32px",
                            fontSize: "14px",
                            border: "1px solid #6B7280",
                            borderRadius: "6px",
                            boxShadow: "none",
                          }),
                          valueContainer: (provided) => ({
                            ...provided,
                            padding: "2px 8px",
                          }),
                          input: (provided) => ({
                            ...provided,
                            margin: "0px",
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                          indicatorsContainer: (provided) => ({
                            ...provided,
                            height: "30px",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            fontSize: "8px",
                            border: "1px solid #6B7280",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            padding: "4px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: "14px",
                            padding: "2px 4px",
                            backgroundColor: "white",
                            color: state.isSelected ? "white" : "#374151",
                            "&:hover": {
                              backgroundColor: state.isSelected
                                ? "#3b82f6"
                                : "#f3f4f6",
                            },
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "#e5e7eb",
                            borderRadius: "4px",
                          }),
                          multiValueLabel: (provided) => ({
                            ...provided,
                            color: "#374151",
                            fontSize: "12px",
                          }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color: "#6b7280",
                            "&:hover": {
                              backgroundColor: "#d1d5db",
                              color: "#374151",
                            },
                          }),
                        }}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-red-500 text-xs mt-1">
                          {meta.error}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center p-2">
              <button
                type="submit"
                className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                // disabled={isSaveGateKeeperDetailsLoading}
              >
                {false
                  ? "Saving..."
                  : false
                  ? "Edit Pos User"
                  : "Create Pos User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePosUser;
