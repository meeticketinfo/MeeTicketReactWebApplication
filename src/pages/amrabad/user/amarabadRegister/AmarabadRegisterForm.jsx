import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { amrabadAuthStore } from "../../../../store/amarabad/user/amrabadAuthStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AmarabadRegisterForm = () => {
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const {
    AmrabadRegisterLoading,
    isRegisterIn,
    setIsRegisterIn,
    AmrabadRegister,
  } = amrabadAuthStore();
  const initialValues = {
    mobileNumber: "",
    firstName: "",
    lastName: "",
    pinNumber: "",
    confirmPin: "",
  };
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    mobileNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
    firstName: Yup.string()
      .matches(/^\S.*$/, "Cannot start with a space")
      .matches(
        /^[a-zA-Z\s]+$/,
        "First Name must contain only letters and spaces"
      )
      .min(3, "First Name must be at least 3 characters")
      .max(50, "First Name must be less than 50 characters")
      .required("First Name is required"),
    lastName: Yup.string()
      .matches(/^\S.*$/, "Cannot start with a space")
      .matches(
        /^[a-zA-Z\s]+$/,
        "Last Name must contain only letters and spaces"
      )
      .min(3, "Last Name must be at least 3 characters")
      .max(50, "Last Name must be less than 50 characters")
      .required("Last Name is required"),
    pinNumber: Yup.string()
      .matches(/^\d{4}$/, "Enter a valid 4-digit PIN")
      .required("4-Digit Pin is required"),
    confirmPin: Yup.string()
      .oneOf([Yup.ref("pinNumber"), null], "Pins must match")
      .required("Confirm 4-Digit Pin is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    localStorage.setItem("registerdDetails", JSON.stringify(values));
    setSubmitting(true);
    try {
      const res = await AmrabadRegister({ mobileNumber: values.mobileNumber });
      if (res.data?.status === 200) {
        resetForm();
        navigate("/amrabad/register-otp", {
          replace: true,
          state: { otpSent: true },
        });

        setIsRegisterIn(true);
        toast.success("OTP sent successfully");
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors }) => (
          <Form>
            <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm mb-1">Mobile Number</label>
                <div className="relative">
                  <Field
                    name="mobileNumber"
                    type="text"
                    maxLength={10}
                    placeholder="Enter your mobile no"
                    className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                      touched.mobileNumber &&
                      !errors.mobileNumber &&
                      values.mobileNumber.length === 10
                        ? "border-green-500 focus:border-green-500"
                        : ""
                    }`}
                  />
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
              <div className="w-full md:w-1/2">
                <label className="block text-sm mb-1">First Name</label>
                <div className="relative">
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                      touched.firstName && !errors.firstName
                        ? "border-green-500 focus:border-green-500"
                        : ""
                    }`}
                  />
                  {touched.firstName &&
                    !errors.firstName &&
                    values.firstName.length > 0 && (
                      <FaCheckCircle className="text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                </div>

                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-xs font-semibold text-red-500 mt-1"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm mb-1">Last Name</label>
                <div className="relative">
                  <Field
                    name="lastName"
                    type="text"
                    placeholder="Enter your Last name"
                    className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                      touched.lastName && !errors.lastName
                        ? "border-green-500 focus:border-green-500"
                        : ""
                    }`}
                  />
                  {touched.lastName &&
                    !errors.lastName &&
                    values.lastName.length > 0 && (
                      <FaCheckCircle className="text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                </div>

                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-xs font-semibold text-red-500 mt-1"
                />
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
              <div className="w-full md:w-1/2">
                <label className="block text-sm mb-1">4-Digit Pin</label>
                <div className="relative">
                  <Field
                    name="pinNumber"
                    placeholder="Enter your 4-digit pin"
                    type={showPin ? "text" : "password"}
                    maxLength={4}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                      touched.pinNumber &&
                      !errors.pinNumber &&
                      values.pinNumber.length === 4
                        ? "border-green-500 focus:border-green-500"
                        : ""
                    }`}
                  />
                  {touched.pinNumber &&
                    !errors.pinNumber &&
                    values.pinNumber.length === 4 && (
                      <FaCheckCircle className="text-green-500 absolute right-8 top-1/2 -translate-y-1/2" />
                    )}
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <button type="button" onClick={() => setShowPin(!showPin)}>
                      {showPin ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </span>
                </div>
                <ErrorMessage
                  name="pinNumber"
                  component="div"
                  className="text-xs font-semibold text-red-500 mt-1"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm mb-1">
                  Confirm 4-Digit Pin
                </label>
                <div className="relative">
                  <Field
                    name="confirmPin"
                    placeholder="Confirm your 4-digit pin"
                    type={showConfirmPin ? "text" : "password"}
                    maxLength={4}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
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
              // disabled={AmrabadRegisterLoading}
              className="block max-w-full md:max-w-[180px] mx-auto bg-[#3B358A] text-white font-bold py-3 rounded-lg text-lg w-full"
            >
              {AmrabadRegisterLoading ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AmarabadRegisterForm;
