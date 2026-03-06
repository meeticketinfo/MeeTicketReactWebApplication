import { Formik, Form, Field } from "formik";
import busPassTotalCommonStore from "../../../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/busPassTotalCommonStore";
import { useBusPassTotalTransactionStore } from "../../../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/BusPassTotalTransactionStore";
import { useEffect } from "react";

// Helper function to get current datetime in the format required for datetime-local max attribute
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to get current date with 23:59 time for To Date field
const getCurrentDateWithEndTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T23:59`;
};


const RtcFailedGateWayReportForm = ({
  pageNumber,
  pageSize,
  SetcurrentPage,
}) => {
  const {
    innerFilters,
    setDeepInnerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
    outerFilters,
  } = busPassTotalCommonStore();
  console.log("outerFilters", innerFilters);
  const { fetchRtcTotalTransactions, AllBusPassesData, fetchAllBusPasses } = useBusPassTotalTransactionStore();
  useEffect(() => {
    fetchAllBusPasses();
  }, []);
  const initialValues = {
    startDate: (deepInnerFilters.startDate || innerFilters.fromDate) ?? "",
    endDate: (deepInnerFilters.endDate || innerFilters.toDate) ?? "",
    phoneNumber: (deepInnerFilters.mobileNumber || innerFilters.mobileNumber) ?? "",
    BusPassType:(deepInnerFilters.BusPassType||innerFilters.BusPassType) ?? "",
  };

  const onSubmit = (values) => {
    // Validate date range
    if (values.startDate && values.endDate && new Date(values.startDate) > new Date(values.endDate)) {
      alert("From Date cannot be greater than To Date. Please select a valid date range.");
      return;
    }

    console.log("values", values);
    setDeepInnerFilters(values);
    fetchRtcTotalTransactions({
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
                type="date"
                name="startDate"
                max={getCurrentDateTime()}
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("startDate", fromDateValue);
                  // If startDate is greater than endDate, update endDate to match startDate
                  if (values.endDate && new Date(fromDateValue) > new Date(values.endDate)) {
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
                type="date"
                name="endDate"
                max={getCurrentDateWithEndTime()}
                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  // If endDate is less than startDate, update startDate to match endDate
                  if (values.startDate && new Date(toDateValue) < new Date(values.startDate)) {
                    setFieldValue("startDate", toDateValue);
                  }
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
            <div>
              <label
                htmlFor="BusPassType"
                className="block text-xs font-medium text-gray-700"
              >
                Bus Pass Type
              </label>
              <Field
                as="select"
                name="BusPassType"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("BusPassType", e.target.value);
                }}
              >
                <option value="">All</option>
                {
                  AllBusPassesData?.filter((item) => item.isActive).map((item) => (
                    <option value={item.passTypeId}>{item.passTypeName}</option>
                  ))
                }
                
                
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

export default RtcFailedGateWayReportForm;
