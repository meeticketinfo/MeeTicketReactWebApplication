import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../../store/authStore";
// Validation schema using Yup

const FacilityCreate = ({ setIsFacilityCreateVisible }) => {
  const {
    saveFacilityDetails,
    isSaveFacilityDetailsLoading,
    facilityCreateResponse,
    FacilityDetails,
  } = useFacilityStore();
  const { isLoading, isAuthenticated, token, error, decodedTokenData, login } =
    useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;

  const initialValues = {
    name: "",
    displayName: "",
    contactName: "",
    contactNumber: "",
    contactEmail: "",
    capacity: null,
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
      capacity: values.capacity == null ? 0 : values.capacity,
      installationDate: values.installationDate
        ? new Date(values.installationDate).toISOString()
        : null,
      lastMaintenanceDate: values.lastMaintenanceDate
        ? new Date(values.lastMaintenanceDate).toISOString()
        : null,
    };

    try {
      // Call the saveFacilityDetails function from the store
      const result = await saveFacilityDetails(formattedValues, false);

      if (result.data.status === 200) {
        toast.success("Facility created successfully!");
        setTimeout(() => {
          setIsFacilityCreateVisible(false);
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

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Please enter facility name.")
      .max(50, "facility name should be less than 50 characters"),
    displayName: Yup.string()
      .required("Please enter display name.")
      .max(50, "display name should be less than 50 characters"),
    contactName: Yup.string()
      .required("Please enter Contact Name.")
      .max(50, "contact name should be less than 50 characters"),
    contactEmail: Yup.string().email("Invalid email format"),
    contactNumber: Yup.string()
      .required("Please enter Contact Number.")
      .matches(/^\d+$/, "Contact number must be numeric")
      .max(10, "contact name should be 10 numbers"),

    capacity: Yup.number()
      .nullable()
      .test(
        "is-positive",
        "Capacity must be a positive number",
        (value) => value == null || value >= 0
      ),

    // lastMaintenanceDate: Yup.date().required(
    //   "Please select last maintenance date."
    // ),
    // installationDate: Yup.date().required("Please select installation date."),
    // availabilityStatus: Yup.string().required(
    //   "Please select availability status."
    // ),
    facilityCondition: Yup.string().max(
      50,
      "contact name should be less than 50 characters"
    ),
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

              <div className="flex justify-center p-5">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
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
