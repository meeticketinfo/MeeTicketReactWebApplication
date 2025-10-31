import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  cleanString,
} from "../../../../../utils/Helper";
import { useBuspassPaymentTransactionStore } from "../../../../../store/rtc/buspassPaymentTransactionStore";

const PaymentGatewayInnerReportForm = ({
  searchParameter,
  currentPage,
  pageNumber,
  pageSize ,
  SetcurrentPage,
  PAGE_LIMIT,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isBusPassPaymentTransactionsLoading,
    allBusPassPaymentTransactions,
    fetchBusPassPaymentTransactions,
  } = useBuspassPaymentTransactionStore();

  // Helper function to transform status for API calls
  const transformStatusForAPI = (status) => {
    if (status === "Not Settled") {
      return "notSettled";
    }
    return status || "";
  };

  // Get current date in YYYY-MM-DD format for date input
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get next day date for settlement date
  const getNextDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get saved filters from localStorage or use URL params or defaults
  const getInitialValues = () => {
    const savedParams = localStorage.getItem("busPassPaymentOuterTransactionSearchParams");
    
    if (savedParams && savedParams !== "") {
      // Use saved filters from localStorage
      const params = new URLSearchParams(savedParams);
      const transactionDate = cleanString(params.get("transactionDate"), "_", ":") || '';
      return {
        transactionDate: transactionDate,
        settlementDate: cleanString(params.get("settlementDate"), "_", ":") || '',
        status: searchParameter || "",
      };
    } else if (searchParams.toString()) {
      // Use URL params if no localStorage
      const transactionDate = cleanString(searchParams.get("transactionDate"), "_", ":") || '';
      return {
        transactionDate: transactionDate,
        settlementDate: cleanString(searchParams.get("settlementDate"), "_", ":") || '',
        status: searchParameter || "",
      };
    } else {
      // Use defaults - today's date
      const currentDate = getCurrentDate();
      return {
        transactionDate: '',
        settlementDate: '',
        status: searchParameter || "",
      };
    }
  };

  const initialValues = getInitialValues();

  // Fetch data on component mount with saved/current filters
  useEffect(() => {
    const savedParams = localStorage.getItem("busPassPaymentOuterTransactionSearchParams");
    console.log(savedParams);
    if (savedParams && savedParams !== "") {
      // Use saved filters
      const params = new URLSearchParams(savedParams);
      const transactionDate = cleanString(params.get("transactionDate"), "_", ":") || '';
      const settlementDate = cleanString(params.get("settlementDate"), "_", ":") || '';
      const status = searchParameter || cleanString(params.get("status"), "_", ":") || "";
      fetchBusPassPaymentTransactions({
        transactionDate: transactionDate,
        settlementDate: settlementDate,
        status: transformStatusForAPI(status),
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    } else if (searchParams.toString()) {
      // Use URL params
      const transactionDate = cleanString(searchParams.get("transactionDate"), "_", ":") ||'';
      const settlementDate = cleanString(searchParams.get("settlementDate"), "_", ":") || ''
      const status = searchParameter || cleanString(searchParams.get("status"), "_", ":") || "";
      fetchBusPassPaymentTransactions({
        transactionDate: transactionDate,
        settlementDate: settlementDate,
        status: transformStatusForAPI(status),
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    } else {
      // Use defaults - today's date
      const currentDate = getCurrentDate();
      fetchBusPassPaymentTransactions({
        transactionDate: "",
        settlementDate: '',
        status: transformStatusForAPI(searchParameter),
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    }
  }, [searchParameter,currentPage,PAGE_LIMIT]);

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    
    // Get status from searchParameter prop or searchParams
    const status = searchParameter || searchParams.get("status") || "";
    if (status) {
      newSearchParams.set("status", status);
    }
    
    setSearchParams(newSearchParams);
    
    // Save filters to localStorage when Search is clicked
    localStorage.setItem("busPassPaymentInnerTransactionSearchParams", newSearchParams.toString());

    fetchBusPassPaymentTransactions({
      transactionDate: values.transactionDate,
      settlementDate: values.settlementDate,
      status: transformStatusForAPI(status),
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
    SetcurrentPage(0);
  };

  const resetForm = (setValues) => {
    // Get current date in YYYY-MM-DD format for date input
    const getCurrentDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const currentDate = getCurrentDate();
    const payload = {
      transactionDate: '',
      settlementDate: '',
    };

    // Clear URL search params
    setSearchParams(new URLSearchParams());
    
    // Clear localStorage ONLY when Reset is clicked
  localStorage.removeItem("busPassPaymentInnerTransactionSearchParams");
    
    // Reset form values
    setValues(payload);
    
    // Reset page and fetch data

    fetchBusPassPaymentTransactions({
      transactionDate: payload.transactionDate,
      settlementDate: payload.settlementDate,
      status: transformStatusForAPI(searchParameter),
      pageNumber: 1,
      pageSize: pageSize,
    });
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 pb-3">
            
            {/* Transaction Date */}
            <div>
              <label
                htmlFor="transactionDate"
                className="block text-xs font-medium text-gray-700"
              >
                Transaction Date
              </label>
              <Field
                type="date"
                name="transactionDate"
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("transactionDate", e.target.value);
                  // Auto-update settlement date to next day if it's before transaction date
                  if (e.target.value && values.settlementDate) {
                    const transactionDate = new Date(e.target.value);
                    const settlementDate = new Date(values.settlementDate);
                    if (settlementDate <= transactionDate) {
                      setFieldValue("settlementDate", getNextDay(e.target.value));
                    }
                  }
                }}
              />
            </div>

            {/* Settlement Date */}
            <div>
              <label
                htmlFor="settlementDate"
                className="block text-xs font-medium text-gray-700"
              >
                Settlement Date
              </label>
              <Field
                type="date"
                name="settlementDate"
                min={values.transactionDate ? getNextDay(values.transactionDate) : undefined}
                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("settlementDate", e.target.value);
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isBusPassPaymentTransactionsLoading}
              >
              Search
              </button>
              {/* <button
                type="button"
                onClick={() => resetForm(setValues)}
                className="bg-gray-500 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-600 border border-gray-500"
                disabled={isBusPassPaymentTransactionsLoading}
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

export default PaymentGatewayInnerReportForm;