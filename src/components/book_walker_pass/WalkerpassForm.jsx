import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiPrinter } from "react-icons/fi";
import * as Yup from "yup";
import { useWalkerpassStore } from "./WalkerpassStore.jsx";
import useAuthStore from "../../store/authStore";
import { toast, ToastContainer } from "react-toastify";

const WalkerpassForm = () => {
    const navigate = useNavigate();
    const initialValues = {
        fullName: "",
        gender: "",
        mobileNumber: "",
        walkerPassType: "",

        dateOfBirth: "",
        age: "",
        city: "",
        residentialAddress: "",

        idProof: null,
        selfie: null,
    };

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .required("Full Name is required")
            .matches(
                /^[A-Z\s.'-]+$/,
                "Only alphabets and special characters (.,-', space) are allowed"
            )
            .max(25, "Maximum 25 characters allowed"),

        dateOfBirth: Yup.date()
            .required("Date of Birth is required")
            .min(
                new Date("1900-01-01"),
                "Date of Birth cannot be before 01/01/1900"
            )
            .max(
                new Date("2021-12-31"),
                "Date of Birth cannot be after 31/12/2021"
            ),

        gender: Yup.string()
            .required("Gender is required"),

        age: Yup.number()
            .min(5, "Minimum age should be 5")
            .max(120, "Maximum age should be 120")
            .required("Age is required"),

        mobileNumber: Yup.string()
            .matches(/^[0-9]{10}$/, "Mobile Number must be exactly 10 digits")
            .required("Mobile Number is required"),

        city: Yup.string()
            .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed")
            .max(25, "Maximum 25 characters allowed")
            .required("City is required"),

        walkerPassType: Yup.string()
            .required("Walker Pass Type is required"),

        residentialAddress: Yup.string()
            .max(100, "Maximum 100 characters allowed")
            .min(5, "Address should contain at least 5 characters")
            .required("Residential Address is required"),
        idProof: Yup.mixed()
            .required("ID Proof is required")
            .test(
                "fileType",
                "Only JPG, PNG and PDF files are allowed",
                (value) =>
                    !value ||
                    [
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                    ].includes(value.type)
            ).test(
                "fileSize",
                "File size should be less than 5 MB",
                (value) =>
                    !value || value.size <= 5 * 1024 * 1024
            ),

        selfie: Yup.mixed()
            .required("Selfie is required")
            .test(
                "fileType",
                "Only JPG and PNG files are allowed",
                (value) =>
                    !value ||
                    [
                        "image/jpeg",
                        "image/png",
                    ].includes(value.type)
            ).test(
                "fileSize",
                "File size should be less than 5 MB",
                (value) =>
                    !value || value.size <= 5 * 1024 * 1024
            )
    });

    const {
        addWalkerPass,
        getPassLocationMasters,
        passLocationData,
    } = useWalkerpassStore();

    const { decodedTokenData } = useAuthStore();
    console.log(decodedTokenData);
    const parkId = decodedTokenData?.data?.ParkId;
    const [idProofPreview, setIdProofPreview] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);

    const [amount, setAmount] = useState(0);
    const [passes, setPasses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPassLoading, setIsPassLoading] = useState(false);

    useEffect(() => {
        const fetchPasses = async () => {
            if (!parkId) return;

            try {
                setIsPassLoading(true);

                console.log("ParkId being sent:", parkId);
                await getPassLocationMasters(parkId);
            } catch (error) {
                console.error(error);
            } finally {
                setIsPassLoading(false);
            }
        };

        fetchPasses();
    }, [parkId]);

    useEffect(() => {
        console.log("PASS LOCATION DATA:", passLocationData);
        if (passLocationData?.service) {
            const normalService = passLocationData.service.find(
                (item) => item.name === "Normal Walkers pass"
            );

            if (normalService) {
                setPasses(normalService.passes);
            }
        }
    }, [passLocationData]);

    useEffect(() => {
        console.log("Available Passes:", passes);
    }, [passes]);

    const handleIdProofChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setIdProofPreview(URL.createObjectURL(file));
        }
    };

    const handleSelfieChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelfiePreview(URL.createObjectURL(file));
        }
    };
    const calculateAge = (dob) => {
        if (!dob) return "";

        const birthDate = new Date(dob);
        const today = new Date();

        let age =
            today.getFullYear() -
            birthDate.getFullYear();

        const monthDiff =
            today.getMonth() -
            birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 &&
                today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    useEffect(() => {
        return () => {
            if (idProofPreview) {
                URL.revokeObjectURL(idProofPreview);
            }

            if (selfiePreview) {
                URL.revokeObjectURL(selfiePreview);
            }
        };
    }, [idProofPreview, selfiePreview]);

    const handleSubmit = async (values) => {
        try {
            if (isSubmitting) return;
            setIsSubmitting(true);

            const parkId = decodedTokenData?.data?.ParkId;
            const formData = new FormData();

            formData.append("UserName", values.fullName);
            formData.append("DateOfBirth", values.dateOfBirth);
            formData.append("Gender", values.gender);
            formData.append("age", values.age);
            formData.append("MobileNumber", values.mobileNumber);
            formData.append("CityName", values.city);

            // Pass Location Master Id
            formData.append("PassLocationMasterId", Number(values.walkerPassType));

            formData.append(
                "ResidentialAddress",
                values.residentialAddress
            );

            formData.append("UserImage", values.selfie);
            formData.append("IdCardImage", values.idProof);
            formData.append("ParkId", parkId);

            formData.append("FatherOrHusbandName", "string");
            formData.append("Occupation", "string");
            formData.append("AadharCardNumber", "string");
            formData.append(
                "BookingDate",
                new Date().toISOString()
            );

            // Debugging
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }



            const response = await addWalkerPass(formData);

            if (!response?.passUserDetailsId) {
                throw new Error("Pass creation failed");
            }

            toast.success("Walker Pass Added Successfully!");

            setTimeout(() => {
                navigate("/walker-pass-details", {
                    state: {
                        ...values,
                        parkId,
                        passUserDetailsId:
                            response?.passUserDetailsId,
                    },
                });
            }, 1500);
        } catch (error) {
            console.error("Submit Error:", error);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Network error. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    return (

        <div className="p-10">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
            />

            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-gray-800">
                    Book Walker Pass
                </h2>


            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">


                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Full Name */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        name="fullName"
                                        type="text"
                                        maxLength={25}
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2 focus:outline-none focus:border-blue-500"
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .toUpperCase()
                                                .replace(/[^A-Z\s.'-]/g, "");

                                            setFieldValue("fullName", value);
                                        }}
                                    />
                                    <ErrorMessage
                                        name="fullName"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* DOB */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        Date Of Birth <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        name="dateOfBirth"
                                        type="date"
                                        min="1900-01-01"
                                        max="2021-12-31"
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2 focus:outline-none focus:border-blue-500"
                                        onChange={(e) => {
                                            const dob = e.target.value;

                                            setFieldValue("dateOfBirth", dob);

                                            if (dob) {
                                                const birthDate = new Date(dob);
                                                const today = new Date();

                                                let age =
                                                    today.getFullYear() - birthDate.getFullYear();

                                                const monthDiff =
                                                    today.getMonth() - birthDate.getMonth();

                                                if (
                                                    monthDiff < 0 ||
                                                    (monthDiff === 0 &&
                                                        today.getDate() < birthDate.getDate())
                                                ) {
                                                    age--;
                                                }

                                                setFieldValue("age", age);
                                            } else {
                                                setFieldValue("age", "");
                                            }
                                        }}
                                    />
                                    <ErrorMessage
                                        name="dateOfBirth"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        Gender <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        as="select"
                                        name="gender"
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>

                                    </Field>
                                    <ErrorMessage
                                        name="gender"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        Age <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        name="age"
                                        type="number"
                                        readOnly
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2 bg-gray-100"
                                    />
                                    <ErrorMessage
                                        name="age"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>

                                    <div className="flex items-center h-8 border border-gray-300 rounded overflow-hidden">
                                        <span className="px-3 text-xs bg-gray-100 h-full flex items-center border-r border-gray-300">
                                            +91
                                        </span>

                                        <Field
                                            name="mobileNumber"
                                            type="text"
                                            maxLength={10}
                                            className="flex-1 h-full px-2 text-xs outline-none border-none focus:ring-0"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                        />
                                    </div>

                                    <ErrorMessage
                                        name="mobileNumber"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                                {/* City */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        City <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        name="city"
                                        type="text"
                                        maxLength={25}
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2 focus:outline-none focus:border-blue-500"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
                                        }}
                                    />

                                    <ErrorMessage
                                        name="city"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Walker Pass Type */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        Walkers Pass Type <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        as="select"
                                        name="walkerPassType"
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2"
                                    >
                                        <option value="">Select</option>

                                        {passes.map((pass) => (
                                            <option
                                                key={pass.passLocationMasterId}
                                                value={String(pass.passLocationMasterId)}
                                            >
                                                {pass.passName}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="walkerPassType"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block mb-1 text-base font-medium text-gray-700">
                                        Residential Address <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        name="residentialAddress"
                                        type="text"
                                        maxLength={100}
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2 focus:outline-none focus:border-blue-500"
                                    />
                                    <ErrorMessage
                                        name="residentialAddress"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* ID Proof */}

                                <div className="mb-6">
                                    <label className="block mb-3 text-base font-medium text-gray-700">
                                        ID PROOF/Upload <span className="text-red-500">*</span>
                                    </label>

                                    <label
                                        htmlFor="idProof"
                                        className="border-2 border-dashed border-gray-300 rounded-md h-52 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
                                    >
                                        {idProofPreview ? (
                                            <>
                                                <img
                                                    src={idProofPreview}
                                                    alt="ID Proof Preview"
                                                    className="w-24 h-24 object-cover rounded-md border mb-3"
                                                />

                                                <p className="text-sm font-medium text-gray-700 text-center px-2 break-all">
                                                    {values.idProof?.name}
                                                </p>




                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-10 w-10 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>

                                                <p className="mt-3 text-base font-semibold text-gray-500">
                                                    Upload ID Proof
                                                </p>

                                                <p className="mt-3 text-base font-semibold text-gray-500">
                                                    (JPG/PNG/PDF)
                                                </p>
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            className="hidden"
                                            id="idProof"
                                            accept=".jpg,.png,.pdf"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];

                                                setFieldValue("idProof", file);

                                                if (file) {
                                                    setIdProofPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </label>



                                    <ErrorMessage
                                        name="idProof"
                                        component="div"
                                        className="text-red-500 text-xs mt-2"
                                    />

                                </div>

                                {/* SELFIE */}
                                <div>
                                    <label className="block mb-3 text-base font-medium text-gray-700">
                                        Selfie Upload <span className="text-red-500">*</span>
                                    </label>

                                    <label
                                        htmlFor="selfie"
                                        className="border-2 border-dashed border-gray-300 rounded-md h-52 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
                                    >
                                        {selfiePreview ? (
                                            <>
                                                <img
                                                    src={selfiePreview}
                                                    alt="Selfie Preview"
                                                    className="w-24 h-24 object-cover rounded-md border mb-3"
                                                />

                                                <p className="text-sm font-medium text-gray-700 text-center px-2 break-all">
                                                    {values.selfie?.name}
                                                </p>


                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-10 w-10 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>

                                                <p className="mt-3 text-base font-semibold text-gray-500">
                                                    Upload Selfie
                                                </p>

                                                <p className="mt-3 text-base font-semibold text-gray-500">
                                                    (JPG/PNG)
                                                </p>
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            className="hidden"
                                            id="selfie"
                                            accept=".jpg,.png"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];

                                                setFieldValue("selfie", file);

                                                if (file) {
                                                    setSelfiePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </label>

                                    <ErrorMessage
                                        name="selfie"
                                        component="div"
                                        className="text-red-500 text-xs mt-2"
                                    />





                                </div>
                            </div>
                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`text-white text-[14px] font-semibold px-6 py-2 rounded-md uppercase
        ${isSubmitting
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#09094D]"
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                />
                                            </svg>
                                            Submitting...
                                        </div>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>

        </div >
    );
};

export default WalkerpassForm;