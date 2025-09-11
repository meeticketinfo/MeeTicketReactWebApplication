import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../utils/Helper";
import { useBuspassUserStore } from "../../../../../store/rtc/RtcUserReportStore";

const IntercityUserReportForm = ({
  PageIndex,
  pageNumber,
  pageSize,
  SetcurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isBusPassUserReportsLoading,
    allBusPassUserReports,
    fetchBusPassUserReports,
  } = useBuspassUserStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  // Get current date and time in the format required for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getCurrentDateWithEndTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T23:59`;
  };
  

  const maxDateTime = getCurrentDateTime();
  console.log(searchParams.get("mobileNo"));
  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    mobileNo: searchParams.get("mobileNo") || "",
  };

  const onSubmit = (values) => {
    console.log(values);
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    localStorage.setItem("userBusPassReportSearchParams", newSearchParams);

    fetchBusPassUserReports({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNo: values.mobileNo || "",
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    SetcurrentPage(0);
  };

  const resetForm = (setValues) => {
    const payload = {
      fromDate: startOfDay,
      toDate: endOfDay,
      mobileNo: "",
    };

    // Clear URL search params
    setSearchParams(new URLSearchParams());
    localStorage.setItem("userBusPassReportSearchParams", "");
    setValues(payload);
    fetchBusPassUserReports({
      ...payload,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    localStorage.setItem("userBusPassReportSearchParams", "");
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 pb-3">
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
                  // If toDate is less than fromDate, update fromDate to match toDate
                  if (
                    values.fromDate &&
                    new Date(toDateValue) < new Date(values.fromDate)
                  ) {
                    setFieldValue("fromDate", toDateValue);
                  }
                  setFieldValue("toDate", toDateValue);
                }}
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
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isBusPassUserReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => resetForm(setValues)}
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
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

export default IntercityUserReportForm;
