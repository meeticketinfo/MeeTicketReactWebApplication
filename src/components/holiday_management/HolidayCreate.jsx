import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css";
import { useState } from "react";
import FormWrapperCard from "../FormWrapperCard";
import { useHolidayStore } from "../../store/masters/holidayStore";
import { toast, ToastContainer } from "react-toastify";
// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
//   description: Yup.string().required("Description is required"),
  fromDate: Yup.date().required("Start date is required"),
  toDate: Yup.date().required("End date is required"),
});

export default function HolidayCreate() {
  const { saveHolidayDetails,isSaveHolidayDetailsLoading } = useHolidayStore();
  const handleSubmit = async (values, { resetForm }, saveHolidayDetails) => {
    // Format date fields to ISO strings
    const formattedValues = {
      ...values,
      fromDate: new Date(values.fromDate).toISOString(),
      toDate: new Date(values.toDate).toISOString(),
    };

    try {
      const result = await saveHolidayDetails(formattedValues, false);
      if (result.data.status === 200) {
        toast.success("Service Variant created successfully!");
        setTimeout(() => {
          // setIsServiceVarientCreateVisible(false);
        }, 3000);
        resetForm();
      }
     
    } catch (xhr) {
      console.log("xhr.errors:", xhr);
      if (xhr && xhr.response && typeof xhr.response.data.errors === "object") {
        const formErrors = {};
        Object.keys(xhr.response.data.errors).forEach((key) => {
          if (
            Array.isArray(xhr.response.data.errors[key]) &&
            xhr.response.data.errors[key].length > 0
          ) {
            formErrors[key] = xhr.response.data.errors[key][0];
            console.log(`${key}: ${xhr.response.data.errors[key][0]}`);
            toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
          }
        });
      } else {
        toast.error(xhr.response.data);
      }
    }
  };
  return (
    <FormWrapperCard>
      <ToastContainer position="top-right" autoClose={3000} />
      <Formik
        initialValues={{
          name: "",
          //   description: "",
          fromDate: "",
          toDate: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) =>
          handleSubmit(values, actions, saveHolidayDetails)
        }
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
              {/* Name Field */}
              <div className="">
                <label className="block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <Field
                  name="name"
                  maxLength={55}
                  type="text"
                  placeholder="Holiday Name"
                  className={`mt-1 block w-full px-2 py-1 border ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Start Date Field */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Date and Time
                </label>
                <Field
                  name="fromDate"
                  type="date"
                  className={`mt-1 block w-full px-2 py-1 border ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                />
                <ErrorMessage
                  name="fromDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* End Date Field */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700">
                  End Date and Time
                </label>
                <Field
                  name="toDate"
                  type="date"
                  className={`mt-1 block w-full px-2 py-1 border ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                />
                <ErrorMessage
                  name="toDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Description Field */}
              {/* <div className="md:col-span-3">
                <label className="text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <Field
                  name="description"
                   placeholder="Give discription"
                   maxLength={255}
                  as="textarea"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div> */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center p-5">
              <button
                type="submit"
                className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                disabled={isSaveHolidayDetailsLoading}
              >
                {isSaveHolidayDetailsLoading ? "Submiting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWrapperCard>
  );
}
