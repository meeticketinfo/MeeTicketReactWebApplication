import React from "react";
import { Field, ErrorMessage } from "formik";

const SelectInput = ({ name, label, options }) => (
  <div className="form-group">
    <label className="block text-sm font-semibold text-gray-700" htmlFor={name}>
      {label}
    </label>
    <Field
      as="select"
      id={name}
      name={name}
      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="span"
      className="text-red-500 text-xs"
    />
  </div>
);

export default SelectInput;
