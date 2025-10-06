import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import useAuthStore from "../../../store/authStore";
import { useUnifiedFacilityStore } from "../../../store/masters/unifiedFacilityStore";
import { PosUserCreationStore } from "./pos_store/PosUserCreationStore";
const CreatePosUser = ({ setIsPosCreateVisible, setIsEdit, isEdit }) => {
  const { roleDetails } = useAuthStore();
  const role = roleDetails?.name;
  const { allUnifiedFacilities, fetchAllUnifiedFacilities } =
    useUnifiedFacilityStore();
  const {
    savePosUser,
    isSavePosUserDetailsLoading,
    posUserEditDetails,
    setCurrentPosUserEditDetails,
  } = PosUserCreationStore();

  useEffect(() => {
    fetchAllUnifiedFacilities(role);
  }, []);
  const facilityOptions =
    allUnifiedFacilities?.map((facility) => ({
      value: facility.facilityMasterId,
      label: facility.name,
    })) || [];
  const AssignedFaciltiy = posUserEditDetails.facilitiesAssigned?.map(
    (item) => item.id
  );

  const initialValues = {
    userId: isEdit ? posUserEditDetails.userId : "",
    FirstName: isEdit ? posUserEditDetails.firstName : "",
    LastName: isEdit ? posUserEditDetails.lastName : "",
    EmailId: isEdit ? posUserEditDetails.emailId : "",
    PhoneNumber: isEdit ? posUserEditDetails.mobileNumber : "",
    pin: isEdit ? posUserEditDetails.pin : "",
    status: isEdit ? posUserEditDetails.status : "",
    AssignFaciltiy: isEdit ? AssignedFaciltiy : [],
  };

  const validationSchema = Yup.object({
    FirstName: Yup.string()
      .required("First Name is required")
      .max(50, "First Name cannot be more than 50 characters"),
    LastName: Yup.string()
      .required("Last Name is required")
      .max(50, "First Name cannot be more than 50 characters"),
    EmailId: Yup.string().required("Email Id is required"),

    PhoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Phone Number must contain exactly 10 digits"),
    pin: Yup.string()
      .required("Pin is required")
      .matches(/^\d{4}$/, "Passcode must be exactly 4 digits"),
    status: Yup.boolean().required("Status is required"),

    AssignFaciltiy: Yup.array()
      .min(1, "At least one facility must be assigned")
      .required("Facility assignment is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const res = await savePosUser(values, isEdit);
      console.log("res", res);
      if (res.data.status === 200) {
        toast.success(
          isEdit
            ? "Pos User Updated Successfully"
            : "Pos User Created Successfully"
        );
        setTimeout(() => {
          setIsPosCreateVisible(false);
          setIsEdit(false);
          setCurrentPosUserEditDetails({});
          resetForm();
        }, 1000);
      } else {
        toast.error("something went wrong");
      }
    } catch (err) {
      console.log("err", err);
      toast.error(err.response.data);
    }
  };
  return (
    <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
              {/* First Name */}
              <div>
                <label htmlFor="User" className="block text-xs font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="FirstName"
                  maxLength={50}
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter first name"
                />
                <ErrorMessage
                  name="FirstName"
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
                  name="LastName"
                  maxLength={50}
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter last name"
                />
                <ErrorMessage
                  name="LastName"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Email Id */}
              <div>
                <label
                  htmlFor="EmailId"
                  className="block text-xs font-medium text-gray-700"
                >
                  Email Id <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  name="EmailId"
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Enter email Id"
                />
                <ErrorMessage
                  name="EmailId"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="PhoneNumber"
                  className="block text-xs font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  maxLength="10"
                  name="PhoneNumber"
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Enter phone number"
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault(); // Prevent non-numeric characters
                    }
                  }}
                />
                <ErrorMessage
                  name="PhoneNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="pin"
                  className="block text-xs font-medium text-gray-700"
                >
                  4-digit Pin
                  {false ? "" : <span className="text-red-500">*</span>}
                </label>
                <Field
                  type="text"
                  name="pin"
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
                  name="pin"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium">Status<span className="text-red-500">*</span></label>
                <Field
                  autoComplete="off"
                  as="select"
                  name="status"
                  onChange={(e) => {
                    const { value } = e.target;
                    setFieldValue("status", value === "true");
                  }}
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                >
                  <option value="">Select Status</option>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Assigned Facilities */}
              <div>
                <label
                  htmlFor="AssignFaciltiy"
                  className="block text-xs font-medium text-gray-700"
                >
                  Assign Facility <span className="text-red-500">*</span>
                </label>
                <Field name="AssignFaciltiy">
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
                {isSavePosUserDetailsLoading
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
