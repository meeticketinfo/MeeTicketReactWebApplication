import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { useEffect } from "react";
const AmrabadPaymentTransactionsForm = ({
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
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();

  useEffect(() => {
    getPackages();
  }, []);
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    purchaseOrBooking: savedFilters?.purchaseOrBooking || "Purchase",
    package: savedFilters?.package ? savedFilters.package : "",
    house: savedFilters?.house ? savedFilters.house : "",
    paymentStatus: savedFilters?.paymentStatus
      ? savedFilters.paymentStatus
      : null,
    modeOfBooking: savedFilters?.modeOfBooking || "",
    // paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
    transactionId: savedFilters?.transactionId ? savedFilters.transactionId : "",
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
      purchaseOrBooking: values.purchaseOrBooking  || "",
      package: values.package || "",
      house: values.house || "",
      paymentStatus: values.paymentStatus || "",
      // paymentMode: values.paymentMode || "",
      modeOfBooking: values.modeOfBooking,
      phoneNumber: values.phoneNumber || "",
      transactionId: values.transactionId || "",
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
                Purchase / Booking
              </label>
              <Field
                as="select"
                name="purchaseOrBooking"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="Purchase">Purchase Date</option>
                <option value="Booking">Booking Date</option>
              </Field>
            </div>
            {/* packages */}
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
              />
            </div>
             {/* transaction Status */}
            <div>
              <label
                htmlFor="transactionId"
                className="block text-xs font-medium text-gray-700"
              >
                Transaction ID
              </label>
              <Field
                type="text"
                name="transactionId"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter transaction ID"
              />
            </div>
             <div>
              <label className="block text-sm font-medium">
                Mode of booking
              </label>
              <Field
                as="select"
                name="modeOfBooking"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select</option>
                <option value="Web">Website</option>
                <option value="Mobile">Mobile</option>
              </Field>
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
                      purchaseOrBooking:"",
                      modeOfBooking:"",
                      package: "",
                      house: "",
                      paymentStatus: "",
                      paymentMode: "",
                      phoneNumber: "",
                      transactionId:"",
                    },
                  });
                  fetchAmrabadPaymentTransactions({
                    startDate: getCurrentDate(),
                    endDate: getCurrentDate(),
                    purchaseOrBooking:"",
                    modeOfBooking:"",
                    package: "",
                    house: "",
                    paymentStatus: "",
                    paymentMode: "",
                    phoneNumber: "",
                    transactionId:"",
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

export default AmrabadPaymentTransactionsForm;
