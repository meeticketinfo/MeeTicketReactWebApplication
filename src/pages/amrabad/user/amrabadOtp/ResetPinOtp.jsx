import React, { useEffect, useRef, useState } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import Lock from "../../../../images/user/lock.png";
import Logo from "../../../../images/user/logo.png";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UseOtpStore } from "../../../../store/amarabad/user/otpStore";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPinOtp = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const [otpError, setOtpError] = useState("");
  const { verifyForgetPinOtp } = UseOtpStore();
  const responseMobileNumber = localStorage.getItem("forgetPinMobileNumber");
  // Replace this with your actual source of mobile number
  const { getForgetPinOtpFromMobile, isForgetOtpRequestLoading } =
  UseOtpStore();
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setCanResend(timeLeft === 0);
  }, [timeLeft]);

  const startTimer = () => {
    setTimeLeft(60);
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
  });

  const handleOtpChange = (e, index, setFieldValue, values) => {
    const { value } = e.target;
    if (/^\d$/.test(value) || value === "") {
      const otpArray = values.otp.split("").concat(Array(6).fill(""));
      otpArray[index] = value;
      const newOtp = otpArray.slice(0, 6).join("");
      setFieldValue("otp", newOtp);

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index, values) => {
    if (e.key === "Backspace" && !values.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await verifyForgetPinOtp({
        ...values,
        mobileNumber: responseMobileNumber,
      });
      console.log("response", response);
      if (response.data.status===200) {
        toast.success(response.data?.data?.message||"OTP verified successfully");
        navigate("/amarabad-reset-pin");
      } else {
        toast.info(response.data?.data?.message||"something went wrong");
      }
    } catch (error) {
      toast.error(error.message||"something went wrong");
      console.log("error", error);
    }
  };
    const resendOtp = async () => {
      try {
        const response = await getForgetPinOtpFromMobile({
          mobileNumber: responseMobileNumber,
        });
        if(response.data.status){
          toast.success(response.data.data.message||"OTP sent successfully");
        }else{
          toast.error(response.data.data.message||"something went wrong");
        }
      }catch(error){
        toast.error(error.message||"something went wrong");
        console.log("error", error);
      }
    }
  
  return (
    <UserLayout>
      <div className="container mx-auto px-3">
        <div className="text-sm text-[#888888] text-right py-3">
          <span className="text-red-500">*</span> Indicates mandatory fields
        </div>
        <div className="relative bg-white rounded-xl border border-[#CCCCCC] p-8 w-full mb-8">
          <div className="flex-col items-center justify-center absolute top-1/2 left-[5%] -translate-y-1/2 hidden md:flex">
            <img src={Lock} alt="Lock" />
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-[350px] mx-auto">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-black">
              Enter OTP
            </h1>

            <Formik
              initialValues={{ otp: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form className="otp_screen relative z-10">
                  <div className=" mb-8 text-xs font-medium px-10 text-center">
                    <p>
                      Please enter the 6-digit code we have sent you to your
                      Mobile Number{" "}
                      <span className="text-black text-xs whitespace-nowrap">{`+91 ${responseMobileNumber?.slice(
                        0,
                        2
                      )}****${responseMobileNumber?.slice(-2)}`}</span>
                    </p>
                  </div>

                  <h3 className="text-base mt-4 text-center font-semibold text-black mb-4">
                    Enter OTP
                  </h3>
                  <div className="flex gap-2 md:gap-3 justify-center mb-2">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={values.otp[index] || ""}
                        onChange={(e) =>
                          handleOtpChange(e, index, setFieldValue, values)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index, values)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className={`  rounded-md border border-none w-10 md:w-12 h-10 md:h-12 bg-[#EEEEEE] backdrop-blur-sm py-2 px-3 text-gray-700  focus:outline-none focus:shadow-outline ${
                          errors.otp && touched.otp ? "border-red-500" : ""
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-red-600 text-center block">
                    {otpError}
                  </span>
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-xs mt-1 text-center"
                  />

                  <p className="text-center text-black text-xs mt-2">
                    Didn't receive the OTP?&nbsp;
                    <span
                      className={`clr_link ${
                        canResend
                          ? "cursor-pointer text-blue-v1 underline font-bold"
                          : "text-gray-900 opacity-40"
                      }`}
                      onClick={() => {
                        if (canResend) {
                          startTimer();
                          // trigger resend API
                          resendOtp();

                        }
                      }}
                    >
                      Resend
                    </span>
                    &nbsp;in {Math.floor(timeLeft / 60)}:
                    {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                  </p>

                  <button
                    type="submit"
                    className="block mx-auto bg-[#3B358A] text-white font-bold py-3 rounded-lg text-lg w-full mt-8"
                  >
                    {isForgetOtpRequestLoading ? "Submitting..." : "VERIFY"}
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
  );
};

export default ResetPinOtp;
