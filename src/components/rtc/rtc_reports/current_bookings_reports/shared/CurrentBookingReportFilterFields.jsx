import { Field } from "formik";

const selectClassName =
  "mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm uppercase";

const isAllStageValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  value === "0" ||
  value === 0;

export const getArrivalStagesForDeparture = (routes = [], fromStageBoardingID) => {
  const arrivalMap = new Map();
  const selectedBoardingId = Number(fromStageBoardingID) || 0;
  const filteredRoutes = isAllStageValue(fromStageBoardingID)
    ? routes
    : routes.filter(
        (item) => Number(item.FromStageBoardingID) === selectedBoardingId
      );

  filteredRoutes.forEach((item) => {
    if (
      item.ToStageName &&
      !arrivalMap.has(item.ToStageBoardingID ?? item.ToStageName)
    ) {
      arrivalMap.set(item.ToStageBoardingID ?? item.ToStageName, {
        ToStageID: item.ToStageID,
        ToStageName: item.ToStageName,
        ToStageBoardingID: item.ToStageBoardingID,
      });
    }
  });

  return Array.from(arrivalMap.values()).sort((a, b) =>
    (a.ToStageName || "").localeCompare(b.ToStageName || "")
  );
};

export const getStageIdsFromSelection = (
  routes = [],
  departureValue,
  arrivalValue
) => {
  const fromMatch = isAllStageValue(departureValue)
    ? null
    : routes.find(
        (item) =>
          Number(item.FromStageBoardingID) === Number(departureValue) ||
          item.FromStageName === departureValue
      );
  const toMatch = isAllStageValue(arrivalValue)
    ? null
    : routes.find(
        (item) =>
          Number(item.ToStageBoardingID) === Number(arrivalValue) ||
          item.ToStageName === arrivalValue
      );

  return {
    FromStageBoardingID: fromMatch?.FromStageBoardingID || 0,
    ToStageBoardingID: toMatch?.ToStageBoardingID || 0,
  };
};

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

export const CurrentBookingDepartureField = ({
  departureStages = [],
  name = "departureLocation",
  arrivalFieldName = "arrivalLocation",
  setFieldValue,
  labelClassName = "block text-xs font-medium text-gray-700 uppercase",
}) => (
  <div>
    <label htmlFor={name} className={labelClassName}>
      Departure Location
    </label>
    <Field
      as="select"
      id={name}
      name={name}
      className={selectClassName}
      onChange={(e) => {
        setFieldValue(name, e.target.value);
        setFieldValue(arrivalFieldName, 0);
      }}
    >
      <option value="0">All</option>
      {departureStages.map((item) => (
        <option
          key={item.FromStageBoardingID ?? item.FromStageName}
          value={item.FromStageBoardingID}
        >
          {item.FromStageName}
        </option>
      ))}
    </Field>
  </div>
);

export const CurrentBookingArrivalField = ({
  arrivalStages = [],
  name = "arrivalLocation",
  labelClassName = "block text-xs font-medium text-gray-700 uppercase",
}) => (
  <div>
    <label htmlFor={name} className={labelClassName}>
      Arrival Location
    </label>
    <Field as="select" id={name} name={name} className={selectClassName}>
      <option value="0">All</option>
      {arrivalStages.map((item) => (
        <option
          key={item.ToStageBoardingID ?? item.ToStageName}
          value={item.ToStageBoardingID}
        >
          {item.ToStageName}
        </option>
      ))}
    </Field>
  </div>
);
