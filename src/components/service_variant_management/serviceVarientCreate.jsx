

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useEffect } from "react";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { toast } from "react-toastify";

// Validation schema using Yup


const ServiceVarientCreate = () => {
    const { saveServiceVarientDetails, isSaveServiceVarientDetailsLoading } = useServiceVariantStore();
    const { allServices, fetchAllServices } = useServiceStore();

    useEffect(() => {
        fetchAllServices();
    }, []);
    const initialValues = {
        name: "",
        serviceId: "",
        displayName: "",
        amount: 0,
        description: "",
    };

    const onSubmit = async (
        values,
        { setSubmitting, resetForm },
        saveServiceVarientDetails
    ) => {
        try {
            // Call the saveParkDetails function from the store
            const result = await saveServiceVarientDetails(values, false);
            console.log(result);
            // if (result.success) {
            //     toast.success("Service Varient created successfully!");
            //     resetForm(); // Optionally reset the form if needed
            // } else {
            //     toast.error("Failed to create Service Varient.");
            // }
            if (result.success) {
                resetForm();
                toast.success("service varient created successfully!");
            }
        } catch (error) {
            toast("Error creating service varient. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };
    const validationSchema = Yup.object({

    });
    return (
        <div className="container mx-auto mt-10">
            {/* <h2 className="text-black text-2xl font-bold mb-6">Facilities</h2> */}

            <div className="bg-zinc-50 p-2 shadow-lg rounded-lg border border-gray-200">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) =>
                        onSubmit(values, actions, saveServiceVarientDetails)
                    }
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">

                                 {/* Service */}
                                 <div>
                                    <label className="block text-sm font-medium"> Service</label>
                                    <Field
                                        as="select"
                                        name="serviceId"
                                        className={`mt-1 block w-full px-2 py-1 border ${errors.serviceId && touched.serviceId
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                    >
                                        <option value="">Select </option>
                                        {allServices.map((service) => (
                                            <option key={service.id } value={service.id}>
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

                                {/* Varient Name */}
                                <div className="">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Varient Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="name"
                                        className={`mt-1 block w-full px-2 py-1 border ${errors.name && touched.name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                        placeholder="Enter Varient Name"
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
                                        Amount
                                    </label>
                                    <Field
                                        type="number"
                                        name="amount"
                                        className={`mt-1 block w-full px-2 py-1 border ${errors.amount && touched.amount
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                        placeholder=" Enter Display Name"
                                    />
                                    <ErrorMessage
                                        name="amount"
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
                                        className={`mt-1 block w-full px-2 py-1 border ${errors.displayName && touched.displayName
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

                                {/* description */}
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium">
                                        Description
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className={`mt-1 block w-full px-2 py-1 border ${errors.description && touched.description
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

                            </div>

                            <div className="flex justify-start p-5">
                                <button
                                    type="submit"
                                    className="bg-blue-v1 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition duration-300 ease-in-out focus:ring-4 focus:ring-blue-500 focus:outline-none"
                                    disabled={isSaveServiceVarientDetailsLoading}
                                >
                                    {isSaveServiceVarientDetailsLoading ? "Saving..." : "Create Service Varient"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
export default ServiceVarientCreate;
