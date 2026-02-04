import React from 'react'
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IntercityMasterStore } from './IntercityMasterStore';

const initialValues = {
    rtcCityId: "",
    cityName: "",

};
const validationSchema = Yup.object({
    rtcCityId: Yup.number().required("City ID is required"),
    cityName: Yup.string().required("City Name is required")

});

const AddIntercityCities = () => {
    const {AddIntercityCitits,isIntercityCititsLoading  } = IntercityMasterStore();

    const onSubmit = async (values, { resetForm, setFieldValue }) => {
        console.log("values", values)
        try {
            const res = await AddIntercityCitits(values);
            console.log("res", res.data.data.message)
            if (res.data.status === 200) {
                toast.success(res.data.data.message);
                resetForm({
                    values: {
                        rtcCityId: "",
                        cityName: "",
                    },
                    touched: {},
                    errors: {}
                });

            } else {
                toast.error("Failed to Add Cities");

            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error.response?.data.title || error.response?.data);

        }
    };
    return (
        <>
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
                                {/*City Id  */}
                                <div>
                                    <label
                                        htmlFor="rtcCityId"
                                        className="block text-xs font-medium text-black "
                                    >
                                       City ID    <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        name="rtcCityId"
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
                                        placeholder="Add ID"
                                    />
                                    <ErrorMessage
                                        name="rtcCityId"
                                        component="div"
                                        className="text-red-500 text-xs"
                                    />
                                </div>
                                {/*City Name  */}
                                <div>
                                    <label
                                        htmlFor="downloadCount"
                                        className="block text-xs font-medium text-black "
                                    >
                                        City Name   <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        name="cityName"
                                        maxLength={100}
                                        type="text"                                      
                                        className={`mt-1 block w-full px-2 py-1 border border-gray-300  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                                        placeholder="Add City"
                                    />
                                    <ErrorMessage
                                        name="cityName"
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
                                    disabled={isIntercityCititsLoading}
                                >
                                    {isIntercityCititsLoading ? "Adding..." : "Add Cities"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default AddIntercityCities
