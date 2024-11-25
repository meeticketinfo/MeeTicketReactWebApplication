import React from "react"
import { ErrorMessage, Form, Formik } from "formik"
import ValidationSchema from "../config/ValidationSchema"
import DepartmentCreate from "../pages/DepartmentCreate"

const DepartmentForm = ({
  initialValues ={},
  onSubmit,
  isSubmitting,
  isSaveDepartmentTypeDetailsLoading }) => {
    console.log("initialValues:", initialValues);
    console.log("onSubmit:", onSubmit);
  return (
    <>
      <div className="">
        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveDepartmentTypeDetails)
          }
        >
          {({ errors, touched }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-6">
                {/* Service Name */}
                <div className="">
                  <label className="block text-sm font-medium">
                    {" "}
                    Department Name
                  </label>
                  <Field
                    name="departmentName"
                    type="text"
                    maxLength={50}
                    className={`mt-1 block w-full px-2 py-1 border ${errors.departmentName && touched.departmentName
                      ? "border-red-500"
                      : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Department name"
                  />
                  <ErrorMessage
                    name="departmentName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Status */}
                <div className="mt-1 flex items-end">
                  <label className="text-sm flex space-x-2">
                    <span>Status</span>
                    <Field
                      type="checkbox"
                      name="isActive"
                      className="sr-only peer "
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                  </label>
                  <ErrorMessage
                    name="isActive"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center p-2 px-6 py-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSubmitting}
                >
                  {isSaveDepartmentTypeDetailsLoading
                    ? "Saving..."
                      : "Create Department"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )

}
export default DepartmentForm ; 







