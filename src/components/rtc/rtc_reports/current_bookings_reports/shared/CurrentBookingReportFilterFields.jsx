import { Field } from "formik";

const selectClassName =
  "mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm uppercase";

export const CurrentBookingCityBusField = ({
  labelClassName = "block text-xs font-medium text-gray-700 uppercase",
}) => (
  <div>
    <label htmlFor="cityBus" className={labelClassName}>
      City Bus
    </label>
    <select
      id="cityBus"
      name="cityBus"
      disabled
      className={`${selectClassName} bg-gray-100 cursor-not-allowed`}
    >
      <option value="">All</option>
    </select>
  </div>
);

export const CurrentBookingIntercityBusField = ({
  intercityStageNames = [],
  name = "intercityBus",
  labelClassName = "block text-xs font-medium text-gray-700 uppercase",
}) => (
  <div>
    <label htmlFor={name} className={labelClassName}>
      Intercity Bus
    </label>
    <Field as="select" id={name} name={name} className={selectClassName}>
      <option value="">All</option>
      {intercityStageNames.map((stageName) => (
        <option key={stageName} value={stageName}>
          {stageName}
        </option>
      ))}
    </Field>
  </div>
);
