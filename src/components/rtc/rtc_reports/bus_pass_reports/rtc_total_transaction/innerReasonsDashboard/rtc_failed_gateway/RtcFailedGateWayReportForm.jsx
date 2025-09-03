import { Formik, Form, Field } from "formik";
import busPassTotalCommonStore from "../../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/busPassTotalCommonStore";
import { useBusPassTotalTransactionStore } from "../../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";
import { useEffect } from "react";


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
  } = busPassTotalCommonStore();
  console.log("outerFilters", innerFilters);
  const { fetchRtcTotalTransactions, AllBusPassesData, fetchAllBusPasses } = useBusPassTotalTransactionStore();
  useEffect(() => {
    fetchAllBusPasses();
  }, []);
  const initialValues = {
    startDate: (deepInnerFilters.startDate ?? innerFilters.fromDate) ?? "",
    endDate: (deepInnerFilters.endDate ?? innerFilters.toDate) ?? "",
    phoneNumber: (deepInnerFilters.mobileNumber ?? innerFilters.mobileNumber) ?? "",
    BusPassType:(deepInnerFilters.BusPassType??innerFilters.BusPassType) ?? "",
  };

  const onSubmit = (values) => {
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
                  AllBusPassesData?.map((item) => (
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
