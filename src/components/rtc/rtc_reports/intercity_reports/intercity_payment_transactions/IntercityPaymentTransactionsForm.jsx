import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import { useIntercityPaymentTransactionStore } from "../../../../../store/rtc/IntercityPaymentTransactionStore";
const IntercityPaymentTransactionsForm = ({
  PageIndex,
  pageSize,
  SetcurrentPage,
}) => {
  const {
    fetchIntercityPaymentTransactions,      
  } = useIntercityPaymentTransactionStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-payment-report-filters")
  );
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    
    paymentStatus: savedFilters?.paymentStatus
      ? savedFilters.paymentStatus
      : null,
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log("values", values);

    localStorage.setItem(
      "amrabad-payment-report-filters",
      JSON.stringify(values)
    );
    fetchIntercityPaymentTransactions({
      startDate: values.fromDate,
      endDate: values.toDate,
      paymentStatus: values.paymentStatus || "",
      phoneNumber: values.phoneNumber || "",
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
                // min={getCurrentDate()}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
                    // Automatically update toDate if it's earlier than fromDate
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
              <label className="block text-sm font-medium">
                Payment Status
              </label>
              <Field
                as="select"
                name="paymentStatus"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select Payment Status</option>
                <option value="INITIATE">Initiate</option>
                <option value="INPROCESS">In Process</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="FAILED">Failed</option>
              </Field>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile No
              </label>
              <Field
                type="tel"
                name="phoneNumber"
                placeholder="Enter mobile number"
                className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              />
            </div>

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
                      purchaseOrBooking: "",
                      modeOfBooking: "",
                      package: "",
                      house: "",
                      paymentStatus: "",
                      paymentMode: "",
                      phoneNumber: "",
                      transactionId: "",
                    },
                  });
                  fetchIntercityPaymentTransactions({
                    startDate: getCurrentDate(),
                    endDate: getCurrentDate(),
                    purchaseOrBooking: "",
                    modeOfBooking: "",
                    package: "",
                    house: "",
                    paymentStatus: "",
                    paymentMode: "",
                    phoneNumber: "",
                    transactionId: "",
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

export default IntercityPaymentTransactionsForm;
