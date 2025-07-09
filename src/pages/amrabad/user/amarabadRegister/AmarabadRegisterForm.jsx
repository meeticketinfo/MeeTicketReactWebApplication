import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";

const AmarabadRegisterForm = () => {
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const initialValues = {
    mobile: "",
    fullName: "",
    pin: "",
    confirmPin: "",
  };

  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
    fullName: Yup.string()
      .matches(/^\S.*$/, 'Cannot start with a space')
      .matches(/^[a-zA-Z\s]+$/, "Full Name must contain only letters and spaces")
      .min(3, "Full Name must be at least 3 characters")
      .max(50, "Full Name must be less than 50 characters")
      .required("Full Name is required"),
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
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, touched, errors }) => (
        <Form>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Mobile Number</label>
              <div className="relative">
                <Field
                  name="mobile"
                  type="text"
                  maxLength={10}
                  placeholder="Enter your mobile number"
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${touched.mobile && !errors.mobile && values.mobile.length === 10
                    ? "border-green-500 focus:border-green-500"
                    : ""
                    }`}
                />
                {touched.mobile && !errors.mobile && values.mobile.length === 10 && (
                  <FaCheckCircle className="text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              <ErrorMessage
                name="mobile"
                component="div"
                className="text-xs font-semibold text-red-500 mt-1"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">Full Name</label>
              <div className="relative">
                <Field
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${touched.fullName && !errors.fullName
                    ? "border-green-500 focus:border-green-500"
                    : ""
                    }`}
                />
                {touched.fullName && !errors.fullName && values.fullName.length > 0 && (
                  <FaCheckCircle className="text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>

              <ErrorMessage
                name="fullName"
                component="div"
                className="text-xs font-semibold text-red-500 mt-1"
              />
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="w-1/2">
              <label className="block text-sm mb-1">4-Digit Pin</label>
              <div className="relative">
                <Field
                  name="pin"
                  placeholder="Enter your 4-digit pin"
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${touched.pin && !errors.pin && values.pin.length === 4
                    ? "border-green-500 focus:border-green-500"
                    : ""
                    }`}
                />
                {touched.pin && !errors.pin && values.pin.length === 4 && (
                  <FaCheckCircle className="text-green-500 absolute right-8 top-1/2 -translate-y-1/2" />
                )}
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <button type="button" onClick={() => setShowPin(!showPin)}>
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
            <div className="w-1/2">
              <label className="block text-sm mb-1">Confirm 4-Digit Pin</label>
              <div className="relative">
                <Field
                  name="confirmPin"
                  placeholder="Confirm your 4-digit pin"
                  type={showConfirmPin ? "text" : "password"}
                  maxLength={4}
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${touched.confirmPin && !errors.confirmPin && values.confirmPin.length === 4
                    ? "border-green-500 focus:border-green-500"
                    : ""
                    }`}
                />
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <button type="button" onClick={() => setShowConfirmPin(!showConfirmPin)}>
                    {showConfirmPin ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </span>
                {touched.confirmPin && !errors.confirmPin && values.confirmPin.length === 4 && (
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
  );
};

export default AmarabadRegisterForm;