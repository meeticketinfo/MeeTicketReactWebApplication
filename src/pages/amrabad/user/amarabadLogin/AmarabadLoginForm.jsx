import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginStore } from "../../../../store/amarabad/user/loginStore";
import { useNavigate } from "react-router-dom";

const AmarabadLoginForm = () => {
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = loginStore();

  // Validation schema
  const LoginValidationSchema = Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
    pin: Yup.string()
      .matches(/^\d{4}$/, "Enter a valid 4-digit PIN")
      .required("4-Digit Pin is required"),
  });

  const initialValues = { mobile: "", pin: "" };

  const handleSubmit = (values, { setSubmitting }) => {
    alert(JSON.stringify(values, null, 2));
    setIsLoggedIn(true);
    setSubmitting(false);
    navigate("/amarabad/packages");
  }
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
              <label className="block text-base mb-2 text-black">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  name="mobile"
                  id="mobile"
                  type="text"
                  placeholder="Enter your mobile number"
                  maxLength={10}
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${touched.mobile && !errors.mobile && values.mobile.length === 10
                    ? "border-green-500 focus:border-green-500"
                    : ""
                    }`}
                  autoComplete="off"
                />
                {/* Green check icon */}
                {touched.mobile && !errors.mobile && values.mobile.length === 10 && (
                  <FaCheckCircle className="text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              <ErrorMessage name="mobile" component="div" className="text-xs font-semibold text-red-500 mt-1" />
            </div>
            <div className="mb-8">
              <label className="block text-base mb-2 text-black">
                4-Digit Pin <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  name="pin"
                  id="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter your 4-digit pin"
                  maxLength={4}
                  className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${touched.pin && !errors.pin && values.pin.length === 4
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
                {touched.pin && !errors.pin && values.pin.length === 4 && (
                  <FaCheckCircle className="text-green-500 absolute right-8 top-1/2 -translate-y-1/2" />
                )}
              </div>
              <ErrorMessage name="pin" component="div" className="text-xs font-semibold text-red-500 mt-1" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
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