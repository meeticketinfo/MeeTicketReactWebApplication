import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { amrabadAuthStore } from "../../../../store/amarabad/user/amrabadAuthStore";
import { toast } from "react-toastify";

const AmarabadLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPin, setShowPin] = useState(false);
  const { isLoggedIn, setIsLoggedIn, AmrabadLoginLoading, AmrabadLogin } =
    amrabadAuthStore();

  // Enhanced validation schema
  const LoginValidationSchema = Yup.object().shape({
    mobileNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
    pinNumber: Yup.string()
      .matches(/^\d{4}$/, "Enter a valid 4-digit PIN")
      .required("4-Digit Pin is required"),
  });

  const initialValues = { mobileNumber: "", pinNumber: "" };

  const handleSubmit = async (values,{resetForm}) => {
    try{
    const response = await AmrabadLogin(values);
    // console.log("responseee", response);
    if (response.data?.status === 200) {
      const redirectTo = location.state?.from?.pathname || "/amrabad-resort";
      navigate(redirectTo, { replace: true });
      setIsLoggedIn(true);
      resetForm();
      // toast.success("loggedin");
    }else{
      toast.info(response.data.data.message||"something went wrong");
    }
    }catch(error){
      console.log("error", error);
    }
  };

  // Function to handle input restrictions
  const handleMobileInput = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.preventDefault();
      return;
    }
    // Limit to 10 digits
    if (value.length > 10) {
      e.preventDefault();
      return;
    }
  };

  const handlePinInput = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.preventDefault();
      return;
    }
    // Limit to 4 digits
    if (value.length > 4) {
      e.preventDefault();
      return;
    }
  };

  // Function to handle paste events
  const handleMobilePaste = (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericOnly = pastedText.replace(/\D/g, ''); // Remove all non-digits
    const limitedNumeric = numericOnly.slice(0, 10); // Limit to 10 digits
    
    // Set the filtered value
    e.target.value = limitedNumeric;
    
    // Trigger change event for Formik
    const event = new Event('input', { bubbles: true });
    e.target.dispatchEvent(event);
  };

  const handlePinPaste = (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericOnly = pastedText.replace(/\D/g, ''); // Remove all non-digits
    const limitedNumeric = numericOnly.slice(0, 4); // Limit to 4 digits
    
    // Set the filtered value
    e.target.value = limitedNumeric;
    
    // Trigger change event for Formik
    const event = new Event('input', { bubbles: true });
    e.target.dispatchEvent(event);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors, values }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-base mb-2 text-black font-medium">
                Mobile Number <span className="text-red-500 ">*</span>
              </label>
              <div className="relative">
                <Field
                  name="mobileNumber"
                  id="mobileNumber"
                  type="text"
                  placeholder="Enter your mobile number"
                  maxLength={10}
                  onKeyPress={(e) => {
                    // Only allow numbers and backspace
                    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                  onInput={handleMobileInput}
                  onPaste={handleMobilePaste}
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                    touched.mobileNumber &&
                    !errors.mobileNumber &&
                    values.mobileNumber.length === 10
                      ? "border-green-500 focus:border-green-500"
                      : ""
                  }`}
                  autoComplete="off"
                />
                {/* Green check icon */}
                {touched.mobileNumber &&
                  !errors.mobileNumber &&
                  values.mobileNumber.length === 10 && (
                    <FaCheckCircle className="text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
              </div>
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="text-xs font-semibold text-red-500 mt-1"
              />
            </div>
            <div className="mb-8">
              <label className="block text-base mb-2 text-black font-medium">
                4-Digit Pin <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  name="pinNumber"
                  id="pinNumber"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter your 4-digit pin"
                  maxLength={4}
                  onKeyPress={(e) => {
                    // Only allow numbers and backspace
                    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                  onInput={handlePinInput}
                  onPaste={handlePinPaste}
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                    touched.pinNumber &&
                    !errors.pinNumber &&
                    values.pinNumber.length === 4
                      ? "border-green-500 focus:border-green-500"
                      : ""
                  }`}
                  autoComplete="off"
                />
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <button type="button" onClick={() => setShowPin(!showPin)}>
                    {showPin ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </span>
                {/* Green check icon */}
                {touched.pinNumber &&
                  !errors.pinNumber &&
                  values.pinNumber.length === 4 && (
                    <FaCheckCircle className="text-green-500 absolute right-8 top-1/2 -translate-y-1/2" />
                  )}
              </div>
              <div className="flex justify-between">
                <ErrorMessage
                  name="pinNumber"
                  component="div"
                  className="text-xs font-semibold text-red-500 mt-1"
                />
                <Link
                  to="/forget-pin-mobile"
                  className="text-[#362D86] text-sm font-normal"
                >
                  Forgot Pin?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={AmrabadLoginLoading}
              className={`text-lg w-full bg-[#362D86] text-white py-3 rounded-md font-semibold hover:bg-indigo-800 transition mb-4 ${AmrabadLoginLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {AmrabadLoginLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AmarabadLoginForm;
