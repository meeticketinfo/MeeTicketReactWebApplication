import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css";
import { useState } from "react";
import FormWrapperCard from "../FormWrapperCard";
import { useHolidayStore } from "../../store/masters/holidayStore";
// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  fromDate: Yup.date().required("Start date is required"),
  toDate: Yup.date().required("End date is required"),
});

export default function HolidayCreate() {
  const { saveHolidayDetails } = useHolidayStore();
  const handleSubmit = async (values, { resetForm }, saveHolidayDetails) => {
    // Format date fields to ISO strings
    const formattedValues = {
      ...values,
      fromDate: new Date(values.fromDate).toISOString(),
      toDate: new Date(values.toDate).toISOString(),
    };

    try {
      await saveHolidayDetails(formattedValues, false);
      // setFormStatus("Holiday saved successfully.");
      resetForm(); // Reset form on successful submission
    } catch (err) {
      // setFormStatus("Failed to save holiday. Please try again.");
    }
  };
  return (
    <FormWrapperCard>
      <Formik
        initialValues={{
          name: "",
          description: "",
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
              <div className="md:col-span-1">
                <label className="text-gray-700 dark:text-gray-300">Name</label>
                <Field
                  name="name"
                  type="text"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Start Date Field */}
              <div className="col-span-1">
                <label className="text-gray-700 dark:text-gray-300">
                  Start Date and Time
                </label>
                <Field
                  name="fromDate"
                  type="datetime-local"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="fromDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* End Date Field */}
              <div className="col-span-1">
                <label className="text-gray-700 dark:text-gray-300">
                  End Date and Time
                </label>
                <Field
                  name="toDate"
                  type="datetime-local"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="toDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Description Field */}
              <div className="md:col-span-3">
                <label className="text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-start p-5">
              <button
                type="submit"
                className="bg-blue-v1 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition duration-300 ease-in-out focus:ring-4 focus:ring-blue-500 focus:outline-none"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWrapperCard>
  );
}
