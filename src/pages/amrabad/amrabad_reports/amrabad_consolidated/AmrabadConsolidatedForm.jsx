import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import { useAmrabadBookingStore } from "./store/amarabadBookingstore";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { useEffect } from "react";

const AmrabadConsolidatedForm = ({ PageIndex, pageSize, SetcurrentPage }) => {
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();
  const {
    allAmrabadBookings,
    fetchAllAmrabadBookings,
    isFetchAllAmrabadBookingsLoading,
  } = useAmrabadBookingStore();

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    typeOfBooking: "Purchase",
    phoneNumber: "",
    package: "",
    houses: "",
    orderId: "",
    paymentStatus: "",
    modeOfBooking: "",
    PaymentMode: "",
  };

  const onSubmit = (values, { resetForm }) => {
    // Reset to first page when applying new filters
    SetcurrentPage(0);

    fetchAllAmrabadBookings({
      startDate: values.fromDate,
      endDate: values.toDate,
      bookingSource: values.typeOfBooking,
      mobileNumber: values.phoneNumber ? values.phoneNumber : "",
      PaymentMode: values.PaymentMode ? values.PaymentMode : "",
      package: values.package ? values.package : "",
      houses: values.houses ? values.houses : "",
      orderId: values.orderId ? values.orderId : "",
      paymentStatus: values.paymentStatus ? values.paymentStatus : "",
      modeOfBooking: values.modeOfBooking ? values.modeOfBooking : "",
      PageIndex: PageIndex,
      pageSize: pageSize,
    });
  };

  useEffect(() => {
    getPackages();
  }, []);

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
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
                name="typeOfBooking"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="Purchase">Purchase Date</option>
                <option value="Booking">Booking Date</option>
              </Field>
            </div>
            <div>
              <label className="block text-sm font-medium">Package</label>
              <Field
                as="select"
                name="package"
                  onChange={(e) => {
                  const packageId = e.target.value;
                  setFieldValue("package", packageId);
                  setFieldValue("houses", "");
                  
                  if (packageId !== "") {
                    getHouses(packageId);
                  }
                }}
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
              <label className="block text-sm font-medium">Houses</label>
              <Field
                as="select"
                name="houses"
                disabled={values.package == ""}
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                Mobile number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="phoneNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="orderId"
                className="block text-xs font-medium text-gray-700"
              >
                Order ID / Transaction ID
              </label>
              <Field
                type="text"
                name="orderId"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Payment status
              </label>
              <Field
                as="select"
                name="paymentStatus"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="FAILED">Cancelled</option>
              </Field>
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
                <option value=""> Select </option>
                <option value="Website">Website</option>
                <option value="Mobile">Mobile</option>
              </Field>
            </div>
           
            {/* submit */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isFetchAllAmrabadBookingsLoading}
              >
                Search
              </button>
              {/* <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isFetchAllAmrabadBookingsLoading}
                onClick={() => {
                  resetForm({
                    values: {
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      typeOfBooking: "",
                      phoneNumber: "",
                      PaymentMode: "",
                      package: "",
                      houses: "",
                      orderId: "",
                      paymentStatus: "",
                      modeOfBooking: "",
                    },
                  });
                }}
              >
                Reset
              </button> */}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AmrabadConsolidatedForm;
