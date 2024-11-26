// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParkStore } from "../../store/masters/parksStore";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useNodalOfficerStore } from "../../store/masters/nodalOfficerStore";

const NodalOfficerCreate = ({
  setIsNodalOfficerCreateVisible,
  isNodalOfficerEditVisible,
  setIsNodalOfficerEditVisible,
}) => {
  const {
    saveNodalOfficerDetails,
    isSaveNodalOfficerDetailsLoading,
    NodalOfficersEditDetails,
  } = useNodalOfficerStore();
  const { allParks, fetchAllParks } = useParkStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();

  useEffect(() => {
    fetchAllParks();
    fetchAllDepartmentTypes();
    fetchAllEntityTypes();
  }, []);

  // console.log(allDepartmentTypes , 'departmenrts')
  const initialValues = {
    id: isNodalOfficerEditVisible ? NodalOfficersEditDetails.id : "",
    firstName: isNodalOfficerEditVisible
      ? NodalOfficersEditDetails.firstName
      : "",
    middleName: "",
    lastName: isNodalOfficerEditVisible
      ? NodalOfficersEditDetails.lastName
      : "",
    emailId: isNodalOfficerEditVisible ? NodalOfficersEditDetails.emailId : "",
    phoneNumber: isNodalOfficerEditVisible
      ? NodalOfficersEditDetails.phoneNumber
      : "",
    password: isNodalOfficerEditVisible
      ? NodalOfficersEditDetails.password
      : "",
    // roleId: isNodalOfficerEditVisible ? NodalOfficersEditDetails.roleId : "",
    IsActive: isNodalOfficerEditVisible
      ? NodalOfficersEditDetails.isActive
      : true,
  };
  const createValidationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    emailId: Yup.string().required("EmailId is required"),
    phoneNumber: Yup.number().required("Phone Number is required"),
    // .max(10, "Phone Number Must contain 10 digits"),
    password: Yup.string()
      .required("Password is required")
      .max(8, "Password cannot be more than 8 characters"),
  });
  const updateValidationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    emailId: Yup.string().required("EmailId is required"),
    phoneNumber: Yup.number().required("Phone Number is required"),
    // .max(10, "Phone Number Must contain 10 digits"),
    password: Yup.string()
      // .required("Password is required")
      .max(8, "Password cannot be more than 8 characters"),
    // .matches(/^\d{8}$/, "Passcode must be exactly 4 digits"),
  });

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveNodalOfficerDetails
  ) => {
    try {
      const formattedValues = {
        ...values,
        IsActive: values.IsActive === "true" || values.IsActive === true,
      };
      const result = await saveNodalOfficerDetails(
        formattedValues,
        isNodalOfficerEditVisible ? true : false
      );
      if (result && result.data && result.data.status === 200) {
        toast.success(
          isNodalOfficerEditVisible
            ? "Nodal Officer updated successfully!"
            : "Nodal Officer created successfully!"
        );
        setTimeout(() => {
          setIsNodalOfficerCreateVisible(false);
        }, 3000);
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
          validationSchema={
            isNodalOfficerEditVisible
              ? updateValidationSchema
              : createValidationSchema
          }
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveNodalOfficerDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* <div>
                  <label className="block text-sm font-medium">
                    Department
                  </label>
                  <Field
                    autoComplete="off"
                    as="select"
                    name="departmentId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.departmentId && touched.departmentId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select </option>
                    {allDepartmentTypes
                      ?.filter((departmentType) => departmentType.isActive)
                      .map((departmentType) => (
                        <option
                          key={departmentType.departmentId}
                          value={departmentType.departmentId}
                        >
                          {departmentType.departmentName}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="departmentId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Entity Type
                  </label>
                  <Field
                    autoComplete="off"
                    as="select"
                    name="entityTypeId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.entityTypeId && touched.entityTypeId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select </option>
                    {allEntityTypes
                      ?.filter((entityType) => entityType.isActive)
                      .map((entityType) => (
                        <option
                          key={entityType.entityTypeId}
                          value={entityType.entityTypeId}
                        >
                          {entityType.entityTypeName}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="entityTypeId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div> */}
                {/* User Select */}
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    autoComplete="off"
                    name="firstName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.firstName && touched.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    autoComplete="off"
                    name="lastName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.lastName && touched.lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    autoComplete="off"
                    type="email"
                    name="emailId"
                    id="email-id"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.emailId && touched.emailId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter emailId"
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
                    type="password"
                    name="password"
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
                  <label className="block text-sm font-medium">Status</label>
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

                  {/* Department */}
              <div>
                <label className="block text-sm font-medium">Department <span className="text-red-500">*</span></label>
                <Field
                  as="select"
                  name="departmentId"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                >
                  <option value="">Select Department</option>
                  {allDepartmentTypes
                    ?.filter((departmentType) => departmentType.isActive)
                    .map((departmentType) => (
                      <option
                        key={departmentType.departmentId}
                        value={departmentType.departmentId}
                      >
                        {departmentType.departmentName}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  className="text-red-600 text-sm"
                  name="departmentId"
                  component={"div"}
                />
              </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center p-2">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveNodalOfficerDetailsLoading}
                >
                  {isSaveNodalOfficerDetailsLoading
                    ? "Saving..."
                    : isNodalOfficerEditVisible
                    ? "Update Nodal Officer"
                    : "Create Nodal Officer"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default NodalOfficerCreate;
