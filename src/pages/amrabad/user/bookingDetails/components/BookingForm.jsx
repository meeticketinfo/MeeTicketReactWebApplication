import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useUserBookingStore } from "../../../../../store/amrabad/user/userBookingStore";

const initialValues = {
    firstName: "Sampath",
    lastName: "Bingi",
    email: "bingisampat@gmail.com",
    country: "India",
    address: "1234567890",
    town: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
    mobile: "9876543210",
    aadhar: "123456789012",
    message: "",
};

const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    country: Yup.string().required("Country is required"),
    address: Yup.string().required("Address is required"),
    town: Yup.string().required("Town is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
        .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
        .required("Pincode is required"),
    mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
    aadhar: Yup.string()
        .matches(/^\d{12}$/, "Aadhar number must be exactly 12 digits")
        .required("Aadhar number is required"),
    message: Yup.string(),
});

const BookingForm = ({ onSubmit }) => {
    const { GetCountries, GetStates, isCountriesLoading, isStatesLoading, fetchCountries, fetchStates } = useUserBookingStore();
    useEffect(() => {
        fetchCountries();
    }, []);

    const handleCountryChange = async (e, setFieldValue, setFieldTouched, validateField) => {
        const countryId = e.target.value;
        
        // Update field values
        await setFieldValue("country", countryId);
        await setFieldValue("state", "");
        
        // Mark fields as touched and validate
        setFieldTouched("country", true);
        setFieldTouched("state", true);
        
        // Validate the country field to clear error if valid
        await validateField("country");
        
        // Fetch states if country is selected
        if (countryId) {
            fetchStates(countryId);
        }
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, setFieldValue, setFieldTouched, validateField, values }) => (
                <Form id="booking-form" className="space-y-3 sm:space-y-4 w-full flex-1">
                    <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-black">
                        Billing Details
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <Field 
                                placeholder="Enter your first name" 
                                name="firstName" 
                                type="text" 
                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                            />
                            <ErrorMessage name="firstName" component="div" className="text-xs text-red-500" />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <Field 
                                placeholder="Enter your last name" 
                                name="lastName" 
                                type="text" 
                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                            />
                            <ErrorMessage name="lastName" component="div" className="text-xs text-red-500" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email Id <span className="text-red-500">*</span>
                        </label>
                        <Field 
                            placeholder="Enter your email" 
                            name="email" 
                            type="email" 
                            className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                        />
                        <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <Field 
                            as="select" 
                            name="country" 
                            value={values.country}
                            onChange={(e) => handleCountryChange(e, setFieldValue, setFieldTouched, validateField)}
                            className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm"
                        >
                            <option value=""> {isCountriesLoading ? "Loading..." : "Select Country"}</option>
                            {GetCountries.map((country) => (
                                <option key={country.countryId} value={country.countryId}>{country.countryName}</option>
                            ))}
                        </Field>
                        <ErrorMessage name="country" component="div" className="text-xs text-red-500" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <Field 
                            placeholder="Enter your address" 
                            name="address" 
                            type="text" 
                            className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                        />
                        <ErrorMessage name="address" component="div" className="text-xs text-red-500" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium mb-1">
                                Town <span className="text-red-500">*</span>
                            </label>
                            <Field 
                                placeholder="Enter your town" 
                                name="town" 
                                type="text" 
                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                            />
                            <ErrorMessage name="town" component="div" className="text-xs text-red-500" />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <Field 
                                as="select" 
                                name="state" 
                                value={values.state}
                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm"
                            >
                                <option value=""> {isStatesLoading ? "Loading..." : "Select State"}</option>
                                {GetStates.map((state) => (
                                    <option key={state.stateId} value={state.stateId}>{state.stateName}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="state" component="div" className="text-xs text-red-500" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium mb-1">
                                Pincode <span className="text-red-500">*</span>
                            </label>
                            <Field 
                                placeholder="Enter pincode" 
                                name="pincode" 
                                type="text" 
                                maxLength={6}
                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                                onKeyPress={(e) => {
                                    // Only allow numbers
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <ErrorMessage name="pincode" component="div" className="text-xs text-red-500" />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium mb-1">
                                Mobile <span className="text-red-500">*</span>
                            </label>
                            <Field 
                                placeholder="Enter your mobile number" 
                                name="mobile" 
                                type="text" 
                                maxLength={10} 
                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                                onKeyPress={(e) => {
                                    // Only allow numbers
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <ErrorMessage name="mobile" component="div" className="text-xs text-red-500" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Aadhar number <span className="text-red-500">*</span>
                        </label>
                        <Field
                            name="aadhar"
                            type="text"
                            placeholder="Enter 12 digit Aadhar number"
                            maxLength={12}
                            className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm"
                            onKeyPress={(e) => {
                                // Only allow numbers
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <ErrorMessage name="aadhar" component="div" className="text-xs text-red-500" />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-base font-semibold mb-3 text-black">
                            Additional Information
                        </h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Message if any (optional)
                            </label>
                            <Field
                                as="textarea"
                                name="message"
                                placeholder="Regarding concerns etc."
                                rows={4}
                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm resize-none"
                            />
                            <ErrorMessage name="message" component="div" className="text-xs text-red-500" />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default BookingForm; 