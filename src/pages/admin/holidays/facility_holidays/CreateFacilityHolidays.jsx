import { ErrorMessage, Field, Formik, Form, FieldArray } from 'formik'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFacilityStore } from '../../../../store/masters/facilitiesStore';

const weekdaysStartingWithSunday =[
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ]
  ;

const CreateFacilityHolidays = () => {
    const { fetchAllFacilities, allFacilities } = useFacilityStore();
    useEffect(() => {
        fetchAllFacilities();
    }, []);
    const initialValues = {
        facilityId: "",
        dayName: [],
    }

    const onSubmit = (values) => {
        const finalValues = {
            masterFacilityId: values.facilityId,
            listofAvailableDays: values.dayName,

        }
        console.log("finalValues", finalValues)
    }
    return (
        <>
            <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, }) => (
                    <Form>
                        {/* Card */}
                        <div className="bg-white rounded-xl shadow-md border p-5">

                            {/* Form grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                {/* Facility */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Facility <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        as="select"
                                        name="facilityId"
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="">Select Facility</option>
                                        {allFacilities
                                            ?.filter((facility) => facility.isActive || facility.isCounterEnable)
                                            ?.map((facility) => (
                                                <option key={facility.id} value={facility.id}>
                                                    {facility.name}
                                                </option>
                                            ))}
                                    </Field>
                                    <ErrorMessage
                                        name="facilityId"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                            </div>

                            {/* Days */}
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                    Select Days
                                </p>

                                <FieldArray name="dayName">
                                    {({ push, remove }) => (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                            {weekdaysStartingWithSunday.map((weekday) => (
                                                <label
                                                    key={weekday}
                                                    className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3  py-1.5 cursor-pointer hover:bg-blue-50 transition"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={weekday}
                                                        checked={values.dayName.includes(weekday)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                push(weekday);
                                                            } else {
                                                                remove(values.dayName.indexOf(weekday));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-v2 rounded focus:outline-none focus:ring-0"
                                                    />

                                                    <span className="text-sm text-blue-v1">{weekday}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-v1 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition shadow"
                                >
                                    Add Holiday
                                </button>
                            </div>

                        </div>
                    </Form>

                )}
            </Formik>
        </>
    )
}

export default CreateFacilityHolidays
