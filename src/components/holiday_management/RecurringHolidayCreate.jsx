import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css";
import FormWrapperCard from "../FormWrapperCard";
import { toast, ToastContainer } from "react-toastify";
import { useHolidayStore } from "../../store/masters/holidayStore";
import DashboardCard07 from "../../partials/dashboard/DashboardCard07";
import { useEffect } from "react";

const validationSchema = Yup.object({
  dayName: Yup.array()
    .of(Yup.string())
    .min(1, "At least one weekday must be selected"),
});

export default function RecurringHolidayCreate() {
  const {
    saveRecurringHolidayDetails,
    isSaveRecurringHolidayDetailsLoading,
    fetchAllRecurringHolidays,
    allRecurringHolidays,
  } = useHolidayStore();

  useEffect(() => {
    fetchAllRecurringHolidays();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const formattedValues = {
      dayNames: values.dayName, // Only selected days will be in this array
    };

    try {
      const result = await saveRecurringHolidayDetails(formattedValues, false);
      if (result && result.data && result.data.status === 200) {
        toast.success("Recurring Holiday created successfully!");
        resetForm();
        fetchAllRecurringHolidays();
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      console.log("xhr.errors:", xhr);
      if (xhr?.response?.data?.errors) {
        Object.keys(xhr.response.data.errors).forEach((key) => {
          if (Array.isArray(xhr.response.data.errors[key])) {
            toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
          }
        });
      } else {
        toast.error(xhr.response?.data?.data || "An error occurred.");
      }
    }
  };

  const weekdaysStartingWithSunday = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return (
    <div className="mt-5">
      <DashboardCard07 header={true} title="Add Recurring Weekdays">
        <div className="bg-white rounded-md">
          <Formik
            initialValues={{
              dayName: allRecurringHolidays || [], // Pre-selected holidays
            }}
            enableReinitialize
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                  <div className="col-span-2">
                    <FieldArray name="dayName">
                      {({ push, remove }) => (
                        <div>
                          {weekdaysStartingWithSunday.map((weekday) => (
                            <div
                              key={weekday}
                              className="flex items-center mb-2"
                            >
                              <input
                                type="checkbox"
                                id={weekday}
                                name="dayName"
                                value={weekday}
                                checked={values.dayName.includes(weekday)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    push(weekday);
                                  } else {
                                    remove(values.dayName.indexOf(weekday));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-100 outline-none border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor={weekday}
                                className="ml-2 text-md font-medium text-gray-700 cursor-pointer border-gray-400"
                              >
                                {weekday}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>

                <div className="flex justify-center p-5">
                  <button
                    type="submit"
                    className="bg-blue-v1 text-base text-white rounded-lg px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1"
                    disabled={isSaveRecurringHolidayDetailsLoading}
                  >
                    {isSaveRecurringHolidayDetailsLoading
                      ? "Submitting..."
                      : "Save"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DashboardCard07>
    </div>
  );
}
