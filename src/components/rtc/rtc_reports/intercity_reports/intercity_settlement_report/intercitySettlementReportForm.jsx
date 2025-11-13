import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  cleanString,
} from "../../../../../utils/Helper";
import { useIntercitySettlementStore } from "../../../../../store/rtc/intercitySettlementStore";
 
const IntercitySettlementReportForm = ({
  PageIndex,
  pageNumber = 1,
  pageSize = 10,
  SetcurrentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isIntercitySettlementTransactionsLoading,
    allIntercitySettlementTransactions,
    fetchIntercitySettlementTransactions,
  } = useIntercitySettlementStore();
 
  // Get next day date for settlement date
  const getNextDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get current date in YYYY-MM-DD format for date input
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get saved filters from URL params or localStorage (do not inject defaults when absent)
  const getInitialValues = () => {
    if (searchParams.toString()) {
      // Use URL params first (highest priority)
      const transactionDate = cleanString(searchParams.get("transactionDate"), "_", ":") || "";
      return {
        transactionDate: transactionDate,
        settlementDate: cleanString(searchParams.get("settlementDate"), "_", ":") || "",
      };
    } else {
      const savedParams = localStorage.getItem("intercitySettlementOuterTransactionSearchParams");
      
      if (savedParams && savedParams !== "") {
        // Use saved filters from localStorage if no URL params
        const params = new URLSearchParams(savedParams);
        const transactionDate = cleanString(params.get("transactionDate"), "_", ":") || "";
        return {
          transactionDate: transactionDate,
          settlementDate: cleanString(params.get("settlementDate"), "_", ":") || "",
        };
      } else {
        return {
          transactionDate: "",
          settlementDate: "",
        };
      }
    }
  };

  const initialValues = getInitialValues();

  // Fetch data on component mount with URL params or saved/current filters; if empty, call API with empty strings
  useEffect(() => {
    if (searchParams.toString()) {
      // Use URL params first (highest priority)
      const transactionDate = cleanString(searchParams.get("transactionDate"), "_", ":") || "";
      const settlementDate = cleanString(searchParams.get("settlementDate"), "_", ":") || "";
   
      fetchIntercitySettlementTransactions({
        transactionDate: transactionDate,
        settlementDate: settlementDate,
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    } else {
      const savedParams = localStorage.getItem("intercitySettlementOuterTransactionSearchParams");

      if (savedParams && savedParams !== "") {
        // Use saved filters if no URL params
        const params = new URLSearchParams(savedParams);
        const transactionDate = cleanString(params.get("transactionDate"), "_", ":") || "";
        const settlementDate = cleanString(params.get("settlementDate"), "_", ":") || "";
      
        fetchIntercitySettlementTransactions({
          transactionDate: transactionDate,
          settlementDate: settlementDate,
          pageNumber: pageNumber,
          pageSize: pageSize,
        });
      } else {
        fetchIntercitySettlementTransactions({
          transactionDate: "",
          settlementDate: "",
          pageNumber: pageNumber,
          pageSize: pageSize,
        });
      }
    }
  }, []);

  const onSubmit = (values) => {
    const newSearchParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newSearchParams.set(key, cleanString(values[key], ":", "_"));
      }
    });
    setSearchParams(newSearchParams);
    
    // Save filters to localStorage when Search is clicked
    localStorage.setItem("intercitySettlementOuterTransactionSearchParams", newSearchParams.toString());

    fetchIntercitySettlementTransactions({
      transactionDate: values.transactionDate,
      settlementDate: values.settlementDate,
      // status: cleanString(searchParams.get("status"), "_", ":") || "",
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
      transactionDate: currentDate,
      settlementDate: getNextDay(currentDate),
    };

    // Clear URL search params
    setSearchParams(new URLSearchParams());
    
    // Clear localStorage ONLY when Reset is clicked
      localStorage.removeItem("intercitySettlementOuterTransactionSearchParams");
    
    // Reset form values
    setValues(payload);

    fetchIntercitySettlementTransactions({
      transactionDate: payload.transactionDate,
      settlementDate: payload.settlementDate,
      pageNumber: 1,
      pageSize: pageSize,
    });
  };
 
  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            
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
                
                disabled={isIntercitySettlementTransactionsLoading}
              >
              Search
              </button>
              <button
                type="button"
                onClick={() => resetForm(setValues)}                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "

                disabled={isIntercitySettlementTransactionsLoading}
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
 
export default IntercitySettlementReportForm;
