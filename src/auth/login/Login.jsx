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
import "./Login.css";
import { bouncy } from "ldrs";

const Login = () => {
  bouncy.register();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, error, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const {
    captchaInput,
    captchaError,
    loadCaptcha,
    updateCaptchaInput,
    validateCaptchaInput,
  } = useCaptchaStore();

  const initialValues = {
    EmailId: "",
    password: "",
  };

  const validationSchema = Yup.object({
    EmailId: Yup.string().required("EmailId is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const isCaptchaValid = validateCaptchaInput();
    if (!isCaptchaValid) {
      setSubmitting(false);
      return;
    }

    const response = await login(values);
    if (response.success) {
      resetForm();
      navigate("/dashboard");
    }
    setSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className="min-h-screen flex flex-col bg-blue-v1 p-4  ">
        <div className="absolute bg-blue-800 w-80 h-80 rounded-full opacity-30 -top-36 -left-20" />
        <div className="absolute bg-blue-800 w-40 h-40 rounded-full opacity-20 top-40 -right-20" />
        <div className="absolute bg-blue-800 w-80 h-80 rounded-full opacity-20 top-10 right-80" />
        <div className="absolute bg-blue-800 w-48 h-48 rounded-full opacity-25 -bottom-32 left-40" />
        {/* Header */}
        <div className="container-fluid p-3 bg-blue-v1 rounded-[20px] text-gray-200 shadow-lg backdrop-blur-sm bg-white/30 ">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* First Column */}
            <div className="align-middle hidden lg:flex items-center space-x-2">
              <img alt="site-logo" src={headerLogo} width={40} height={40} />
              <div>
                <p className="text-lg font-semibold">Government of Telangana</p>
                <small className="text-[10px]">ITE&C Department</small>
              </div>
            </div>

            {/* Second Column */}
            <div className="flex items-center space-x-8">
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="w-full lg:w-1/2 max-w-md  rounded-[20px] p-4  backdrop-blur-sm bg-white/30">
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
                    Welcome to MeeTicket
                  </h2>

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
                    <div
                      className="absolute right-6 top-1/2 transform -translate-y-1/6 py-4 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </div>
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
                        <LoadCanvasTemplate reloadText="" />
                      </div>
                      <button
                        type="button"
                        className="flex items-center justify-center p-3 text-blue-v1"
                        onClick={() =>
                          loadCaptchaEnginge(
                            6,
                            "#a8b4c4",
                            "rgb(107 114 128 / 1)"
                          )
                        }
                      >
                        <FaRedo size={16} />
                      </button>
                      <div className="flex items-center backdrop-blur-sm bg-white/30 rounded-lg border border-gray-300">
                        <input
                          type="text"
                          placeholder="Enter Captcha"
                          value={captchaInput}
                          onChange={(e) => updateCaptchaInput(e.target.value)}
                          className="w-full h-12 px-4 shadow-lg backdrop-blur-sm bg-white/30 bg-blue-50 border border-gray-300 rounded-lg outline-none focus:border-blue-v1 focus:bg-gray-100 transition duration-300"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex text-center justify-center">
                    {error && (
                      <small className="text-red-500 text-center mb-4 text-shadow shadow-color-blue">
                        {error}
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
        </div>
      </div>
    </>
  );
};

export default Login;
