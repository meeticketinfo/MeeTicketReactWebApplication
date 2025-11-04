import React from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../utils/TypographyHelper";
import { useWalkerpassStore } from "./store/walkerpassStore";

const WalkerpassFilter = () => {
  const { fetchWalkerpassDashboard, isFetchWalkerpassDashboardLoading } = useWalkerpassStore();

  const initialValues = {
    fromDate:'',
    toDate:'',
  };

  const onSubmit = (values) => {
    fetchWalkerpassDashboard({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };


  return (
    <div className="col-span-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Walkers Pass</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ values, resetForm }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-0">
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
                    id="fromDate"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
                    type="date"
                    name="toDate"
                    id="toDate"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    disabled={isFetchWalkerpassDashboardLoading}
                    className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchWalkerpassDashboardLoading ? "Search" : "Search"}
                  </button>
               
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default WalkerpassFilter;
