import React from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { convertToBase64 } from "../../../../utils/Helper";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { usePackagesCommonStore } from "../../../../store/amrabad/masters/packagesCommonStore";
import * as Yup from "yup";

// helper: turn an existing image URL into a base64 string
const urlToBase64 = async (url) => {
  const resp = await fetch(url);
  const blob = await resp.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // base64
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const UpdatePackage = ({ data }) => {
  const { UpdatePackage, isUpdatePackageLoading, fetchPackagesWithRooms } =
    usePackagesStore();

  const { setCurrentTab } = usePackagesCommonStore();

  /** ---------------- validation schema ---------------- */
  const updatePackageValidationSchema = Yup.object().shape({
    packageName: Yup.string().required("Package name is required"),
    description: Yup.string()
      .max(100, "Max 100 characters")
      .required("Description is required"),
    checkInTime: Yup.string()
      .required("Check-in time is required"),
      // .matches(/^\d{2}:\d{2}$/, "Use HH:MM format"),
    checkOutTime: Yup.string()
      .required("Check-out time is required")
      // .matches(/^\d{2}:\d{2}$/, "Use HH:MM format")
      .test(
        "after-check-in",
        "Check-out must be after check-in",
        function (value) {
          const { checkInTime } = this.parent;
          return !value || !checkInTime || value > checkInTime;
        }
      ),
    termsConditions: Yup.string()
      .max(100, "Max 100 characters")
      .required("T&C are required"),
    privacyPolicy: Yup.string().max(100),
    latitude: Yup.number()
      .typeError("Latitude must be a number")
      .required("Latitude is required")
      .min(-90)
      .max(90)
      .nullable(),
    longitude: Yup.number()
      .typeError("Longitude must be a number")
      .required("Longitude is required")
      .min(-180)
      .max(180)
      .nullable(),
    packageImages: Yup.array()
      .of(Yup.object().shape({
        imageId: Yup.mixed().nullable(),
        imageUrl: Yup.string().nullable(),
        isNew: Yup.boolean(),
        isDeleted: Yup.boolean(),
      }))
      .test('at-least-one-image', 'At least one image is required', function(value) {
        if (!value || value.length === 0) return false;
        const nonDeletedImages = value.filter(img => !img.isDeleted);
        return nonDeletedImages.length > 0;
      }),
    isActive: Yup.boolean().required("Status is required"),
  });

  /** ---------------- initial values ---------------- */
  const initialValues = {
    packageId: data.packageId,
    packageName: data.packageName,
    description: data.description,
    checkInTime: data.checkInTime,
    checkOutTime: data.checkOutTime,
    guidelines: data.guidelines,
    cancellationPolicy: data.cancellationPolicy,
    termsConditions: data.termsConditions,
    privacyPolicy: data.privacyPolicy,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.isActive,

    // full objects so we can flag new / deleted
    packageImages: Array.isArray(data.packageImages)
      ? data.packageImages.map((img) => ({
          imageId: img.imageId,
          imageUrl: img.imageUrl,
          isNew: false,
          isDeleted: false,
        }))
      : [],
  };

  /** ---------------- submit handler ---------------- */
  const onSubmit = async (values) => {
    
    try {
      const packageImages = [];

      for (const img of values.packageImages) {
        let base64Image = "";

        if (!img.isDeleted) {
          // If not deleted, include image data
          if (img.isNew) {
            base64Image = img.imageUrl; // already base64
          } else {
            base64Image = await urlToBase64(img.imageUrl);
          }
        }

        packageImages.push({
          imageId: img.isNew ? null : img.imageId, // 0 for new images
          base64Image, // empty string if deleted
          isDeleted: img.isDeleted ? true : false, // 1 if deleted, 0 otherwise
        });
      }
      const payload = {
        ...values,
        packageImages,
      };

      const res = await UpdatePackage(payload);

      if (res.data.status === 200) {
        toast.success("Package updated successfully 🎉");
        // setCurrentTab(0);
        fetchPackagesWithRooms();
      } else {
        toast.error("Something went wrong while updating the package");
      }
    } catch (err) {
      toast.error("Something went wrong while updating the package");
    } finally {
    }
  };

  /** ---------------- component ---------------- */
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-3">
        <Formik
          initialValues={initialValues}
          validationSchema={updatePackageValidationSchema}
          onSubmit={onSubmit}
          enableReinitialize
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            /* ---------- file input handler ---------- */
            const handleFileChange = async (e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;

              const newObjs = [];
              for (const file of files) {
                const b64 = await convertToBase64(file);
                newObjs.push({
                  imageUrl: b64,
                  isNew: true,
                  isDeleted: false,
                });
              }

              setFieldValue("packageImages", [
                ...values.packageImages,
                ...newObjs,
              ]);

              // allow re‑selecting the same file again later
              e.target.value = "";
            };

            return (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ------- simple text inputs (trimmed for brevity) ------- */}
                  <div>
                    <label className="block text-sm font-medium">
                      Name of the Package<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="packageName"
                      type="text"
                      className="mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md text-sm"
                      placeholder="Enter Package Name"
                    />
                    <ErrorMessage
                      name="packageName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* (include the rest of your fields here exactly as before) */}
                  {/* Check In Time */}
                  <div className="">
                    <label
                      htmlFor="checkInTime"
                      className="block text-sm font-medium"
                    >
                      Check-in<span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="time"
                      name="checkInTime"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Check-in Time"
                    />
                    <ErrorMessage
                      name="checkInTime"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Check Out Time */}
                  <div className="">
                    <label
                      htmlFor="checkOutTime"
                      className="block text-sm font-medium"
                    >
                      Checkout Time<span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="time"
                      name="checkOutTime"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Checkout Time"
                    />
                    <ErrorMessage
                      name="checkOutTime"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/*  Latitude */}
                  <div className="">
                    <label
                      htmlFor="latitude"
                      className="block text-sm font-medium"
                    >
                      Latitude<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="latitude"
                      type="text"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Latitude"
                    />
                    <ErrorMessage
                      name="latitude"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/*  Longitude */}
                  <div className="">
                    <label
                      htmlFor="longitude"
                      className="block text-sm font-medium"
                    >
                      Longitude<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="longitude"
                      type="text"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter longitude"
                    />
                    <ErrorMessage
                      name="longitude"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* status */}
                  <div className="form-group">
                    <label
                      className="block text-sm font-medium"
                      htmlFor="isActive"
                    >
                      Status<span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="isActive"
                      name="isActive"
                      onChange={(e) => {
                        const Value = e.target.value === "true";
                        setFieldValue(`isActive`, Value);
                      }}
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    >
                      <option value="">Select</option>
                      <option value={true}>Active</option>
                      <option value={false}>In Active</option>
                    </Field>
                    <ErrorMessage
                      name="isActive"
                      component="span"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/*  Guidelines */}
                  <div>
                    <label
                      htmlFor="guidelines"
                      className="block text-sm font-medium"
                    >
                      Guidelines
                    </label>
                    <Field
                      as="textarea"
                      name="guidelines"
                      maxlength={50}
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Guidelines"
                    />
                  </div>
                  {/* discription */}
                  <div>
                    <label className="block text-sm font-medium">
                      Description<span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      maxlength={100}
                      name="description"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none  bg-white text-sm`}
                      placeholder="Enter Description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Cancellation Policy */}
                  <div>
                    <label className="block text-sm font-medium">
                      Cancellation Policy
                    </label>
                    <Field
                      as="textarea"
                      maxlength={100}
                      name="cancellationPolicy"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Cancellation Policy"
                    />
                  </div>
                  {/* Terms & Conditions */}
                  <div>
                    <label className="block text-sm font-medium">
                      Terms & Conditions<span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      maxlength={100}
                      name="termsConditions"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Terms & Conditions"
                    />
                    <ErrorMessage
                      name="termsConditions"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Privacy Policy */}
                  <div>
                    <label className="block text-sm font-medium">
                      Privacy Policy
                    </label>
                    <Field
                      as="textarea"
                      maxlength={100}
                      name="privacyPolicy"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Privacy Policy"
                    />
                  </div>

                  {/* ------- file upload ------- */}
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images<span className="text-red-500">*</span>
                    </label>

                    {/* Drag and Drop Zone */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ease-in-out ${
                        values.packageImages.length > 0
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400 bg-gray-50"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = Array.from(e.dataTransfer.files).filter(
                          (file) => file.type.startsWith("image/")
                        );
                        if (files.length > 0) {
                          handleFileChange({ target: { files } });
                        }
                      }}
                    >
                      {/* Upload Icon */}
                      <div className="flex justify-center mb-4">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>

                      {/* Upload Text */}
                      <p className="text-gray-600 mb-2">
                        Drop your images here, or{" "}
                        <label className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                          click to browse
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </p>

                      {/* File Specifications */}
                      <p className="text-sm text-gray-500">
                        1600 x 1200 (4:3) recommended. PNG, JPG
                      </p>
                    </div>

                    {/* Image validation error */}
                    <ErrorMessage
                      name="packageImages"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />

                    {/* ------- preview ------- */}
                    {values.packageImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Selected Images (
                          {
                            values.packageImages.filter((img) => !img.isDeleted)
                              .length
                          }
                          ):
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {values.packageImages.map((img, idx) =>
                            img.isDeleted ? null : (
                              <div
                                key={img.imageId ?? idx}
                                className="relative group aspect-square rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white"
                              >
                                {/* Image */}
                                <img
                                  src={img.imageUrl}
                                  alt={`preview-${idx}`}
                                  className="w-full h-full object-cover"
                                />

                                {/* Overlay with delete button */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFieldValue(
                                        "packageImages",
                                        values.packageImages.map((it, i) =>
                                          i === idx
                                            ? {
                                                ...it,
                                                isDeleted: !it.isDeleted,
                                              }
                                            : it
                                        )
                                      )
                                    }
                                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 shadow-lg"
                                    title="Remove image"
                                  >
                                    ×
                                  </button>
                                </div>

                                {/* Image info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                  <p className="text-white text-xs truncate">
                                    {img.isNew ? "New Image" : "Existing Image"}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ------- submit button ------- */}
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    // disabled={isSubmitting || isUpdatePackageLoading}
                    className="bg-blue-v1 text-white rounded-lg px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1"
                  >
                    {isUpdatePackageLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default UpdatePackage;
