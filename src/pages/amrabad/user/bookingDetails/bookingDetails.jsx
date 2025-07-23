import UserLayout from "../../../../layouts/UserLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Mock booking data (replace with real data as needed)
const bookingData = {
    houseName: "CHITAL AND OTTER",
    image: "https://amrabadtigerreserve.com/wp-content/uploads/2023/01/20230412_162323-1024x768.jpg",
    checkIn: "19 MAY 2025",
    checkOut: "21 MAY 2025",
    noOfHouses: 1,
    subTotal: 6175,
};

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

const AmarabadBookingDetails = () => {
    const navigate = useNavigate();
    const handleSubmit = (values, { setSubmitting }) => {
        // Payment logic here
        // alert("Booking submitted!\n" + JSON.stringify(values, null, 2));
        setSubmitting(false);
        navigate("/amarabad/confirmed-details/1234567890");
    };

    return (
        <UserLayout>
            <div className="container mx-auto py-8">
                <div className="">
                    {/* Left: Billing/Guest Details Form */}
                    <div className="bg-white rounded-lg p-8 flex flex-col md:flex-row gap-8">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <>
                                    <Form id="booking-form" className="space-y-4 w-full flex-1">
                                        <h2 className="text-lg font-semibold mb-6 text-black">BILLING INFORMATION / Guest Details</h2>
                                        <div className="flex gap-4">
                                            <div className="w-1/2">
                                                <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                                                <Field placeholder="Enter your first name" name="firstName" type="text" className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380]" />
                                                <ErrorMessage name="firstName" component="div" className="text-xs text-red-500" />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                                                <Field placeholder="Enter your last name" name="lastName" type="text" className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380]" />
                                                <ErrorMessage name="lastName" component="div" className="text-xs text-red-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                                            <Field placeholder="Enter your email" name="email" type="email" className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380]" />
                                            <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Country <span className="text-red-500">*</span></label>
                                            <Field as="select" name="country" className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380]">
                                                <option value="INDIA">INDIA</option>
                                                <option value="USA">USA</option>
                                                <option value="UK">UK</option>
                                                <option value="CANADA">CANADA</option>
                                                <option value="AUSTRALIA">AUSTRALIA</option>
                                                <option value="NEW ZEALAND">NEW ZEALAND</option>
                                                <option value="SOUTH AFRICA">SOUTH AFRICA</option>
                                                <option value="GERMANY">GERMANY</option>
                                                {/* Add more countries as needed */}
                                            </Field>
                                            <ErrorMessage name="country" component="div" className="text-xs text-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Mobile number <span className="text-red-500">*</span></label>
                                            <Field placeholder="Enter your mobile number" name="mobile" type="text" maxLength={10} className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380]" />
                                            <ErrorMessage name="mobile" component="div" className="text-xs text-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Aadhar number <span className="text-red-500">*</span></label>
                                            <Field
                                                name="aadhar"
                                                type="text"
                                                placeholder="Enter 12 digit Aadhar number"
                                                maxLength={12}
                                                className="w-full border border-[#D1D1D3] rounded px-3 py-2 bg-[#EEECF380]"
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
                                </>
                            )}
                        </Formik>

                        {/* Right: Booking Summary & Payment */}
                        <div className="flex-1 max-w-[450px] w-full flex flex-col gap-6">
                            {/* Booking Summary */}
                            <div className="bg-[#EEEDFA] rounded-lg p-6 border border-[#C0C0C5]">
                                <div className="flex items-start gap-4 mb-4">
                                    <img src={bookingData.image} alt={bookingData.houseName} className="w-16 h-12 object-cover rounded" />
                                    <div className="flex-1">
                                        <div className="font-bold text-lg text-gray-800">{bookingData.houseName}</div>
                                    </div>
                                </div>

                                <div className="border-t border-[#C0C0C5] pt-4 mb-4">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="font-semibold text-gray-700 mb-1">CHECK-IN</div>
                                            <div className="text-gray-600">{bookingData.checkIn}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-700 mb-1">CHECK-OUT</div>
                                            <div className="text-gray-600">{bookingData.checkOut}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-700 mb-1">NO. OF HOUSES</div>
                                            <div className="text-gray-600">0{bookingData.noOfHouses}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#C0C0C5] pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800">SUB-TOTAL</span>
                                        <span className="font-bold text-[#362D86] text-lg">₹{bookingData.subTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white rounded-lg p-6 border border-[#C0C0C5]">
                                <div className="flex items-center gap-3 mb-2">
                                    <img src="https://1000logos.net/wp-content/uploads/2023/03/Paytm-logo.png" alt="Paytm" className="w-28 h-auto object-contain" />
                                    <span className="font-medium text-[#362D86]">Payment Gateway</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-4">
                                    The best payment gateway provider in India for e-payment through <span className="font-semibold text-gray-800">Paytm Postpaid, Paytm Wallet, UPI, Credit Card, Debit Card and Netbanking</span>
                                </p>
                            </div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <button
                                        type="submit"
                                        form="booking-form"
                                        className="w-full flex items-center justify-center gap-2 bg-[#362D86] hover:bg-indigo-800 text-white font-semibold py-3 rounded-md transition-colors duration-200 disabled:opacity-60"
                                        disabled={isSubmitting}
                                    >
                                        <FaCreditCard className="text-lg" />
                                        PAY&nbsp; ₹{bookingData.subTotal.toLocaleString()}
                                    </button>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default AmarabadBookingDetails; 