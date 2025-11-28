import { Field, Form, Formik } from "formik";
import React from "react";
import { getCurrentDate } from "../../../utils/TypographyHelper";

const CounterWiseTickets = () => {
  const initialValues = {
    bookingPurchaseDate: "false",
    fromDate: "",
    toDate: "",
  };
  const OnSubmit = (values) => {
    console.log("values", values);
  };
  return (
    <div className="px-4 py-3 bg-[#F6F7FD] border border-[#E1E5FC] rounded-lg">
      <div className="flex justify-between  ">
        <h1 className="text-lg font-semibold">Counter Wise Tickets</h1>
        <div className="">
          <Formik initialValues={initialValues} onSubmit={OnSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <div className="flex gap-2">
                  {/* from date */}
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
                      className={`mt-1  w-52 px-2 py-[2px] border border-gray-200 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
                  {/* to date */}
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
                      className={`mt-1  w-52 px-2 py-[2px] border border-gray-200 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                      min={values.fromDate || getCurrentDate()}
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  {/* search button */}
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      // disabled={isFetchEntityBookingsLoading}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CounterWiseTickets;
