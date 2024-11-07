import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParkStore } from "../../store/masters/parksStore";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseVariant from "../utils/file_privew/baseVariant";

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
console.log("editparkEditDetails",parkEditDetails)
  const initialValues = {
    Id: isParkEditVisible ? parkEditDetails.id : "",
    Name: isParkEditVisible ? parkEditDetails.name : "",
    DisplayName: isParkEditVisible ? parkEditDetails.displayName : "",
    Street1: isParkEditVisible ? parkEditDetails.street1: " ",
    Street2: isParkEditVisible ? parkEditDetails.street2 : "",
    Street3: isParkEditVisible ? parkEditDetails.street3 : "",
    Landmark: isParkEditVisible ? parkEditDetails.landmark : "",
    City: isParkEditVisible ? parkEditDetails.city : "",
    State: isParkEditVisible ? parkEditDetails.state : "",
    Country: isParkEditVisible ? parkEditDetails.country : "",
    ZipCode: isParkEditVisible ? parkEditDetails.zipCode : "",
    longitude: 0,
    latitude: 0,
    ParkSize: isParkEditVisible ? parkEditDetails.parkSize : "0",
    IsActive: isParkEditVisible ? parkEditDetails.isActive : true,
    Description: isParkEditVisible ? parkEditDetails.description : "",
    ImageUrl: null,
    Ifsc: isParkEditVisible ? parkEditDetails.ifsc : "",
    BankName: isParkEditVisible ? parkEditDetails.bankName : "",
    BankBranch: isParkEditVisible ? parkEditDetails.bankBranch : "",
    AccountNumber: isParkEditVisible ? parkEditDetails.accountNumber : "",
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
    Street1: Yup.string()
      .nullable()
      .min(3, "Street 1 must be at least 3 characters long")
      .max(50, "Street 1 cannot be more than 50 characters"),
      Street2: Yup.string()
      .nullable()
      .min(3, "Street 2 must be at least 3 characters long")
      .max(50, "Street 2 cannot be more than 50 characters"),

      Street3: Yup.string()
      .nullable()
      .min(3, "Street 3 must be at least 3 characters long")
      .max(50, "Street 3 cannot be more than 50 characters"),

      Landmark: Yup.string()
      .nullable()
      .min(3, "Landmark must be at least 3 characters long")
      .max(50, "Landmark cannot be more than 50 characters"),
    City: Yup.string()
      .nullable()
      .min(2, "City must be at least 2 characters long")
      .max(50, "City cannot be more than 50 characters"),
    State: Yup.string()
      .nullable()
      .min(2, "State must be at least 2 characters long")
      .max(50, "State cannot be more than 50 characters"),
    Country: Yup.string()
      .nullable()
      .min(2, "Country must be at least 2 characters long")
      .max(50, "Country cannot be more than 50 characters"),
      ZipCode: Yup.string()
      .nullable()
      .matches(/^\d+$/, "Zip Code must be a number")
      .length(5, "Zip Code must be exactly 5 digits"),
    longitude: Yup.number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    latitude: Yup.number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    // IsActive: Yup.boolean(),

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
    Ifsc: Yup.string()
      .required("IFSC code is required")
      .matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC code format"),
      BankName: Yup.string()
      .required("Bank name is required")
      .max(100, "Bank name cannot be more than 100 characters"),
    BankBranch: Yup.string()
      .required("Bank branch is required")
      .max(100, "Bank branch cannot be more than 100 characters"),
    AccountNumber: Yup.string()
      .required("Account number is required")
      .matches(/^\d+$/, "Account number must contain only digits")
      .min(10, "Account number must be at least 10 digits")
      .max(20, "Account number cannot exceed 20 digits"),
  });

  // onSubmit function to handle form submission
  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveParkDetails
  ) => {
    // const data = {
    //   id: values.id,
    //   Name: values.Name,
    //   DisplayName: values.DisplayName,
    //   Street1: values.street1,
    //   Street2: values.street2,
    //   Street3: values.street3,
    //   Landmark: values.landmark,
    //   City: values.city,
    //   State: values.state,
    //   country: values.country,
    //   ZipCode: (values.zipcode && values.zipCode) || "",
    //   longitude: values.longitude,
    //   latitude: values.latitude,
    //   Description: values.description,
    //   ParkSize: values.parkSize,
    //   IsActive: values.IsActive,
    //   ImageUrl: values.ImageUrl,
    //   Ifsc: values.Ifsc,
    //   BankName: values.BankName,
    //   BankBranch: values.BankBranch,
    //   AccountNumber: values.AccountNumber,
    // };

    try {
      const result = await saveParkDetails(
        values,
        isParkEditVisible ? true : false
      );
      if (result && result.data && result.data.status === 200) {
        toast.success(isParkEditVisible?"Park Updated Successfully!":"Park Created Successfully!");
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
                    name="Street1"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Street1 && touched.Street1
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter street 1"
                  />
                  <ErrorMessage
                    name="Street1"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Street 2 */}
                <div>
                  <label className="block text-sm font-medium">Street 2</label>
                  <Field
                    name="Street2"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Street2 && touched.Street2
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter street 2"
                  />
                  <ErrorMessage
                    name="Street2"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Street 3 */}
                <div>
                  <label className="block text-sm font-medium">Street 3</label>
                  <Field
                    name="Street3"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Street3 && touched.Street3
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
                    name="Landmark"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Landmark && touched.Landmark
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter landmark"
                  />
                  <ErrorMessage
                    name="Landmark"
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

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium">Country</label>
                  <Field
                    name="Country"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Country && touched.Country
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter country"
                  />
                  <ErrorMessage
                    name="Country"
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

                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium">Park Size</label>
                  <Field
                    name="ParkSize"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.ParkSize && touched.ParkSize
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Park Size"
                  />
                  <ErrorMessage
                    name="ParkSize"
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
              <hr />
              <div className="grid grid-cols-1  md:grid-cols-3 pt-3 px-6">
                <h4 className="text-lg md:text-lg text-gray-600 dark:text-gray-100 font-bold">
                  Bank Details
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {/* IFSC Field */}
                <div>
                  <label className="block text-sm font-medium">IFSC</label>
                  <Field
                    name="Ifsc"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.Ifsc && touched.Ifsc
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Ifsc"
                  />
                  <ErrorMessage
                    name="Ifsc"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Bank Name Field */}
                <div>
                  <label className="block text-sm font-medium">Bank Name</label>
                  <Field
                    name="BankName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.BankName && touched.BankName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Bank Name"
                  />
                  <ErrorMessage
                    name="BankName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Bank Branch Field */}
                <div>
                  <label className="block text-sm font-medium">
                    Bank Branch
                  </label>
                  <Field
                    name="BankBranch"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.BankBranch && touched.BankBranch
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Bank Branch"
                  />
                  <ErrorMessage
                    name="BankBranch"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Account Number Field */}
                <div>
                  <label className="block text-sm font-medium">
                    Account Number
                  </label>
                  <Field
                    name="AccountNumber"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.AccountNumber && touched.AccountNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Account Number"
                  />
                  <ErrorMessage
                    name="AccountNumber"
                    component="div"
                    className="text-red-500 text-xs"
                  />
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
                    {isSaveParkDetailsLoading ? "Saving..." : isParkEditVisible?"Update Park":"Create Park"}
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
