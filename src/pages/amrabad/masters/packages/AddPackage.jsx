import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { convertToBase64 } from "../../../../utils/Helper";
import { MdDeleteForever } from "react-icons/md";
import * as Yup from "yup";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { usePackagesCommonStore } from "../../../../store/amrabad/masters/packagesCommonStore";
const AddPackage = () => {
  const [isHasRoom, setIsHasRoom] = useState(false);
  const [isValidation, setIsValidation] = useState("");
  const { setCurrentTab } = usePackagesCommonStore();
  const { savePackageWithRoom, isSavePackageWithRoomLoading } =
    usePackagesStore();
  /*  Initial values                                                    */

  const initialValues = {
    package: {
      packageName: "",
      description: "",
      checkInTime: "",
      checkOutTime: "",
      guidelines: "",
      cancellationPolicy: "",
      termsConditions: "",
      privacyPolicy: "",
      latitude: null,
      longitude: null,
      packageImageBase64Strings: [],
      isActive: true,
    },
    hasRooms: false,
    rooms: [
      {
        roomName: "",
        tariffPerDay: null,
        hasDiscount: false,
        discountType: "",
        discountValue: 0,
        amountAfterDiscount: 0,
        discountApplicable: true,
        noOfHousesAvailable: 0,
        roomLimit: 0,
        isBlockout: false,
        sequence: 0,
        remarks: "",
        roomImageBase64Strings: [],
      },
    ],
  };

  /*  Validation helpers                                                */

  const positiveInt = (msg = "Must be a positive number") =>
    Yup.number()
      .typeError("Must be a number")
      .integer("Must be an integer")
      .positive(msg);

  /*  ONE room schema (uses Yup.when)                                   */
  const roomSchema = Yup.object().shape({
    roomName: Yup.string().max(10).required("House name is required"),
    tariffPerDay: Yup.number()
      .typeError("Must be a number")
      .positive()
      .required("Tariff per day is required"),

    hasDiscount: Yup.boolean().required("Required"),

    discountType: Yup.string().when("hasDiscount", {
      is: true,
      then: (schema) => schema.required("Discount Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    discountValue: Yup.number().when("hasDiscount", {
      is: true,
      then: (schema) =>
        schema
          .typeError("Must be a number")
          .positive("Must be positive")
          .required("Discount Value is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    discountApplicable: Yup.boolean().when("hasDiscount", {
      is: true,
      then: (schema) =>
        schema
          .required("Discount Applicable is required")
          .typeError("Must be true or false"),
      otherwise: (schema) => schema.notRequired(),
    }),

    noOfHousesAvailable: positiveInt().required(
      "No Of Houses Available is required"
    ),
    roomLimit: positiveInt().required("Room Limit is required"),
    isBlockout: Yup.boolean().required("Required"),

    sequence: positiveInt().required("Sequence is required"),

    roomImageBase64Strings: Yup.array()
      .of(Yup.string())
      .min(1, "At least one image"),
  });

  /*  Main schema                                                       */

  const addPackageValidationSchema = Yup.object().shape({
    hasRooms: Yup.boolean(),

    /* ---------- PACKAGE ---------- */
    package: Yup.object().shape({
      packageName: Yup.string().required("Package name is required"),

      description: Yup.string()
        .max(100, "Max 100 characters")
        .required("Description is required"),

      checkInTime: Yup.string()
        .required("Check-in time is required")
        .matches(/^\d{2}:\d{2}$/, "Use HH:MM format"),

      checkOutTime: Yup.string()
        .required("Check-out time is required")
        .matches(/^\d{2}:\d{2}$/, "Use HH:MM format")
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
        .max(90),

      longitude: Yup.number()
        .typeError("Longitude must be a number")
        .required("Longitude is required")
        .min(-180)
        .max(180),

      packageImageBase64Strings: Yup.array()
        .of(Yup.string())
        .min(1, "At least one image is required"),

      isActive: Yup.boolean().required("Status is required"),
    }),

    /* ---------- ROOMS ---------- */
    rooms: Yup.lazy((_, ctx) =>
      ctx.parent?.hasRooms
        ? Yup.array().of(roomSchema).min(1, "Add at least one house")
        : Yup.array().notRequired()
    ),
  });

  /*  Submit handler   */

  const onSubmit = async (values) => {
    const WithOutRoomspayLoad = { package: values.package };
    const WithRoomspayLoad = values;
    const Payload = isHasRoom ? WithRoomspayLoad : WithOutRoomspayLoad;
    try {
      const res = await savePackageWithRoom(Payload);
      console.log("res", res);
      if (res.data.status === 200) {
        toast.success("Package Added Successfully");
        setCurrentTab(0);
      }
    } catch (err) {
      toast.error("Someting Went Wrong");
    }
  };
  return (
    <div className="bg-white/30 p-3 rounded-2xl ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
        <Formik
          initialValues={initialValues}
          validationSchema={addPackageValidationSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/*  Package Name */}
                <div className="">
                  <label
                    htmlFor="openTime"
                    className="block text-sm font-medium"
                  >
                    Name of the Package<span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="package.packageName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Package Name"
                  />
                  <ErrorMessage
                    name="package.packageName"
                    component="div"
                    className="text-red-500 text-xs absolute"
                  />
                </div>

                {/* Check In Time */}
                <div className="">
                  <label
                    htmlFor="package.checkInTime"
                    className="block text-sm font-medium"
                  >
                    Check-in<span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="time"
                    name="package.checkInTime"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Check-in Time"
                  />
                  <ErrorMessage
                    name="package.checkInTime"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Check Out Time */}
                <div className="">
                  <label
                    htmlFor="package.checkOutTime"
                    className="block text-sm font-medium"
                  >
                    Checkout Time<span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="time"
                    name="package.checkOutTime"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Checkout Time"
                  />
                  <ErrorMessage
                    name="package.checkOutTime"
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
                    name="package.latitude"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Latitude"
                  />
                  <ErrorMessage
                    name="package.latitude"
                    component="div"
                    className="text-red-500 text-xs absolute"
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
                    name="package.longitude"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter longitude"
                  />
                  <ErrorMessage
                    name="package.longitude"
                    component="div"
                    className="text-red-500 text-xs absolute"
                  />
                </div>
                {/* status */}
                <div className="form-group">
                  <label
                    className="block text-sm font-medium"
                    htmlFor="package.isActive"
                  >
                    Status<span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="package.isActive"
                    name="package.isActive"
                    onChange={(e) => {
                      const Value = e.target.value === "true";
                      setIsValidation(Value);
                      setFieldValue(`package.isActive`, Value);
                    }}
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select</option>
                    <option value={true}>Active</option>
                    <option value={false}>In Active</option>
                  </Field>
                  <ErrorMessage
                    name="package.isActive"
                    component="span"
                    className="text-red-500 text-xs absolute"
                  />
                </div>
                {/*  Guidelines */}
                <div>
                  <label htmlFor="User" className="block text-sm font-medium">
                    Guidelines
                  </label>
                  <Field
                    as="textarea"
                    name="package.guidelines"
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
                    name="package.description"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none  bg-white text-sm`}
                    placeholder="Enter Description"
                  />
                  <ErrorMessage
                    name="package.description"
                    component="div"
                    className="text-red-500 text-xs absolute"
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
                    name="package.cancellationPolicy"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Cancellation Policy"
                  />
                  {/* <ErrorMessage
                      name="package.cancellationPolicy"
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
                    name="package.termsConditions"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Terms & Conditions"
                  />
                  <ErrorMessage
                    name="package.termsConditions"
                    component="div"
                    className="text-red-500 text-xs absolute"
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
                    name="package.privacyPolicy"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Privacy Policy"
                  />
                  {/* <ErrorMessage
                        name="package.privacyPolicy"
                        component="div"
                        className="text-red-500 text-xs absolute"
                        /> */}
                </div>
                {/* upload Image */}
                <div className="col-md-2">
                  <label
                    htmlFor="package.packageImageBase64Strings"
                    className="block text-sm font-medium"
                  >
                    Upload Images<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="package.packageImageBase64Strings"
                    name="package.packageImageBase64Strings"
                    className={`mt-1 block w-full px-2 py-3 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (event) => {
                      const files = event.currentTarget.files;
                      if (files) {
                        const base64Images = [];
                        for (let i = 0; i < files.length; i++) {
                          const base64 = await convertToBase64(files[i]);
                          base64Images.push(base64);
                        }
                        setFieldValue(
                          "package.packageImageBase64Strings",
                          base64Images
                        ); // Store base64 images in Formik state
                      }
                    }}
                  />
                  <ErrorMessage
                    name="package.packageImageBase64Strings"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                  {/* preview */}
                  {values.package.packageImageBase64Strings.length !== 0 && (
                    <div className="col-md-10 border p-2 mt-2">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Selected Image Previews:
                      </h4>

                      <div className="flex flex-wrap gap-4 h-20 overflow-auto ">
                        {values.package.packageImageBase64Strings.map(
                          (base64Image, index) => (
                            <div
                              key={index}
                              className="relative w-[120px]  rounded overflow-hidden shadow-md border border-gray-200"
                            >
                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedImages =
                                    values.package.packageImageBase64Strings.filter(
                                      (_, i) => i !== index
                                    );
                                  setFieldValue(
                                    "package.packageImageBase64Strings",
                                    updatedImages
                                  );
                                }}
                                className="absolute top-1 right-1 bg-white text-gray-600 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 hover:text-white transition-all"
                              >
                                ×
                              </button>

                              {/* Image preview */}
                              <img
                                src={base64Image}
                                alt={`preview-${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ---------------------------------------------------------------------------------------------------------------------- */}
                {/* has sub facility */}
                <div className="flex items-center mt-5">
                  <Field
                    type="checkbox"
                    id="hasRooms"
                    name="hasRooms"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsHasRoom(isChecked);
                      setFieldValue("hasRooms", isChecked);
                      if (isChecked) {
                        setFieldValue("rooms[0].roomName", "");
                      } else {
                        setFieldValue("rooms", [values.rooms[0]]);
                        // setFieldValue(
                        //   "rooms[0].roomName",
                        //   Selectedfacility.facilityName
                        // );
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="hasRooms"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Has House
                  </label>
                </div>
              </div>
              <hr className="py-2"></hr>
              <FieldArray name="rooms">
                {({ push, remove }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        push({ roomName: "" });
                      }}
                      className={`${
                        values.hasRooms ? "" : "hidden"
                      } bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 my-3`}
                    >
                      Add House
                    </button>
                    <div className={`${values.hasRooms ? "" : "hidden"}`}>
                      {values.rooms.map((rooms, index) => (
                        <div
                          key={index}
                          className="card mb-3 p-3 border border-gray-100 rounded-2xl shadow-md"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h1 className="font-medium">House: {index + 1}</h1>
                            {values.rooms.length > 1 && (
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    remove(index); // Remove the sub-facility at the given index

                                    // New logic: Check if there are no sub-facilities left, then reset the state
                                    if (values.rooms.length === 1) {
                                      setFieldValue("hasRooms", false);
                                    }
                                  }}
                                  className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition duration-200"
                                >
                                  <MdDeleteForever className="text-white" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div
                            className={`mb-6 ${
                              values.hasRooms
                                ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                                : "hidden"
                            }`}
                          >
                            <div>
                              <label
                                htmlFor={`rooms[${index}].roomName`}
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                House Name{" "}
                                <span className="text-red-500 text-xs">*</span>
                              </label>
                              <Field
                                type="text"
                                maxLength="10"
                                id={`rooms[${index}].roomName`}
                                name={`rooms[${index}].roomName`}
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                placeholder="Enter House Name"
                              />
                              <ErrorMessage
                                name={`rooms[${index}].roomName`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`rooms[${index}].tariffPerDay`}
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Tariff Per Day{" "}
                                <span className="text-red-500 text-xs">*</span>
                              </label>
                              <Field
                                type="number"
                                minlength={0}
                                maxlength={10}
                                placeholder="Tariff Per Day"
                                name={`rooms[${index}].tariffPerDay`}
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                onKeyDown={(e) => {
                                  // Allow only numbers and backspace
                                  if (
                                    ["-", "e", "E", "+", "."].includes(e.key) ||
                                    (e.key.length === 1 && !/[0-9]/.test(e.key))
                                  ) {
                                    e.preventDefault(); // Block other keys
                                  }
                                }}
                                // onChange={(e) => {
                                //   const value = e.target.value;
                                //   if (value === "" || Number(value) >= 0) {
                                   
                                //     e.target.value = value;
                                //   } else {
                                    
                                //     e.target.value = 0;
                                //   }
                                // }}
                              />
                              <ErrorMessage
                                name={`rooms[${index}].tariffPerDay`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            {/* discounts */}
                            <div className="">
                              <label
                                htmlFor={`rooms[${index}].hasDiscount`}
                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Discounts
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                as="select"
                                name={`rooms[${index}].hasDiscount`}
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                onChange={(e) => {
                                  const Value = e.target.value === "true";
                                  setIsValidation(Value);
                                  setFieldValue(
                                    `rooms[${index}].hasDiscount`,
                                    Value
                                  );
                                }}
                              >
                                <option value=" " label="Select Option" />
                                <option value={true} label="Yes" />
                                <option value={false} label="No" />
                              </Field>
                              <ErrorMessage
                                name={`rooms[${index}].hasDiscount`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            {values.rooms[index].hasDiscount === true && (
                              <>
                                {/* Discount Type */}
                                <div>
                                  <label
                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    htmlFor={`rooms[${index}].discountType`}
                                  >
                                    Discount Type
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <Field
                                    as="select"
                                    name={`rooms[${index}].discountType`}
                                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                  >
                                    <option value="">Select type</option>
                                    <option value="Amount">Amount</option>
                                    <option value="Percentage">
                                      Percentage
                                    </option>
                                  </Field>
                                  <ErrorMessage
                                    name={`rooms[${index}].discountType`}
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                  />
                                </div>
                                {/* Discount Value */}
                                <div>
                                  <label
                                    c
                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                    Discount Value{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <Field
                                    type="number"
                                    placeholder="Enter Discount Value"
                                    name={`rooms[${index}].discountValue`}
                                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                  />
                                  <ErrorMessage
                                    name={`rooms[${index}].discountValue`}
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                  />
                                </div>
                                {/* Amount after Discount */}
                                <div>
                                  <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Amount after Discount
                                  </label>
                                  <Field
                                    name={`rooms[${index}].amountAfterDiscount`}
                                    placeholder="Enter Amount after Discount"
                                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                  />
                                </div>
                                {/* Discount Applicable */}
                                <div>
                                  <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Discount Applicable{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <Field
                                    as="select"
                                    name={`rooms[${index}].discountApplicable`}
                                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                    onChange={(e) => {
                                      const Value = e.target.value === "true";

                                      setFieldValue(
                                        `rooms[${index}].discountApplicable`,
                                        Value
                                      );
                                    }}
                                  >
                                    <option value="">Select option</option>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                  </Field>
                                  <ErrorMessage
                                    name={`rooms[${index}].discountApplicable`}
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                  />
                                </div>
                              </>
                            )}
                            {/* No of Houses Available */}
                            <div>
                              <label
                                htmlFor="noOfHousesAvailable"
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                No of Houses Available{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                type="number"
                                maxLength="10"
                                name={`rooms[${index}].noOfHousesAvailable`}
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                placeholder="Enter No of Houses Available"
                              />
                              <ErrorMessage
                                name={`rooms[${index}].noOfHousesAvailable`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            {/* room Limit */}
                            <div>
                              <label
                                htmlFor="roomLimit"
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Room Limit{" "}
                                <span className="text-red-500 text-xs">*</span>
                              </label>
                              <Field
                                type="number"
                                maxLength="10"
                                name={`rooms[${index}].roomLimit`}
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                placeholder="Enter Room Limit"
                              />
                              <ErrorMessage
                                name={`rooms[${index}].roomLimit`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            {/* block out */}
                            <div>
                              <label
                                htmlFor={`rooms[${index}].isBlockout`}
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Block out{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                as="select"
                                name={`rooms[${index}].isBlockout`}
                                onChange={(e) => {
                                  const Value = e.target.value === "true";
                                  setFieldValue(
                                    `rooms[${index}].isBlockout`,
                                    Value
                                  );
                                }}
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                              >
                                <option value="">Select option</option>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                              </Field>
                              <ErrorMessage
                                name={`rooms[${index}].isBlockout`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            {/* Sequence */}
                            <div>
                              <label
                                htmlFor="sequence"
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Sequence <span className="text-red-500">*</span>
                              </label>
                              <Field
                                type="number"
                                maxLength="10"
                                name={`rooms[${index}].sequence`}
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                placeholder="Enter Sequence Number"
                              />
                              <ErrorMessage
                                name={`rooms[${index}].sequence`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            {/* Remarks */}
                            <div>
                              <label
                                htmlFor="remarks"
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Remarks
                              </label>
                              <Field
                                as="textarea"
                                name={`rooms[${index}].remarks`}
                                rows="2"
                                maxLength="250"
                                className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                placeholder="Enter your remarks"
                              />
                            </div>
                            {/* images */}
                            <div className="col-md-2">
                              <label
                                htmlFor={`rooms[${index}].roomImageBase64Strings`}
                                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Upload Images
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                id={`rooms[${index}].roomImageBase64Strings`}
                                name={`rooms[${index}].roomImageBase64Strings`}
                                className={`mt-1 block w-full px-2 py-3 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (event) => {
                                  const files = event.currentTarget.files;
                                  if (files) {
                                    const base64Images = [];
                                    for (let i = 0; i < files.length; i++) {
                                      const base64 = await convertToBase64(
                                        files[i]
                                      );
                                      base64Images.push(base64);
                                    }
                                    setFieldValue(
                                      `rooms[${index}].roomImageBase64Strings`,
                                      base64Images
                                    ); // Store base64 images in Formik state
                                  }
                                }}
                              />
                              <ErrorMessage
                                name={`rooms[${index}].roomImageBase64Strings`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>

                            {values.rooms[index]?.roomImageBase64Strings
                              ?.length > 0 && (
                              <div className="col-md-10">
                                <h4 className="block text-xs font-medium text-gray-700">
                                  Selected Image Previews:
                                </h4>
                                <div className="flex gap-4 mt-2">
                                  {values.rooms[
                                    index
                                  ]?.roomImageBase64Strings?.map(
                                    (base64Image, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="relative w-[100px] h-[100px]"
                                      >
                                        {/* Delete button */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedImages = values.rooms[
                                              index
                                            ].roomImageBase64Strings.filter(
                                              (_, i) => i !== imgIndex
                                            );

                                            setFieldValue(
                                              `rooms[${index}].roomImageBase64Strings`,
                                              updatedImages
                                            );
                                          }}
                                          className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                          ×
                                        </button>

                                        {/* Image preview */}
                                        <img
                                          src={base64Image}
                                          alt={`preview-${imgIndex}`}
                                          className="w-full h-full object-cover rounded shadow-md"
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </FieldArray>
              <div className="flex justify-center mt-3">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  //  disabled={isSaveUnifiedFacilityDetailsLoading}
                >
                  {isSavePackageWithRoomLoading ? "Saving..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddPackage;
