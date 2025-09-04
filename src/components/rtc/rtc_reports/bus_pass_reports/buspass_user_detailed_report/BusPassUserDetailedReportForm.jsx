import { Formik, Form, Field } from "formik";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePackagesStore } from "../../../../../store/amrabad/masters/packagesStore";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useBuspassUserStore } from "../../../../../store/rtc/RtcUserReportStore";

const BusPassUserDetailedReportForm = ({
  pageNumber,
  pageSize,
  setcurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isBusPassUserDetailedReportsLoading,
    allBusPassUserDetailedReports,
    fetchBusPassUserDetailedReports,
  } = useBuspassUserStore();
  const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();

  // Load packages on component mount
  useEffect(() => {
    getPackages();
  }, [getPackages]);

  // Load houses if packageId is present in search params
  useEffect(() => {
    const packageId = searchParams.get("packageId");
    if (packageId) {
      getHouses(packageId);
    }
  }, [searchParams, getHouses]);

  useEffect(() => {
    if (searchParams.toString()) {
      const newSearchParams = new URLSearchParams();

      for (const [key, value] of searchParams.entries()) {
        if (value) {
          newSearchParams.set(key, cleanString(value, ":", "_"));
        }
      }
      localStorage.setItem(
        "userDetailedBusPassReportSearchParams",
        newSearchParams.toString()
      );
    }
  }, [searchParams]);

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    paymentMode: searchParams.get("paymentMode") || "",
    mobileNo: searchParams.get("mobileNo") || "",
  };

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key] && values[key] !== "") {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    localStorage.setItem("userDetailedBusPassReportSearchParams", newSearchParams.toString());

    fetchBusPassUserDetailedReports({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNo: values.mobileNo,
      paymentMode: values.paymentMode || "",
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    setcurrentPage(0);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="datetime-local"
                name="fromDate"
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                type="datetime-local"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
                min={values.fromDate}
              />
            </div>
            {/* mobile number */}
            <div>
              <label
                htmlFor="mobileNo"
                className="block text-xs font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="mobileNo"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("mobileNo", e.target.value);
                }}
              />
            </div>
           <div>
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
            </div>
         
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isBusPassUserDetailedReportsLoading}
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

export default BusPassUserDetailedReportForm;
