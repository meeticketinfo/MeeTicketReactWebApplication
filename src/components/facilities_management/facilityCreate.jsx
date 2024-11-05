import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../../store/authStore";
// Validation schema using Yup

const FacilityCreate = () => {
  const { saveFacilityDetails, isSaveFacilityDetailsLoading } =
    useFacilityStore();
  const { isLoading, isAuthenticated, token, error, decodedTokenData, login } =
    useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;

  const initialValues = {
    name: "",
    displayName: "",
    contactName: "",
    contactNumber: "",
    contactEmail: "",
    capacity: 0,
    availabilityStatus: "",
    lastMaintenanceDate: "",
    facilityCondition: "",
    installationDate: "",
    openTime: "00:00:00",
    closeTime: "00:00:00",
    description: "",
    isActive: true,
    parkId: parkId,
  };

  const onSubmit = async (
    values,
    { setSubmitting, resetForm },
    saveFacilityDetails
  ) => {
    const formattedValues = {
      ...values,
      openTime:
        values.openTime.length === 5
          ? `${values.openTime}:00`
          : values.openTime,
      closeTime:
        values.closeTime.length === 5
          ? `${values.closeTime}:00`
          : values.closeTime,
      installationDate: new Date(values.installationDate).toISOString(),
      lastMaintenanceDate: new Date(values.lastMaintenanceDate).toISOString(),
    };
    try {
      // Call the saveParkDetails function from the store
      const result = await saveFacilityDetails(formattedValues, false);
      toast.success("Park created successfully!");
      // if (result.success) {
      //   resetForm();
      //   alert("facility created successfully!");
      // }
    } catch (error) {
      alert("Error creating Facility. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const validationSchema = Yup.object({
    // facilityName: Yup.string().required("Please enter facility name."),
    // displayName: Yup.string().required("Please enter display name."),
    // contactName: Yup.string().required("Please enter contact name."),
    // contactEmail: Yup.string()
    //   .email("Invalid email format")
    //   .required("Please enter contact email."),
    // contactNumber: Yup.string()
    //   .matches(/^\d+$/, "Contact number must be numeric")
    //   .required("Contact number is required"),
    // capacity: Yup.number()
    //   .positive("Capacity must be a positive number")
    //   .required("Please enter capacity."),
    // lastMaintenanceDate: Yup.date().required(
    //   "Please select last maintenance date."
    // ),
    // installationDate: Yup.date().required("Please select installation date."),
    // availabilityStatus: Yup.string().required(
    //   "Please select availability status."
    // ),
    // facilityCondition: Yup.string().required("Please enter facility condition."),
    // openTime: Yup.string().required("Please select open time."),
    // closeTime: Yup.string().required("Please select close time."),
  });
  return (
    <div className="container mx-auto mt-10">
      {/* <h2 className="text-black text-2xl font-bold mb-6">Facilities</h2> */}

      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg border border-gray-200">
        <ToastContainer position="top-right" autoClose={3000} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            onSubmit(values, actions, saveFacilityDetails)
          }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* Facility Name */}
                <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Facility Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Facility Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Display Name */}
                <div className="">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Display Name
                  </label>
                  <Field
                    type="text"
                    name="displayName"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.displayName && touched.displayName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Display Name"
                  />
                  <ErrorMessage
                    name="displayName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Contact Name */}
                <div className="">
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Contact Name
                  </label>
                  <Field
                    type="text"
                    name="contactName"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.contactName && touched.contactName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Contact Name"
                  />
                  <ErrorMessage
                    name="contactName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Contact Number */}
                <div className="">
                  <label
                    htmlFor="contactNumber"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Contact Number
                  </label>
                  <Field
                    type="text"
                    name="contactNumber"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.contactNumber && touched.contactNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Contact Number"
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Contact Email */}
                <div className="">
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Contact Email
                  </label>
                  <Field
                    type="email"
                    name="contactEmail"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.contactEmail && touched.contactEmail
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Contact Email"
                  />
                  <ErrorMessage
                    name="contactEmail"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Capacity */}
                <div className="">
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Capacity
                  </label>
                  <Field
                    type="number"
                    name="capacity"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.capacity && touched.capacity
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Capacity"
                  />
                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Availability Status */}
                <div className="">
                  <label
                    htmlFor="availabilityStatus"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Availability Status
                  </label>
                  <Field
                    as="select"
                    name="availabilityStatus"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.availabilityStatus && touched.availabilityStatus
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </Field>
                  <ErrorMessage
                    name="availabilityStatus"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Last Maintenance Date */}
                <div className="">
                  <label
                    htmlFor="lastMaintenanceDate"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Last Maintenance Date
                  </label>
                  <Field
                    type="date"
                    name="lastMaintenanceDate"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.lastMaintenanceDate && touched.lastMaintenanceDate
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter LastMaintenance Date"
                  />
                  <ErrorMessage
                    name="lastMaintenanceDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Facility Condition */}
                <div className="">
                  <label
                    htmlFor="facilityCondition"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Facility Condition
                  </label>
                  <Field
                    type="text"
                    name="facilityCondition"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.facilityCondition && touched.facilityCondition
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder=" Enter Facility Condition"
                  />
                  <ErrorMessage
                    name="facilityCondition"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Installation Date */}
                <div className="">
                  <label
                    htmlFor="installationDate"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Installation Date
                  </label>
                  <Field
                    type="date"
                    name="installationDate"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.installationDate && touched.installationDate
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Installation Date"
                  />
                  <ErrorMessage
                    name="installationDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Open Time */}
                <div className="">
                  <label
                    htmlFor="openTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Open Time
                  </label>
                  <Field
                    type="time"
                    name="openTime"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.openTime && touched.openTime
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Open Time"
                  />
                  <ErrorMessage
                    name="openTime"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Close Time */}
                <div className="">
                  <label
                    htmlFor="closeTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Close Time
                  </label>
                  <Field
                    type="time"
                    name="closeTime"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.closeTime && touched.closeTime
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Close Time"
                  />
                  <ErrorMessage
                    name="closeTime"
                    component="div"
                    className="text-red-500 text-xs mt-1"
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
                    name="isActive"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-start p-5">
                <button
                  type="submit"
                  className="bg-blue-v1 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition duration-300 ease-in-out focus:ring-4 focus:ring-blue-500 focus:outline-none"
                  disabled={isSaveFacilityDetailsLoading}
                >
                  {isSaveFacilityDetailsLoading
                    ? "Saving..."
                    : "Create Facility"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default FacilityCreate;
