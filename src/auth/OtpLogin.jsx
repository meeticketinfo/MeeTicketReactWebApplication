import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { bouncy } from "ldrs";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { API_BASE_URL } from "../constants/apiEndpoints";
import useAuthStore from "../store/authStore";
import { amrabadAuthStore } from "../store/amarabad/user/amrabadAuthStore";

const OtpLogin = ({ onOtpSent, startTimer }) => {
  bouncy.register();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setTokenType } = amrabadAuthStore();
  const { setRedirectError } = useAuthStore();
  const initialValues = {
    mobileNumber: "",
  };

  const validationSchema = Yup.object({
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .test(
        "is-valid-mobile",
        "Enter a valid 10-digit mobile number",
        (value) => {
          const mobileRegex = /^[0-9]{10}$/;
          return mobileRegex.test(value || "");
        }
      ),
  });

  const login = async (values) => {
    localStorage.clear();
    setTokenType(null);
    setLoading(true);
    setError(null);
    localStorage.setItem("login_id", values.mobileNumber);
    try {
      const response = await axios.post(
        `${API_BASE_URL}Authentication/SendLoginOTP`,
        values
      );
      onOtpSent(true);
      //  setUserId(true);
      if (response.status === 200) {
        if (response.data.status === 200) {
          localStorage.setItem("login_id", values.mobileNumber);
          startTimer();
        } else {
          setError(response.data.message || "Failed to send OTP");
          setRedirectError(response.data.message);
        }
      } else {
        setError(response.data.message || "Failed to send OTP");
        setRedirectError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setRedirectError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      {/* <ToastContainer /> */}
      <div className="w-full max-w-sm mx-auto">
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="">
              <div className="my-8">
                <label className="text-white text-sm">
                  Enter Mobile Number
                </label>
                <Field
                  className="shadow appearance-none border mt-2  h-12 px-4 bg-gray-100  border-gray-300 rounded-md w-full py-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="mobileNumber"
                  type="text"
                  maxLength={10}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                  placeholder=" Mobile number"
                />
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
                {!errors.mobileNumber && touched.mobileNumber && error && (
                  <div className="text-red-500 text-xs mt-1">{error}</div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className={`w-full h-12 flex justify-center items-center text-white rounded-lg transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 animate-pulse"
                      : "bg-blue-v1 hover:bg-blue-v2"
                  }`}
                  disabled={loading || isSubmitting}
                >
                  Send OTP
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default OtpLogin;
