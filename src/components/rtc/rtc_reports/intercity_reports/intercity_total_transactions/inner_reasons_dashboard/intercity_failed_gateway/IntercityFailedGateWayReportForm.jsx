import { Formik, Form, Field } from "formik";
import AmarabadTotalCommonStore from "../../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import { useAmarabadTotalTransactionStore } from "../../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalTransactionStore";
import { usePackagesStore } from "../../../../../../../store/amrabad/masters/packagesStore";
import IntercityTotalCommonStore from "../../../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";
import { useIntercityTotalTransactionStore } from "../../store/IntercityTotalTransactionStore";

const IntercityFailedGatewayReportForm = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
  packageName,
  house,
  mobileNumber,
  fromDate,
  toDate,
  subCategory,
}) => {
  const {
    outerFilters,
    innerFilters,
    setDeepInnerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
  } = IntercityTotalCommonStore();
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();
  const {fetchTotalTransactionsReport} = useIntercityTotalTransactionStore();
  const initialValues = {
    startDate:
      fromDate ?? deepInnerFilters.startDate ?? innerFilters.fromDate ?? "",
    endDate: toDate ?? deepInnerFilters.endDate ?? innerFilters.toDate ?? "",
    phoneNumber:
      mobileNumber ??
      deepInnerFilters.mobileNumber ??
      innerFilters.mobileNumber ??
      "",
    PaymentMode: deepInnerFilters.PaymentMode ?? "",
    package: packageName ?? innerFilters.package ?? outerFilters.package ?? "",
    house: house ?? innerFilters.house ?? outerFilters.house ?? "",
    mobileNumber:
      mobileNumber ??
      deepInnerFilters.mobileNumber ??
      innerFilters.mobileNumber ??
      "",
  };

  const onSubmit = (values) => {
    console.log("values", values);
    setDeepInnerFilters(values);
    fetchTotalTransactionsReport({
      ...values,
      status: innerFilters.status,
      subCategory: subCategory ?? innerFilters.subCategory,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    getPackages();
    SetcurrentPage(0);
  };

  return (
    <>
 <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-3 py-3">
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
                disabled={!values.arrivalLocation || values.arrivalLocation === ""}
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

export default IntercityFailedGatewayReportForm;
