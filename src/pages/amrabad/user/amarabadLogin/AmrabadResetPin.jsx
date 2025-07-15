import React, { useState } from "react";
import { UseOtpStore } from "../../../../store/amarabad/user/otpStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import UserLayout from "../../../../layouts/UserLayout";
import Lock from "../../../../images/user/lock.png";
import Logo from "../../../../images/user/logo.png";


const AmrabadResetPin = () => {
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const initialValues = {
    
    pin: "",
    confirmPin: "",
  };

  const validationSchema = Yup.object().shape({
    pin: Yup.string()
      .matches(/^\d{4}$/, "Enter a valid 4-digit PIN")
      .required("4-Digit Pin is required"),
    confirmPin: Yup.string()
      .oneOf([Yup.ref("pin"), null], "Pins must match")
      .required("Confirm 4-Digit Pin is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  };

  return (
    <>
      <UserLayout>
        <ToastContainer />
        <div className="container mx-auto">
          <div className="text-sm text-[#888888] text-right py-3">
            <span className="text-red-500">*</span> Indicates mandatory fields
          </div>
          <div className="relative bg-white rounded-xl border border-[#CCCCCC] p-8 w-full mb-8 ">
            <div className="flex flex-col items-center justify-center absolute top-1/2 left-[5%] -translate-y-1/2">
              <img src={Lock} alt="Lock" className="" />
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-[350px] mx-auto">
              <h1 className="text-3xl font-extrabold text-center mb-7 text-black">
              RESET PIN
              </h1>
             
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, touched, errors }) => (
                  <Form>
                  
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="">
                        <label className="block text-sm mb-1">
                          4-Digit Pin
                        </label>
                        <div className="relative">
                          <Field
                            name="pin"
                            placeholder="Enter your 4-digit pin"
                            type={showPin ? "text" : "password"}
                            maxLength={4}
                            className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                              touched.pin &&
                              !errors.pin &&
                              values.pin.length === 4
                                ? "border-green-500 focus:border-green-500"
                                : ""
                            }`}
                          />
                          {touched.pin &&
                            !errors.pin &&
                            values.pin.length === 4 && (
                              <FaCheckCircle className="text-green-500 absolute right-8 top-1/2 -translate-y-1/2" />
                            )}
                          <span className="absolute inset-y-0 right-3 flex items-center">
                            <button
                              type="button"
                              onClick={() => setShowPin(!showPin)}
                            >
                              {showPin ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </span>
                        </div>
                        <ErrorMessage
                          name="pin"
                          component="div"
                          className="text-xs font-semibold text-red-500 mt-1"
                        />
                      </div>
                      <div className="">
                        <label className="block text-sm mb-1">
                          Confirm 4-Digit Pin
                        </label>
                        <div className="relative">
                          <Field
                            name="confirmPin"
                            placeholder="Confirm your 4-digit pin"
                            type={showConfirmPin ? "text" : "password"}
                            maxLength={4}
                            className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                              touched.confirmPin &&
                              !errors.confirmPin &&
                              values.confirmPin.length === 4
                                ? "border-green-500 focus:border-green-500"
                                : ""
                            }`}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center">
                            <button
                              type="button"
                              onClick={() => setShowConfirmPin(!showConfirmPin)}
                            >
                              {showConfirmPin ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </span>
                          {touched.confirmPin &&
                            !errors.confirmPin &&
                            values.confirmPin.length === 4 && (
                              <FaCheckCircle className="text-green-500 absolute right-8 top-1/2 -translate-y-1/2" />
                            )}
                        </div>
                        <ErrorMessage
                          name="confirmPin"
                          component="div"
                          className="text-xs font-semibold text-red-500 mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="block max-w-[180px] mx-auto bg-[#3B358A] text-white font-bold py-3 rounded-lg text-lg w-full"
                    >
                      REGISTER
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <img src={Logo} alt="MeeTicket Logo" className="w-56" />
            </div>
          </div>
        </div>
      </UserLayout>
    </>
  );
};

export default AmrabadResetPin;
