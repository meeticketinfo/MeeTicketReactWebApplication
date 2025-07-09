import React from "react";
import { Field, Form, Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { convertToBase64 } from "../../../../utils/Helper";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";

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
  const { UpdatePackage, isUpdatePackageLoading } = usePackagesStore();

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
  const onSubmit = async (values, { setSubmitting }) => {
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
          imageId: img.isNew ? 0 : img.imageId, // 0 for new images
          base64Image, // empty string if deleted
          isDeleted: img.isDeleted ? 1 : 0, // 1 if deleted, 0 otherwise
        });
      }

      const payload = {
        ...values,
        packageImages,
      };

      await UpdatePackage(payload);
      toast.success("Package updated successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating the package");
    } finally {
      setSubmitting(false);
    }
  };

  /** ---------------- component ---------------- */
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-3">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize
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
                    {/* <ErrorMessage
                      name="checkInTime"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    /> */}
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
                    {/* <ErrorMessage
                      name="checkOutTime"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    /> */}
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
                    {/* <ErrorMessage
                      name="latitude"
                      component="div"
                      className="text-red-500 text-xs absolute"
                    /> */}
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
                    {/* <ErrorMessage
                      name="longitude"
                      component="div"
                      className="text-red-500 text-xs absolute"
                    /> */}
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
                        setIsValidation(Value);
                        setFieldValue(`isActive`, Value);
                      }}
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    >
                      <option value="">Select</option>
                      <option value={true}>Active</option>
                      <option value={false}>In Active</option>
                    </Field>
                    {/* <ErrorMessage
                      name="isActive"
                      component="span"
                      className="text-red-500 text-xs absolute"
                    /> */}
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
                    {/* <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-xs absolute"
                    /> */}
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
                    {/* <ErrorMessage
                      name="cancellationPolicy"
                      component="div"
                      className="text-red-500 text-xs absolute"
                      /> */}
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
                    {/* <ErrorMessage
                      name="termsConditions"
                      component="div"
                      className="text-red-500 text-xs absolute"
                    /> */}
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
                    {/* <ErrorMessage
                        name="privacyPolicy"
                        component="div"
                        className="text-red-500 text-xs absolute"
                        /> */}
                  </div>

                  {/* ------- file upload ------- */}
                  <div>
                    <label className="block text-sm font-medium">
                      Upload Images<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="mt-1 block w-full px-2 py-3 border border-gray-300 rounded-md shadow-sm text-sm"
                    />

                    {/* ------- preview ------- */}
                    {values.packageImages.length > 0 && (
                      <div className="border p-2 mt-2">
                        <h4 className="text-sm font-semibold mb-2">
                          Selected Image Previews:
                        </h4>
                        <div className="flex flex-wrap gap-4 h-20 overflow-auto">
                          {values.packageImages.map((img, idx) =>
                            img.isDeleted ? null : (
                              <div
                                key={img.imageId ?? idx}
                                className="relative w-[120px] rounded overflow-hidden shadow-md border"
                              >
                                {/* delete / undo */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFieldValue(
                                      "packageImages",
                                      values.packageImages.map((it, i) =>
                                        i === idx
                                          ? { ...it, isDeleted: !it.isDeleted }
                                          : it
                                      )
                                    )
                                  }
                                  className="absolute top-1 right-1 bg-white text-gray-600 border rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 hover:text-white"
                                  title="Remove"
                                >
                                  ×
                                </button>

                                <img
                                  src={img.imageUrl}
                                  alt={`preview-${idx}`}
                                  className="w-full h-full object-cover"
                                />
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
