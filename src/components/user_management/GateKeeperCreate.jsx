// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUsersStore } from "../../store/masters/usersStore";
import { useParkStore } from "../../store/masters/parksStore";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gateKeepersStore } from "../../store/masters/gateKeepersStore";
import useAuthStore from "../../store/authStore";

const GateKeeperCreate = ({ setIsGateKeeperCreateVisible }) => {
  const { saveGateKeeperDetails, isSaveGateKeeperDetailsLoading,currentGateKeeperEditDetails,IsEditGateKeeper,setIsEditGateKeeper } =
    gateKeepersStore();
  const { allParks, fetchAllParks } = useParkStore();
  const { isLoading, isAuthenticated, token, error, decodedTokenData, login } =
    useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;
  useEffect(() => {
    fetchAllParks();
  }, []);
  console.log("IsEditGateKeeper",IsEditGateKeeper)

  const initialValues = {
    id:IsEditGateKeeper?currentGateKeeperEditDetails.id :"",
    firstName:IsEditGateKeeper?currentGateKeeperEditDetails.firstName :"",
    middleName: IsEditGateKeeper?currentGateKeeperEditDetails.middleName :"",
    parkId: parkId,
    lastName: IsEditGateKeeper?currentGateKeeperEditDetails.lastName :"",
    dateOfBirth: IsEditGateKeeper?currentGateKeeperEditDetails.dateOfBirth :"2024-11-18T19:50:43.952Z",
    emailId: IsEditGateKeeper?currentGateKeeperEditDetails.emailId :"",
    phoneNumber: IsEditGateKeeper?currentGateKeeperEditDetails.phoneNumber :"",
    password: IsEditGateKeeper?currentGateKeeperEditDetails.password :"",
    roleId: IsEditGateKeeper?currentGateKeeperEditDetails.roleId :"",
    isConfirmed: IsEditGateKeeper?currentGateKeeperEditDetails.isConfirmed :true,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(30, "First Name cannot be more than 30 characters"),
    emailId: Yup.string().required("Email Id is required"),

    phoneNumber: Yup.string().required("Phone Number is required")
    .matches(/^\d{10}$/, "Phone Number must contain exactly 10 digits"),
    password: !IsEditGateKeeper&&Yup.string()
      .required("Pin is required")
      .matches(/^\d{4}$/, "Passcode must be exactly 4 digits"),
    // dateOfBirth: Yup.date()
    //   .required("Date of Birth is required")
    //   .test("age", "You must be at least 18 years old", (value) => {
    //     const today = new Date();
    //     const age = today.getFullYear() - value.getFullYear();
    //     const month = today.getMonth() - value.getMonth();
    //     // If birth month is later in the year, subtract one year
    //     if (month < 0 || (month === 0 && today.getDate() < value.getDate())) {
    //       return age - 1 >= 18;
    //     }
    //     return age >= 18;
    //   }),
  });

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveGateKeeperDetails
  ) => {
    try {
      const result = await saveGateKeeperDetails(values, 
        IsEditGateKeeper ? true : false,
        );
      if (result && result.data && result.data.status === 200) {
        toast.success(IsEditGateKeeper?"Gate Keeper Updated successfully!":"Gate Keeper created successfully!");
        setTimeout(() => {
          setIsGateKeeperCreateVisible(false);
          setIsEditGateKeeper(false)
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
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveGateKeeperDetails)
          }
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
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.firstName && touched.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter first name"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                      setFieldValue("firstName", value);
                    }}
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      if (!/^[a-zA-Z0-9]*$/.test(pastedText)) {
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
                    name="lastName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.lastName && touched.lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter last name"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                      setFieldValue("lastName", value);
                    }}
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
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
                    type="email"
                    name="emailId"
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
                    4-digit Pin{IsEditGateKeeper?"":<span className="text-red-500">*</span>}
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
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Four-digit-pin"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center p-2">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveGateKeeperDetailsLoading}
                >
                  {isSaveGateKeeperDetailsLoading ? "Saving..." : IsEditGateKeeper?"Edit Gate Keeper":"Create Gate Keeper"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default GateKeeperCreate;
