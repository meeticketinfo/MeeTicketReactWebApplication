import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useWalkerpassStore } from "./WalkerpassStore.jsx";
import useAuthStore from "../../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import {
    compressImageFile,
    fileToCompressedDataUrl,
    formatFileSize,
    storeWalkerPassImage,
} from "./walkerPassImageUtils";

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
            .required("Mobile Number is required")
            .matches(
                /^[6-9]/,
                "Mobile Number must start with 6, 7, 8, or 9"
            )
            .matches(
                /^[6-9][0-9]{9}$/,
                "Mobile Number must be exactly 10 digits"
            ),

        city: Yup.string()
            .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed")
            .max(25, "Maximum 25 characters allowed")
            .required("City is required"),

        walkerPassType: Yup.string()
            .required("Walker Pass Type is required"),

        residentialAddress: Yup.string()
            .max(100, "Maximum 100 characters allowed")
            .matches(
                /^[A-Za-z0-9\s,./#-]+$/,
                "Invalid address format"
            )
            .required("Residential Address is required"),
        idProof: Yup.mixed()
            .required("ID Proof is required")
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
    const [idProofCompressInfo, setIdProofCompressInfo] = useState(null);
    const [selfieCompressInfo, setSelfieCompressInfo] = useState(null);
    const [isIdProofCompressing, setIsIdProofCompressing] = useState(false);
    const [isSelfieCompressing, setIsSelfieCompressing] = useState(false);

    const [passes, setPasses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, setIsPassLoading] = useState(false);

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
    }, [parkId, getPassLocationMasters]);

    useEffect(() => {
        if (passLocationData?.service) {
            const normalService = passLocationData.service.find(
                (item) => item.name === "Normal Walkers pass"
            );
            const allPasses =
                normalService?.passes ||
                passLocationData.service.flatMap((item) => item.passes || []);

            setPasses(allPasses);
        }
    }, [passLocationData]);

    useEffect(() => {
        console.log("Available Passes:", passes);
    }, [passes]);

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

    const handleImageUpload = async (
        file,
        {
            fieldName,
            setFieldValue,
            setPreview,
            setCompressInfo,
            setCompressing,
            currentPreview,
        }
    ) => {
        if (!file) return;

        setCompressing(true);
        setCompressInfo(null);

        try {
            const result = await compressImageFile(file);
            setFieldValue(fieldName, result.file);

            if (currentPreview) {
                URL.revokeObjectURL(currentPreview);
            }

            setPreview(URL.createObjectURL(result.file));

            if (result.wasCompressed) {
                setCompressInfo({
                    originalSize: result.originalSize,
                    compressedSize: result.compressedSize,
                });
            }
        } catch (error) {
            console.error("Image compression failed:", error);
            toast.error("Unable to process image. Please try another file.");
            setFieldValue(fieldName, null);
            setCompressInfo(null);

            if (currentPreview) {
                URL.revokeObjectURL(currentPreview);
            }

            setPreview(null);
        } finally {
            setCompressing(false);
        }
    };

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
            formData.append("BookingSource", "web");

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

            const userImageBase64 = await fileToCompressedDataUrl(values.selfie);

            storeWalkerPassImage(
                response.passUserDetailsId,
                userImageBase64
            );

            // ADD HERE
            const selectedPass = passes.find(
                (pass) =>
                    String(pass.passLocationMasterId) === values.walkerPassType
            );

            navigate("/walker-pass-details", {
                state: {
                    ...values,
                    walkerPassTypeName: selectedPass?.passName,
                    parkId,
                    userImageBase64,
                    passUserDetailsId: response?.passUserDetailsId,
                },
            });

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
                    Book Walker's Pass
                </h2>


            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">


                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, setFieldTouched, setFieldError, values }) => (
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
                                        Date of Birth <span className="text-red-500">*</span>
                                    </label>

                                    <Field
                                        name="dateOfBirth"
                                        type="date"
                                        min="1900-01-01"
                                        max="2021-12-31"
                                        className="w-full h-8 border border-gray-300 rounded text-xs px-2 focus:outline-none focus:border-blue-500"
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;

                                            if (!selectedDate) {
                                                setFieldValue("dateOfBirth", "");
                                                setFieldValue("age", "");
                                                return;
                                            }

                                            setFieldValue("dateOfBirth", selectedDate);

                                            const date = new Date(`${selectedDate}T00:00:00`);
                                            const today = new Date();
                                            let age =
                                                today.getFullYear() -
                                                date.getFullYear();

                                            const monthDiff =
                                                today.getMonth() -
                                                date.getMonth();

                                            if (
                                                monthDiff < 0 ||
                                                (monthDiff === 0 &&
                                                    today.getDate() < date.getDate())
                                            ) {
                                                age--;
                                            }

                                            setFieldValue("age", age);
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
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");

                                                setFieldValue("mobileNumber", value);
                                                setFieldTouched("mobileNumber", true, false);

                                                // Show error immediately for first digit
                                                if (value.length > 0 && !/^[6-9]/.test(value)) {
                                                    setFieldError(
                                                        "mobileNumber",
                                                        "Mobile Number must start with 6, 7, 8, or 9"
                                                    );
                                                }
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

                                                {isIdProofCompressing && (
                                                    <p className="text-xs text-blue-600 mt-2">
                                                        Optimizing image...
                                                    </p>
                                                )}

                                                {!isIdProofCompressing && idProofCompressInfo && (
                                                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-2 text-center">
                                                        Image optimized from{" "}
                                                        {formatFileSize(idProofCompressInfo.originalSize)}{" "}
                                                        to{" "}
                                                        {formatFileSize(idProofCompressInfo.compressedSize)}{" "}
                                                        for upload.
                                                    </p>
                                                )}
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
                                                    (JPG/PNG)
                                                </p>
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            className="hidden"
                                            id="idProof"
                                            accept=".jpg,.png,.jpeg"
                                            disabled={isIdProofCompressing}
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];

                                                handleImageUpload(file, {
                                                    fieldName: "idProof",
                                                    setFieldValue,
                                                    setPreview: setIdProofPreview,
                                                    setCompressInfo: setIdProofCompressInfo,
                                                    setCompressing: setIsIdProofCompressing,
                                                    currentPreview: idProofPreview,
                                                });

                                                event.currentTarget.value = "";
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

                                                {isSelfieCompressing && (
                                                    <p className="text-xs text-blue-600 mt-2">
                                                        Optimizing image...
                                                    </p>
                                                )}

                                                {!isSelfieCompressing && selfieCompressInfo && (
                                                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-2 text-center">
                                                        Image optimized from{" "}
                                                        {formatFileSize(selfieCompressInfo.originalSize)}{" "}
                                                        to{" "}
                                                        {formatFileSize(selfieCompressInfo.compressedSize)}{" "}
                                                        for upload.
                                                    </p>
                                                )}
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
                                            accept=".jpg,.png,.jpeg"
                                            disabled={isSelfieCompressing}
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];

                                                handleImageUpload(file, {
                                                    fieldName: "selfie",
                                                    setFieldValue,
                                                    setPreview: setSelfiePreview,
                                                    setCompressInfo: setSelfieCompressInfo,
                                                    setCompressing: setIsSelfieCompressing,
                                                    currentPreview: selfiePreview,
                                                });

                                                event.currentTarget.value = "";
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
                                    disabled={isSubmitting || isIdProofCompressing || isSelfieCompressing}
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