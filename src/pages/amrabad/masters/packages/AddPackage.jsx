import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { convertToBase64 } from "../../../../utils/Helper";
import SelectInput from "../../../../components/facilities_management/SelectInput";
import CheckboxInput from "../../../../components/facilities_management/CheckboxInput";

const AddPackage = () => {
  const [isSubfacility, setIsSubfacility] = useState(false);
  const initialValues = {
    // facilityDto: {
    //   facilityMasterId: "",
    //   facilitySequenceNumber: null,
    //   description: "",
    // },
   
    // subFacilities: [{ name: "", Limit: null, subFacilitySequenceNumber: null }],

    package: {
      packageName: "",
      description: "",
      information: "",
      bulkBookingDiscount: "",
      daySchedules: "",
      checkInTime: "",
      checkOutTime: "",
      guidelines: "",
      cancellationPolicy: "",
      termsConditions: "",
      privacyPolicy: "",
      latitude: null,
      longitude: null,
      packageImageUrls: [],
      isActive: true,
    },
    hasSubFacility: false,
    rooms: [
      {
        roomName: "string",
        tariffPerDay: 0,
        hasDiscount: true,
        discountType: "string",
        discountValue: 0,
        discountApplicable: "string",
        noOfHousesAvailable: 0,
        hasLimit: true,
        roomLimit: 0,
        isBlockout: true,
        sequence: 0,
        remarks: "string",
        roomImageUrls: ["string"],
      },
    ],
  };
  const onSubmit = (values) => {
    console.log("values", values);
  };
  return (
    <div className="bg-white/30 p-3 rounded-2xl ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
        <Formik
          initialValues={initialValues}
          //   validationSchema={validationSchema}
          //   onSubmit={(values, actions) =>
          //     onSubmit(values, actions, saveunifiedFacilityDetails)
          //   }
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
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
                    maxlength={5}
                    className={`mt-1 block w-full px-2 py-2 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Package Name"
                  />
                  {/* <ErrorMessage
                    name="package.packageName"
                    component="div"
                    className="text-red-500 text-xs absolute"
                  /> */}
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
                    className={`mt-1 block w-full px-2 py-2 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Check-in Time"
                  />
                  {/* <ErrorMessage
                      name="package.checkInTime"
                     component="div"
                     className="text-red-500 text-xs mt-1"
                     /> */}
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
                    className={`mt-1 block w-full px-2 py-2 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Checkout Time"
                  />
                  {/* <ErrorMessage
                      name="package.checkOutTime"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                     /> */}
                </div>
                {/*  Guidelines */}
                <div>
                  <label htmlFor="User" className="block text-sm font-medium">
                    Guidelines <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="package.guidelines"
                    type="text"
                    maxlength={50}
                    className={`mt-1 block w-full px-2 py-2 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Guidelines"
                  />
                  {/* <ErrorMessage
                    name="package.guidelines"
                    component="div"
                    className="text-red-500 text-xs absolute"
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
                    name="package.latitude"
                    type="text"
                    className={`mt-1 block w-full px-2 py-2 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Latitude"
                  />
                  {/* <ErrorMessage
                    name="package.latitude"
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
                    name="package.longitude"
                    type="text"
                    className={`mt-1 block w-full px-2 py-2 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter longitude"
                  />
                  {/* <ErrorMessage
                    name="package.longitude"
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
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="InActive">In Active</option>
                  </Field>
                  {/* <ErrorMessage
                    name="isActive"
                    component="span"
                    className="text-red-500 text-xs absolute"
                  /> */}
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
                  {/* <ErrorMessage
                        name="package.description"
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
                  {/* <ErrorMessage
                        name="package.termsConditions"
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
                    htmlFor="packageImageUrls"
                    className="block text-sm font-medium"
                  >
                    Upload Images<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="packageImageUrls"
                    name="package.packageImageUrls"
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
                          base64Images.push(base64);
                        }
                        setFieldValue("package.packageImageUrls", base64Images); // Store base64 images in Formik state
                      }
                    }}
                  />
                  {/* <ErrorMessage
                    name="roomImagesBase64Strings"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  /> */}
                  {/* preview */}
                  {values.package.packageImageUrls.length !== 0 && (
                    <div className="col-md-10 border p-2 mt-2">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Selected Image Previews:
                      </h4>

                      <div className="flex flex-wrap gap-4 h-20 overflow-auto ">
                        {values.package.packageImageUrls.map(
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
                                    values.package.packageImageUrls.filter(
                                      (_, i) => i !== index
                                    );
                                  setFieldValue(
                                    "package.packageImageUrls",
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
                    id="hasSubFacility"
                    name="hasSubFacility"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsSubfacility(isChecked);
                      setFieldValue("hasSubFacility", isChecked);
                      if (isChecked) {
                        setFieldValue("subFacilities[0].name", "");
                      } else {
                        setFieldValue("subFacilities", [
                          values.subFacilities[0],
                        ]);
                       
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="hasSubFacility"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Has House
                  </label>
                </div>
              </div>

              <div className="flex justify-center mt-3">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  //  disabled={isSaveUnifiedFacilityDetailsLoading}
                >
                  {false ? "Saving..." : "Submit"}
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
