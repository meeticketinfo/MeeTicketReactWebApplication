import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
const AmrabadPosTransactionForm = ({
  PageIndex,
  pageSize,
  SetcurrentPage,
}) => {
  const {
    fetchAmrabadPaymentTransactions,
    allAmrabadIndividualReports,
    setisAmrabadCompleteBookings,
    isAmrabadConsolidatedReportsLoading,
  } = useAmrabadConsolidatedStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-payment-report-filters")
  );
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    adminLoginMobileNumber: savedFilters?.adminLoginMobileNumber || "",
    ticketType: savedFilters?.ticketType || "",
    paymentMethod: savedFilters?.paymentMethod || "",
    transactionStatus: savedFilters?.transactionStatus || "",
    vehicleNumber: savedFilters?.vehicleNumber || "",
    userMobileNumber: savedFilters?.userMobileNumber || "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log("values", values);

    localStorage.setItem(
      "amrabad-payment-report-filters",
      JSON.stringify(values)
    );
    fetchAmrabadPaymentTransactions({
      startDate: values.fromDate,
      endDate: values.toDate,
      operatorMobileNumber: values.adminLoginMobileNumber || "",
      ticketType: values.ticketType || "",
      paymentMethod: values.paymentMethod || "",
      transactionStatus: values.transactionStatus || "",
      vehicleNumber: values.vehicleNumber || "",
      phoneNumber: values.userMobileNumber || "",
      PageIndex,
      pageSize,
    });
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 py-3">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="date"
                name="fromDate"
                className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
                    setFieldValue("toDate", fromDateValue);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-xs font-medium text-gray-700"
              >
                To Date
              </label>
              <Field
                type="date"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="adminLoginMobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Admin login Mobile Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="adminLoginMobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter admin mobile number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Ticket Type
              </label>
              <Field
                as="select"
                name="ticketType"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select Ticket Type</option>
                <option value="2-Wheeler">2-Wheeler</option>
                <option value="4-Wheeler">4-Wheeler</option>
                <option value="Bus">Bus</option>
              </Field>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Payment method
              </label>
              <Field
                as="select"
                name="paymentMethod"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </Field>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Transaction Status
              </label>
              <Field
                as="select"
                name="transactionStatus"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select Transaction Status</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
              </Field>
            </div>
            <div>
              <label
                htmlFor="vehicleNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Vehicle Number
              </label>
              <Field
                type="text"
                name="vehicleNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter vehicle number"
              />
            </div>
            <div>
              <label
                htmlFor="userMobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                User Mobile Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="userMobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter user mobile number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            {/* <div>
              <label
                htmlFor="paymentMode"
                className="block text-xs font-medium text-gray-700"
              >
                Payment Mode
              </label>
              <Field
                as="select"
                name="paymentMode"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("paymentMode", e.target.value);
                }}
              >
                <option value="">Select Mode</option>
                <option value="upi">UPI</option>
                <option value="creditCard">Credit Card</option>
                <option value="debitCard">Debit Card</option>
                <option value="netBanking">Net Banking</option>
              </Field>
            </div> */}
           
           
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
                onClick={() => {
                  localStorage.removeItem(
                    "amrabad-consolidated-report-filters"
                  );
                  resetForm({
                    values: {
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      adminLoginMobileNumber: "",
                      ticketType: "",
                      paymentMethod: "",
                      transactionStatus: "",
                      vehicleNumber: "",
                      userMobileNumber: "",
                    },
                  });
                  fetchAmrabadPaymentTransactions({
                    startDate: getCurrentDate(),
                    endDate: getCurrentDate(),
                    operatorMobileNumber: "",
                    ticketType: "",
                    paymentMethod: "",
                    transactionStatus: "",
                    vehicleNumber: "",
                    phoneNumber: "",
                    PageIndex,
                    pageSize,
                  });
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AmrabadPosTransactionForm;
