import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useBannerStore } from "./BannerStore";

const CreateBanner = ({ setIsBannerCreateVisible, setIsEdit, isEdit }) => {
  const { saveBannersDetails, isBannerDetailsLoading, BannerEditDetails } =
    useBannerStore();
  const [imagePreview, setImagePreview] = useState(
    isEdit ? BannerEditDetails.bannerImage : null
  ); 
  const initialValues = {
    BannerTitle: isEdit ? BannerEditDetails.bannerTitle : "",
    BannerImage: isEdit ? BannerEditDetails.bannerImage : null,
    startDate: isEdit ? BannerEditDetails.startDateAndTime : "",
    endDate: isEdit ? BannerEditDetails.endDateAndTime : "",
    BannerDescription: isEdit ? BannerEditDetails.bannerDescription : "",
    Sequence: isEdit ? BannerEditDetails.sequence : "",
    status: isEdit ? BannerEditDetails.isActive : "",
  };

  const validationSchema = Yup.object({
    BannerTitle: Yup.string()
      .required("Banner Title is required")
      .max(100, "Banner Title cannot be more than 100 characters"),
    BannerImage: Yup.mixed()
      .required("Banner Image is required")
      .test("fileType", "Only JPG/JPEG files are allowed", (value) => {
        // If it's a string (URL from edit), allow it
        if (typeof value === "string") {
          return true;
        }
        // If it's a File object, check the type
        return (
          !value ||
          (value && (value.type === "image/jpeg" || value.type === "image/jpg"))
        );
      }),
    startDate: Yup.string().required("Start Date is required"),

    Sequence: Yup.number().required("Sequence is required"),
    status: Yup.boolean().required("Status is required"),
  });

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("BannerImage", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (setFieldValue) => {
    setFieldValue("BannerImage", null);
    setImagePreview(null);
  };

  const onSubmit = async (values, { resetForm }) => {
    const payload = {
      BannerId: isEdit ? BannerEditDetails.bannerId : "",
      BannerTitle: values.BannerTitle,
      StartDateAndTime: values.startDate,
      EndDateAndTime: values.endDate,
      BannerDescription: values.BannerDescription,
      Sequence: values.Sequence,
      IsActive: values.status,
      BannerDisplayImage: values.BannerImage,
    };
    try {
      const res = await saveBannersDetails(payload, isEdit);
      if (res.data.status === 200) {
        toast.success(
          isEdit
            ? "Banner updated successfully!"
            : "Banner created successfully!"
        );

        setTimeout(() => {
          resetForm();
          setImagePreview(null);
          setIsEdit(false);
          setIsBannerCreateVisible(false);
        }, 1000);
      } else {
        toast.error("Failed to create banner");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data.title||error.response?.data);
    }
  };
  return (
    <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
              {/*Banner Title  */}
              <div>
                <label
                  htmlFor="BannerTitle"
                  className="block text-xs text-black font-medium"
                >
                  Banner Title <span className="text-red-500">*</span>
                </label>
                <Field
                  name="BannerTitle"
                  maxLength={100}
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border-gray-300  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter banner title"
                />
                <ErrorMessage
                  name="BannerTitle"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Start Date & Time */}
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-xs font-medium text-black "
                >
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <Field
                  type="datetime-local"
                  name="startDate"
                  className={`mt-1 block w-full px-2 py-1 border
              border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  // min={getCurrentDateTime()}
                  onChange={(e) => {
                    const startDateValue = e.target.value;
                    setFieldValue("startDate", startDateValue);
                    if (new Date(startDateValue) > new Date(values.toDate)) {
                      // Automatically update toDate if it's earlier than fromDate
                      setFieldValue("toDate", startDateValue);
                    }
                  }}
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              {/* End Date & Time */}
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-xs font-medium text-black "
                >
                  To Date & Time
                </label>
                <Field
                  type="datetime-local"
                  name="endDate"
                  className={`mt-1 block w-full px-2 py-1 border
                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  min={values.startDate}
                  onChange={(e) => {
                    const endDateValue = e.target.value;
                    setFieldValue("endDate", endDateValue);
                  }}
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-black ">
                  Status<span className="text-red-500">*</span>
                </label>
                <Field
                  autoComplete="off"
                  as="select"
                  name="status"
                  onChange={(e) => {
                    const { value } = e.target;
                    setFieldValue("status", value === "true");
                  }}
                  className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                >
                  <option value="">Select Status</option>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              {/*Sequence  */}
              <div>
                <label
                  htmlFor="Sequence"
                  className="block text-xs font-medium text-black "
                >
                  Sequence <span className="text-red-500">*</span>
                </label>
                <Field
                  name="Sequence"
                  maxLength={3}
                  type="number"
                  min="1"
                  max="999"
                  onInput={(e) => {
                    if (e.target.value.length > 3) {
                      e.target.value = e.target.value.slice(0, 3);
                    }
                  }}
                  className={`mt-1 block w-full px-2 py-1 border border-gray-300  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter sequence number"
                />
                <ErrorMessage
                  name="Sequence"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              {/* Banner Description */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-black ">
                  Banner Description
                </label>
                <Field
                  as="textarea"
                  maxLength={500}
                  name="BannerDescription"
                  className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  placeholder="Enter description"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData("text");
                    if (!/^[a-zA-Z0-9]*$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}
                />
                <ErrorMessage
                  name="Description"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/*Banner Image */}
              <div className="col-span-1">
                <label
                  htmlFor="BannerImage"
                  className="block text-xs font-medium text-black "
                >
                  Banner Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 ">
                  <div className="relative border border-gray-300 rounded-md">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,image/jpeg"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border file:border-none focus:outline-none file:text-sm  file:bg-white file:text-gray-900 hover:file:bg-gray-50 file:cursor-pointer cursor-pointer"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center bg-gray-200 px-6 pr-3 pointer-events-none text-sm ">
                      Browse
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-blue-v1 bg-gray-100 shadow-md inline-block rounded-md px-2 py-[1px]">
                    Supported formats: JPG/JPEG
                  </p>
                  {imagePreview && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-600">Preview:</p>
                        <button
                          type="button"
                          onClick={() => clearImage(setFieldValue)}
                          className="text-xs text-red-600 hover:text-red-800 underline"
                        >
                          Remove Image
                        </button>
                      </div>
                      <img
                        src={imagePreview}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
                <ErrorMessage
                  name="BannerImage"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center p-2">
              <button
                type="submit"
                className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                // disabled={isSavePosUserDetailsLoading}
              >
                {isBannerDetailsLoading
                  ? "Saving..."
                  : isEdit
                  ? "Edit Banner"
                  : "Create Banner"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateBanner;
