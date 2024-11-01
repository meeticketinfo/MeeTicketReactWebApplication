import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParkStore } from "../../store/masters/parksStore";

const ParkCreate = () => {
  const { saveParkDetails, isSaveParkDetailsLoading } = useParkStore();
  const initialValues = {
    name: "",
    displayName: "",
    street1: "",
    street2: "",
    street3: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    longitude: "",
    latitude: "",
    parkSize: "",
    active: "0",
    description: "",
    // file1: null,
  };

  // Validation schema for the form
  const validationSchema = Yup.object({
    // displayName: Yup.string().required("Park Name is required"),
    // street1: Yup.string().required("Street 1 is required"),
    // street2: Yup.string().required("Street 2 is required"),
    // street3: Yup.string().required("Street 3 is required"),
    // landmark: Yup.string().required("Landmark is required"),
    // city: Yup.string().required("City is required"),
    // state: Yup.string().required("State is required"),
    // country: Yup.string().required("Country is required"),
    // zipCode: Yup.string()
    //   .required("Zip Code is required")
    //   .matches(/^\d+$/, "Zip Code must be a number"),
    // longitude: Yup.string().required("Longitude is required"),
    // latitude: Yup.string().required("Latitude is required"),
    // active: Yup.string().required("Status is required"),
    // description: Yup.string().required("Description is required"),
    // file1: Yup.mixed().required("Park image is required"),
  });

  // onSubmit function to handle form submission
  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveParkDetails
  ) => {
    try {
      // Call the saveParkDetails function from the store
      const result = await saveParkDetails(values, false);
      if (result.success) {
        resetForm();
        alert("Park created successfully!");
      }
    } catch (error) {
      alert("Error creating park. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveParkDetails)
          }
        >
          {({ setFieldValue, touched, errors }) => (
            <Form className="">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {/* Park Name */}
                <div>
                  <label className="block text-sm font-medium">Park Name</label>
                  <Field
                    name="name"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter park name"
                  />
                  <ErrorMessage
                    name="name"
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
                    name="displayName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
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

                {/* Street 1 */}
                <div>
                  <label className="block text-sm font-medium">Street 1</label>
                  <Field
                    name="street1"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter street 1"
                  />
                  <ErrorMessage
                    name="street1"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Street 2 */}
                <div>
                  <label className="block text-sm font-medium">Street 2</label>
                  <Field
                    name="street2"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter street 2"
                  />
                  <ErrorMessage
                    name="street2"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Street 3 */}
                <div>
                  <label className="block text-sm font-medium">Street 3</label>
                  <Field
                    name="street3"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter street 3"
                  />
                  <ErrorMessage
                    name="street3"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium">Landmark</label>
                  <Field
                    name="landmark"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter landmark"
                  />
                  <ErrorMessage
                    name="landmark"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <Field
                    name="city"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter city"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <Field
                    name="state"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter state"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium">Country</label>
                  <Field
                    name="country"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter country"
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label className="block text-sm font-medium">Zip Code</label>
                  <Field
                    name="zipCode"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter zip code"
                  />
                  <ErrorMessage
                    name="zipCode"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-sm font-medium">Longitude</label>
                  <Field
                    name="longitude"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter longitude"
                  />
                  <ErrorMessage
                    name="longitude"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium">Latitude</label>
                  <Field
                    name="latitude"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter latitude"
                  />
                  <ErrorMessage
                    name="latitude"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium">Park Size</label>
                  <Field
                    name="parkSize"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Park Size"
                  />
                  <ErrorMessage
                    name="parkSize"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <Field
                    as="select"
                    name="active"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="active"
                    component="div"
                    className="text-red-500 text-xs"
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
                      errors.name && touched.name
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

                {/* Park Image */}
                <div>
                  <label className="block text-sm font-medium">
                    Park Image
                  </label>
                  {/* <input
                    name="file1"
                    type="file"
                    onChange={(event) =>
                      setFieldValue("file1", event.currentTarget.files[0])
                    }
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  /> */}
                  {/* <ErrorMessage
                    name="file1"
                    component="div"
                    className="text-red-500 text-xs"
                  /> */}
                </div>
              </div>
              {/* Submit Button */}
              <div className="d-flex justify-center">
                <div className="">
                  <button
                    type="submit"
                    className="px-2 py-2 mt-4 bg-blue-v1 text-white rounded-md hover:bg-blue-v2"
                    disabled={isSaveParkDetailsLoading}
                  >
                    {isSaveParkDetailsLoading ? "Saving..." : "Create Park"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ParkCreate;
