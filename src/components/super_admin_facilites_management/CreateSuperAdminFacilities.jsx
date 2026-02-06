import React, { useEffect } from "react";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useAdminFacilityStore } from "../../store/masters/SuperAdminFacilitiesStore";

function CreateSuperAdminFacilities({
  setIsFacilityCreateVisible,
  isFacilityEditVisible,
}) {
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const { saveAdminFacilityDetails, AdminFacilityEditDetails } =
    useAdminFacilityStore();
  console.log("Edit", AdminFacilityEditDetails);
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
  }, []);

  const intialValues = {
    facilityMasterId: isFacilityEditVisible
      ? AdminFacilityEditDetails.facilityMasterId
      : "",
    departmentId: isFacilityEditVisible
      ? AdminFacilityEditDetails.departmentId
      : "",
    locationCategoryId: isFacilityEditVisible
      ? AdminFacilityEditDetails.locationCategoryId
      : "",
    facilityName: isFacilityEditVisible
      ? AdminFacilityEditDetails.facilityName
      : "",
  };
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    values.departmentId = Number(values.departmentId);
    values.locationCategoryId = Number(values.locationCategoryId);
    console.log("values", values);
    try {
      const result = await saveAdminFacilityDetails(
        values,
        isFacilityEditVisible ? true : false
      );
      console.log("Save result:", result); // Debugging line

      if (result && result.data && result.data.status === 200) {
        toast.success(
          isFacilityEditVisible
            ? "Facility Updated successfully!"
            : "Facility created successfully!"
        );
        // toast.success("Facility created successfully!");
        setTimeout(() => {
          setIsFacilityCreateVisible(false);
          //   setIsFacilityEditVisible(false);
        }, 1000);
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

  const validationSchema = Yup.object({
    departmentId: Yup.string().required("Please select Department Type."),
    locationCategoryId: Yup.string().required(
      "Please select Location Category."
    ),

    facilityName: Yup.string().required("Please select Facility Name."),
  });

  return (
    <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* EntityTypeId DepartmentId */}
      <Formik
        initialValues={intialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid grid-cols-1 justify-center">
            <div className="grid grid-cols-1 gap-6 p-6  rounded-lg w-96 mx-auto">

              {/* Department */}
              <div>
                <label className="block text-sm font-medium">Department <span className="text-red-500">*</span></label>
                <Field
                  as="select"
                  name="departmentId"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                >
                  <option value="">Select Department</option>
                  {allDepartmentTypes
                    ?.filter((departmentType) => departmentType.isActive)
                    .map((departmentType) => (
                      <option
                        key={departmentType.departmentId}
                        value={departmentType.departmentId}
                      >
                        {departmentType.departmentName}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  className="text-red-600 text-sm"
                  name="departmentId"
                  component={"div"}
                />
              </div>

              {/* Location Category */}
              <div>
                <label className="block text-sm font-medium">
                  Location Category <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="locationCategoryId"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                >
                  <option value="">Select Location Category</option>
                  {allEntityTypes
                    ?.filter((entityType) => entityType.isActive)
                    .map((entityType) => (
                      <option
                        key={entityType.entityTypeId}
                        value={entityType.entityTypeId}
                      >
                        {entityType.entityTypeName}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  className="text-red-600 text-sm"
                  name="locationCategoryId"
                  component={"div"}
                />
              </div>

              {/* Facility Name */}
              <div>
                <label className="block text-sm font-medium">
                  Facility Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="facilityName"
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  placeholder="Enter Facility name"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                    setFieldValue("facilityName", value);
                  }}
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
                  className="text-red-600 text-sm"
                  name="facilityName"
                  component={"div"}
                />
              </div>

              {/* Status */}
              {/* <div>
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
            </div> */}
              {/* Submit Button */}
              <div className="flex justify-center">
                <div className="">
                  <button
                    type="submit"
                    className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  //   disabled={isSaveParkDetailsLoading}
                  >
                    {isFacilityEditVisible
                      ? "Update Facility"
                      : "Create Facility"}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateSuperAdminFacilities;
