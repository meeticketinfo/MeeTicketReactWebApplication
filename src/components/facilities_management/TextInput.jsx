import React from "react";
import { Field, ErrorMessage } from "formik";

const TextInput = ({ name, label, ...props }) => (
  <div className="form-group">
    <label className="block text-sm font-semibold text-gray-700" htmlFor={name}>
      {label}
    </label>
    <Field
      id={name}
      name={name}
      {...props}
      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
    />
    <ErrorMessage name={name} component="div" className="text-danger" />
  </div>
);

export default TextInput;
