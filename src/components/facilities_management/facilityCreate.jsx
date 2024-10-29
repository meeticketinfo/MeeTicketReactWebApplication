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
  contactEmail: Yup.string().email("Invalid email format").required("Please enter contact email."),
  contactNumber: Yup.string()
    .matches(/^\d+$/, "Contact number must be numeric")
    .required("Contact number is required"),
  capacity: Yup.number()
    .positive("Capacity must be a positive number")
    .required("Please enter capacity."),
  lastMaintenanceDate: Yup.date().required("Please select last maintenance date."),
  installationDate: Yup.date().required("Please select installation date."),
  availabilityStatus: Yup.string().required("Please select availability status."),
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
        <div className="flex justify-between mb-6 bg-[#f8f9fa] p-2 border-b-2">
          <h6 className="text-lg font-semibold">Facilities</h6>
          <button className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700" onClick={handleView}>View</button>
        </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                
                {/* Facility Name */}
                <div className="mb-4">
                  <label htmlFor="facilityName" className="block text-sm font-medium text-gray-700">Facility Name</label>
                  <Field
                    type="text"
                    name="facilityName"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.facilityName && touched.facilityName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                    placeholder="Facility Name"
                  />
                  <ErrorMessage name="facilityName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Display Name */}
                <div className="mb-4">
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                  <Field
                    type="text"
                    name="displayName"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.displayName && touched.displayName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                    placeholder="Display Name"
                  />
                  <ErrorMessage name="displayName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Contact Name */}
                <div className="mb-4">
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
                  <Field
                    type="text"
                    name="contactName"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.contactName && touched.contactName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                    placeholder="Contact Name"
                  />
                  <ErrorMessage name="contactName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Contact Email */}
                <div className="mb-4">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <Field
                    type="email"
                    name="contactEmail"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.contactEmail && touched.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                    placeholder="Contact Email"
                  />
                  <ErrorMessage name="contactEmail" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <Field
                    type="text"
                    name="contactNumber"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.contactNumber && touched.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                    placeholder="Contact Number"
                  />
                  <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Capacity */}
                <div className="mb-4">
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                  <Field
                    type="number"
                    name="capacity"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.capacity && touched.capacity ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                    placeholder="Capacity"
                  />
                  <ErrorMessage name="capacity" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Last Maintenance Date */}
                <div className="mb-4">
                  <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700">Last Maintenance Date</label>
                  <Field
                    type="date"
                    name="lastMaintenanceDate"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.lastMaintenanceDate && touched.lastMaintenanceDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                  />
                  <ErrorMessage name="lastMaintenanceDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Installation Date */}
                <div className="mb-4">
                  <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700">Installation Date</label>
                  <Field
                    type="date"
                    name="installationDate"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.installationDate && touched.installationDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                  />
                  <ErrorMessage name="installationDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Availability Status */}
                <div className="mb-4">
                  <label htmlFor="availabilityStatus" className="block text-sm font-medium text-gray-700">Availability Status</label>
                  <Field
                    as="select"
                    name="availabilityStatus"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.availabilityStatus && touched.availabilityStatus ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                  >
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </Field>
                  <ErrorMessage name="availabilityStatus" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Facility Condition */}
                <div className="mb-4">
                  <label htmlFor="facilityCondition" className="block text-sm font-medium text-gray-700">Facility Condition</label>
                  <Field
                    type="text"
                    name="facilityCondition"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.facilityCondition && touched.facilityCondition ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                    placeholder="Facility Condition"
                  />
                  <ErrorMessage name="facilityCondition" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Open Time */}
                <div className="mb-4">
                  <label htmlFor="openTime" className="block text-sm font-medium text-gray-700">Open Time</label>
                  <Field
                    type="time"
                    name="openTime"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.openTime && touched.openTime ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                  />
                  <ErrorMessage name="openTime" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Close Time */}
                <div className="mb-4">
                  <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700">Close Time</label>
                  <Field
                    type="time"
                    name="closeTime"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.closeTime && touched.closeTime ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none`}
                  />
                  <ErrorMessage name="closeTime" component="div" className="text-red-500 text-sm mt-1" />
                </div>

              </div>

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
  );
}
