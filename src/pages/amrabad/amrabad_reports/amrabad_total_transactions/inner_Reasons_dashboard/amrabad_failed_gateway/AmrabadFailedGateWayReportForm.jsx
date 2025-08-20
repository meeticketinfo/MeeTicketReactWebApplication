import { Formik, Form, Field } from "formik";
import useMetroTotalCommonStore from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalCommonStore";
import { useMetroTotalTransactionsStore } from "../../../../../store/metro_transaction_reports_store/metro_total/MetroTotalTransactionsStore";

const AmrabadFailedOtherReasonReport = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
}) => {
  const {
    innerFilters,
    setDeepInnerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
  } = useMetroTotalCommonStore();
  console.log("outerFilters", innerFilters);
  const { fetchMetroTotalTransactions } = useMetroTotalTransactionsStore();
  const initialValues = {
    startDate: (deepInnerFilters.startDate ?? innerFilters.fromDate) ?? "",
    endDate: (deepInnerFilters.endDate ?? innerFilters.toDate) ?? "",
    phoneNumber: (deepInnerFilters.mobileNumber ?? innerFilters.mobileNumber) ?? "",
    PaymentMode: deepInnerFilters.PaymentMode ?? "",
  };

  const onSubmit = (values) => {
    console.log("values", values);
    setDeepInnerFilters(values);
    fetchMetroTotalTransactions({
      ...values,
      status: innerFilters.status,
      subCategory: innerFilters.subCategory,
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

export default AmrabadFailedOtherReasonReport;
