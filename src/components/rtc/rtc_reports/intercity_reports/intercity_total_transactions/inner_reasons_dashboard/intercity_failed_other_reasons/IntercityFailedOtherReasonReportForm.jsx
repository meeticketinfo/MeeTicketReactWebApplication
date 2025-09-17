import { Formik, Form, Field } from "formik";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../../utils/Helper";
import { usePackagesStore } from "../../../../../../../store/amrabad/masters/packagesStore";
import useIntercityTotalCommonStore from "../../../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";
import { useIntercityTotalTransactionStore } from "../../store/IntercityTotalTransactionStore";

const IntercityFailedOtherReasonReportForm = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
  mobileNumber,
  fromDate,
  toDate,
  arrivalLocation,
  departureLocation,
  busType,
  status,
}) => {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { innerFilters, setDeepInnerFilters, deepInnerFilters, outerFilters } =
    useIntercityTotalCommonStore();
  const { fetchTotalTransactionsReport } = useIntercityTotalTransactionStore();
  const { AllArrivalLocations, getArrivalLocations, AllDepartureLocations, getDepartureLocations } = usePackagesStore();
  const initialValues = {
    startDate:
      fromDate ??
      deepInnerFilters.startDate ??
      innerFilters.fromDate ??
      startOfDay,
    endDate:
      toDate ?? deepInnerFilters.endDate ?? innerFilters.toDate ?? endOfDay,
    phoneNumber:
      mobileNumber ??
      deepInnerFilters.mobileNumber ??
      innerFilters.mobileNumber ??
      "",
    arrivalLocation:
      arrivalLocation ??
      innerFilters.arrivalLocation ??
      outerFilters.arrivalLocation ??
      "",
    departureLocation:
      departureLocation ??
      innerFilters.departureLocation ??
      outerFilters.departureLocation ??
      "",
    busType: busType ?? innerFilters.busType ?? outerFilters.busType ?? "",
  };

  const onSubmit = (values) => {
    setDeepInnerFilters(values);
    fetchTotalTransactionsReport({
      ...values,
      status: status ?? innerFilters.status,
      arrivalLocation: arrivalLocation ?? innerFilters.arrivalLocation,
      departureLocation: departureLocation ?? innerFilters.departureLocation,
      busType: busType ?? innerFilters.busType,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    SetcurrentPage(0);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
            <div>
              <label
                htmlFor="startDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="datetime-local"
                name="startDate"
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("startDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.endDate)) {
                    // Automatically update toDate if it's earlier than fromDate
                    setFieldValue("endDate", fromDateValue);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-xs font-medium text-gray-700"
              >
                To Date
              </label>
              <Field
                type="datetime-local"
                name="endDate"
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("endDate", toDateValue);
                }}
              />
            </div>

            {/* mobile number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile No
              </label>
              <Field
                type="text"
                maxLength="10"
                name="phoneNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter Mobile No"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("phoneNumber", e.target.value);
                }}
              />
            </div>
            {/*Payment Mode */}

            <div>
              <label
                htmlFor="arrivalLocation"
                className="block text-xs font-medium text-gray-700"
              >
                Arrival Location
              </label>
              <Field
                as="select"
                name="arrivalLocation"
                placeholder="Select Arrival Location"
                onChange={(e) => {
                  const arrivalLocationId = e.target.value;
                        getArrivalLocations(arrivalLocationId);
                  setFieldValue("arrivalLocation", arrivalLocationId);
                }}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">Select</option>
                {/* {AllArrivalLocations.map((item) => (
                  <option key={item.arrivalLocationId} value={item.arrivalLocationId}>
                        {item.arrivalLocationName}
                  </option>
                ))} */}
              </Field>
            </div>
            <div>
              <label
                htmlFor="departureLocation"
                className="block text-xs font-medium text-gray-700"
              >
                Departure Location
              </label>
              <Field
                as="select"
                name="departureLocation"
                placeholder="Select Departure Location"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">Select</option>
                {/* {AllDepartureLocations.map((item) => (
                  <option key={item.departureLocationId} value={item.departureLocationId}>
                    {item.departureLocationName}
                  </option>
                ))} */}
              </Field>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default IntercityFailedOtherReasonReportForm;
