// import React from "react";

// const FacilityCreate = () => {
//   return <> create</>;
// };
// export default FacilityCreate;

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const validationSchema = Yup.object({
  facilityName: Yup.string().required("Please enter facility name."),
  displayName: Yup.string().required("Please enter display name."),
  contactName: Yup.string().required("Please enter contact name."),
  contactEmail: Yup.string()
    .email("Invalid email format")
    .required("Please enter contact email."),
  contactNumber: Yup.string()
    .matches(/^\d+$/, "Contact number must be numeric")
    .required("Contact number is required"),
  capacity: Yup.number()
    .positive("Capacity must be a positive number")
    .required("Please enter capacity."),
  lastMaintenanceDate: Yup.date().required(
    "Please select last maintenance date."
  ),
  installationDate: Yup.date().required("Please select installation date."),
  availabilityStatus: Yup.string().required(
    "Please select availability status."
  ),
  facilityCondition: Yup.string().required("Please enter facility condition."),
  openTime: Yup.string().required("Please select open time."),
  closeTime: Yup.string().required("Please select close time."),
});

export default function FacilityCreate() {
  const navigate = useNavigate();

  const handleView = () => {
    navigate("/facilities/view");
  };

  return (
    <div className="container mx-auto mt-10">
      {/* <h2 className="text-black text-2xl font-bold mb-6">Facilities</h2> */}

      <div className="bg-white shadow-md rounded-lg mb-6">
        <Formik
          initialValues={{
            facilityName: "",
            displayName: "",
            contactName: "",
            contactEmail: "",
            contactNumber: "",
            capacity: "",
            lastMaintenanceDate: "",
            installationDate: "",
            availabilityStatus: "",
            facilityCondition: "",
            openTime: "",
            closeTime: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form data:", values);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* Facility Name */}
                <div className="">
                  <label
                    htmlFor="facilityName"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Facility Name
                  </label>
                  <Field
                    type="text"
                    name="facilityName"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Facility Name"
                  />
                  <ErrorMessage
                    name="facilityName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Display Name */}
                <div className="">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Display Name
                  </label>
                  <Field
                    type="text"
                    name="displayName"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Display Name"
                  />
                  <ErrorMessage
                    name="displayName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Contact Name */}
                <div className="">
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Contact Name
                  </label>
                  <Field
                    type="text"
                    name="contactName"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Contact Name"
                  />
                  <ErrorMessage
                    name="contactName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Contact Email */}
                <div className="">
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Contact Email
                  </label>
                  <Field
                    type="email"
                    name="contactEmail"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Contact Email"
                  />
                  <ErrorMessage
                    name="contactEmail"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Contact Number */}
                <div className="">
                  <label
                    htmlFor="contactNumber"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Contact Number
                  </label>
                  <Field
                    type="text"
                    name="contactNumber"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Contact Number"
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Capacity */}
                <div className="">
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Capacity
                  </label>
                  <Field
                    type="number"
                    name="capacity"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Capacity"
                  />
                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Last Maintenance Date */}
                <div className="">
                  <label
                    htmlFor="lastMaintenanceDate"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Last Maintenance Date
                  </label>
                  <Field
                    type="date"
                    name="lastMaintenanceDate"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                  <ErrorMessage
                    name="lastMaintenanceDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Installation Date */}
                <div className="">
                  <label
                    htmlFor="installationDate"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Installation Date
                  </label>
                  <Field
                    type="date"
                    name="installationDate"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                  <ErrorMessage
                    name="installationDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Availability Status */}
                <div className="">
                  <label
                    htmlFor="availabilityStatus"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Availability Status
                  </label>
                  <Field
                    as="select"
                    name="availabilityStatus"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </Field>
                  <ErrorMessage
                    name="availabilityStatus"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Facility Condition */}
                <div className="">
                  <label
                    htmlFor="facilityCondition"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Facility Condition
                  </label>
                  <Field
                    type="text"
                    name="facilityCondition"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Facility Condition"
                  />
                  <ErrorMessage
                    name="facilityCondition"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Open Time */}
                <div className="">
                  <label
                    htmlFor="openTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Open Time
                  </label>
                  <Field
                    type="time"
                    name="openTime"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                  <ErrorMessage
                    name="openTime"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Close Time */}
                <div className="">
                  <label
                    htmlFor="closeTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Close Time
                  </label>
                  <Field
                    type="time"
                    name="closeTime"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                  <ErrorMessage
                    name="closeTime"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

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
      </div>
    </div>
  );
}
