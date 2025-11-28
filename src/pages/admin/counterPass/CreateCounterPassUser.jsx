import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { CounterPassUserCreationStore } from "./counterpass_store/CounterPassUserCreationStore";
const CreateCounterPassUser = ({ setIsCounterPassCreateVisible, setIsEdit, isEdit }) => {
  const {
    saveCounterPassUser,
    isSaveCounterPassUserDetailsLoading,
    counterPassUserEditDetails,
    setCurrentCounterPassUserEditDetails,
  } = CounterPassUserCreationStore();

  const initialValues = {
    userId: isEdit ? counterPassUserEditDetails.userId : "",
    CounterName: isEdit ? counterPassUserEditDetails.counterName || counterPassUserEditDetails.counterPassAdminName : "",
    CounterNumber: isEdit ? counterPassUserEditDetails.counterNumber : "",
    EmailId: isEdit ? counterPassUserEditDetails.emailId : "",
    MobileNumber: isEdit ? counterPassUserEditDetails.mobileNumber : "",
    Password: isEdit ? counterPassUserEditDetails.password : "",
  };

  const validationSchema = Yup.object({
    CounterName: Yup.string()
      .required("Counter Name is required")
      .max(100, "Counter Name cannot be more than 100 characters"),
    CounterNumber: Yup.string()
      .required("Counter Number is required")
      .max(50, "Counter Number cannot be more than 50 characters"),
    EmailId: Yup.string()
      .email("Invalid email format")
      .required("Email ID is required"),
    MobileNumber: Yup.string()
      .required("Mobile Number is required")
      .matches(/^\d{10}$/, "Mobile Number must contain exactly 10 digits"),
    Password: Yup.string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters"),
  });

  const onSubmit = async (values, { resetForm }) => {
    const payload = {
      userId: values.userId || "",
      counterName: values.CounterName,
      counterNumber: values.CounterNumber,
      emailId: values.EmailId,
      mobileNumber: values.MobileNumber,
      password: values.Password,
    };
    try {
      const res = await saveCounterPassUser(payload, isEdit);
    
      if (res.data.status === 200) {
        toast.success(
          isEdit
            ? "Counter Pass Admin Updated Successfully"
            : "Counter Pass Admin Created Successfully"
        );
        setTimeout(() => {
          setIsCounterPassCreateVisible(false);
          setIsEdit(false);
          setCurrentCounterPassUserEditDetails({});
          resetForm();
        }, 1000);
      } else {
        toast.error("something went wrong");
      }
    } catch (err) {
      console.log("err", err);
      toast.error(err.response.data);
    }
  };
  return (
    <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
              {/* Counter Name */}
              <div>
                <label htmlFor="CounterName" className="block text-xs font-medium">
                  Counter Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="CounterName"
                  maxLength={100}
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter counter name"
                />
                <ErrorMessage
                  name="CounterName"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Counter Number */}
              <div>
                <label htmlFor="CounterNumber" className="block text-xs font-medium">
                  Counter Number <span className="text-red-500">*</span>
                </label>
                <Field
                  name="CounterNumber"
                  maxLength={50}
                  type="text"
                  className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                  placeholder="Enter counter number"
                />
                <ErrorMessage
                  name="CounterNumber"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Email Id */}
              <div>
                <label
                  htmlFor="EmailId"
                  className="block text-xs font-medium text-gray-700"
                >
                  Email ID <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  name="EmailId"
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Enter email ID"
                />
                <ErrorMessage
                  name="EmailId"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="MobileNumber"
                  className="block text-xs font-medium text-gray-700"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  maxLength="10"
                  name="MobileNumber"
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Enter mobile number"
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault(); // Prevent non-numeric characters
                    }
                  }}
                />
                <ErrorMessage
                  name="MobileNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="Password"
                  className="block text-xs font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <Field
                  type="password"
                  name="Password"
                  className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none  text-sm`}
                  placeholder="Enter password"
                />
                <ErrorMessage
                  name="Password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center p-2">
              <button
                type="submit"
                className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                disabled={isSaveCounterPassUserDetailsLoading}
              >
                {isSaveCounterPassUserDetailsLoading
                  ? "Saving..."
                  : isEdit
                  ? "Edit Counter Pass Admin"
                  : "Create Counter Pass Admin"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCounterPassUser;

