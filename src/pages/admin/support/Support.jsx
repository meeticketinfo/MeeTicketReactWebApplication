
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import logoIcon from "../../../images/logo.jpg";

const Support = () => {
  // Validation Schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed")
      .required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  // Initial Values
  const initialValues = { name: "", email: "", message: "" };

  // Form Submission
  const handleSubmit = (values, { resetForm }) => {
    // alert("Form submitted successfully!");
    console.log("Submitted Data:", values);
    resetForm();
  };
  return (
    <>

      <div className="min-h-screen flex flex-col bg-blue-v1 p-4  overflow-hidden items-center justify-center">
     
        <div className="absolute bg-blue-800 w-80 h-80 rounded-full opacity-30 -top-36 -left-20" />
        {/* <div className="absolute bg-blue-800 w-40 h-40 rounded-full opacity-20 top-40 -right-20" /> */}
        <div className="absolute bg-blue-800 w-80 h-80 rounded-full opacity-20 top-10 right-80" />
        <div className="absolute bg-blue-800 w-48 h-48 rounded-full opacity-25 -bottom-2 left-0" />
        <img className="rounded-full mb-4" alt="site-logo" src={logoIcon} width={80} height={80} />
        <div autoComplete="off" className="w-full lg:w-1/2 max-w-md ">
        
          <div className=" rounded-[20px] p-4  backdrop-blur-sm bg-white/30 mb-3">
          
            {/* toggle logic */}


            {/* render pages */}
            <div className=" p-6 rounded-lg  w-full max-w-md">
              <h2 className="text-2xl font-semibold text-center text-gray-100">CONTACT US</h2>
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ touched, errors }) => (
                  <Form className="mt-4 space-y-4">
                    {/* Name Field */}
                    <div>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Name"
                        className={`w-full p-2 border rounded-lg ${touched.name && errors.name ? "border-red-500" : "focus:ring focus:ring-blue-300"
                          }`}
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Email Field */}
                    <div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={`w-full p-2 border rounded-lg ${touched.email && errors.email ? "border-red-500" : "focus:ring focus:ring-blue-300"
                          }`}
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Message Field */}
                    <div>
                      <Field
                        as="textarea"
                        name="message"
                        placeholder="Message"
                        className={`w-full p-2 border rounded-lg ${touched.message && errors.message ? "border-red-500" : "focus:ring focus:ring-blue-300"
                          }`}
                        rows="4"
                      />
                      <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full h-12 flex justify-center items-center text-white rounded-lg transition-all duration-300 bg-blue-v1 hover:bg-blue-v2">
                      Submit
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        {/* Header */}

        {/* Main Content Section */}

      </div>
    </>
  );
};

export default Support;
