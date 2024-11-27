import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css";
import FormWrapperCard from "../FormWrapperCard";
import { toast, ToastContainer } from "react-toastify";

const validationSchema = Yup.object({
  weekdays: Yup.array()
    .of(Yup.string())
    .min(1, "At least one weekday must be selected"),
});

export default function RecurringHolidayCreate() {
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
    <FormWrapperCard>
      <ToastContainer position="top-right" autoClose={3000} />
      <div>
        <h1 className="font-bold text-lg">Select Recurring Weekdays</h1>
      </div>
      <Formik
        initialValues={{
          weekdays: [],
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form values:", values);
          toast.success("Holiday added successfully!");
        }}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
              {/* Weekdays Checkboxes */}
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700"></label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {weekdaysStartingWithSunday.map((weekday) => (
                    <div key={weekday} className="flex items-center">
                      <Field
                        type="checkbox"
                        id={weekday}
                        name="weekdays"
                        value={weekday}
                        className="hidden"
                      />
                      <label
                        htmlFor={weekday}
                        className={`ml-2 text-sm font-medium text-gray-700 px-2 py-3 border w-full text-center rounded-lg cursor-pointer 
                          ${
                            values.weekdays.includes(weekday)
                              ? "bg-blue-v1 text-white border-blue-500"
                              : "border-gray-400"
                          }`}
                      >
                        {weekday}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.weekdays && touched.weekdays && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.weekdays}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center p-5">
              <button
                type="submit"
                className="bg-blue-v1 text-base text-white rounded-lg px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWrapperCard>
  );
}
