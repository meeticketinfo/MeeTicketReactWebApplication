import { ErrorMessage, Field, Formik, Form, FieldArray } from 'formik'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFacilityStore } from '../../../../store/masters/facilitiesStore';
import { FacilityHolidayStore } from './FacilityHolidayStore';
import * as Yup from "yup";

const weekdaysStartingWithSunday = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
]
    ;

const CreateFacilityHolidays = ({ setIsCreate }) => {
    const { fetchAllFacilities, allFacilities } = useFacilityStore();
    const { FacilityHolidayEditDetails, saveFacilityHolidayDetails, setCurrentFacilityHolidayEditDetails, isSaveFacilityHolidayLoading } = FacilityHolidayStore();

    useEffect(() => {
        fetchAllFacilities();
    }, []);
    const initialValues = {
        facilityId: FacilityHolidayEditDetails ? FacilityHolidayEditDetails.facilityId : "",
        dayName: FacilityHolidayEditDetails ? FacilityHolidayEditDetails.listofBlockedDays.map(day => day.toLowerCase()) : [],
    }
     const validationSchema = Yup.object().shape({
        facilityId: Yup.string()
          .required("Facility is required"),
      
        // dayName: Yup.array()
        //   .min(1, "Please select at least one day")
        //   .required("Please select at least one day"),

      });

    const onSubmit = async (values,{ resetForm }) => {
        const AddValues = {
            masterFacilityId: values.facilityId,
            listofAvailableDays: values.dayName,
        }
        const EditValues = {
            facilityId: values.facilityId,
            listofAvailableDays: values.dayName,
        }

        const finalValues = FacilityHolidayEditDetails ? EditValues : AddValues
        const isEdit = FacilityHolidayEditDetails ? true : false
        try {
            const res = await saveFacilityHolidayDetails(finalValues, isEdit);

            if (res.data.status === 200) {

                console.log("res", res.data.status)
                toast.success(
                    isEdit
                        ? "Holiday Updated Successfully"
                        : "Holiday Created Successfully"
                );
                setTimeout(() => {
                    setIsCreate(false);
                    setCurrentFacilityHolidayEditDetails(null);
                    resetForm();
                }, 1000);
            } else {
                toast.error("something went wrong");
            }
        } catch (err) {
            console.log("err", err);
            toast.error(err.response.data|| err.response.data.message || err.message);
        }
    }
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
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

                                                    <span className="text-sm text-blue-v1 capitalize">{weekday}</span>
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
                                    {isSaveFacilityHolidayLoading ? "Loading..." : (FacilityHolidayEditDetails ? "Edit Blocked Facility" : "Block Facility")}
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
