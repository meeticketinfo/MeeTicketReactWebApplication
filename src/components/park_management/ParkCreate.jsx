import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParkStore } from "../../store/masters/parksStore";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseVariant from "../utils/file_privew/baseVariant";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";

const ParkCreate = ({
  setIsParkCreateVisible,
  isParkEditVisible,
  setIsParkEditVisible,
}) => {
  const {
    saveParkDetails,
    isSaveParkDetailsLoading,
    handleFileChange,
    filePreviews,
    parkEditDetails,
  } = useParkStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
  }, []);

  const initialValues = {
    Id: isParkEditVisible ? parkEditDetails.id : "",
    EntityTypeId: isParkEditVisible ? parkEditDetails.EntityTypeId : "",
    DepartmentId: isParkEditVisible ? parkEditDetails.DepartmentId : "",
    DisplayName: "",
    Name: isParkEditVisible ? parkEditDetails.name : "",
    Street1: isParkEditVisible ? parkEditDetails.street1 : " ",
    Street2: isParkEditVisible ? parkEditDetails.street2 : "",
    City: isParkEditVisible ? parkEditDetails.city : "",
    State: isParkEditVisible ? parkEditDetails.state : "",
    ZipCode: isParkEditVisible ? parkEditDetails.zipCode : "",
    IsActive: isParkEditVisible ? parkEditDetails.isActive : true,
    Description: isParkEditVisible ? parkEditDetails.description : "",
    ImageUrl: null,
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
    EntityTypeId: Yup.number().required("Entity Type is required"),
    DepartmentId: Yup.number().required("Department is required"),
    Street1: Yup.string()
      .nullable()
      // .min(3, "Street 1 must be at least 3 characters long")
      .max(50, "Street 1 cannot be more than 50 characters"),
    Street2: Yup.string()
      .nullable()
      .min(3, "Street 2 must be at least 3 characters long")
      .max(50, "Street 2 cannot be more than 50 characters"),
    City: Yup.string()
      .nullable()
      .min(2, "City must be at least 2 characters long")
      .max(50, "City cannot be more than 50 characters"),
    State: Yup.string()
      .nullable()
      .min(2, "State must be at least 2 characters long")
      .max(50, "State cannot be more than 50 characters"),
    ZipCode: Yup.string()
      .nullable()
      .matches(/^\d+$/, "Zip Code must be a number")
      .length(6, "Zip Code must be exactly 5 digits"),
    Description: Yup.string()
      .nullable()
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
    try {
      const result = await saveParkDetails(
        values,
        isParkEditVisible ? true : false
      );
      if (result && result.data && result.data.status === 200) {
        toast.success(
          isParkEditVisible
            ? "Park Updated Successfully!"
            : "Park Created Successfully!"
        );
        setTimeout(() => {
          setIsParkCreateVisible(false);
          setIsParkEditVisible(false);
        }, 3000);
        resetForm();
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      if (
        xhr &&
        xhr.response &&
        xhr.response.data &&
        xhr.response.data.errors
      ) {
        const formErrors = {};
        Object.keys(xhr.response.data.errors).forEach((key) => {
          if (
            Array.isArray(xhr.response.data.errors[key]) &&
            xhr.response.data.errors[key].length > 0
          ) {
            formErrors[key] = xhr.response.data.errors[key][0];
            toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
          }
        });
      } else {
        toast.error(xhr.response?.data || "An unknown error occurred.");
      }
    } finally {
      setSubmitting(false);
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
          {/* EntityTypeId DepartmentId */}
          {({ setFieldValue, touched, errors }) => (
            <Form className="">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {/* Entity Type */}
                <div>
                  <label className="block text-sm font-medium">
                    Entity Type
                  </label>
                  <Field
                    as="select"
                    name="EntityTypeId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.EntityTypeId && touched.EntityTypeId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Entity Type</option>
                    {allEntityTypes?.data?.map((entityType) => (
                      <option
                        key={entityType.entityTypeId}
                        value={entityType.entityTypeId}
                      >
                        {entityType.entityTypeName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="EntityTypeId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium">
                    Department
                  </label>
                  <Field
                    as="select"
                    name="DepartmentId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.DepartmentId && touched.DepartmentId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Department</option>
                    {allDepartmentTypes?.data?.map((departmentType) => (
                      <option
                        key={departmentType.departmentId}
                        value={departmentType.departmentId}
                      >
                        {departmentType.departmentName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="DepartmentId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                
                {/* Entity Name */}
                <div>
                  <label className="block text-sm font-medium">
                    Entity Name
                  </label>
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

                {/* Street 1 */}
                <div>
                  <label className="block text-sm font-medium">
                    Address Line 1
                  </label>
                  <Field
                    name="Street1"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Street1 && touched.Street1
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Address Line 1"
                  />
                  <ErrorMessage
                    name="Street1"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Street 2 */}
                <div>
                  <label className="block text-sm font-medium">
                    Address Line 2
                  </label>
                  <Field
                    name="Street2"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Street2 && touched.Street2
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Address Line 2"
                  />
                  <ErrorMessage
                    name="Street2"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <Field
                    name="City"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.City && touched.City
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter city"
                  />
                  <ErrorMessage
                    name="City"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <Field
                    name="State"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.State && touched.State
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter state"
                  />
                  <ErrorMessage
                    name="State"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label className="block text-sm font-medium">Zip Code</label>
                  <Field
                    name="ZipCode"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.ZipCode && touched.ZipCode
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter zip code"
                  />
                  <ErrorMessage
                    name="ZipCode"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <Field
                    as="select"
                    name="IsActive"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.IsActive && touched.IsActive
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="IsActive"
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
                    name="Description"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Description && touched.Description
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter description"
                  />
                  <ErrorMessage
                    name="Description"
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
                      errors.ImageUrl && touched.ImageUrl
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
              <div className="flex justify-center">
                <div className="">
                  <button
                    type="submit"
                    className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                    disabled={isSaveParkDetailsLoading}
                  >
                    {isSaveParkDetailsLoading
                      ? "Saving..."
                      : isParkEditVisible
                      ? "Update Park"
                      : "Create Park"}
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
