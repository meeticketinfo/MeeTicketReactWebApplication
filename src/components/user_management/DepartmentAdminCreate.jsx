// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { DepartmentAdminStore } from "../../store/masters/departmentAdminStore";
import Select from "react-select";

const DepartmentAdminCreate = ({
  setIsNodalOfficerCreateVisible,
  isNodalOfficerEditVisible,
  setIsNodalOfficerEditVisible,
}) => {
  const {
    savePosUser,
    isSaveDepartmentAdminDetailsLoading,
    departmentAdminEditDetails,
  } = DepartmentAdminStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes,isFetchAllDepartmentTypesLoading } =
    useDepartmentTypesStore();
    const departmentOptions =
    allDepartmentTypes?.filter((department) => department.isActive !== false)
      .map((department) => ({
        value: department.departmentId,
        label: department.departmentName,
      })) || [];
  

  useEffect(() => {
    fetchAllDepartmentTypes();
  }, []);

  // console.log(allDepartmentTypes , 'departmenrts')
  const initialValues = {
    userId: isNodalOfficerEditVisible ? departmentAdminEditDetails?.userId || departmentAdminEditDetails?.id || "" : "",
    departmentIds: isNodalOfficerEditVisible
      ? (Array.isArray(departmentAdminEditDetails?.departmentAssigned)
          ? departmentAdminEditDetails.departmentAssigned.map((d) => d.id)
          : (departmentAdminEditDetails?.departmentIds || []))
      : [],
    firstName: isNodalOfficerEditVisible
      ? departmentAdminEditDetails?.firstName || ""
      : "",
    middleName: "",
    lastName: isNodalOfficerEditVisible
      ? departmentAdminEditDetails?.lastName || ""
      : "",
    emailId: isNodalOfficerEditVisible ? departmentAdminEditDetails?.emailId || "" : "",
    phoneNumber: isNodalOfficerEditVisible
      ? (departmentAdminEditDetails?.phoneNumber || departmentAdminEditDetails?.mobileNumber || "")
      : "",
    password: isNodalOfficerEditVisible
      ? (departmentAdminEditDetails?.password || "")
      : "",
    IsActive: isNodalOfficerEditVisible
      ? (departmentAdminEditDetails?.status ?? true)
      : true,
  };
  const createValidationSchema = Yup.object({
    departmentIds: Yup.array().of(Yup.string().required()).min(1, "Select at least one department").required("Department is required"),
    firstName: Yup.string()
      .required("First Name is required")
      .max(50, "First Name cannot be more than 50 characters")
      .matches(/^[a-zA-Z0-9]*$/, "First Name must contain only alphanumeric characters (no spaces or special characters)"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(50, "Last Name cannot be more than 50 characters")
      .matches(/^[a-zA-Z0-9]*$/, "Last Name must contain only alphanumeric characters (no spaces or special characters)"),
    emailId: Yup.string().required("Email Id is required"),
    phoneNumber: Yup.string().required("Phone Number is required").matches(/^\d{10}$/, "Enter 10 digit mobile number"),
    // .max(10, "Phone Number Must contain 10 digits"),
    password: Yup.string()
      .required()
      .min(10)
      .max(16),
  });
  const updateValidationSchema = Yup.object({
    departmentIds: Yup.array().of(Yup.string().required()).min(1, "Select at least one department").required("Department is required"),
    firstName: Yup.string()
      .required("First Name is required")
      .max(50, "First Name cannot be more than 50 characters")
      .matches(/^[a-zA-Z0-9]*$/, "First Name must contain only alphanumeric characters (no spaces or special characters)"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(50, "Last Name cannot be more than 50 characters")
      .matches(/^[a-zA-Z0-9]*$/, "Last Name must contain only alphanumeric characters (no spaces or special characters)"),
    emailId: Yup.string().required("EmailId is required"),
    phoneNumber: Yup.string().required("Phone Number is required").matches(/^\d{10}$/, "Enter 10 digit Phone Number"),
    password: Yup.string()
      .min(10)
      .max(16),
  });

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveDepartmentAdmin
  ) => {
    try {
      const formattedValues = {
        userId: values.userId || undefined,
        firstName: values.firstName,
        lastName: values.lastName,
        emailId: values.emailId,
        phoneNumber: values.phoneNumber,
        password: values.password || undefined,
        departmentIds: Array.isArray(values.departmentIds) ? values.departmentIds : [],
        status: values.IsActive === "true" || values.IsActive === true,
      };
      const result = await saveDepartmentAdmin(
        formattedValues,
        isNodalOfficerEditVisible ? true : false
      );
      if (result && result.data && result.data.status === 200) {
        toast.success(
          isNodalOfficerEditVisible
            ? "Department Admin updated successfully!"
            : "Department Admin created successfully!"
        );
        setTimeout(() => {
          setIsNodalOfficerCreateVisible(false);
        }, 1000);
        resetForm();
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      if (
        xhr &&
        xhr.response &&
        xhr.response.data &&
        xhr.response.data.errors
      ) {
        const formErrors = {};
        Object.keys(xhr.response.data.errors).forEach((key) => {
          if (
            Array.isArray(xhr.response.data.errors[key]) &&
            xhr.response.data.errors[key].length > 0
          ) {
            formErrors[key] = xhr.response.data.errors[key][0];
            toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
          }
        });
      } else {
        toast.error(xhr.response?.data || "An unknown error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      {" "}
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
        <ToastContainer position="top-right" autoClose={3000} />
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={
            isNodalOfficerEditVisible
              ? updateValidationSchema
              : createValidationSchema
          }
          onSubmit={(values, actions) =>
            onSubmit(values, actions, savePosUser)
          }
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* Department Filter */}
               <div>
                <label
                  htmlFor="AssignFaciltiy"
                  className="block text-xs font-medium text-gray-700"
                >
                  Department Name <span className="text-red-500">*</span>
                </label>
                <div className="">
                  <Field name="departmentIds">
                    {({ field, form, meta }) => (
                      <div className="relative">
                        <Select
                          {...field}
                          isMulti
                          options={departmentOptions}
                          value={departmentOptions.filter((option) =>
                            field?.value?.includes(option.value)
                          )}
                          onChange={(selectedOptions) => {
                            const facilityIds = selectedOptions
                              ? selectedOptions.map((option) => option.value)
                              : [];
                            form.setFieldValue(field.name, facilityIds);
                          }}
                          onBlur={() => form.setFieldTouched(field.name, true)}
                          placeholder={isFetchAllDepartmentTypesLoading ? "Loading Departments..." : "Select Departments..."}
                          className={`mt-1 ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'}`}
                          classNamePrefix="react-select"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "32px",
                              fontSize: "14px",
                              border: meta.touched && meta.error 
                                ? "1px solid #EF4444" 
                                : "1px solid #D1D5DB",
                              borderRadius: "6px",
                              boxShadow: "none",
                              "&:hover": {
                                border: meta.touched && meta.error 
                                  ? "1px solid #EF4444" 
                                  : "1px solid #D1D5DB",
                              },
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
                              backgroundColor: state.isSelected ? "#3b82f6" : "white",
                              color: state.isSelected ? "white" : "#374151",
                              ":hover": {
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
                {/* User Select */}
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    autoComplete="off"
                    name="firstName"
                    type="text"
                    maxLength="50"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.firstName && touched.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter first name"
                    onKeyPress={(e) => {
                      // Only allow alphanumeric characters
                      if (!/^[a-zA-Z0-9]*$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
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
                    autoComplete="off"
                    name="lastName"
                    type="text"
                    maxLength="50"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.lastName && touched.lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter last name"
                    onKeyPress={(e) => {
                      // Only allow alphanumeric characters
                      if (!/^[a-zA-Z0-9]*$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
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
                    autoComplete="off"
                    type="email"
                    name="emailId"
                    id="email-id"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.emailId && touched.emailId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter email Id"
                  />
                  <ErrorMessage
                    name="emailId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Field
                    autoComplete="off"
                    type="text"
                    maxLength="10"
                    name="phoneNumber"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
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
                    Password {!isNodalOfficerEditVisible &&<span className="text-red-500">*</span>}
                  </label>
                  <Field
                    autoComplete="off"
                    type="text"
                    name="password"
                    minLength="10"
                    maxLength="16"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter password"
                  />
                  <ErrorMessage
                    name="password"
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
                    name="IsActive"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.IsActive && touched.IsActive
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="IsActive"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

              </div>
              {/* Submit Button */}
              <div className="flex justify-center p-2">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveDepartmentAdminDetailsLoading}
                >
                  {isSaveDepartmentAdminDetailsLoading
                    ? "Saving..."
                    : isNodalOfficerEditVisible
                    ? "Update Department Admin"
                    : "Create Department Admin"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default DepartmentAdminCreate;
