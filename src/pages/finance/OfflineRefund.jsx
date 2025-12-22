import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useOfflineRefundStore } from "./OfflineRefundStore";

const OfflineRefund = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { saveOfflineRefundDetails, isOfflineRefundDetailsLoading } =
    useOfflineRefundStore();

  const initialValues = {
    OrderId: "",
    TransactionId: "",
    BannerImage: null,
  };

  const validationSchema = Yup.object({
    BannerImage: Yup.mixed()
      .required("Refund proof image is required")
      .test("fileType", "Only JPG/JPEG files are allowed", (value) => {
        if (typeof value === "string") {
          return true;
        }
        return (
          !value ||
          (value && (value.type === "image/jpeg" || value.type === "image/jpg"))
        );
      }),
    TransactionId: Yup.string().required("Transaction Id is required"),
    OrderId: Yup.string().required("Order Id is required"),
  });

  const processFile = (file, setFieldValue) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
      setFieldValue("BannerImage", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file, setFieldValue);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e, setFieldValue) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file, setFieldValue);
    }
  };

  const clearImage = (setFieldValue) => {
    setFieldValue("BannerImage", null);
    setImagePreview(null);
    setFileInputKey((prev) => prev + 1);
  };

  const onSubmit = async (values, { resetForm }) => {
    const payload = {
      TransactionId: values.TransactionId,
      OrderId: values.OrderId,
      Images: values.BannerImage,
    };
    try {
      const res = await saveOfflineRefundDetails(payload);
      if (res.data.status === 200) {
        toast.success("Offline refund created successfully!");
        setImagePreview(null);
        resetForm();
        setFileInputKey((prev) => prev + 1);
      } else {
        toast.error("Failed to create offline refund");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data.title ||
          error.response?.data ||
          "Something went wrong"
      );
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-v2 text-shadow-sm  my-2">
                Offline Refund
              </h1>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200  overflow-hidden">
          <div className="bg-gradient-to-r from-blue-v1 via-blue-900 to-blue-v2 px-4 py-1.5">
            <p className="text-xs text-white  ">
              Process offline refund requests with transaction and order
              details.
            </p>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form>
                <div className="p-4 space-y-4">
                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Transaction Id */}
                    <div className="space-y-1">
                      <label
                        htmlFor="TransactionId"
                        className="block text-xs font-semibold text-gray-700  "
                      >
                        Transaction ID <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="TransactionId"
                        maxLength={100}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none   bg-white  text-sm text-gray-900  placeholder-gray-400 222"
                        placeholder="Enter transaction ID"
                      />
                      <ErrorMessage
                        name="TransactionId"
                        component="div"
                        className="text-red-500 text-xs mt-1 flex items-center gap-1"
                      />
                    </div>

                    {/* Order Id */}
                    <div className="space-y-1">
                      <label
                        htmlFor="OrderId"
                        className="block text-xs font-semibold text-gray-700"
                      >
                        Order ID <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="OrderId"
                        maxLength={100}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none  bg-white  text-sm text-gray-900  placeholder-gray-400"
                        placeholder="Enter order ID"
                      />
                      <ErrorMessage
                        name="OrderId"
                        component="div"
                        className="text-red-500 text-xs mt-1 flex items-center gap-1"
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-1">
                    <label
                      htmlFor="BannerImage"
                      className="block text-xs font-semibold text-gray-700 "
                    >
                      Refund Proof Image <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-1">
                      <label
                        htmlFor="file-upload"
                        className="relative block cursor-pointer"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, setFieldValue)}
                      >
                        <input
                          key={fileInputKey}
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".jpg,.jpeg,image/jpeg"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          className="sr-only"
                        />
                        <div
                          className={`flex items-center justify-center w-full border-2 border-dashed rounded-md p-4 transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 cursor-pointer ${
                            isDragging
                              ? "border-blue-v1  bg-blue-50 "
                              : "border-gray-300  hover:border-gray-500 "
                          }`}
                        >
                          <div className="text-center">
                            <svg
                              className={`mx-auto h-8 w-8 transition-colors ${
                                isDragging
                                  ? "text-blue-v1 dark:text-blue-v2"
                                  : "text-gray-400"
                              }`}
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="mt-2 flex text-xs leading-5 text-gray-600 ">
                              <span className="font-semibold text-blue-v1 dark:text-blue-v2">
                                Click to upload
                              </span>
                              <span className="pl-1">or drag and drop</span>
                            </div>
                            <p className="text-xs leading-4 text-gray-500  mt-1">
                              JPG, JPEG up to 10MB
                            </p>
                          </div>
                        </div>
                      </label>

                      {imagePreview && (
                        <div className="space-y-2 md:w-1/3 mt-2">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-md transition-opacity duration-200 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => clearImage(setFieldValue)}
                                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-600 transition-all duration-200 shadow-lg"
                              >
                                Remove Image
                              </button>
                            </div>
                            <img
                              src={imagePreview}
                              alt="Refund proof preview"
                              className="w-full h-48 object-cover rounded-md border-2 border-gray-200  shadow-md"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => clearImage(setFieldValue)}
                            className="text-xs text-red-600  hover:text-red-800  font-medium transition-colors duration-200"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500  mt-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Supported formats: JPG/JPEG only
                    </p>

                    <ErrorMessage
                      name="BannerImage"
                      component="div"
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    />
                  </div>
                </div>

                {/* Submit Button Section */}
                <div className="px-4 py-3 bg-gray-50  border-t border-gray-200  flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isOfflineRefundDetailsLoading || isSubmitting}
                    className="inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-blue-v1 to-blue-v2 text-white text-sm font-semibold rounded-md shadow-sm hover:shadow-md transform  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none   min-w-[120px]"
                  >
                    {isOfflineRefundDetailsLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Submit Refund
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OfflineRefund;
