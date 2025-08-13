import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    country: "INDIA",
    mobile: "",
    aadhar: "",
};

const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    country: Yup.string().required("Country is required"),
    mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
    aadhar: Yup.string()
        .matches(/^\d{12}$/, "Aadhar number must be exactly 12 digits")
        .required("Aadhar number is required"),
});

const BookingForm = ({ onSubmit }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting }) => (
                <Form id="booking-form" className="space-y-3 sm:space-y-4 w-full flex-1">
                    <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-black">
                        BILLING INFORMATION / Guest Details
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
                            Email <span className="text-red-500">*</span>
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
                            className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm"
                        >
                            <option value="INDIA">INDIA</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="CANADA">CANADA</option>
                            <option value="AUSTRALIA">AUSTRALIA</option>
                            <option value="NEW ZEALAND">NEW ZEALAND</option>
                            <option value="SOUTH AFRICA">SOUTH AFRICA</option>
                            <option value="GERMANY">GERMANY</option>
                        </Field>
                        <ErrorMessage name="country" component="div" className="text-xs text-red-500" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Mobile number <span className="text-red-500">*</span>
                        </label>
                        <Field 
                            placeholder="Enter your mobile number" 
                            name="mobile" 
                            type="text" 
                            maxLength={10} 
                            className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380] text-sm" 
                        />
                        <ErrorMessage name="mobile" component="div" className="text-xs text-red-500" />
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
                </Form>
            )}
        </Formik>
    );
};

export default BookingForm; 