import { Field, Form, Formik } from "formik";
import React from "react";
import { ToastContainer } from "react-toastify";

const AddPackage = () => {
  const initialValues = {
    // facilityDto: {
    //   facilityMasterId: "",
    //   facilitySequenceNumber: null,
    //   description: "",
    // },
    // hasSubFacility: false,
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
      activeStatus: true,
      packageImageUrls: [""],
    },
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
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Name of the Package
                  </label>
                  <Field
                    name="package.packageName"
                    type="text"
                    maxlength={5}
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Check-in
                  </label>
                  <Field
                    type="time"
                    name="package.checkInTime"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Checkout Time
                  </label>
                  <Field
                    type="time"
                    name="package.checkOutTime"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                  <label htmlFor="User" className="block text-xs font-medium">
                    Guidelines <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="package.guidelines"
                    maxlength={50}
                    className={`mt-1 block w-full px-2 py-1border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Guidelines"
                  />
                  {/* <ErrorMessage
                    name="package.guidelines"
                    component="div"
                    className="text-red-500 text-xs absolute"
                  /> */}
                </div>

                {/* discription */}
                <div>
                  <label className="block text-sm font-medium">
                    Description
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
                    Terms & Conditions
                  </label>
                  <Field
                    as="textarea"
                    maxlength={100}
                    name="package.termsConditions"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Privacy Policy"
                  />
                  {/* <ErrorMessage
                        name="package.privacyPolicy"
                        component="div"
                        className="text-red-500 text-xs absolute"
                        /> */}
                </div>
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-xs font-medium"
                  >
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="package.latitude"
                    type="text"
                    maxlength={50}
                    className={`mt-1 block w-full px-2 py-1border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                  {/* <ErrorMessage
                    name="package.latitude"
                    component="div"
                    className="text-red-500 text-xs absolute"
                  /> */}
                </div>
                <div>
                  <label
                    htmlFor="activeStatus"
                    className="block text-xs font-medium"
                  >
                    Active Status <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="package.activeStatus"
                    className="mt-1 block w-full px-2 py-1 border border-gray-200 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="true">Active</option>
                    <option value="false">InActive</option>
                  </Field>
                  {/* <ErrorMessage
                        name="package.activeStatus"
                        component="div"
                        className="text-red-500 text-xs absolute"
                      /> */}
                </div>
                {/* ---------------------------------------------------------------------------------------------------------------------- */}
                {/* has sub facility */}
                {/* <div className="flex items-center mt-5">
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
                        setFieldValue(
                          "subFacilities[0].name",
                          Selectedfacility.facilityName
                        );
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="hasSubFacility"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Has Rooms
                  </label>
                </div> */}

                {/* <CheckboxInput name="hasSubFacility" label="Has Sub-Facility" onChange={handleSubFacilityName} /> */}
              </div>

              {/* discription */}
              {/* <div className="col-span-3">
                <label className="block text-sm font-medium">Description</label>
                <Field
                  as="textarea"
                  maxlength={100}
                  name="facilityDto.description"
                  onChange={(e) => {
                    setFieldValue("facilityDto.description", e.target.value);
                  }}
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  placeholder="Enter description"
                />
              </div> */}
              {/* <hr className="py-2"></hr> */}

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
