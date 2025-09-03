import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import { useAmrabadUserStore } from "../../../../store/amrabad/reports/UserReportStore";

const AmrabadUserReportForm = ({ PageIndex,pageNumber, pageSize, SetcurrentPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    isAmrabadUserReportsLoading,
    fetchAmrabadUserReports,
  } = useAmrabadUserStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
    mobileNumber: searchParams.get("mobileNumber") || "",
  };

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach(key => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    localStorage.setItem("userAmrabadReportSearchParams", newSearchParams);

    fetchAmrabadUserReports({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber,
      pageNumber:pageNumber,
      pageSize: pageSize,
    });
    SetcurrentPage(0)
  };

  const resetForm = (setValues) => {
    const payload = {
      fromDate: startOfDay,
      toDate: endOfDay,
      mobileNumber: "",
    };

    // Clear URL search params
    setSearchParams(new URLSearchParams());
    localStorage.setItem("userAmrabadReportSearchParams", "");
    setValues(payload);
    fetchAmrabadUserReports({ ...payload, pageNumber: pageNumber, pageSize: pageSize });
    localStorage.setItem("userAmrabadReportSearchParams", "");
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
                  
                  // Check if selected fromDate is today
                  const today = new Date();
                  const selectedDate = new Date(fromDateValue);
                  const isToday = today.toDateString() === selectedDate.toDateString();
                  
                  if (isToday) {
                    // If fromDate is today, set toDate to tomorrow
                    const tomorrow = new Date(selectedDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tomorrowString = tomorrow.toISOString().slice(0, 16);
                    setFieldValue("toDate", tomorrowString);
                  } else if (new Date(fromDateValue) >= new Date(values.toDate)) {
                    // If fromDate is same as or later than toDate, set toDate to next day after fromDate
                    const nextDay = new Date(selectedDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    const nextDayString = nextDay.toISOString().slice(0, 16);
                    setFieldValue("toDate", nextDayString);
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
                  const fromDate = new Date(values.fromDate);
                  const toDate = new Date(toDateValue);
                  
                  // Prevent selecting the same date as fromDate
                  if (fromDate.toDateString() === toDate.toDateString()) {
                    // Set toDate to next day after fromDate
                    const nextDay = new Date(fromDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    const nextDayString = nextDay.toISOString().slice(0, 16);
                    setFieldValue("toDate", nextDayString);
                  } else {
                    setFieldValue("toDate", toDateValue);
                  }
                }}
                min={(() => {
                  if (!values.fromDate) return "";
                  const fromDate = new Date(values.fromDate);
                  const nextDay = new Date(fromDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  return nextDay.toISOString().slice(0, 16);
                })()}
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
                name="mobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("mobileNumber", e.target.value);
                }}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isAmrabadUserReportsLoading}
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

export default AmrabadUserReportForm;