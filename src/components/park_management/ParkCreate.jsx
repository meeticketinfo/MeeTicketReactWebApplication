import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParkStore } from "../../store/masters/parksStore";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseVariant from "../utils/file_privew/baseVariant";

const ParkCreate = ({ setIsParkCreateVisible }) => {
  const {
    saveParkDetails,
    isSaveParkDetailsLoading,
    handleFileChange,
    filePreviews,
  } = useParkStore();
  const initialValues = {
    Name: "",
    DisplayName: "",
    street1: "",
    street2: "",
    street3: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    longitude: 0,
    latitude: 0,
    parkSize: "0",
    isActive: true,
    description: "",
    imageUrl: null,
  };
  const FILE_SIZE = 10 * 1024 * 1024;

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];
  // Validation schema for the form
  const validationSchema = Yup.object({
    Name: Yup.string().required("Park Name is required"),
    DisplayName: Yup.string().required("Park Display Name is required"),
    street1: Yup.string()
      .min(3, "Street 1 must be at least 3 characters long")
      .max(50, "Street 1 cannot be more than 50 characters"),
    street2: Yup.string()
      .min(3, "Street 2 must be at least 3 characters long")
      .max(50, "Street 2 cannot be more than 50 characters"),

    street3: Yup.string()
      .min(3, "Street 3 must be at least 3 characters long")
      .max(50, "Street 3 cannot be more than 50 characters"),

    landmark: Yup.string()
      .min(3, "Landmark must be at least 3 characters long")
      .max(50, "Landmark cannot be more than 50 characters"),
    city: Yup.string()
      .min(2, "City must be at least 2 characters long")
      .max(50, "City cannot be more than 50 characters"),
    state: Yup.string()
      .min(2, "State must be at least 2 characters long")
      .max(50, "State cannot be more than 50 characters"),
    country: Yup.string()
      .min(2, "Country must be at least 2 characters long")
      .max(50, "Country cannot be more than 50 characters"),
    zipCode: Yup.string()
      .matches(/^\d+$/, "Zip Code must be a number")
      .length(5, "Zip Code must be exactly 5 digits"),
    longitude: Yup.number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    latitude: Yup.number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    active: Yup.boolean(),

    description: Yup.string()
      .min(10, "Description must be at least 10 characters long")
      .max(500, "Description cannot be more than 500 characters"),
    ImageUrl: Yup.mixed()
      .nullable()
      .test("fileSize", "File too large", (value) => {
        return !value || (value && value.size <= FILE_SIZE);
      })
      .test("fileType", "Unsupported file format", (value) => {
        return !value || (value && SUPPORTED_FORMATS.includes(value.type));
      }),
  });

  // onSubmit function to handle form submission
  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveParkDetails
  ) => {
    const data = {
      Name: values.Name,
      DisplayName: values.DisplayName,
      street1: values.street1,
      street2: values.street2,
      street3: values.street3,
      landmark: values.landmark,
      city: values.city,
      state: values.state,
      country: values.country,
      zipCode: values.zipcode,
      longitude: values.longitude,
      latitude: values.latitude,
      description: values.description,
      parkSize: values.parkSize,
      isActive: values.isActive,
      ImageUrl: values.ImageUrl, // Add image URL or any other file here
    };

    try {
      const response = await saveParkDetails(data, false);
      if (response?.data?.status === 200) {
        toast.success("Park created successfully!");
        setTimeout(() => {
          setIsParkCreateVisible(false);
        }, 3000);
      }
    } catch (error) {
      toast.error("Error creating park!");
    }
  };
  return (
    <>
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
        <ToastContainer position="top-right" autoClose={3000} />
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
                    name="Name"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Name && touched.Name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter park name"
                  />
                  <ErrorMessage
                    name="Name"
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
                    name="DisplayName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.DisplayName && touched.DisplayName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter park name"
                  />
                  <ErrorMessage
                    name="DisplayName"
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
                  <input
                    name="ImageUrl"
                    type="file"
                    // onChange={(event) =>
                    //   setFieldValue("file1", event.currentTarget.files[0])
                    // }
                    onChange={(e) => {
                      handleFileChange(e, "ImageUrl");
                      setFieldValue("ImageUrl", e.currentTarget.files[0]);
                    }}
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                  <ErrorMessage
                    name="ImageUrl"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                  {filePreviews.ImageUrl?.fileUrl && (
                    <BaseVariant
                      file={filePreviews.ImageUrl.file}
                      fileType={filePreviews.ImageUrl.fileType}
                      fileUrl={filePreviews.ImageUrl.fileUrl}
                    />
                  )}
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
