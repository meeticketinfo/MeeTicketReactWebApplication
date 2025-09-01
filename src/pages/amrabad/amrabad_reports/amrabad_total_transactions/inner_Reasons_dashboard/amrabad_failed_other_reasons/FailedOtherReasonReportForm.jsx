import { Formik, Form, Field } from "formik";
import useAmrabadTotalCommonStore from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import { useAmarabadTotalTransactionStore } from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalTransactionStore";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { usePackagesStore } from "../../../../../../store/amrabad/masters/packagesStore";

const FailedOtherReasonReportForm = ({
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
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { innerFilters, setDeepInnerFilters, deepInnerFilters } =
    useAmrabadTotalCommonStore();
  const { fetchAmrabadTotalTransactions } = useAmarabadTotalTransactionStore();
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();
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
    package: packageName ?? innerFilters.package ?? outerFilters.package ?? "",
    house: house ?? innerFilters.house ?? outerFilters.house ?? "",
    PaymentMode: deepInnerFilters.PaymentMode ?? "",
  };

  const onSubmit = (values) => {
    console.log("values", values);
    setDeepInnerFilters(values);
    fetchAmrabadTotalTransactions({
      ...values,
      status: innerFilters.status,
      subCategory: subCategory ?? innerFilters.subCategory,
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
                Phone Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="phoneNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
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
                htmlFor="package"
                className="block text-xs font-medium text-gray-700"
              >
                Packages
              </label>
              <Field
                as="select"
                name="package"
                placeholder="Select Package"
                onChange={(e) => {
                  const packageId = e.target.value;
                  getHouses(packageId);
                  setFieldValue("package", packageId);
                }}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">Select Package</option>
                {AllPackages.map((item) => (
                  <option key={item.packageId} value={item.packageId}>
                    {item.packageName}
                  </option>
                ))}
              </Field>
            </div>
            <div>
              <label
                htmlFor="house"
                className="block text-xs font-medium text-gray-700"
              >
                House
              </label>
              <Field
                as="select"
                name="house"
                placeholder="Select House"
                disabled={!values.package || values.package === ""}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">Select House</option>
                {AllHouses.map((item) => (
                  <option key={item.roomId} value={item.roomId}>
                    {item.roomName}
                  </option>
                ))}
              </Field>
            </div>
            <div>
              <label
                htmlFor="PaymentMode"
                className="block text-xs font-medium text-gray-700"
              >
                Payment Mode
              </label>
              <Field
                as="select"
                name="PaymentMode"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("PaymentMode", e.target.value);
                }}
              >
                <option value="">Select Mode</option>
                <option value="upi">UPI</option>
                <option value="creditCard">Credit Card</option>
                <option value="debitCard">Debit Card</option>
                <option value="netBanking">Net Banking</option>
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

export default FailedOtherReasonReportForm;
