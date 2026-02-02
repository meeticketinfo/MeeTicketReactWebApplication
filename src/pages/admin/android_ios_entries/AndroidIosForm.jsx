import React from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getCurrentDate, getCurrentDateEndTime, getCurrentDateTimeWithSeconds } from '../../../utils/TypographyHelper';
import { LoginDashboardStore } from '../../../store/amarabad/login_dashboard/LoginDashboardStore';


const initialValues = {
    downloadCount: "",
    createdDate: getCurrentDateTimeWithSeconds()
};
const validationSchema = Yup.object({
    downloadCount: Yup.number().required("Count is required")
});

const AndroidIosForm = () => {

    const { UpdateAndroidIosCount, AndroidIosCountData, isAndroidIosCountLoading } = LoginDashboardStore();

    const onSubmit = async (values, { resetForm, setFieldValue }) => {
        console.log("values", values)
        try {
            const res = await UpdateAndroidIosCount(values);
            console.log("res", res.data.data.message)
            if (res.data.status === 200) {
                toast.success(res.data.data.message);
                resetForm({
                    values: {
                        downloadCount: "",
                        createdDate: getCurrentDate()
                    },
                    touched: {},
                    errors: {}
                });

            } else {
                toast.error("Failed to Add Count");

            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error.response?.data.title || error.response?.data);

        }
    };
    return (
        <>
            <AdminLayout>
                <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                    <div className="sm:flex sm:justify-between sm:items-center mb-4">
                        {/* Left: Title */}
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                                Andriod and IOS Entries
                            </h1>
                        </div>


                    </div>
                    {/* form */}
                    <div className="bg-gray-50 border p-2 shadow-lg rounded-lg w-1/3 mx-auto">
                        <ToastContainer position="top-right" autoClose={3000} />
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="grid grid-cols-1  gap-4 p-3">
                                        {/*Andriod  */}
                                        <div>
                                            <label
                                                htmlFor="downloadCount"
                                                className="block text-xs font-medium text-black "
                                            >
                                                App Dowanloads Count   <span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                name="downloadCount"
                                                maxLength={18}
                                                type="number"
                                                min="1"
                                                max="9999999999999999"
                                                onInput={(e) => {
                                                    if (e.target.value.length > 18) {
                                                        e.target.value = e.target.value.slice(0, 18);
                                                    }
                                                }}
                                                className={`mt-1 block w-full px-2 py-1 border border-gray-300  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                                                placeholder="App Dowanload Count"
                                            />
                                            <ErrorMessage
                                                name="downloadCount"
                                                component="div"
                                                className="text-red-500 text-xs"
                                            />
                                        </div>
                                    </div>
                                    {/* Submit Button */}
                                    <div className="flex justify-center p-2">
                                        <button
                                            type="submit"
                                            className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                                            disabled={isAndroidIosCountLoading}
                                        >
                                            {isAndroidIosCountLoading ? "Adding..." : "Add Entries"}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}

export default AndroidIosForm
