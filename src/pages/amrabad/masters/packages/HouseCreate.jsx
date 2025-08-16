import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { useEffect, useState } from "react";
import { usePackagesCommonStore } from "../../../../store/amrabad/masters/packagesCommonStore";
import {
  convertToBase64,
  convertImageUrlToBase64,
} from "../../../../utils/Helper";
import MultipleDatePicker from "../../../../components/MultipleDatePicker";

// Alternative approach: Skip base64 conversion for existing images if CORS fails
const handleImageConversion = async (imageUrl, imageId) => {
  // If it's a new image, it's already base64
  if (!imageId) {
    return imageUrl;
  }

  // For existing images, try to convert but don't fail if CORS blocks it
  try {
    const base64Image = await convertImageUrlToBase64(imageUrl);
    return base64Image;
  } catch (error) {
    console.warn("CORS blocked image conversion, using original URL:", error);
    // Return a special marker to indicate this image should be skipped in conversion
    return { originalUrl: imageUrl, skipConversion: true };
  }
};

const HouseCreate = () => {
  const {
    fetchPackagesWithRooms,
    fetchGetAllPackages,
    GetAllPackages,
    saveHouseDetails,
    isSaveHouseDetailsLoading,
  } = usePackagesStore();
  const {
    isHouseEditVisible,
    setIsHouseEditVisible,
    selectedSubRowData,
    setCurrentTab,
  } = usePackagesCommonStore();
  const [isValidation, setIsValidation] = useState("");

  const initialValues = {
    roomId: isHouseEditVisible ? selectedSubRowData?.roomId : null,
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
    // discountValue: isHouseEditVisible
    //   ? selectedSubRowData?.discountValue
    //   : null,
    // amountAfterDiscount: isHouseEditVisible
    //   ? selectedSubRowData?.amountAfterDiscount
    //   : null,
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
      ? selectedSubRowData?.isBlockout === true ||
        (selectedSubRowData?.isBlockout === false &&
          selectedSubRowData?.roomBlockedDurations &&
          selectedSubRowData.roomBlockedDurations.length > 0)
        ? "Yes"
        : "No"
      : "",
    blockoutType: isHouseEditVisible
      ? selectedSubRowData?.roomBlockedDurations &&
        selectedSubRowData.roomBlockedDurations.length > 0
        ? "blockByDate" // Has blocked dates means Block by Date
        : "fullBlock" // No blocked dates means Full Block
      : "",
    BlockBydate: isHouseEditVisible
      ? selectedSubRowData?.roomBlockedDurations || []
      : [],
    latitude: isHouseEditVisible ? selectedSubRowData?.latitude : null,
    longitude: isHouseEditVisible ? selectedSubRowData?.longitude : null,
    overview: isHouseEditVisible ? selectedSubRowData?.overview : "",
    specialOffers: isHouseEditVisible ? selectedSubRowData?.specialOffers : "",
    remarks: isHouseEditVisible ? selectedSubRowData?.remarks : "",
    sequence: isHouseEditVisible ? selectedSubRowData?.sequence : 0,
    // roomImagesBase64Strings: isHouseEditVisible
    //   ? selectedSubRowData?.roomImages
    //   : [],

    roomImagesBase64Strings: isHouseEditVisible
      ? Array.isArray(selectedSubRowData?.roomImages)
        ? selectedSubRowData.roomImages.map((img) => ({
            imageId: img.imageId,
            imageUrl: img.imageUrl,
            isNew: false,
            isDeleted: false,
          }))
        : []
      : [],

    // Add discountDetails array for daily discounts
    discountDetails:
      isHouseEditVisible && selectedSubRowData?.discountDetails
        ? selectedSubRowData.discountDetails.map((discount) => ({
            dayOfWeek: discount.dayOfWeek || "",
            discountValue: discount.discountValue || null,
            amountAfterDiscount: discount.amountAfterDiscount || null,
          }))
        : [
            {
              dayOfWeek: "Monday",
              discountValue: null,
              amountAfterDiscount: null,
            },
            {
              dayOfWeek: "Tuesday",
              discountValue: null,
              amountAfterDiscount: null,
            },
            {
              dayOfWeek: "Wednesday",
              discountValue: null,
              amountAfterDiscount: null,
            },
            {
              dayOfWeek: "Thursday",
              discountValue: null,
              amountAfterDiscount: null,
            },
            {
              dayOfWeek: "Friday",
              discountValue: null,
              amountAfterDiscount: null,
            },
            {
              dayOfWeek: "Saturday",
              discountValue: null,
              amountAfterDiscount: null,
            },
            {
              dayOfWeek: "Sunday",
              discountValue: null,
              amountAfterDiscount: null,
            },
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
    tariffPerDay: Yup.string()
      .required("Tariff per day is required.")
      .test(
        "is-not-empty-or-space",
        "Tariff cannot be empty or spaces only",
        (value) => value && value.trim() !== ""
      )
      .test(
        "is-valid-number",
        "Tariff must be a valid number",
        (value) => !isNaN(value)
      )
      .test(
        "is-positive",
        "Tariff must be a positive number",
        (value) => Number(value) >= 0
      ),

    hasDiscount: Yup.string().required(
      "Please select if discounts are available."
    ),
    discountType:
      isValidation === "Yes" &&
      Yup.string().required("Discount Type is required"),
    // discountValue:
    //   isValidation === "Yes" &&
    //   Yup.string().required("Discount Value is required"),
    // discountApplicable:
    //   isValidation === "Yes" &&
    //   Yup.string().required("discounts Applicable is required"),
    noOfHousesAvailable: Yup.string()
      .required("No Of House Applicable is required")
      .test(
        "not-only-spaces",
        "No of Houses cannot be empty or just spaces",
        (value) => value && value.trim() !== ""
      )
      .test(
        "is-valid-number",
        "No of Houses must be a valid number",
        (value) => !isNaN(value)
      )
      .test(
        "is-positive",
        "No of Houses must be a positive number",
        (value) => Number(value) > 0
      ),

    latitude: Yup.number()
      .typeError("Latitude must be a number")
      .required("Latitude is required")
      .min(-90)
      .max(90),

    longitude: Yup.number()
      .typeError("Longitude must be a number")
      .required("Longitude is required")
      .min(-180)
      .max(180),
    roomLimit: Yup.string()
      .required("House Limit is required.")
      .test(
        "not-only-spaces",
        "House Limit cannot be empty or just spaces",
        (value) => value && value.trim() !== ""
      )
      .test(
        "is-valid-number",
        "House Limit must be a valid number",
        (value) => !isNaN(value)
      )
      .test(
        "is-positive",
        "House Limit must be a positive number",
        (value) => Number(value) >= 0
      ),
    isBlockout: Yup.string().required("Block out selection is required"),
    blockoutType: Yup.string().when("isBlockout", {
      is: "Yes",
      then: (schema) => schema.required("Block out type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    BlockBydate: Yup.array()
      .of(Yup.string())
      .when("blockoutType", {
        is: "blockByDate",
        then: (schema) => schema.min(1, "At least one date is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    sequence: Yup.string()
      .required("Sequence is required.")
      .test(
        "not-only-spaces",
        "Sequence cannot be empty or just spaces",
        (value) => value && value.trim() !== ""
      )
      .test(
        "is-valid-number",
        "Sequence must be a valid number",
        (value) => !isNaN(value)
      )
      .test(
        "is-positive",
        "Sequence must be a positive number",
        (value) => Number(value) > 0
      ),
    discountDetails: Yup.array().of(
      Yup.object().shape({
        dayOfWeek: Yup.string().required("Day of week is required"),
        discountValue: Yup.string()
          .nullable()
          .transform((value) => (value === "" ? null : value)),
        amountAfterDiscount: Yup.string()
          .nullable()
          .transform((value) => (value === "" ? null : value)),
      })
    ),
    roomImagesBase64Strings: Yup.array()
      .of(
        Yup.object().shape({
          imageId: Yup.mixed().nullable(),
          imageUrl: Yup.string().nullable(),
          isNew: Yup.boolean(),
          isDeleted: Yup.boolean(),
        })
      )
      .test(
        "at-least-one-image",
        "You must upload at least one image",
        function (value) {
          if (!value || value.length === 0) return false;
          const nonDeletedImages = value.filter((img) => !img.isDeleted);
          return nonDeletedImages.length > 0;
        }
      )
      .max(20, "You can upload up to 20 images only"),
    overview: Yup.string()
      .required("Overview is required.")
      .min(10, "Overview must be at least 10 characters.")
      .max(500, "Overview cannot exceed 500 characters."),
    specialOffers: Yup.string()
      .required("Special offers is required.")
      .min(10, "Special offers must be at least 10 characters.")
      .max(500, "Special offers cannot exceed 500 characters."),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const isEdit = isHouseEditVisible;

    try {
      // Handle roomImagesBase64Strings based on add vs edit
      let roomImagesPayload;

      if (isEdit) {
        // For edit: array of objects with imageId, isDeleted, and base64Image
        roomImagesPayload = await Promise.all(
          values.roomImagesBase64Strings.map(async (img) => {
            if (!img.isNew && img.imageId) {
              // For existing images - convert URL to base64
              const base64Image = await handleImageConversion(
                img.imageUrl,
                img.imageId
              );

              // Check if conversion was skipped due to CORS
              if (
                typeof base64Image === "object" &&
                base64Image.skipConversion
              ) {
                return {
                  imageId: img.imageId,
                  isDeleted: img.isDeleted ? true : false,
                  // Send original URL instead of base64 if CORS blocked conversion
                  originalUrl: base64Image.originalUrl,
                  skipConversion: true,
                };
              }

              return {
                imageId: img.imageId,
                isDeleted: img.isDeleted ? true : false,
                base64Image: base64Image,
              };
            } else {
              // For new images
              return {
                imageId: null,
                isDeleted: img.isDeleted ? true : false,
                base64Image: img.imageUrl, // This is already base64 for new images
              };
            }
          })
        );
      } else {
        // For add: array of base64 strings (only non-deleted images)
        roomImagesPayload = values.roomImagesBase64Strings
          .filter((img) => !img.isDeleted)
          .map((img) => img.imageUrl);
      }

      // Convert empty strings to null for discount values
      const processedDiscountDetails = values.discountDetails.map(
        (discount) => ({
          ...discount,
          discountValue:
            discount.discountValue === "" ? null : discount.discountValue,
          amountAfterDiscount:
            discount.amountAfterDiscount === ""
              ? null
              : discount.amountAfterDiscount,
        })
      );

      const payload = {
        ...values,
        packageId: values.packageId,
        hasDiscount: values.hasDiscount === "Yes",
        isBlockout: values.isBlockout === "Yes" ? true : false,
        blockedDate:
          values.isBlockout === "Yes" && values.blockoutType === "blockByDate"
            ? values.BlockBydate || []
            : [],
        discountApplicable: values.discountApplicable === "true",
        roomImagesBase64Strings: roomImagesPayload,
        discountDetails: processedDiscountDetails, // Use the processed discount details
      };

      // Remove BlockBydate from payload since we only want blockedDate
      delete payload.BlockBydate;

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

        // Add a small delay before changing tab to ensure toast is visible
        setTimeout(() => {
          setCurrentTab(0);
        }, 1000);
      }
    } catch (xhr) {
      console.log("xhr", xhr);
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
        <ToastContainer position="top-right" autoClose={3000} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values, isSubmitting, setFieldValue, errors }) => {
            // Debug validation errors
            if (Object.keys(errors).length > 0) {
              console.log("Validation errors:", errors);
              console.log("Form values:", values);
              if (errors.discountDetails) {
                console.log("Discount details errors:", errors.discountDetails);
              }
            }

            return (
              <Form>
                <div className="bg-[#F3F3F3] grid md:grid-cols-4 gap-5 p-6 my-4 mx-2 rounded-xl border border-gray-300">
                  {/* User Select */}
                  <div className="col-span-4">
                    <label
                      htmlFor="packageId"
                      className="block text-xs font-medium"
                    >
                      Name of the Package{" "}
                      <span className="text-red-500">*</span>
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

                  <div className="col-span-2">
                    <label
                      htmlFor="roomName"
                      className="block text-xs font-medium"
                    >
                      Name of the House <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="roomName"
                      maxLength="300"
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

                  {/* Tarrif Per Day*/}
                  <div className="col-span-1">
                    <label
                      htmlFor="tariffPerDay"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Tariff per day <span className="text-red-500">*</span>
                    </label>

                    <Field name="tariffPerDay">
                      {({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min={0}
                          onInput={(e) => {
                            const value = e.target.value;
                            if (value.length > 5) {
                              e.target.value = value.slice(0, 5);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              ["-", "e", "E", "+", "."].includes(e.key) ||
                              (e.key.length === 1 && !/[0-9]/.test(e.key))
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                          placeholder="Enter Tariff per day"
                        />
                      )}
                    </Field>

                    <ErrorMessage
                      name="tariffPerDay"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* No of Houses available  */}
                  <div className="col-span-1">
                    <label
                      htmlFor="noOfHousesAvailable"
                      className="block text-xs font-medium text-gray-700"
                    >
                      No of Houses Available{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <Field name="noOfHousesAvailable">
                      {({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min={0}
                          onInput={(e) => {
                            const value = e.target.value;
                            if (value.length > 3) {
                              e.target.value = value.slice(0, 3);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              ["-", "e", "E", "+", "."].includes(e.key) ||
                              (e.key.length === 1 && !/[0-9]/.test(e.key))
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                          placeholder="Enter No of Houses Available"
                        />
                      )}
                    </Field>

                    <ErrorMessage
                      name="noOfHousesAvailable"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="roomLimit"
                      className="block text-xs font-medium text-gray-700"
                    >
                      House Limit{" "}
                      <span className="text-red-500 text-xs">*</span>
                    </label>

                    <Field name="roomLimit">
                      {({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min={0}
                          onInput={(e) => {
                            const value = e.target.value;
                            if (value.length > 3) {
                              e.target.value = value.slice(0, 3);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              ["-", "e", "E", "+", "."].includes(e.key) ||
                              (e.key.length === 1 && !/[0-9]/.test(e.key))
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                          placeholder="Enter Room Limit"
                        />
                      )}
                    </Field>

                    <ErrorMessage
                      name="roomLimit"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hasDiscount"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Discount <span className="text-red-500">*</span>
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
                          onChange={(e) => {
                            setFieldValue("discountType", e.target.value);
                            // Clear all discount values when discount type changes
                            const clearedDiscountDetails =
                              values.discountDetails.map((discount) => ({
                                ...discount,
                                discountValue: "",
                                amountAfterDiscount: "",
                              }));
                            setFieldValue(
                              "discountDetails",
                              clearedDiscountDetails
                            );
                          }}
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
                    </>
                  )}
                  <div className="col-span-1">
                    <label
                      htmlFor="isBlockout"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Block out type? <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="isBlockout"
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setFieldValue("isBlockout", selectedValue);

                        // Reset BlockBydate when changing blockout type
                        if (selectedValue === "No") {
                          // Clear dates for no block
                          setFieldValue("BlockBydate", []);
                          setFieldValue("blockoutType", ""); // Clear blockoutType
                        }
                      }}
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Field>
                    <ErrorMessage
                      name="isBlockout"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Block out type - only show when isBlockout is "Yes" */}
                  {values.isBlockout === "Yes" && (
                    <div className="col-span-1">
                      <label
                        htmlFor="blockoutType"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Block out type? <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="blockoutType"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setFieldValue("blockoutType", selectedValue);

                          // Reset BlockBydate when changing blockout type
                          if (selectedValue === "fullBlock") {
                            // Clear dates for full block
                            setFieldValue("BlockBydate", []);
                          }
                        }}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                        <option value="">Select</option>
                        <option value="fullBlock">Full Block</option>
                        <option value="blockByDate">Block by Date</option>
                      </Field>
                      <ErrorMessage
                        name="blockoutType"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  )}

                  {/* Block by Date - only show when isBlockout is "Yes" and blockoutType is "blockByDate" */}
                  {values.isBlockout === "Yes" &&
                    values.blockoutType === "blockByDate" && (
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-700">
                          Block by Date <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <MultipleDatePicker
                            value={values.BlockBydate || []}
                            onChange={(selectedDates) => {
                              setFieldValue("BlockBydate", selectedDates);
                            }}
                            placeholder="Select dates to block..."
                            className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                          />
                          <ErrorMessage
                            name="BlockBydate"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      </div>
                    )}
                  {/* Discount Table */}
                  {values.hasDiscount === "Yes" && (
                    <div className="col-span-4">
                      <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
                        {/* Discount applicable on */}
                        <div>
                          <div className="space-y-2">
                            <div className="flex gap-[120px]">
                              <h4 className="text-sm font-medium text-gray-900 mb-3">
                                Discount applicable on
                              </h4>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">
                                Amount after discount
                              </h4>
                            </div>
                            {[
                              "MONDAY",
                              "TUESDAY",
                              "WEDNESDAY",
                              "THURSDAY",
                              "FRIDAY",
                              "SATURDAY",
                              "SUNDAY",
                            ].map((day, dayIndex) => (
                              <div
                                key={day}
                                className="flex items-center justify-start gap-4"
                              >
                                {/* Day Label */}
                                <span className="text-sm text-gray-700 w-20">
                                  {day}
                                </span>

                                {/* Discount Input */}
                                <div className="relative">
                                  <Field
                                    type="number"
                                    name={`discountDetails[${dayIndex}].discountValue`}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-40 px-2 py-1 pr-8 border border-gray-300 rounded text-sm bg-white"
                                    onKeyDown={(e) => {
                                      // Prevent negative values and invalid characters
                                      if (
                                        ["-", "e", "E", "+"].includes(e.key) ||
                                        (e.key.length === 1 &&
                                          !/[0-9]/.test(e.key))
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      // Prevent negative values
                                      if (parseFloat(value) < 0) {
                                        e.target.value = "";
                                        return;
                                      }

                                      // Convert empty string to null
                                      const processedValue =
                                        value === "" ? null : value;
                                      setFieldValue(
                                        `discountDetails[${dayIndex}].discountValue`,
                                        processedValue
                                      );

                                      const tariff = values.tariffPerDay || 0;
                                      const discountType =
                                        values.discountType || "Percentage";
                                      const discountValue =
                                        parseFloat(value) || 0;

                                      let amountAfterDiscount;
                                      if (discountType === "Percentage") {
                                        const discountAmount =
                                          (tariff * discountValue) / 100;
                                        amountAfterDiscount =
                                          tariff - discountAmount;
                                      } else {
                                        amountAfterDiscount =
                                          tariff - discountValue;
                                      }

                                      setFieldValue(
                                        `discountDetails[${dayIndex}].amountAfterDiscount`,
                                        amountAfterDiscount.toFixed(2)
                                      );
                                    }}
                                    onBlur={(e) => {
                                      // Additional check on blur to prevent negative values
                                      const value = parseFloat(e.target.value);
                                      if (value < 0) {
                                        e.target.value = "";
                                        setFieldValue(
                                          `discountDetails[${dayIndex}].discountValue`,
                                          null
                                        );
                                      }
                                    }}
                                  />
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                                    {values.discountType === "Percentage"
                                      ? "%"
                                      : "₹"}
                                  </span>
                                </div>

                                {/* Amount after Discount */}
                                <div className="relative">
                                  <Field
                                    type="number"
                                    name={`discountDetails[${dayIndex}].amountAfterDiscount`}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    disabled={true}
                                    className="w-40 px-2 py-1 pl-6 border border-gray-300 rounded text-sm bg-gray-300"
                                    onKeyDown={(e) => {
                                      // Prevent negative values and invalid characters
                                      if (
                                        ["-", "e", "E", "+"].includes(e.key) ||
                                        (e.key.length === 1 &&
                                          !/[0-9]/.test(e.key))
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      // Prevent negative values
                                      if (parseFloat(value) < 0) {
                                        e.target.value = "";
                                        return;
                                      }

                                      // Convert empty string to null
                                      const processedValue =
                                        value === "" ? null : value;
                                      setFieldValue(
                                        `discountDetails[${dayIndex}].amountAfterDiscount`,
                                        processedValue
                                      );

                                      const tariff = values.tariffPerDay || 0;
                                      const discountType =
                                        values.discountType || "Percentage";
                                      const amountAfterDiscount =
                                        parseFloat(value) || 0;

                                      let discountValue;
                                      if (discountType === "Percentage") {
                                        const discountAmount =
                                          tariff - amountAfterDiscount;
                                        discountValue = (
                                          (discountAmount / tariff) *
                                          100
                                        ).toFixed(2);
                                      } else {
                                        discountValue = (
                                          tariff - amountAfterDiscount
                                        ).toFixed(2);
                                      }

                                      setFieldValue(
                                        `discountDetails[${dayIndex}].discountValue`,
                                        discountValue
                                      );
                                    }}
                                    onBlur={(e) => {
                                      // Additional check on blur to prevent negative values
                                      const value = parseFloat(e.target.value);
                                      if (value < 0) {
                                        e.target.value = "";
                                        setFieldValue(
                                          `discountDetails[${dayIndex}].amountAfterDiscount`,
                                          null
                                        );
                                      }
                                    }}
                                  />
                                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                                    ₹
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Sequence */}
                  <div>
                    <label
                      htmlFor="sequence"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Sequence <span className="text-red-500">*</span>
                    </label>

                    <Field name="sequence">
                      {({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min={0}
                          onInput={(e) => {
                            const value = e.target.value;
                            if (value.length > 3) {
                              e.target.value = value.slice(0, 3);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              ["-", "e", "E", "+", "."].includes(e.key) ||
                              (e.key.length === 1 && !/[0-9]/.test(e.key))
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                          placeholder="Enter Sequence Number"
                        />
                      )}
                    </Field>

                    <ErrorMessage
                      name="sequence"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/*  Latitude */}
                  <div className="col-span-1 sm:col-span-3 lg:col-span-1">
                    <label
                      htmlFor="latitude"
                      className="block text-sm font-medium"
                    >
                      Latitude<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="latitude"
                      type="number"
                      step="any"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter Latitude"
                    />
                    <ErrorMessage
                      name="latitude"
                      component="div"
                      className="text-red-500 text-xs absolute"
                    />
                  </div>

                  {/*  Longitude */}
                  <div className="col-span-1 sm:col-span-3 lg:col-span-1">
                    <label
                      htmlFor="longitude"
                      className="block text-sm font-medium"
                    >
                      Longitude<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="longitude"
                      type="number"
                      step="any"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      placeholder="Enter longitude"
                    />
                    <ErrorMessage
                      name="longitude"
                      component="div"
                      className="text-red-500 text-xs absolute"
                    />
                  </div>

                  {/* Overview */}
                  <div className="col-span-2">
                    <label
                      htmlFor="overview"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Overview <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="overview"
                      rows="3"
                      maxLength="500"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      placeholder="Enter house overview"
                    />
                    <ErrorMessage
                      name="overview"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Special Offers */}
                  <div className="col-span-2">
                    <label
                      htmlFor="specialOffers"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Special Offers <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="specialOffers"
                      rows="3"
                      maxLength="500"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      placeholder="Enter special offers"
                    />
                    <ErrorMessage
                      name="specialOffers"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Remarks */}
                  <div className="col-span-3">
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
                      maxLength="500"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      placeholder="Enter your remarks"
                    />
                  </div>

                  <div className="col-span-4">
                    <label
                      htmlFor="roomImagesBase64Strings"
                      className="block text-sm font-medium mb-2"
                    >
                      Upload Images<span className="text-red-500">*</span>
                    </label>

                    {/* Drag and Drop Zone */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        values.roomImagesBase64Strings.length > 0
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300 hover:border-blue-400 bg-gray-50"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add(
                          "border-blue-500",
                          "bg-blue-50"
                        );
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-blue-500",
                          "bg-blue-50"
                        );
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-blue-500",
                          "bg-blue-50"
                        );

                        const files = Array.from(e.dataTransfer.files).filter(
                          (file) => file.type.startsWith("image/")
                        );

                        if (files.length > 0) {
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
                    >
                      {/* Upload Icon */}
                      <div className="flex justify-center mb-3">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                      <p className="text-gray-600 mb-1 text-sm">
                        Drop your images here, or{" "}
                        <label
                          htmlFor="roomImagesBase64Strings"
                          className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                        >
                          click to browse
                        </label>
                      </p>

                      {/* File Specifications */}
                      <p className="text-xs text-gray-500">
                        1600 × 1200 (4:3) recommended. PNG, JPG and JPEG files
                        are allowed
                      </p>

                      {/* Hidden File Input */}
                      <input
                        id="roomImagesBase64Strings"
                        name="roomImagesBase64Strings"
                        className="hidden"
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
                    </div>

                    <ErrorMessage
                      name="roomImagesBase64Strings"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {values.roomImagesBase64Strings.length !== 0 && (
                    <div className="col-span-3 border p-2 mt-2">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Selected Image Previews:
                      </h4>

                      <div className="flex flex-wrap gap-4 h-20 overflow-auto ">
                        {values.roomImagesBase64Strings
                          .filter((img) => !img.isDeleted)
                          .map((base64Image) => {
                            // Find the actual index in the original array
                            const actualIndex =
                              values.roomImagesBase64Strings.findIndex(
                                (img) => img === base64Image
                              );

                            return (
                              <div
                                key={actualIndex}
                                className="relative w-[120px] rounded overflow-hidden shadow-md border border-gray-200"
                              >
                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedImages =
                                      values.roomImagesBase64Strings.map(
                                        (img, i) =>
                                          i === actualIndex
                                            ? { ...img, isDeleted: true }
                                            : img
                                      );
                                    setFieldValue(
                                      "roomImagesBase64Strings",
                                      updatedImages
                                    );
                                  }}
                                  className="absolute top-1 right-1 bg-white text-gray-600 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 hover:text-white transition-all"
                                >
                                  ×
                                </button>

                                {/* Image preview */}
                                <img
                                  src={base64Image.imageUrl}
                                  alt={`preview-${actualIndex}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-4 mb-4">
                  <div>
                    <button
                      type="submit"
                      disabled={isSaveHouseDetailsLoading}
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
