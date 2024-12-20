import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useEffect } from "react";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { toast, ToastContainer } from "react-toastify";
import { useModalStore } from "../../store/modalStore";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";

// Validation schema using Yup

const ServiceVarientCreate = ({ onDataAdded }) => {
  const {
    saveServiceVarientDetails,
    isSaveServiceVarientDetailsLoading,
    ServiceVariantEditDetails,
  } = useServiceVariantStore();

  const { isCreateServiceVariantEnabled, setIsCreateServiceVariantEnabled } =
  useUnifiedFacilityStore();

  const { allServices, fetchAllServices } = useServiceStore();
  const { openModalId, setOpenModalId, closeModal } = useModalStore();

  useEffect(() => {
    fetchAllServices();
  }, []);
  const initialValues = {
    id: isCreateServiceVariantEnabled ? "" : ServiceVariantEditDetails.id,
    name: isCreateServiceVariantEnabled ? "" : ServiceVariantEditDetails.name,
    serviceId: isCreateServiceVariantEnabled ? "" : ServiceVariantEditDetails.serviceId,
    displayName: isCreateServiceVariantEnabled ? "" : ServiceVariantEditDetails.displayName,
    amount: isCreateServiceVariantEnabled ? "" : ServiceVariantEditDetails.amount,
    serviceVarientSequenceNumber:isCreateServiceVariantEnabled ? "" :ServiceVariantEditDetails.sequenceNumber,
    description: isCreateServiceVariantEnabled ? "" : ServiceVariantEditDetails.description,
    isPriceFixed: isCreateServiceVariantEnabled ? false : !ServiceVariantEditDetails.isPriceFixed,
    isActive: isCreateServiceVariantEnabled ? true : ServiceVariantEditDetails.isActive,
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter the Actual name."),
    serviceId: Yup.string().required("Please enter the sub facility."),
    serviceVarientSequenceNumber: Yup.string().required("Please enter the Sequence."),
    amount: Yup.number().required("Please enter the amount."),
    description: Yup.string().required("Please enter the description."),
    isPriceFixed: Yup.boolean().required(
      "Please specify if the price is fixed."
    ),
  });

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveServiceVarientDetails
  ) => {
    try {
      // Call the saveParkDetails function from the store
      const formattedValues = {
        ...values,
        isActive: values.isActive === "true" || values.isActive === true,
        isPriceFixed:values.isPriceFixed===true?false:true,
        displayName: values.name || "",
      };

      const result = await saveServiceVarientDetails(formattedValues, isCreateServiceVariantEnabled ? false :true);
      console.log(result);
      if (result.data.status === 200) {
        toast.success(isCreateServiceVariantEnabled ? "Ticket Type Added successfully!" : "Ticket Type Updated successfully!");
        setTimeout(() => {
          setOpenModalId(null);
          onDataAdded();
          setIsCreateServiceVariantEnabled(false);
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
    <div className="container mx-auto">
      {/* <h2 className="text-black text-2xl font-bold mb-6">Facilities</h2> */}
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <div className=" ">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveServiceVarientDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="bg-zinc-50 grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* Service */}
               {setIsCreateServiceVariantEnabled &&
                 <div>
                  <label className="block text-sm font-medium">
                    Sub Facility <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="serviceId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.serviceId && touched.serviceId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select sub facility</option>
                    {allServices
                      ?.filter((service) => service.isActive)
                      ?.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="serviceId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>}

                {/* Varient Name */}
                <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Actual Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="name"
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
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Amount */}
                <div className="">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    name="amount"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.amount && touched.amount
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Amount"
                    min={0}
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex items-end mb-3">
                  <label className="text-sm flex space-x-2">
                    <Field
                      type="checkbox"
                      name="isPriceFixed"
                      className="sr-only peer "
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                    <span className="ms-3 text-md font-semibold text-gray-900 ">
                    Is Person Based
                    </span>
                  </label>
                  <ErrorMessage
                    name="isPriceFixed"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                </div>
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
                 {/* sequence */}
                 <div>
                  <label className="block text-sm font-medium">
                    Sequence
                  </label>
                  <Field
                    name="serviceVarientSequenceNumber"
                    type="number"
                    maxLength={50}
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Sequence"
                  />
                  <ErrorMessage
                    name="serviceVarientSequenceNumber"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                 
                </div>

                {/* description */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    maxLength={255}
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

              <div className="flex justify-center p-4">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveServiceVarientDetailsLoading}
                >
                  {isSaveServiceVarientDetailsLoading
                    ? "Saving..."
                    : (isCreateServiceVariantEnabled ? "Add Ticket Type" :"Update Ticket Type")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default ServiceVarientCreate;
