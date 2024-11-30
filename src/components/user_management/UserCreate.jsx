// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUsersStore } from "../../store/masters/usersStore";
import { useParkStore } from "../../store/masters/parksStore";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../../store/authStore";

const UserCreate = ({
  roleName,
  setIsUserCreateVisible,
  isUserEditVisible,
  setIsUserEditVisible,
}) => {
  const { saveUserDetails, isSaveUserDetailsLoading, userEditDetails } =
    useUsersStore();
  const {
    allParks,
    fetchAllParks,
    fetchAllNodalOfficerParks,
    allNodalOfficerParks,
    isFetchAllNodalOfficerParksLoading,
  } = useParkStore();
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const role = roleDetails?.name;
  const userId = decodedTokenData?.data?.UserId;

  const parksToRender =
    role === "ROLE_NODALOFFICER" ? allNodalOfficerParks : allParks;

  useEffect(() => {
    if (role === "ROLE_NODALOFFICER") {
      fetchAllNodalOfficerParks(null, null, {}, userId);
    } else {
      fetchAllParks();
    }
  }, []);

  const initialValues = {
    id: isUserEditVisible ? userEditDetails.id : "",
    firstName: isUserEditVisible ? userEditDetails.firstName : "",
    middleName: isUserEditVisible ? userEditDetails.middleName : "",
    parkId: isUserEditVisible ? userEditDetails.entityId : "",
    lastName: isUserEditVisible ? userEditDetails.lastName : "",
    dateOfBirth: "2024-11-15T06:59:41.509Z",
    emailId: isUserEditVisible ? userEditDetails.emailId : "",
    phoneNumber: isUserEditVisible ? userEditDetails.phoneNumber : "",
    password: isUserEditVisible ? userEditDetails.password : "",
    roleId: isUserEditVisible ? userEditDetails.roleId : "",
    isConfirmed: isUserEditVisible ? userEditDetails.isConfirmed : true,
    isActive: isUserEditVisible ? userEditDetails.isActive : true,
  };

  const createValidationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    lastName: Yup.string()
      //.required("Last Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    emailId: Yup.string().required("EmailId is required"),
    parkId: Yup.string().required("Location is required"),
    phoneNumber: Yup.number().required("Phone Number is required"),
    // .max(10, "Phone Number Must contain 10 digits"),
    password: Yup.string()
      .required("Password is required")
      .min(10, "Password cannot be less than 10 characters")
      .max(16, "Password cannot be more than 16 characters")
      .matches(
        /[A-Z]/,
        "Password must include at least one uppercase letter (A-Z)"
      )
      .matches(
        /[a-z]/,
        "Password must include at least one lowercase letter (a-z)"
      )
      .matches(/\d/, "Password must include at least one numeric digit (0-9)")
      .matches(
        /[@$!%*?&]/,
        "Password must include at least one special character (e.g., !, @, #, $, %, &, *)"
      ),
  });
  const updateValidationSchema = Yup.object({
    firstName: Yup.string()
      //.required("First Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    lastName: Yup.string()
      //.required("Last Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    emailId: Yup.string().required("EmailId is required"),
    // parkId: Yup.string().required("Entity is required"),
    phoneNumber: Yup.number().required("Phone Number is required"),
    // .max(10, "Phone Number Must contain 10 digits"),
    password: Yup.string()
      // .required("Password is required")
      .min(10, "Password cannot be less than 10 characters")
      .max(16, "Password cannot be more than 16 characters")
      .matches(
        /[A-Z]/,
        "Password must include at least one uppercase letter (A-Z)"
      )
      .matches(
        /[a-z]/,
        "Password must include at least one lowercase letter (a-z)"
      )
      .matches(/\d/, "Password must include at least one numeric digit (0-9)")
      .matches(
        /[@$!%*?&]/,
        "Password must include at least one special character (e.g., !, @, #, $, %, &, *)"
      ),
  });

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveUserDetails
  ) => {
    try {
      const formattedValues = {
        ...values,
        isActive: values.isActive === "true" || values.isActive === true,
        password: values.password && values.password,
      };

      const result = await saveUserDetails(
        formattedValues,
        isUserEditVisible ? true : false
      );

      if (result.data.status === 200) {
        toast.success(
          isUserEditVisible
            ? "Location Admin Updated successfully!"
            : "Location Admin Created Successfully"
        );
        setTimeout(() => {
          setIsUserCreateVisible(false);
          setIsUserEditVisible(false);
        }, 3000);

        resetForm();
      }
    } catch (xhr) {
      if (xhr && xhr.response && typeof xhr.response.data.errors === "object") {
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
        toast.error(xhr.response.data);
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
            isUserEditVisible ? updateValidationSchema : createValidationSchema
          }
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveUserDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                <div>
                  <label className="block text-sm font-medium">Location  <span className="text-red-500">*</span></label>
                  <Field
                    as="select"
                    name="parkId"
                    disabled={isUserEditVisible}
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.parkId && touched.parkId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Location</option>
                    {parksToRender
                      ?.filter((park) => park.isActive)
                      .map((park) => (
                        <option
                          key={park.id}
                          disabled={!park.isActive}
                          className={!park.isActive && `bg-red-200 text-white`}
                          value={park.id}
                        >
                          {park.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="parkId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/* User Select */}
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    First Name  <span className="text-red-500">*</span>
                  </label>
                  <Field
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
                    Last Name  <span className="text-red-500">*</span>
                  </label>
                  <Field
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
                    Email Id  <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    name="emailId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.emailId && touched.emailId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter emailId"
                    disabled={isUserEditVisible}
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
                    htmlFor="dob"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Phone Number  <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="phoneNumber"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter phone number"
                    disabled={isUserEditVisible}
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
                    Password  <span className="text-red-500">*</span>
                  </label>
                  <Field
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
                    as="select"
                    name="isActive"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.isActive && touched.isActive
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="isActive"
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
                  disabled={isSaveUserDetailsLoading}
                >
                  {isSaveUserDetailsLoading
                    ? "Saving..."
                    : isUserEditVisible
                    ? "Update Location Admin"
                    : "Create Location Admin"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default UserCreate;
