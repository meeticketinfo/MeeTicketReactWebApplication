import React from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import AgGridTable from "../../../../components/tables/AgGridTable";

const AmrabadAvailabilityOuter = () => {
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    // Handle form submission here
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ resetForm, values }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
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
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            {/* submit */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-8">
        <AgGridTable
          ExportName="Individual Booking Details"
          isPagination={false}
          IsReactPaginate={true}
          showSearch={false}
        />
      </div>
    </div>
  );
};

export default AmrabadAvailabilityOuter;
