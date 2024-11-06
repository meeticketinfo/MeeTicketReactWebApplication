// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUsersStore } from "../../store/masters/usersStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceCreate = () => {
  const { saveUserDetails, isSaveUserDetailsLoading } = useUsersStore();
  const { fetchAllFacilities, allFacilities } = useFacilityStore();
  useEffect(() => {
    fetchAllFacilities();
  }, []);
  const initialValues = {
    firstName: "",
    middleName: "",
    parkId: "",
    lastName: "",
    dateOfBirth: "",
    emailId: "",
    phoneNumber: "",
    password: "",
    roleId: "901a561a-2c54-4f1f-9a40-5aa8b71e2e71",
    isConfirmed: true,
  };
  const validationSchema = Yup.object({});

  // onSubmit function to handle form submission
  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveUserDetails
  ) => {
    try {
      // Call the saveUserDetails function from the store
      const result = await saveUserDetails(values, false);
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("Error creating park. Please try again.");
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
            onSubmit(values, actions, saveUserDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                <div>
                  <label className="block text-sm font-medium"> Park</label>
                  <Field
                    as="select"
                    name="facilityId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.facilityId && touched.facilityId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select </option>
                    {allFacilities.map((facility) => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="facilityId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium"> Name</label>
                  <Field
                    name="Name"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Name && touched.Name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter park name"
                  />
                  <ErrorMessage
                    name="Name"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/* Park Name */}
                <div>
                  <label className="block text-sm font-medium">
                    Display Name
                  </label>
                  <Field
                    name="DisplayName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.DisplayName && touched.DisplayName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter park name"
                  />
                  <ErrorMessage
                    name="DisplayName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/*Last Name */}
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    Last Name
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
                {/* DOB Number */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-xs font-medium text-gray-700"
                  >
                    DOB
                  </label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.dateOfBirth && touched.dateOfBirth
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter date of birth"
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Email Id */}
                <div>
                  <label
                    htmlFor="emailId"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Email Id
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
                    Phone Number
                  </label>
                  <Field
                    type="text"
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
                    Password
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium">
                    {" "}
                    Is Confirmed
                  </label>
                  <Field
                    as="select"
                    name="isConfirmed"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.isConfirmed && touched.isConfirmed
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select </option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </Field>
                  <ErrorMessage
                    name="isConfirmed"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-start p-2">
                <button
                  type="submit"
                  className="bg-blue-v1 text-white rounded px-3 py-1 hover:bg-blue-700 text-sm mt-3"
                  disabled={isSaveUserDetailsLoading}
                >
                  {isSaveUserDetailsLoading ? "Saving..." : "Create User"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default ServiceCreate;
