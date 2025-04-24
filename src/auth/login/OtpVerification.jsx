import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { bouncy } from "ldrs";
import useAuthStore from "../../store/authStore";
// import VerificationImg from "../assets/svg/VerificationImg.svg";

const OtPVerification = ({ userId, onTokenReceived, startTimer, timeLeft }) => {
  const otpToastIdRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  bouncy.register();
  const navigate = useNavigate();
  const {
    isLoading,
    isAuthenticated,
    loginError,
    OtpLogin,
    setIsAuthenticated,
    setOtpError,
    otpError,
  } = useAuthStore();
  const mobileNumber = localStorage.getItem("login_id");
  // Validation schema for OTP input
  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
  });

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
    } else {
      setCanResend(false);
    }
  }, [timeLeft]);

  // Handle OTP change across multiple inputs
  const handleOtpChange = (e, index, setFieldValue, values) => {
    const { value } = e.target;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = values.otp.split("");
      newOtp[index] = value;
      setFieldValue("otp", newOtp.join(""));

      if (value !== "" && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus(); // Move to the next input
      }
    }
  };

  const handleKeyDown = (e, index, values) => {
    if (e.key === "Backspace") {
      if (!values.otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (values, { setFieldValue }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await OtpLogin({
        mobileNumber: mobileNumber,
        otp: values.otp,
      });
      console.log("response status", response.response.status);
      if (response.response.status != 409) {
        navigate("/dashboard");
        resetForm();
      } else {
        setOtpError(response.response.message);
        setFieldValue("otp", "");
      }
      setSubmitting(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    setLoading(true);
    setError(null);
    const mobileNumber = localStorage.getItem("login_id");

    try {
      const response = await axios.post(
        "https://meeticket.vmaxtechservices.life/parkapi/api/Authentication/SendLoginOTP",
        {
          mobileNumber,
        }
      );
      console.log("response", response);
      if (response.data.status === 200) {
        toast.success(` OTP sent successfully`, {
          autoClose: 1500,
        });

        // Reset the timer
        startTimer(); // This should reset your timer to the initial countdown state.

        // Reset canResend flag since we just sent a new OTP
        setCanResend(false);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="">
        <div className="w-full max-w-sm mx-auto my-4">
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
              <Form className="  otp_screen ">
                <div className="flex justify-center">
                  {/* <img alt="" src={VerificationImg} className="ml-2 mt-[2px]" /> */}
                </div>

                {/* -----------------------Modal header--------------------- */}
                <h3 className="text-base  text-center font-semibold text-white mb-4">
                  Verification
                </h3>
                {/* ------------------------Text------------------------- */}
                <div className="mb-4 text-sm text-white px-10 text-center">
                  <p>
                    Please enter the 6-digit code we have sent you to your
                    Mobile Number{" "}
                    <span className="text-white text-xs">{`+91 ${mobileNumber.slice(
                      0,
                      2
                    )}****${mobileNumber.slice(-2)}`}</span>
                  </p>
                </div>

                {/* --------------------Enter Code----------------------- */}
                <h3 className="text-base mt-4 text-center font-semibold text-white mb-4">
                  Enter Code
                </h3>
                <div className="flex gap-3 justify-center mb-2">
                  {[...Array(6)].map((_, index) => (
                    <Field
                      key={index}
                      name="otp"
                      render={({ field }) => (
                        <input
                          type="text"
                          maxLength={1}
                          value={values.otp[index] || ""}
                          onChange={(e) =>
                            handleOtpChange(e, index, setFieldValue, values)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index, values)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          className={`appearance-none border rounded-md w-12 h-12 bg-white/30 backdrop-blur-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.otp && touched.otp ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                  ))}
                </div>
                <span className="text-red-600">{otpError && otpError}</span>
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
                <p className="text-center text-white text-xs mt-2">
                  Didn't receive the OTP?&nbsp;
                  <span
                    className={`clr_link ${
                      canResend
                        ? "cursor-pointer text-blue-v1 underline font-bold"
                        : "text-gray-900 opacity-40 "
                    }`}
                    onClick={canResend ? handleResendOtp : undefined}
                  >
                    Resend
                  </span>
                  &nbsp;in {Math.floor(timeLeft / 60)}:
                  {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                </p>
                <div className="w-full py-3 mt-4 mb-4 text-dark bg-primary hover:bg-primary rounded-md text-base font-medium flex items-center justify-center">
                  <button
                    type="submit"
                    className={`w-full h-12 flex justify-center items-center text-white rounded-lg transition-all duration-300 ${
                      isSubmitting
                        ? "bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 animate-pulse"
                        : "bg-blue-v1 hover:bg-blue-v2"
                    }`}
                    disabled={loading || isSubmitting}
                  >
                    Verify <FaArrowRightLong className="ms-2 mt-0.5" />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OtPVerification;
