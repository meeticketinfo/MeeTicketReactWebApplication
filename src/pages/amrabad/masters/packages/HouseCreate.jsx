import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { useEffect, useState } from "react";
import { usePackagesCommonStore } from "../../../../store/amrabad/masters/packagesCommonStore";

// Function to convert files to base64 strings
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file); // Convert to base64
  });
};
const convertUrlToBase64 = (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => convertToBase64(blob)); // reuse your existing helper
};
const HouseCreate = () => {
  const {
    fetchPackagesWithRooms,
    fetchGetAllPackages,
    GetAllPackages,
    saveHouseDetails,
    isSaveHouseDetailsLoading,
    houseEditDetails,
  } = usePackagesStore();
  const {
    isHouseEditVisible,
    setIsHouseEditVisible,
    selectedSubRowData,
    setCurrentTab,
  } = usePackagesCommonStore();
  const [isValidation, setIsValidation] = useState("");
  const initialValues = {
    roomId: isHouseEditVisible ? selectedSubRowData?.roomId : "",
    packageId: isHouseEditVisible ? selectedSubRowData?.packageId : "",
    // packageName: isHouseEditVisible ? selectedSubRowData?.packageName : "",
    roomName: isHouseEditVisible ? selectedSubRowData?.roomName : "",
    tariffPerDay: isHouseEditVisible ? selectedSubRowData?.tariffPerDay : "",
    hasDiscount: isHouseEditVisible
      ? selectedSubRowData?.hasDiscount
        ? "Yes"
        : "No"
      : "",
    discountType: isHouseEditVisible ? selectedSubRowData?.discountType : null,
    discountValue: isHouseEditVisible
      ? selectedSubRowData?.discountValue
      : null,
    amountAfterDiscount: isHouseEditVisible
      ? selectedSubRowData?.amountAfterDiscount
      : null,
    discountApplicable: isHouseEditVisible
      ? selectedSubRowData?.discountApplicable
        ? "true"
        : "false"
      : null,
    noOfHousesAvailable: isHouseEditVisible
      ? selectedSubRowData?.noOfHousesAvailable
      : null,
    roomLimit: isHouseEditVisible ? selectedSubRowData?.roomLimit : "",
    isBlockout: isHouseEditVisible
      ? selectedSubRowData?.isBlockout
        ? "Yes"
        : "No"
      : "",
    remarks: isHouseEditVisible ? selectedSubRowData?.remarks : "",
    sequence: isHouseEditVisible ? selectedSubRowData?.sequence : 0,
    // roomImagesBase64Strings: isHouseEditVisible
    //   ? selectedSubRowData?.roomImages
    //   : [],

    roomImagesBase64Strings: Array.isArray(selectedSubRowData?.roomImages)
      ? selectedSubRowData?.roomImages.map((img) => ({
          imageId: img.imageId,
          imageUrl: img.imageUrl,
          isNew: false,
          isDeleted: false,
        }))
      : [],
    
    // Add discounts array for daily discounts
    discounts: isHouseEditVisible && selectedSubRowData?.discounts
      ? selectedSubRowData.discounts.map(discount => ({
          percentage: discount.percentage || "",
          amountAfterDiscount: discount.amountAfterDiscount || "",
        }))
      : [
          { percentage: "", amountAfterDiscount: "" },
          { percentage: "", amountAfterDiscount: "" },
          { percentage: "", amountAfterDiscount: "" },
          { percentage: "", amountAfterDiscount: "" },
          { percentage: "", amountAfterDiscount: "" },
          { percentage: "", amountAfterDiscount: "" },
          { percentage: "", amountAfterDiscount: "" },
        ],
  };

  useEffect(() => {
    fetchGetAllPackages();
  }, []);

  const validationSchema = Yup.object().shape({
    packageId: Yup.string().required("Package selection is required."),
    roomName: Yup.string()
      .required("House name is required.")
      .min(3, "House name must be at least 3 characters."),
    tariffPerDay: Yup.number()
      .typeError("Tariff must be a number.")
      .required("Tariff per day is required.")
      .positive("Tariff must be a positive number."),
    hasDiscount: Yup.string().required(
      "Please select if discounts are available."
    ),
    discountType:
      isValidation === "Yes" &&
      Yup.string().required("Discount Type is required"),
    discountValue:
      isValidation === "Yes" &&
      Yup.string().required("Discount Value is required"),
    discountApplicable:
      isValidation === "Yes" &&
      Yup.string().required("discounts Applicable is required"),
    noOfHousesAvailable: Yup.number().required(
      "No Of House Applicable is required"
    ),
    roomLimit: Yup.string().required("Room Limit is required."),
    isBlockout: Yup.string().required("Block Out is required."),
    sequence: Yup.string().required("Sequence is required."),
    discounts: Yup.array().of(
      Yup.object().shape({
        percentage: Yup.string().nullable(),
        amountAfterDiscount: Yup.string().nullable(),
      })
    ),
    // roomImagesBase64Strings: Yup.array()
    //   .of(
    //     Yup.string().test("is-valid-image", "Invalid image type", (value) => {
    //       // Regular expression for checking valid image data URI format
    //       return /^data:image\/(jpeg|png|gif|svg);base64,/.test(value);
    //     })
    //   )
    //   .min(1, "You must upload at least one image")
    //   .max(5, "You can upload up to 5 images only"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Form Submitted:", values);
    console.log("Discounts data:", values.discounts);
    const isEdit = isHouseEditVisible;

    try {
      const roomImagesPayload = await Promise.all(
        values.roomImagesBase64Strings
          .filter((img) => !img.isDeleted)
          .map(async (img) => {
            if (!img.isNew && img.imageId) {
              // Convert existing image URL to base64
              const base64 = await convertUrlToBase64(img.imageUrl);
              return {
                imageId: img.imageId,
                imageUrl: base64,
                isDeleted: img.isDeleted ? 1 : 0,
              };
            } else {
              // New image, already base64
              return img.imageUrl;
            }
          })
      );

      console.log("test");

      const payload = {
        ...values,
        packageId: values.packageId,
        hasDiscount: values.hasDiscount === "Yes",
        isBlockout: values.isBlockout === "Yes",
        discountApplicable: values.discountApplicable === "true",
        roomImagesBase64Strings: roomImagesPayload,
        discounts: values.discounts, // Include the discounts array
      };

      if (!payload.hasDiscount) {
        payload.discountType = null;
        payload.discountValue = null;
        payload.amountAfterDiscount = null;
        payload.discountApplicable = null;
      }

      const result = await saveHouseDetails(payload, isEdit);

      if (result.data.status === 200) {
        toast.success(
          isEdit ? "House updated successfully" : "House created successfully"
        );
        setIsHouseEditVisible(false);
        fetchPackagesWithRooms();
        resetForm();
        setCurrentTab(0);
      }
    } catch (xhr) {
      if (xhr?.response?.data?.errors) {
        Object.entries(xhr.response.data.errors).forEach(([key, msgs]) => {
          toast.error(`${key}: ${msgs[0]}`);
        });
      } else {
        toast.error(xhr.response?.data || "An error occurred");
      }
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
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values, isSubmitting, setFieldValue, errors, touched }) => {
            // Debug validation errors
            if (Object.keys(errors).length > 0) {
              console.log("Validation errors:", errors);
              console.log("Form values:", values);
              if (errors.discounts) {
                console.log("Discount errors:", errors.discounts);
              }
            }
            return (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-3">
                {/* User Select */}
                <div>
                  <label
                    htmlFor="packageId"
                    className="block text-xs font-medium"
                  >
                    Packages <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="packageId"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select Packages</option>
                    {GetAllPackages.map((pkg) => (
                      <option key={pkg.packageId} value={pkg.packageId}>
                        {pkg.packageName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="packageId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roomName"
                    className="block text-xs font-medium"
                  >
                    Name of the House <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="roomName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Name of the House"
                  />
                  <ErrorMessage
                    name="roomName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Email Id */}
                <div>
                  <label
                    htmlFor="tariffPerDay"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Tariff per day <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="tariffPerDay"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Tariff per day"
                  />
                  <ErrorMessage
                    name="tariffPerDay"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="hasDiscount"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Discounts <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="hasDiscount"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    onChange={(e) => {
                      setIsValidation(e.target.value);
                      setFieldValue("hasDiscount", e.target.value);
                    }}
                  >
                    <option value="" label="Select option" />
                    <option value="Yes" label="Yes" />
                    <option value="No" label="No" />
                  </Field>
                  <ErrorMessage
                    name="hasDiscount"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {values.hasDiscount === "Yes" && (
                  <>
                    {/* Discount Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Discount Type <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="discountType"
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                        <option value="">Select type</option>
                        <option value="Amount">Amount</option>
                        <option value="Percentage">Percentage</option>
                      </Field>
                      <ErrorMessage
                        name="discountType"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Discount Value <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        name="discountValue"
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <ErrorMessage
                        name="discountValue"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    {/* Amount after Discount */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Amount after Discount
                      </label>
                      <Field
                        name="amountAfterDiscount"
                        className="mt-1 block w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Discount Applicable */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Discount Applicable{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="discountApplicable"
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                        <option value="">Select option</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Field>
                      <ErrorMessage
                        name="discountApplicable"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </>
                )}
                
                {/* Discount Table */}
                {values.hasDiscount === "Yes" && (
                  <div className="col-span-3">
                    <div className="bg-gray-200 border border-gray-300 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Discount applicable on */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Discount applicable on
                          </h4>
                          <div className="space-y-2">
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((day, dayIndex) => (
                              <div
                                key={day}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-700 w-20">
                                  {day}
                                </span>
                                <Field
                                  type="number"
                                  name={`discounts[${dayIndex}].percentage`}
                                  placeholder="0"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setFieldValue(
                                      `discounts[${dayIndex}].percentage`,
                                      value
                                    );

                                    // Calculate amount after discount
                                    const tariff = values.tariffPerDay || 0;
                                    const percentage = parseFloat(value) || 0;
                                    const discountAmount =
                                      (tariff * percentage) / 100;
                                    const amountAfterDiscount =
                                      tariff - discountAmount;

                                    setFieldValue(
                                      `discounts[${dayIndex}].amountAfterDiscount`,
                                      amountAfterDiscount.toFixed(2)
                                    );
                                  }}
                                />
                                <span className="text-sm text-gray-500">
                                  %
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Amount after discount */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Amount after discount
                          </h4>
                          <div className="space-y-2">
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((day, dayIndex) => (
                              <div
                                key={day}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-700 w-20">
                                  {day}
                                </span>
                                <Field
                                  type="number"
                                  name={`discounts[${dayIndex}].amountAfterDiscount`}
                                  placeholder="0"
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                                  readOnly
                                />
                                <span className="text-sm text-gray-500">
                                  ₹
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label
                    htmlFor="noOfHousesAvailable"
                    className="block text-xs font-medium text-gray-700"
                  >
                    No of Houses Available{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="noOfHousesAvailable"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter No of Houses Available"
                  />
                  <ErrorMessage
                    name="noOfHousesAvailable"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="roomLimit"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Room Limit <span className="text-red-500 text-xs">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="roomLimit"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Room Limit"
                  />
                  <ErrorMessage
                    name="roomLimit"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="isBlockout"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Block out <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="isBlockout"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Field>
                  <ErrorMessage
                    name="isBlockout"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sequence"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Sequence <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="sequence"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Sequence Number"
                  />
                  <ErrorMessage
                    name="sequence"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="remarks"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Remarks
                  </label>
                  <Field
                    as="textarea"
                    name="remarks"
                    rows="4"
                    maxLength="250"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    placeholder="Enter your remarks"
                  />
                </div>

                <div className="col-md-2">
                  <label
                    htmlFor="roomImagesBase64Strings"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Upload Images<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="roomImagesBase64Strings"
                    name="roomImagesBase64Strings"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (event) => {
                      const files = event.currentTarget.files;
                      if (files) {
                        const base64Images = [];
                        for (let i = 0; i < files.length; i++) {
                          const base64 = await convertToBase64(files[i]);
                          base64Images.push({
                            imageId: null, // Since it's a new image
                            imageUrl: base64, // Base64 string
                            isNew: true, // Mark as new
                            isDeleted: false, // Mark as not deleted
                          });
                        }
                        // Append new uploads to existing images
                        setFieldValue("roomImagesBase64Strings", [
                          ...values.roomImagesBase64Strings,
                          ...base64Images,
                        ]);
                      }
                    }}
                  />
                  <ErrorMessage
                    name="roomImagesBase64Strings"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {values.roomImagesBase64Strings.length !== 0 && (
                  <div className="col-md-10 border p-2">
                    <h4 className="block text-xs font-medium text-gray-700">
                      Selected Image Previews:
                    </h4>
                    <div className="flex flex-wrap gap-4 h-28 p-2 overflow-auto ">
                      {values.roomImagesBase64Strings.map(
                        (base64Image, index) => (
                          <div
                            key={index}
                            className="relative w-[140px] h-[100px]"
                          >
                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedImages =
                                  values.roomImagesBase64Strings.map((img, i) =>
                                    i === index
                                      ? { ...img, isDeleted: true }
                                      : img
                                  );
                                setFieldValue(
                                  "roomImagesBase64Strings",
                                  updatedImages
                                );
                              }}
                              className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>

                            {/* Image preview */}
                            <img
                              src={base64Image.imageUrl}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover rounded shadow-md"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4 mb-4">
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 hover:cursor-pointer "
                  >
                    {isSaveHouseDetailsLoading
                      ? "Saving..."
                      : isHouseEditVisible
                      ? "Update House"
                      : "Create House"}
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
        </Formik>
      </div>
    </>
  );
};

export default HouseCreate;
