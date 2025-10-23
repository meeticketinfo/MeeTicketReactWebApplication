import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported

import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useModalStore } from "../../store/modalStore";
import useAuthStore from "../../store/authStore";
import { WalkersPassStore } from "../../store/masters/WalkersPassStore";

// Validation schema using Yup

const WalkersParkPassCreate = () => {
  const { roleDetails } = useAuthStore();
  const role = roleDetails?.name;
  const { allServices, fetchAllServices } = useServiceStore();
  const {
    saveWalkersPass,
    isSaveWalkersPassDetailsLoading,
    setCurrentWalkersPassEditDetails,
    walkersPassEditDetails,
    isWalkersPassEdit,
    setIsWalkersPassAdd,
  } = WalkersPassStore();
  useEffect(() => {
    fetchAllServices(role);
  }, []);
  const initialValues = {
    id: "",
    name: "",
    serviceId: "",
    displayName: "",
    amount: "",
    serviceVarientSequenceNumber: "",
    description: "",
    isPriceFixed: false,
    isActive: true,
    validityValue: "",
    validityUnit: "",
    MaximumAge: "",
    MinimumAge: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter the Actual name."),
    serviceId: Yup.string().required("Please select the sub facility."),
    serviceVarientSequenceNumber: Yup.string().required(
      "Please enter the Sequence."
    ),
    amount: Yup.number().required("Please enter the amount."),
    description: Yup.string().required("Please enter the description."),
    // isPriceFixed: Yup.boolean().required(
    //   "Please specify if the price is fixed."
    // ),
    // isActive: Yup.boolean().required("Please select the status."),
    validityUnit: Yup.string().required("Please select the validity unit."),
    MaximumAge: Yup.number()
      .required("Please enter the maximum age.")
      .test('is-greater-than-min', 'Maximum age must be greater than minimum age', function(value) {
        const { MinimumAge } = this.parent;
        if (MinimumAge && value && value <= MinimumAge) {
          return false;
        }
        return true;
      }),
    MinimumAge: Yup.number()
      .required("Please enter the minimum age.")
      .test('is-less-than-max', 'Minimum age must be less than maximum age', function(value) {
        const { MaximumAge } = this.parent;
        if (MaximumAge && value && value >= MaximumAge) {
          return false;
        }
        return true;
      }),
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log(values);
    const payload = {
      passId: isWalkersPassEdit ? walkersPassEditDetails.passId : "",
      subfacility: values.serviceId,
      actualName: values.name,
      amount: values.amount,
      isPeresonBased: values.isPriceFixed,
      passType: values.validityUnit,
      minimumAge: values.MinimumAge,
      maximumAge: values.MaximumAge,
      status: values.isActive,
      sequence: values.serviceVarientSequenceNumber,
      description: values.description,
    };
    try {
      const res = await saveWalkersPass(payload, isWalkersPassEdit);

      if (res.data.status === 200) {
        toast.success(
          isWalkersPassEdit
            ? "Walkers Park Pass Updated Successfully"
            : "Walkers Park Pass Created Successfully"
        );
        setTimeout(() => {
          setIsWalkersPassAdd(false);
          setCurrentWalkersPassEditDetails({});
         
          resetForm();
        }, 1000);
      } else {
        toast.error("something went wrong");
      }
    } catch (err) {
      console.log("err", err);
      toast.error(err.response.data);
    }
  };

  return (
    <div className="container mx-auto px-8">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <div className=" ">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="bg-zinc-50 grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                {/* Service */}

                <div>
                  <label className="block text-sm font-medium">
                    Sub Facility <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="serviceId"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
                </div>

                {/* Actual Name */}
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
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
                    type="text"
                    name="amount"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Amount"
                    onKeyDown={(e) => {
                      // Allow only numbers and backspace
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault(); // Block other keys
                      }
                    }}
                    maxLength={12}
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* is person based */}
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

                {/* Validity Unit */}
                <div>
                  <label className="block text-sm font-medium">
                    Pass Type <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="validityUnit"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  >
                    <option value="">Select Validity Unit</option>

                    <option value="Months">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half Years">Half Yearly</option>
                    <option value="Years">Yearly</option>
                  </Field>
                  <ErrorMessage
                    name="validityUnit"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Minumum age */}
                <div className="">
                  <label
                    htmlFor="MinimumAge"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Minimum Age <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    name="MinimumAge"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                    placeholder=" Enter Minimum Age"
                    onKeyDown={(e) => {
                      // Allow only numbers and backspace
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault(); // Block other keys
                      }
                    }}
                    maxLength={12}
                  />
                  <ErrorMessage
                    name="MinimumAge"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Maximum age */}
                <div className="">
                  <label
                    htmlFor="MaximumAge"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Maximum Age <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    name="MaximumAge"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                    placeholder=" Enter Maximum Age"
                    onKeyDown={(e) => {
                      // Allow only numbers and backspace
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault(); // Block other keys
                      }
                    }}
                    maxLength={12}
                  />
                  <ErrorMessage
                    name="MaximumAge"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="isActive"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
                    Sequence<span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="serviceVarientSequenceNumber"
                    type="text"
                    maxlength={5}
                    onKeyDown={(e) => {
                      // Allow only numbers and backspace
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault(); // Block other keys
                      }
                    }}
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
                    maxLength={500}
                    className={`mt-1 block w-full px-2 py-1 border border-gray-400 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
                    disabled={isSaveWalkersPassDetailsLoading}
                >
                  {isSaveWalkersPassDetailsLoading
                    ? "Saving..."
                    : true
                    ? "Add Ticket Type"
                    : "Update Ticket Type"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default WalkersParkPassCreate;
