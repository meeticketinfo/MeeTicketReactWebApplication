import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminLayout from "../../../layouts/AdminLayout";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
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

export default function AdminUsers() {
const navigate = useNavigate()
  const userView = ()=>{
    navigate("/user-management/view")
  }
  return (
    <AdminLayout>
      <div className="container mx-auto mt-10 px-4">
        <h2 className="text-black text-2xl font-bold mb-6">Admin User</h2>
        
        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="flex justify-between mb-6 bg-[#f8f9fa] p-2 border-b-2">
            <h6 className="text-lg font-semibold">Admin User</h6>
            <button className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700" onClick={userView}>View</button>
          </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                  {/* Park Select */}
                  <div className="mb-4">
                    <label htmlFor="park" className="block text-sm font-medium text-gray-700">Park</label>
                    <Field
                      as="select"
                      name="park"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.park && touched.park ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white`}
                    >
                      <option value="">Select Park</option>
                      <option value="park1">Park 1</option>
                      <option value="park2">Park 2</option>
                    </Field>
                    <ErrorMessage name="park" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      type="text"
                      name="name"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Mobile Number */}
                  <div className="mb-4">
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <Field
                      type="text"
                      name="mobileNumber"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.mobileNumber && touched.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter mobile number"
                    />
                    <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Field
                      type="password"
                      name="password"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter password"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Confirm password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-start p-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 mt-4"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </AdminLayout>
  );
}
