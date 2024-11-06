import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useEffect } from "react";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { toast, ToastContainer } from "react-toastify";

// Validation schema using Yup

const ServiceVarientCreate = ({setIsServiceVarientCreateVisible}) => {
  const { saveServiceVarientDetails, isSaveServiceVarientDetailsLoading } =
    useServiceVariantStore();
  const { allServices, fetchAllServices } = useServiceStore();

  useEffect(() => {
    fetchAllServices();
  }, []);
  const initialValues = {
    name: "",
    serviceId: "",
    displayName: "",
    amount: null,
    description: "",
    isPriceFixed: false,
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter the name."),
    serviceId: Yup.string().required("Please enter the service ID."),
    displayName: Yup.string().required("Please enter the display name."),
    amount: Yup.number().required("Please enter the amount."),
    description: Yup.string().required("Please enter the description."),
    isPriceFixed: Yup.boolean().required("Please specify if the price is fixed."),
});

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveServiceVarientDetails
  ) => {
    try {
      // Call the saveParkDetails function from the store
      const result = await saveServiceVarientDetails(values, false);
      console.log(result);
      if (result.data.status === 200) {
        toast.success("Service Variant created successfully!");
        setTimeout(() => {
          setIsServiceVarientCreateVisible(false);
        }, 3000);
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
    <div className="container mx-auto mt-10">
      {/* <h2 className="text-black text-2xl font-bold mb-6">Facilities</h2> */}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg border border-gray-200">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveServiceVarientDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* Service */}
                <div>
                  <label className="block text-sm font-medium"> Service</label>
                  <Field
                    as="select"
                    name="serviceId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.serviceId && touched.serviceId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select </option>
                    {allServices.map((service) => (
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
                </div>

                {/* Varient Name */}
                <div className="">
                  <label
                    htmlFor="name"

                    className="block text-sm font-semibold text-gray-700"
                  >
                    Varient Name
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
                    placeholder="Enter Varient Name"
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
                    Amount
                  </label>
                  <Field
                    type="number"
                    name="amount"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.amount && touched.amount
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Display Name"
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Display Name */}
                <div className="mb-3">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Display Name
                  </label>
                  <Field
                    type="text"
                    name="displayName"
                    maxLength={50}
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.displayName && touched.displayName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Display Name"
                  />
                  <ErrorMessage
                    name="displayName"
                    component="span"
                    className="text-red-500 text-xs mt-1 absolute mb-1"
                  />
                </div>
                {/* <div class="flex items-end">
                  <label class="text-sm flex space-x-2">
                    <div class="h-5 w-5 flex items-end">
                      <Field
                        type="checkbox"
                        name="isPriceFixed"
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </div>

                    <span className="text-gray-900">Price Fixed</span>
                  </label>
                </div> */}
                <div class="flex items-end mb-3">
                  <label className="text-sm flex space-x-2">
                    <Field
                      type="checkbox"
                      name="isPriceFixed"
                      className="sr-only peer "
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                    <span className="ms-3 text-md font-semibold text-gray-900 ">
                      Price Fixed
                    </span>
                  </label>  
                   <ErrorMessage
                    name="isPriceFixed"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* description */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium">
                    Description
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

              <div className="flex justify-center p-5">
                <button
                  type="submit"
                 className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveServiceVarientDetailsLoading}
                >
                  {isSaveServiceVarientDetailsLoading
                    ? "Saving..."
                    : "Create Service Varient"}
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
