// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUsersStore } from "../../store/masters/usersStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useServiceStore } from "../../store/masters/servicesStore";

const ServiceCreate = () => {
  const { saveServiceDetails, isSaveServiceDetailsLoading } = useServiceStore();
  const { fetchAllFacilities, allFacilities } = useFacilityStore();
  useEffect(() => {
    fetchAllFacilities();
  }, []);
  const initialValues = {
    name: "",
    displayName: "",
    serviceType: "",
    duration: "",
    availability: "",
    installationDate: "",
    description: "",
    isActive: true,
    facilityId: "",
  };
  const validationSchema = Yup.object({});

  // onSubmit function to handle form submission
  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveServiceDetails
  ) => {
    try {
      // Call the saveUserDetails function from the store
      const result = await saveServiceDetails(values, false);
      toast.success("Service created successfully!");
      // if (result.success) {
      //   resetForm();
      //   alert("User created successfully!");
      // }
    } catch (error) {
      toast.error("Error creating service. Please try again.");
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
            onSubmit(values, actions, saveServiceDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                <div>
                  <label className="block text-sm font-medium">Facility</label>
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
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium">
                    {" "}
                    Service Name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter service name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium">
                    Display Name
                  </label>
                  <Field
                    name="displayName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.displayName && touched.displayName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter park name"
                  />
                  <ErrorMessage
                    name="displayName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Duration
                  </label>
                  <Field
                    type="text"
                    name="duration"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.duration && touched.duration
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter Duration"
                  />
                  <ErrorMessage
                    name="duration"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* DOB Number */}
                <div>
                  <label
                    htmlFor="installationDate"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Installation Date
                  </label>
                  <Field
                    type="date"
                    name="installationDate"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.installationDate && touched.installationDate
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter date of birth"
                  />
                  <ErrorMessage
                    name="installationDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <Field
                    as="select"
                    name="isActive"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="active"
                    component="div"
                    className="text-red-500 text-xs"
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
                      errors.availabilityStatus && touched.availabilityStatus
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

                {/* Description */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter description"
                  />
                  <ErrorMessage
                    name="description"
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
                  disabled={isSaveServiceDetailsLoading}
                >
                  {isSaveServiceDetailsLoading ? "Saving..." : "Create Service"}
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
