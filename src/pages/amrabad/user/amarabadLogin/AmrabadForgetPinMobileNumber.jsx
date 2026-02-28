import React from "react";
import Lock from "../../../../images/user/lock.png";
import Logo from "../../../../images/user/logo.png";
import UserLayout from "../../../../layouts/UserLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { UseOtpStore } from "../../../../store/amarabad/user/otpStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const AmrabadForgetPinMobileNumber = () => {
  const navigate = useNavigate();
  const { getForgetPinOtpFromMobile, isForgetOtpRequestLoading } =
    UseOtpStore();
  const initialValues = {
    mobile: "",
  };

  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
  });

  const handleSubmit = async (values) => {
    localStorage.setItem("forgetPinMobileNumber", values.mobile);
    try {
      const res = await getForgetPinOtpFromMobile({
        mobileNumber: values.mobile,
      });
      if (res.data?.status === 200) {
        navigate("/amrabad-otp");
      } else {
        toast.error(res.data.data?.message);
      }
    } catch (err) {
      console.log("err", err);
      toast.error(err?.message);
    }
  };
  return (
    <>
      <UserLayout>
        <div className="container mx-auto px-3">
          <div className="text-sm text-[#888888] text-right py-3">
            <span className="text-red-500">*</span> Indicates mandatory fields
          </div>
          <div className="relative bg-white rounded-xl border border-[#C8BFB2] shadow-[0_4px_20px_rgba(48,74,58,0.08)] p-8 w-full mb-8 ">
            <div className="hidden md:flex flex-col items-center justify-center absolute top-1/2 left-[5%] -translate-y-1/2">
              <img src={Lock} alt="Lock" className="block filter-[brightness(0)_saturate(100%)_invert(18%)_sepia(25%)_saturate(1500%)_hue-rotate(115deg)_brightness(90%)_contrast(90%)]" />
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-[350px] mx-auto relative z-10">
              <h1 className="text-3xl font-extrabold text-center mb-7 text-[#304A3A]">
                Forget PIN?
              </h1>
              <p className="flex-1 flex flex-col justify-center max-w-[350px] mx-auto text-xs font-medium mb-12 text-center text-[#394D48]">
                Please enter the mobile number associated with the account. 
                We will send you 6-digit OTP to change your PIN number.
              </p>
              {/* <AmarabadLoginForm /> */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, touched, errors, isSubmiting }) => (
                  <Form>
                    <div className="flex gap-4 mb-8">
                      <div className="w-full">
                        <label className="block text-sm mb-1 font-bold text-[#304A3A]">
                          Enter Mobile Number{" "}
                          <span className="text-red-700">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            name="mobile"
                            type="text"
                            maxLength={10}
                            placeholder="Enter your mobile number"
                            className={`w-full bg-[#EDEBE1] border border-transparent rounded-md px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#304A3A]/30 ${
                              touched.mobile &&
                              !errors.mobile &&
                              values.mobile.length === 10
                                ? "border-[#304A3A] focus:border-[#304A3A]"
                                : ""
                            }`}
                          />
                          {touched.mobile &&
                            !errors.mobile &&
                            values.mobile.length === 10 && (
                              <FaCheckCircle className="text-[#304A3A] absolute right-3 top-1/2 -translate-y-1/2" />
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
                      className="block mx-auto bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] font-bold py-3 rounded-lg text-lg w-full hover:opacity-90 transition"
                    >
                      {isForgetOtpRequestLoading
                        ? "Sending Otp..."
                        : "SEND OTP"}
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
