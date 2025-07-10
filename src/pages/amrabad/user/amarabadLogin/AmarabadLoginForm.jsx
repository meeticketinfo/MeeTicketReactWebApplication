import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { amrabadAuthStore } from "../../../../store/amarabad/user/amrabadAuthStore";
import { ToastContainer } from "react-toastify";

const AmarabadLoginForm = () => {
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);
  const {
    isLoggedIn,
    setIsLoggedIn,
    AmrabadLoginLoading,
    AmrabadLogin,
  } = amrabadAuthStore();

  // Validation schema
  const LoginValidationSchema = Yup.object().shape({
    mobileNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
      pinNumber: Yup.string()
      .matches(/^\d{4}$/, "Enter a valid 4-digit PIN")
      .required("4-Digit Pin is required"),
  });

  const initialValues = { mobileNumber: "", pinNumber: "" };

  const handleSubmit = async (values) => {
    console.log("values", values);
    const response = await AmrabadLogin(values);

    if (response.data.status === 200) {
      setIsLoggedIn(true);
      navigate("/amarabad/packages");
    }


  };
  return (
    <>
    <ToastContainer />
      <Formik
        initialValues={initialValues}
        validationSchema={LoginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors, values }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-base mb-2 text-black">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  name="mobileNumber"
                  id="mobileNumber"
                  type="text"
                  placeholder="Enter your mobile number"
                  maxLength={10}
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
              <label className="block text-base mb-2 text-black">
                4-Digit Pin <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  name="pinNumber"
                  id="pinNumber"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter your 4-digit pin"
                  maxLength={4}
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                    touched.pinNumber && !errors.pinNumber && values.pinNumber.length === 4
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
                {touched.pinNumber && !errors.pinNumber && values.pinNumber.length === 4 && (
                  <FaCheckCircle className="text-green-500 absolute right-8 top-1/2 -translate-y-1/2" />
                )}
              </div>
              <ErrorMessage
                name="pinNumber"
                component="div"
                className="text-xs font-semibold text-red-500 mt-1"
              />
            </div>
            <button
              type="submit"
              // disabled={isSubmitting}
              className="text-lg w-full bg-[#362D86] text-white py-3 rounded-md font-semibold hover:bg-indigo-800 transition mb-4"
            >
              LOGIN
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AmarabadLoginForm;
