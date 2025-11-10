import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import "tailwindcss/tailwind.css";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useServiceStore } from "../../store/masters/servicesStore";
import useAuthStore from "../../store/authStore";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";
import { MdDeleteForever } from "react-icons/md";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const daysOfWeek = [
  { value: "sun", label: "Sun" },
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
];

// Validation schema using Yup
const validationSchema = Yup.object({
  serviceId: Yup.string().required("Sub Facility is required"),
  startTime: Yup.string().required("Start Time is required"),
  endTime: Yup.string().required("End Time is required"),
  totalCapacity: Yup.number()
    .typeError("Total Capacity must be a number")
    .nullable()
    .required("Total Capacity is required")
    .positive("Total Capacity must be a positive number")
    .integer("Total Capacity must be an integer"),
  availableCapacity: Yup.number()
    .typeError("Available Capacity must be a number")
    .nullable()
    .required("Available Capacity is required")
    .positive("Available Capacity must be a positive number")
    .integer("Available Capacity must be an integer"),
  cutOffTime: Yup.number()
    .typeError("Cut-off Time must be a number")
    .nullable()
    .required("Cut-off Time is required")
    .max(60, "Cut-off Time cannot exceed 60 minutes")
    .min(0, "Cut-off Time must be a positive number"),
  status: Yup.string().required("Status is required"),
  isRecurring: Yup.boolean(),
  recurringStatus: Yup.string().when("isRecurring", {
    is: true,
    then: (schema) => schema.required("Recurring Status is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  recurringStartDate: Yup.string().when("isRecurring", {
    is: true,
    then: (schema) => schema.required("Recurring Start Date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  recurringEndDate: Yup.string().when("isRecurring", {
    is: true,
    then: (schema) => schema.required("Recurring End Date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const SlotCreate = () => {
  const { roleDetails } = useAuthStore();
  const role = roleDetails?.name;
  const { allServices, fetchAllServices } = useServiceStore();

  useEffect(() => {
    fetchAllServices(role);
  }, []);
  const initialValues = {
    serviceId: "",
    startTime: "",
    endTime: "",
    totalCapacity: null,
    availableCapacity: null,
    cutOffTime: null,
    status: "",
    description: "",
    isRecurring: false,
    recurringStatus: "",
    recurringStartDate: "",
    recurringEndDate: "",
    selectedDays: [],
  };

  const onSubmit = async (values, { resetForm }) => {
    console.log(values);

    // const payload = {
    //   passId: isWalkersPassEdit ? walkersPassEditDetails.passId : "",
    //   subfacility: values.serviceId,
    //   actualName: values.name,
    //   amount: values.amount,
    //   isPersonBased: values.isPriceFixed,
    //   passType: values.validityUnit,
    //   minimumAge: values.MinimumAge,
    //   maximumAge: values.MaximumAge,
    //   status: values.isActive,
    //   sequence: values.serviceVarientSequenceNumber,
    //   description: values.description,
    // };
    // try {
    //   const res = await saveWalkersPass(payload, isWalkersPassEdit);

    //   if (res.data.status === 200) {
    //     toast.success(
    //       isWalkersPassEdit
    //         ? "Walkers Park Pass Updated Successfully"
    //         : "Walkers Park Pass Created Successfully"
    //     );
    //     setTimeout(() => {
    //       setIsWalkersPassAdd(false);
    //       setCurrentWalkersPassEditDetails({});
    //       setIsWalkersPassEdit(false);
    //       resetForm();
    //       fetchAllUnifiedFacilities(role);
    //     }, 1000);
    //   } else {
    //     toast.error("something went wrong");
    //   }
    // } catch (err) {
    //   console.log("err", err);
    //   toast.error(err.response.data);
    // }
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
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <div className="">
                <div className="mb-3 flex gap-4 items-start border-b-2 border border-gray-200 rounded-2xl my-3 p-3">
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {/*sub facility  */}
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
                      </div>
                      {/* Start Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="startTime"
                          type="time"
                          placeholder="-- : --"
                          className={`mt-1 block w-full px-2 py-1 border ${
                            errors.startTime && touched.startTime
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          onChange={(e) => {
                            const startTime = e.target.value;
                            setFieldValue("startTime", startTime);

                            // Calculate end time as exactly 1 hour after start time
                            if (startTime) {
                              const [hours, minutes] = startTime
                                .split(":")
                                .map(Number);
                              let endHours = hours + 1;
                              let endMinutes = minutes;

                              // Handle hour overflow (24-hour format)
                              if (endHours >= 24) {
                                endHours = endHours % 24;
                              }

                              // Format back to HH:MM
                              const endTime = `${String(endHours).padStart(
                                2,
                                "0"
                              )}:${String(endMinutes).padStart(2, "0")}`;
                              setFieldValue("endTime", endTime);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="startTime"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* End Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="endTime"
                          type="time"
                          placeholder="-- : --"
                          className={`mt-1 block w-full px-2 py-1 border ${
                            errors.endTime && touched.endTime
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                        />
                        <ErrorMessage
                          name="endTime"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Total Capacity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Capacity <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="totalCapacity"
                          placeholder="No. of people allowed"
                          type="text"
                          className={`mt-1 block w-full px-2 py-1 border ${
                            errors.totalCapacity && touched.totalCapacity
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "Delete" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue(
                              "totalCapacity",
                              value === "" ? null : Number(value)
                            );
                          }}
                        />
                        <ErrorMessage
                          name="totalCapacity"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Available Capacity  */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Available Capacity
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="availableCapacity"
                          placeholder="Enter available capacity"
                          type="text"
                          className={`mt-1 block w-full px-2 py-1 border ${
                            errors.availableCapacity &&
                            touched.availableCapacity
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "Delete" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue(
                              "availableCapacity",
                              value === "" ? null : Number(value)
                            );
                          }}
                        />
                        <ErrorMessage
                          name="availableCapacity"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Cut-off Time for Booking (Minutes) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cut-off Time for Booking (Minutes)
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="cutOffTime"
                          placeholder="Enter cut-off time (max 60 Minutes)"
                          type="text"
                          className={`mt-1 block w-full px-2 py-1 border ${
                            errors.cutOffTime && touched.cutOffTime
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          onKeyDown={(e) => {
                            // Allow only numbers and navigation keys
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "Delete" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight" &&
                              e.key !== "Tab"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            // Only allow values up to 60
                            const numValue =
                              value === "" ? null : Number(value);
                            if (numValue === null || numValue <= 60) {
                              setFieldValue("cutOffTime", numValue);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="cutOffTime"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="select"
                          name="status"
                          className={`mt-1 block w-full px-2 py-1 border ${
                            errors.status && touched.status
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Recurring Slot Section */}
                    <div className="mb-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-3">
                        <Field
                          type="checkbox"
                          name="isRecurring"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ms-2 text-sm font-medium text-gray-900">
                          Repeat/Recurring Slot
                        </label>
                      </div>

                      {values.isRecurring && (
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Recurring Status{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              as="select"
                              name="recurringStatus"
                              className={`mt-1 block w-full px-2 py-1 border ${
                                errors.recurringStatus &&
                                touched.recurringStatus
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                            >
                              <option value="">Select Status</option>
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="recurringStatus"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Recurring Start Date{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              name="recurringStartDate"
                              type="date"
                              placeholder="mm/dd/yyyy"
                              className={`mt-1 block w-full px-2 py-1 border ${
                                errors.recurringStartDate &&
                                touched.recurringStartDate
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                            />
                            <ErrorMessage
                              name="recurringStartDate"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Recurring End Date{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              name="recurringEndDate"
                              type="date"
                              placeholder="mm/dd/yyyy"
                              className={`mt-1 block w-full px-2 py-1 border ${
                                errors.recurringEndDate &&
                                touched.recurringEndDate
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                            />
                            <ErrorMessage
                              name="recurringEndDate"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Select Days{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4 flex-wrap">
                              {daysOfWeek?.map((day) => {
                                const fieldName = "selectedDays";
                                const selectedDays = values.selectedDays || [];
                                const isChecked = selectedDays.includes(
                                  day.value
                                );

                                return (
                                  <div
                                    key={day.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const currentDays = selectedDays || [];
                                        let newDays;
                                        if (e.target.checked) {
                                          newDays = [...currentDays, day.value];
                                        } else {
                                          newDays = currentDays.filter(
                                            (d) => d !== day.value
                                          );
                                        }
                                        setFieldValue(fieldName, newDays);
                                      }}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ms-2 text-sm font-medium text-gray-900">
                                      {day.label}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center p-4">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  //   disabled={isSaveWalkrsPassDetailsLoading}
                >
                  {false ? "Saving..." : false ? "Update Slot" : "Add Slot"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default SlotCreate;
