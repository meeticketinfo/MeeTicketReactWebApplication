// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const UserCreate = () => {
  const validationSchema = Yup.object({
    park: Yup.string().required("Please enter facility name."),
    name: Yup.string().required("Please enter facility name."),
    mobileNumber: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d+$/, "Mobile number must be numeric"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please enter Confirm password."),
  });
  return (
    <>
      {" "}
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
        <Formik
          initialValues={{
            park: "",
            name: "",
            mobileNumber: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form data:", values);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* Park Select */}
                <div>
                  <label
                    htmlFor="park"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Park
                  </label>
                  <Field
                    as="select"
                    name="park"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.park && touched.park
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Park</option>
                    <option value="park1">Park 1</option>
                    <option value="park2">Park 2</option>
                  </Field>
                  <ErrorMessage
                    name="park"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <Field
                    type="text"
                    name="mobileNumber"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.mobileNumber && touched.mobileNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter mobile number"
                  />
                  <ErrorMessage
                    name="mobileNumber"
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
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Confirm password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-start p-2">
                <button
                  type="submit"
                  className="bg-blue-v1 text-white rounded px-3 py-1 hover:bg-blue-700 text-sm mt-3"
                  disabled={isSubmitting}
                >
                  Submit
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
