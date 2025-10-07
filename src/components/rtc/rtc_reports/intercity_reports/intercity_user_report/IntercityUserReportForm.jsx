import { Formik, Form, Field } from "formik";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../utils/Helper";
import { useIntercityUserStore } from "../../../../../store/intercity/reports/IntercityUserReportStore";

const IntercityUserReportForm = ({
  PageIndex,
  pageNumber,
  pageSize,
  SetcurrentPage,
  updateCurrentFilters,
}) => {
  const { isIntercityUserReportsLoading, fetchIntercityUserReports } =
    useIntercityUserStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  const initialValues = (() => {
    // Try to get saved filters from localStorage first
    const savedFilters = localStorage.getItem(
      "userIntercityReportSearchParams"
    );
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        return {
          fromDate: parsedFilters.fromDate || startOfDay,
          toDate: parsedFilters.toDate || endOfDay,
          MobileNumber: parsedFilters.MobileNumber || "",
        };
      } catch (error) {
        console.error("Error parsing saved filters:", error);
      }
    }

    // If no saved filters, use default values
    return {
      fromDate: startOfDay,
      toDate: endOfDay,
      MobileNumber: "",
    };
  })();

  const onSubmit = (values) => {
    localStorage.setItem(
      "userIntercityReportSearchParams",
      JSON.stringify(values)
    );
    updateCurrentFilters({
      fromDate: values.fromDate,
      toDate: values.toDate,
      MobileNumber: values.MobileNumber || "",
    });

    fetchIntercityUserReports({
      fromDate: values.fromDate,
      toDate: values.toDate,
      MobileNumber: values.MobileNumber || "",
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    SetcurrentPage(0);
  };

  const resetForm = (setValues) => {
    const payload = {
      fromDate: startOfDay,
      toDate: endOfDay,
      MobileNumber: "",
    };

    // Clear saved filters from localStorage
    localStorage.setItem("userIntercityReportSearchParams", "");

    // Update current filters in parent component
    updateCurrentFilters(payload);

    setValues(payload);
    fetchIntercityUserReports({
      ...payload,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
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
                min={values.fromDate} 
              />
            </div>
            {/* mobile number */}
            <div>
              <label
                htmlFor="MobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="MobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
                onChange={(e) => {
                  setFieldValue("MobileNumber", e.target.value);
                }}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isIntercityUserReportsLoading}
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
