import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import headerLogo from "../../images/Telangana-logo.png";
import cmImg from "../../images/chief_minister.png";
import ITMinisterImg from "../../images/it_minister.png";
import meetickesTelanganaImg from "../../images/meetickets-telangana.png";
import Loader from "../../web_app_loaders/Loader";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import useCaptchaStore from "../../store/useCaptchaStore";
import { FaRedo, FaEye, FaEyeSlash } from "react-icons/fa";
import CryptoJS from "crypto-js";
import "./Login.css";
import { bouncy } from "ldrs";
import OtpLogin from "../OtpLogin";
import MainOtpLogin from "./MainOtpLogin";
import { amrabadAuthStore } from "../../store/amarabad/user/amrabadAuthStore";
import bcrypt from "bcryptjs";
const Login = () => {
  bouncy.register();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, loginError, login, setOtpError } =
    useAuthStore();
  const AES_KEY = "Q29kZXhTYW1wbGVLZXlGb3JBRVMyNTYhISEhISEhISE=";
  const key = CryptoJS.enc.Base64.parse(AES_KEY);
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
  const encryptAES = (text) => {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(text),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }

  const { setTokenType } = amrabadAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneSelected, setIsPhoneSelected] = useState(false);

  const {
    captchaInput,
    captchaError,
    loadCaptcha,
    updateCaptchaInput,
    validateCaptchaInput,
    CaptchaData,
    GetCaptcha,
  } = useCaptchaStore();

  const initialValues = {
    EmailId: "",
    password: "",
  };

  const validationSchema = Yup.object({
    EmailId: Yup.string()
      .email("Enter a valid email address")
      .required("Email Id is required"),

    password: Yup.string().required("Password is required"),
  });

  // useEffect(() => {
  //   loadCaptcha();
  // }, [loadCaptcha]);

  useEffect(() => {
    // Ensure the DOM is ready before loading captcha
    const canvasExists = document.querySelector("canvas");
    if (canvasExists) {
      loadCaptcha();
    }
  }, []);

  useEffect(() => {
    GetCaptcha()
  }, []);

  const encryptPayload = (payload) => {
  const jsonString = JSON.stringify(payload);
  return encryptAES(jsonString);
};

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    localStorage.clear();

    setTokenType(null);

    try {


     const normalPayload = {
      EmailId: values.EmailId,
      password: values.password,
      CaptchaToken: CaptchaData?.captchaToken,
      CaptchaAnswer: captchaInput,
    };

    // ✅ Encrypt Whole Payload
    const encryptedData = encryptPayload(normalPayload);

    // ✅ Final Payload (Only Encrypted Data)
    const payload = {
      data: encryptedData,
    };

      const response = await login(payload);

      if (response.success) {
        resetForm();
        navigate("/dashboard");
      } else {
        GetCaptcha();
        updateCaptchaInput("");
      }
    } catch (err) {
      console.error(err);
    }

    setSubmitting(false);
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("auth-store");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Only reload captcha when switching to the phone tab
    if (isPhoneSelected) {
      loadCaptcha();
    }
  }, [isPhoneSelected, loadCaptcha]);

  const handleToggle = () => {
    setOtpError(null);
    setIsPhoneSelected((prevState) => !prevState);
    if (!isPhoneSelected) {
      loadCaptchaEnginge(6, "#a8b4c4", "rgb(107 114 128 / 1)", "upper");
    }
  };
  return (
    <>
      <div className="min-h-screen flex flex-col bg-blue-v1 p-4  overflow-hidden">
        <div className="absolute bg-blue-800 w-80 h-80 rounded-full opacity-30 -top-36 -left-20" />
        {/* <div className="absolute bg-blue-800 w-40 h-40 rounded-full opacity-20 top-40 -right-20" /> */}
        <div className="absolute bg-blue-800 w-80 h-80 rounded-full opacity-20 top-10 right-80" />
        <div className="absolute bg-blue-800 w-48 h-48 rounded-full opacity-25 -bottom-2 left-0" />
        {/* Header */}
        <div className="container-fluid p-3 bg-blue-v1 rounded-[20px] text-gray-200 shadow-lg backdrop-blur-sm bg-white/30 ">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Mobile Layout - First Row: Government of Telangana Logo and Details */}
            <div className="flex lg:hidden items-center justify-center w-full mb-3">
              <div className="flex items-center space-x-2">
                <img alt="site-logo" src={headerLogo} width={40} height={40} />
                <div>
                  <p className="text-base font-semibold">Government of Telangana</p>
                  <small className="text-sm">ITE&C Department</small>
                </div>
              </div>
            </div>

            {/* Mobile Layout - Second Row: CM and Details */}
            <div className="flex lg:hidden items-center justify-center w-full mb-3">
              {/* Chief Minister Section */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-base font-semibold">Sri A. Revanth Reddy</p>
                  <span className="block text-sm leading-tight">
                    Hon'ble Chief Minister <br /> Government of Telangana
                  </span>
                </div>
                <img
                  src={cmImg}
                  alt="CM"
                  className="w-16 h-20 rounded-[20px] border-2 border-gray-100"
                />
              </div>
            </div>

            {/* Mobile Layout - Third Row: IT Minister and Details */}
            <div className="flex lg:hidden items-center justify-center w-full">
              {/* IT Minister Section */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-base font-semibold">Sri D. Sridhar Babu</p>
                  <span className="block text-sm leading-tight">
                    Hon'ble Minister for IT <br /> Government of Telangana
                  </span>
                </div>
                <img
                  src={ITMinisterImg}
                  alt="Minister"
                  className="w-16 h-20 rounded-[20px] border-2 border-gray-100"
                />
              </div>
            </div>

            {/* Desktop Layout - Original Structure */}
            <div className="hidden lg:flex items-center space-x-2">
              <img alt="site-logo" src={headerLogo} width={40} height={40} />
              <div>
                <p className="text-lg font-semibold">Government of Telangana</p>
                <small className="text-[10px]">ITE&C Department</small>
              </div>
            </div>

            {/* Desktop Layout - Second Column */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Chief Minister Section */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">Sri A. Revanth Reddy</p>
                  <span className="block text-xs leading-tight">
                    Hon'ble Chief Minister <br /> Government of Telangana
                  </span>
                </div>
                <img
                  src={cmImg}
                  alt="CM"
                  className="w-16 h-20 rounded-[20px] border-2 border-gray-100"
                />
              </div>

              {/* IT Minister Section */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">Sri D. Sridhar Babu</p>
                  <span className="block text-xs leading-tight">
                    Hon'ble Minister for IT <br /> Government of Telangana
                  </span>
                </div>
                <img
                  src={ITMinisterImg}
                  alt="Minister"
                  className="w-16 h-20 rounded-[20px] border-2 border-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex-1 flex items-center justify-between py-5">
          <div className=" w-full flex flex-col lg:flex-row  items-center justify-between">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 flex justify-center ">
              <img
                src={meetickesTelanganaImg}
                alt="MeeTicket Telangana"
                className="w-full max-w-sm rounded-lg"
              />
            </div>

            {/* Form Section */}
            <div autoComplete="off" className="w-full lg:w-1/2 max-w-md ">
              <div className=" rounded-[20px] p-4  backdrop-blur-sm bg-white/30 mb-3">
                <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
                  Welcome to MeeTicket
                </h2>
                {/* toggle logic */}
                <div className="relative px-1 shadow-lg w-full h-12 py-1 bg-white rounded-md overflow-hidden border border-gray-300 ">
                  <input
                    id="toggle"
                    type="checkbox"
                    className="peer hidden"
                    checked={isPhoneSelected}
                    onChange={handleToggle}
                  />
                  <label
                    htmlFor="toggle"
                    className="flex w-full h-full items-center justify-between text-black cursor-pointer relative"
                  >
                    {/* Highlight Effect */}
                    <div
                      className={`absolute top-0 h-full w-1/2 bg-blue-v1 rounded-md transition-transform duration-500 ease-in-out`}
                      style={{
                        transform: isPhoneSelected
                          ? "translateX(100%)"
                          : "translateX(0%)",
                      }}
                    ></div>

                    {/* Tab 1: Login with Phone */}
                    <span
                      className={`relative w-1/2 text-center text-sm font-bold py-2 z-10 transition-all duration-500 ease-in-out ${isPhoneSelected ? "text-gray-600" : "text-white"
                        }`}
                    >
                      Officer
                    </span>

                    {/* Tab 2: Login with Email */}
                    <span
                      className={`relative w-1/2 text-center text-sm py-2 font-bold z-10 transition-all duration-500 ease-in-out ${isPhoneSelected ? "text-white" : "text-gray-600"
                        }`}
                    >
                      Admin
                    </span>
                  </label>
                </div>

                {/* render pages */}
                <div>
                  {!isPhoneSelected ? (
                    <MainOtpLogin />
                  ) : (
                    <div className="mt-4">
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting }) => (
                          <Form>
                            {/* Username Field */}
                            <div className="mb-6">
                              <label
                                htmlFor="EmailId"
                                className="block text-sm font-medium text-gray-100 mb-1"
                              >
                                Email
                              </label>
                              <Field
                                id="EmailId"
                                name="EmailId"
                                placeholder="Enter your Email ID"
                                autoComplete="off"
                                className="shadow-lg w-full h-12 px-4 bg-gray-100 border border-gray-300 rounded-lg outline-none focus:border-blue-v1 focus:bg-gray-100 transition duration-300"
                              />
                              <ErrorMessage
                                name="EmailId"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Password Field */}
                            <div className="mb-6">
                              <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-100 mb-1"
                              >
                                Password
                              </label>
                              <Field
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="off"
                                className="w-full h-12 px-4 shadow-lg  bg-gray-100 border border-gray-300 rounded-lg outline-none focus:border-blue-v1 focus:bg-gray-200 transition duration-300"
                              />
                              {/* <div
                      className="absolute right-6 top-10 transform -translate-y-1/6 py-4 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </div> */}
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                            <div className="flex justify-center mb-3">
                              {/* Captcha Section */}
                              <div className="flex items-center mb-6backdrop-blur-sm bg-white/30  rounded-lg border border-gray-300">
                                <div className="relative flex items-center flex-row-reverse ">
                                  <img
                                    src={CaptchaData?.imageBase64}
                                    alt="captcha"
                                    width={160}
                                    height={50}
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="flex items-center justify-center p-3 text-blue-v1"
                                  onClick={() =>
                                    GetCaptcha()
                                  }
                                >
                                  <FaRedo size={16} />
                                </button>
                                <div className="flex items-center backdrop-blur-sm bg-white/30 rounded-lg border border-gray-300">
                                  <input
                                    type="text"
                                    placeholder="Enter Captcha"
                                    value={captchaInput}
                                    onChange={(e) =>
                                      updateCaptchaInput(e.target.value)
                                    }
                                    className="w-full h-12 px-4 shadow-lg backdrop-blur-sm bg-white/30 bg-blue-50 border border-gray-300 rounded-lg outline-none focus:border-blue-v1 focus:bg-gray-100 transition duration-300"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex text-center justify-center">
                              {loginError && (
                                <small className="text-red-500 text-center mb-4 text-shadow shadow-color-blue">
                                  {loginError}
                                </small>
                              )}
                            </div>
                            <div className="text-center">
                              {captchaError && (
                                <small className="text-red-500 text-center  mb-4">
                                  {captchaError}
                                </small>
                              )}
                            </div>

                            {/* Submit Button */}
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className={`w-full h-12 flex justify-center items-center text-white rounded-lg transition-all duration-300 ${isSubmitting
                                ? "bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 animate-pulse"
                                : "bg-blue-v1 hover:bg-blue-v2"
                                }`}
                            >
                              Sign in
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
