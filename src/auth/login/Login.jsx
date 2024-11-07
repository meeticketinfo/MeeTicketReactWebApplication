import React, { useEffect } from "react";
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
import { FaRedo } from "react-icons/fa";
import "./Login.css";
import { bouncy } from 'ldrs'

const Login = () => {
  bouncy.register();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, error, login } = useAuthStore();

  const {
    captchaInput,
    captchaError,
    loadCaptcha,
    updateCaptchaInput,
    validateCaptchaInput,
  } = useCaptchaStore();

  const initialValues = {
    EmailId: "Testing1@gmail.com",
    password: "Test@123",
  };

  const validationSchema = Yup.object({
    EmailId: Yup.string().required("EmailId is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const isCaptchaValid = validateCaptchaInput();
    if (!isCaptchaValid) {
      setSubmitting(false);
      return;
    }
    const response = await login(values);
    if (response.success) {
      navigate("/dashboard");
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="h-screen bg-blue-v2 flex flex-col">
        {/* Header Section */}
        <div className="container-fluid p-3 text-white bg-blue-v1 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="align-middle hidden lg:inline-flex 2xl:hidden justify-end">
              <div className="flex justify-center items-center">
                <img alt="site-logo" src={headerLogo} width={40} height={40} />
              </div>
              <div className="pl-2 flex flex-col">
                <p className="text-lg">Government of Telangana</p>
                <small className="text-[10px] pl-1">ITE&C Department</small>
              </div>
            </div>

            {/* Second Column */}
            <div className="flex justify-end items-center pr-20">
              <div className="flex items-center mr-4">
                <div className="mr-2 text-right">
                  <p className="text-sm font-semibold">
                    Sri A. Revanth Reddy
                    <span className="block text-xs">
                      Hon'ble Chief Minister <br />
                      Government of Telangana
                    </span>
                  </p>
                </div>
                <img src={cmImg} alt="CM" className="w-16 h-20" />
              </div>

              <div className="flex items-center">
                <div className="mr-2 text-right">
                  <p className="text-sm font-semibold">
                    Sri D. Sridhar Babu
                    <span className="block text-xs">
                      Hon'ble Minister for IT
                      <br />
                      Government of Telangana
                    </span>
                  </p>
                </div>
                <img src={ITMinisterImg} alt="Minister" className="w-16 h-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-grow items-center justify-center px-4">
          <div className="flex flex-col md:flex-row items-center w-full max-w-6xl space-y-6 md:space-y-0 md:space-x-10">
            {/* Left side - MeeTicket Logo */}
            <div className="flex justify-center items-center md:w-1/2">
              <img
                src={meetickesTelanganaImg}
                alt="MeeTicket Logo"
                className="h-[300px] md:max-h-full object-contain"
              />
            </div>

            {/* Right side - Login Section */}
            <div className="flex justify-center items-center md:w-1/2 h-full">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex-grow flex flex-col justify-center">
                <h3 className="text-center mb-4 text-lg font-semibold text-gray-700">
                  Welcome to MeeTicket
                </h3>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-4">
                        <label
                          htmlFor="EmailId"
                          className="form-label text-sm font-medium text-gray-700"
                        >
                          User Name
                        </label>
                        <Field
                          id="EmailId"
                          name="EmailId"
                          placeholder="User Name"
                          className="form-control mt-1 block w-full border rounded-md p-2 text-sm"
                          autoComplete="off"
                          maxLength="255"
                        />
                        <ErrorMessage
                          name="EmailId"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="password"
                          className="form-label text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <Field
                          id="password"
                          name="password"
                          placeholder="Password"
                          className="form-control mt-1 block w-full border rounded-md p-2 text-sm"
                          type="password"
                          autoComplete="off"
                          maxLength="49"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {error && (
                        <div className="text-red-500 text-center mb-4">
                          {error}
                        </div>
                      )}

                      <div className="flex items-center mb-4 bg-gray-500 rounded ">
                        <div className="relative flex items-center flex-row-reverse lg:w-3/4">
                          <button
                            type="button"
                            className="absolute left-0 bg-gray-500 p-2 outline-none text-blue-v1"
                            onClick={() =>
                              loadCaptchaEnginge(
                                6,
                                "rgb(107 114 128 / 1)",
                                "#fff"
                              )
                            }
                          >
                            <FaRedo size={16} />{" "}
                          </button>
                          <LoadCanvasTemplate reloadText="" />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter Captcha"
                          value={captchaInput}
                          onChange={(e) => updateCaptchaInput(e.target.value)}
                          className="form-control ml-2 border rounded-md p-2 text-sm"
                        />
                      </div>
                      <div className="text-center">
                        {captchaError && (
                          <small className="text-red-500 text-center mb-4">
                            {captchaError}
                          </small>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`relative w-full p-2 rounded-md text-white overflow-hidden flex justify-center items-center bg-gradient-to-r ${ isSubmitting ? "from-blue-v2 via-blue-300 to-blue-v2 bg-[length:200%_100%] animate-fill-right-to-left" : "bg-blue-v1"}`}
                      >
                        <span >
                          Sign in
                        </span>
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
