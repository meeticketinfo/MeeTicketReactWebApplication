import { Formik, Form, Field } from "formik";
import AmarabadTotalCommonStore from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import { useAmarabadTotalTransactionStore } from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalTransactionStore";
import { usePackagesStore } from "../../../../../../store/amrabad/masters/packagesStore";

const IntercityFailedGateWayReportForm = ({
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
    innerFilters,
    setDeepInnerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
    outerFilters,
  } = AmarabadTotalCommonStore();
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();
  console.log("outerFilters", innerFilters);
  const { fetchAmrabadTotalTransactions } = useAmarabadTotalTransactionStore();
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
    fetchAmrabadTotalTransactions({
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
                  setFieldValue("package", packageId);
                  if (packageId === "") {
                    // Clear house when package is unselected
                    setFieldValue("house", "");
                  } else {
                    // Get houses only when package is selected
                    getHouses(packageId);
                  }
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
                disabled={values.package == ""}
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

export default IntercityFailedGateWayReportForm;
