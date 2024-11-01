// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUsersStore } from "../../store/masters/usersStore";

const UserCreate = () => {
  const { saveUserDetails, isSaveUserDetailsLoading } = useUsersStore();
  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    emailId: "",
    phoneNumber: "",
    password: "",
    RoleId: "",
    isConfirmed: null,
  };
  const validationSchema = Yup.object({
    
  });

  // onSubmit function to handle form submission
  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveUserDetails
  ) => {
    try {
      // Call the saveUserDetails function from the store
      const result = await saveUserDetails(values, false);
      if (result.success) {
        resetForm();
        alert("User created successfully!");
      }
    } catch (error) {
      alert("Error creating park. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      {" "}
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
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
                {/* User Select */}
                <div>
                  <label
                    htmlFor="User"
                    className="block text-xs font-medium"
                  >
                    First Name
                  </label>
                  <Field
                    name="firstName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${errors.firstName && touched.firstName
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

                {/*Middle Name */}
                <div>
                  <label
                    htmlFor="User"
                    className="block text-xs font-medium"
                  >
                    Middle Name
                  </label>
                  <Field
                    name="middleName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${errors.middleName && touched.middleName
                        ? "border-red-500"
                        : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter middle name"
                  />
                  <ErrorMessage
                    name="middleName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/*Last Name */}
                <div>
                  <label
                    htmlFor="User"
                    className="block text-xs font-medium"
                  >
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${errors.lastName && touched.lastName
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
                    htmlFor="dob"
                    className="block text-xs font-medium text-gray-700"
                  >
                    DOB
                  </label>
                  <Field
                    type="date"
                    name="dob"
                    className={`mt-1 block w-full px-2 py-1 border ${errors.dob && touched.dob
                        ? "border-red-500"
                        : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter date of birth"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Email Id */}
                <div>
                  <label
                    htmlFor="dob"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Email Id
                  </label>
                  <Field
                    type="email"
                    name="emailId"
                    className={`mt-1 block w-full px-2 py-1 border ${errors.emailId && touched.emailId
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
                    type="number"
                    name="phoneNumber"
                    className={`mt-1 block w-full px-2 py-1 border ${errors.phoneNumber && touched.phoneNumber
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
                    className={`mt-1 block w-full px-2 py-1 border ${errors.password && touched.password
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
                  <label className="block text-sm font-medium"> Is Confirmed</label>
                  <Field
                    as="select"
                    name="active"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select </option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </Field>
                  <ErrorMessage
                    name="active"
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
                  {isSaveUserDetailsLoading ? "Saving..." : "Create Park"}
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
