import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";

const ServiceUnifiedCreator = () => {
  const [selectedOption, setSelectedOption] = useState("default");

  const initialValues = {
    facility: "",
    option: "default",
    name: "",
    isPriceFixed: false,
    price: "",
    multipleEntries: [], // For multiple services
  };

  const validationSchema = Yup.object({
    facility: Yup.string().required("Facility is required"),
    name: Yup.string().when("option", {
      is: "default",
      then: Yup.string().required("Name is required"),
    }),
    price: Yup.number()
      .positive("Price must be positive")
      .when("option", {
        is: "default",
        then: Yup.number().required("Price is required"),
      }),
  });

  const onSubmit = (values) => {
    toast.success("Form submitted successfully!");
    console.log("Form Data:", values);
  };

  return (
    <div className="container mx-auto mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-zinc-50 p-5 shadow-lg rounded-lg border border-gray-200">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, setFieldValue, handleChange }) => (
            <Form>
              {/* Facilities Dropdown */}
              <div className="grid grid-cols-3">
                <div className="mb-4">
                  <label
                    htmlFor="facility"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Facility
                  </label>
                  <Field
                    as="select"
                    name="facility"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.facility && touched.facility
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                  >
                    <option value="">Select Facility</option>
                    <option value="facility1">Facility 1</option>
                    <option value="facility2">Facility 2</option>
                    <option value="facility3">Facility 3</option>
                  </Field>
                  <ErrorMessage
                    name="facility"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Radio Buttons */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Option
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      name="option"
                      value="default"
                      onChange={(e) => {
                        setFieldValue("option", e.target.value);
                        setSelectedOption(e.target.value);
                      }}
                    />
                    Default
                  </label>
                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      name="option"
                      value="multiple"
                      onChange={(e) => {
                        setFieldValue("option", e.target.value);
                        setSelectedOption(e.target.value);
                      }}
                    />
                    Multiple
                  </label>
                </div>
              </div>
              {selectedOption === "multiple" && (
                <div className="grid grid-cols-3">
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      service Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className={`mt-1 block w-full px-2 py-1 border ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                      placeholder="Enter service Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Forms */}
              {(selectedOption === "default" ||
                selectedOption === "multiple") && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Type of Ticket</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Name */}
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Type of Ticket Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className={`mt-1 block w-full px-2 py-1 border ${
                          errors.name && touched.name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                        placeholder="Enter Name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <label
                        htmlFor="price"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Price
                      </label>
                      <Field
                        type="number"
                        name="price"
                        className={`mt-1 block w-full px-2 py-1 border ${
                          errors.price && touched.price
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                        placeholder="Enter Price"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-end mb-3">
                    <label className="text-sm flex space-x-2">
                      <Field
                        type="checkbox"
                        name="isPriceFixed"
                        className="sr-only peer "
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                      <span className="ms-3 text-md font-semibold text-gray-900 ">
                        Price Fixed
                      </span>
                    </label>
                    <ErrorMessage
                      name="isPriceFixed"
                      component="span"
                      className="text-red-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                >
                  Create Unified service ticket
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ServiceUnifiedCreator;
