import React from "react";
import Lock from "../../../../images/user/lock.png";
import Logo from "../../../../images/user/logo.png";
import UserLayout from "../../../../layouts/UserLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
const AmrabadForgetPinMobileNumber = () => {
  const initialValues = {
    mobile: "",
  };

  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  };
  return (
    <>
      <UserLayout>
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
                Forget PIN?
              </h1>
              <p className="flex-1 flex flex-col justify-center max-w-[350px] mx-auto text-xs font-medium mb-12">
                Please enter the mobile number associated with the account.
                <span className="text-center">
                  We will send you 6-digit OTP to change your PIN number.
                </span>
              </p>
              {/* <AmarabadLoginForm /> */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, touched, errors }) => (
                  <Form>
                    <div className="flex gap-4 mb-8">
                      <div className="w-full">
                        <label className="block text-sm mb-1 font-bold text-center text-black mb-4">
                          Enter Mobile Number{" "}
                          <span className="text-red-700">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            name="mobile"
                            type="text"
                            maxLength={10}
                            placeholder="Enter your mobile number"
                            className={`w-full bg-[#EEEEEE] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none ${
                              touched.mobile &&
                              !errors.mobile &&
                              values.mobile.length === 10
                                ? "border-green-500 focus:border-green-500"
                                : ""
                            }`}
                          />
                          {touched.mobile &&
                            !errors.mobile &&
                            values.mobile.length === 10 && (
                              <FaCheckCircle className="text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                        </div>
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="text-xs font-semibold text-red-500 mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="block  mx-auto bg-[#3B358A] text-white font-bold py-3 rounded-lg text-lg w-full"
                    >
                      SEND OTP
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

export default AmrabadForgetPinMobileNumber;
