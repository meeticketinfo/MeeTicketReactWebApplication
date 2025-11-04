import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../utils/Helper";
import { useBuspassUserStore } from "../../../../../store/rtc/RtcUserReportStore";
import Select from "react-select";
 
const PaymentGatewayReportForm = ({
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
    depotName: searchParams.get("depotName") || "",
    paymentGateway: searchParams.get("paymentGateway") || "",
    reportType: searchParams.get("reportType") || "Detailed",
  };

  // Mock data for dropdowns - replace with actual API data
  const depotOptions = [
    { value: "", label: "All Depots" },
    { value: "depot1", label: "Depot 1" },
    { value: "depot2", label: "Depot 2" },
    { value: "depot3", label: "Depot 3" },
  ];

  const paymentGatewayOptions = [
    { value: "paytm", label: "Paytm" },
    { value: "razorpay", label: "Razorpay" },
    { value: "phonepe", label: "PhonePe" },
    { value: "googlepay", label: "Google Pay" },
  ];
 
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
      depotName: values.depotName || "",
      paymentGateway: values.paymentGateway || "",
      reportType: values.reportType || "Detailed",
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    SetcurrentPage(0);
  };
 
  const resetForm = (setValues) => {
    const payload = {
      fromDate: startOfDay,
      toDate: endOfDay,
      depotName: "",
      paymentGateway: "",
      reportType: "Detailed",
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
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 pb-3">
            
            {/* From Date */}
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

            {/* To Date */}
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
                onChange={(e) => {
                  const toDateValue = e.target.value;
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
            {/* Depot Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Depot Name
              </label>
              <Select
                name="depotName"
                value={depotOptions.find(option => option.value === values.depotName) || depotOptions[0]}
                options={depotOptions}
                onChange={(selectedOption) =>
                  setFieldValue("depotName", selectedOption?.value || "")
                }
                className="mt-1 text-sm"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    outline: "none",
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    borderRadius: "6px",
                    height: "30px",
                    minHeight: "33px",
                  }),
                  menu: (base) => ({
                    ...base,
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    fontSize: "0.775rem",
                    backgroundColor: isFocused ? "#F8F8F8" : "white",
                    color: isFocused ? "#0C3771" : "#000",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>

            {/* Payment Gateway */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Payment Gateway
              </label>
              <Select
                name="paymentGateway"
                value={paymentGatewayOptions.find(option => option.value === values.paymentGateway) || paymentGatewayOptions[0]}
                options={paymentGatewayOptions}
                onChange={(selectedOption) =>
                  setFieldValue("paymentGateway", selectedOption?.value || "")
                }
                className="mt-1 text-sm"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    outline: "none",
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    borderRadius: "6px",
                    height: "30px",
                    minHeight: "33px",
                  }),
                  menu: (base) => ({
                    ...base,
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    fontSize: "0.775rem",
                    backgroundColor: isFocused ? "#F8F8F8" : "white",
                    color: isFocused ? "#0C3771" : "#000",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>

            {/* Type - Radio buttons */}
            {/* <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center">
                  <Field
                    type="radio"
                    name="reportType"
                    value="Summary"
                    className="mr-1"
                  />
                  <span className="text-xs">Summary</span>
                </label>
                <label className="flex items-center">
                  <Field
                    type="radio"
                    name="reportType"
                    value="Detailed"
                    className="mr-1"
                  />
                  <span className="text-xs">Detailed</span>
                </label>
              </div>
            </div> */}


            {/* Buttons */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                
                disabled={isBusPassUserReportsLoading}
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
 
export default PaymentGatewayReportForm;
