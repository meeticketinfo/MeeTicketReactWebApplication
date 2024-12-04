// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUsersStore } from "../../store/masters/usersStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useModalStore } from "../../store/modalStore";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";

const ServiceCreate = ({ onDataAdded }) => {
  const {
    saveServiceDetails,
    isSaveServiceDetailsLoading,
    ServiceEditDetails,
  } = useServiceStore();
  const { isCreateServiceEnabled } =
  useUnifiedFacilityStore();

  const { openModalId, setOpenModalId, closeModal } = useModalStore();

  const { fetchAllFacilities, allFacilities } = useFacilityStore();
  useEffect(() => {
    fetchAllFacilities();
  }, []);
  const initialValues = {
    id: isCreateServiceEnabled ? "" : ServiceEditDetails.id,
    name: isCreateServiceEnabled ? "" :ServiceEditDetails.name,
    displayName: isCreateServiceEnabled ? "" :ServiceEditDetails.displayName,
    serviceType: isCreateServiceEnabled ? "" :ServiceEditDetails.serviceType,
    duration: isCreateServiceEnabled ? "" :ServiceEditDetails.duration,
    availability: isCreateServiceEnabled ? "" :ServiceEditDetails.availabilit,
    installationDate: isCreateServiceEnabled ? "" :ServiceEditDetails.installationDate,
    description: isCreateServiceEnabled ? "" :ServiceEditDetails.description,
    isActive: isCreateServiceEnabled ? true :ServiceEditDetails.isActive,
    facilityId: isCreateServiceEnabled ? "" :ServiceEditDetails.facilityId,
  };
  const validationSchema = Yup.object({
    facilityId: Yup.string().required("Please enter facility ."),
    name: Yup.string().required("Please enter Actual name."),
    Description: Yup.string()
      .nullable()
      .min(10, "Description must be at least 10 characters long")
      .max(500, "Description cannot be more than 500 characters"),
  });

  // onSubmit function to handle form submission
  const onSubmit = async (
    values,

    { setSubmitting, resetForm },
    saveServiceDetails
  ) => {
    values.installationDate = values.installationDate
      ? values.installationDate
      : null;
    values.isActive = values.isActive === "true" || values.isActive === true;
    values.displayName = values.name;
    try {
      // Call the saveUserDetails function from the store
      const result = await saveServiceDetails(values, isCreateServiceEnabled ? false : true);

      if (result.data.status === 200) {
        toast.success(isCreateServiceEnabled ? "Sub Facility Added successfully" : "Sub Facility Updated successfully!");

        setTimeout(() => {
          setOpenModalId(null);
          onDataAdded();
          // setIsServiceCreateVisible(false);
          // setIsServiceEditVisible(false);
        }, 300);

        resetForm();
      }
    } catch (xhr) {
      console.log("xhr.errors:", xhr);
      if (xhr && xhr.response && typeof xhr.response.data.errors === "object") {
        const formErrors = {};
        Object.keys(xhr.response.data.errors).forEach((key) => {
          if (
            Array.isArray(xhr.response.data.errors[key]) &&
            xhr.response.data.errors[key].length > 0
          ) {
            formErrors[key] = xhr.response.data.errors[key][0];
            console.log(`${key}: ${xhr.response.data.errors[key][0]}`);
            toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
          }
        });
      } else {
        toast.error(xhr.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      {" "}
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveServiceDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                <div>
                  <label className="block text-sm font-medium">
                    Facility <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="facilityId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.facilityId && touched.facilityId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Facility</option>
                    {allFacilities
                      ?.filter((facility) => facility.isActive)
                      ?.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                          {facility.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="facilityId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium">
                    Actual Name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    maxLength={50}
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Actual Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/* Display Name */}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <Field
                    as="select"
                    name="isActive"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.isActive && touched.isActive
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="active"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Description */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    maxlength={255}
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter description"
                  />
                  <ErrorMessage
                    name="description"
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
                  disabled={isSaveServiceDetailsLoading}
                >
                  {isSaveServiceDetailsLoading
                    ? "Saving..."
                    : (isCreateServiceEnabled ? "Add Sub Facility" : "Update Sub Facility")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default ServiceCreate;
