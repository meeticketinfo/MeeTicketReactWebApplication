// import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useModalStore } from "../../store/modalStore";

const EntityCreateForm = ({
  isEntityTypeEditVisible,
  setIsEntityTypeEditVisible,
}) => {
  const {
    saveEntityTypeDetails,
    isSaveEntityTypeDetailsLoading,
    entityTypeEditDetails,
    fetchAllEntityTypes,
  } = useEntityTypesStore();
  const { openModalId, setOpenModalId, closeModal } = useModalStore();

  const initialValues = {
    entityTypeId:
      (isEntityTypeEditVisible && entityTypeEditDetails?.entityTypeId) || "",
    entityTypeName:
      (isEntityTypeEditVisible && entityTypeEditDetails?.entityTypeName) || "",
    isActive: isEntityTypeEditVisible ? entityTypeEditDetails?.isActive : true,
  };

  const validationSchema = Yup.object({
    entityTypeName: Yup.string().required("Please enter location category."),
  });

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveEntityTypeDetails
  ) => {
    values.isActive = values.isActive === true || values.isActive === "true";
    try {
      const result = await saveEntityTypeDetails(
        values,
        isEntityTypeEditVisible ? true : false
      );

      if (result.data.status === 200) {
        resetForm();
        setOpenModalId(null);
        toast.success(
          isEntityTypeEditVisible
            ? "Location Category Updated successfully!"
            : "Location Category created successfully!"
        );
        fetchAllEntityTypes();
        setIsEntityTypeEditVisible(false);
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
      <div className="">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveEntityTypeDetails)
          }
        >
          {({ errors, touched, isSubmitting,setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-3">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium">
                    {" "}
                    Location Category Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="entityTypeName"
                    type="text"
                    maxLength={50}
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.entityTypeName && touched.entityTypeName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Location Category Name"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                      setFieldValue("entityTypeName", value);
                    }}
                    
                  />
                  <ErrorMessage
                    name="entityTypeName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Status */}

                <div className="mt-1 flex items-end">
                  <label className="text-sm flex space-x-2">
                    <span>Status</span>
                    <Field
                      type="checkbox"
                      name="isActive"
                      className="sr-only peer "
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                  </label>
                  <ErrorMessage
                    name="isActive"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center p-2">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveEntityTypeDetailsLoading}
                >
                  {isSaveEntityTypeDetailsLoading
                    ? "Saving..."
                    : isEntityTypeEditVisible
                    ? "Update Location Category"
                    : "Create Location Category"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default EntityCreateForm;
