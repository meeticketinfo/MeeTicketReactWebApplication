import React from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import AgGridTable from "../../../../components/tables/AgGridTable";

const AmrabadAvailabilityOuter = () => {
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    month: "",
    year: "",
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    // Handle form submission here
  };
  const handleReset = (resetForm) => {
    resetForm();
  };

  const months = [
    { value: "", label: "Select Month" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: "", label: "Select Year" },
    ...Array.from({ length: 5 }, (_, index) => {
      const year = currentYear + index;
      return { value: year.toString(), label: year.toString() };
    }),
  ];

  return (
    <div className="p-3 bg-white rounded-lg  shadow-md">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ resetForm, values }) => (
          <Form className="">
            <div className="flex items-end gap-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1">
                {/* From Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <Field
                    type="date"
                    name="fromDate"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    To Date
                  </label>

                  <Field
                    type="date"
                    name="toDate"
                    min={values?.fromDate || ""}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Month Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <Field
                    as="select"
                    name="month"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Field>
                </div>

                {/* Year Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <Field
                    as="select"
                    name="year"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {years.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => handleReset(resetForm)}
                  className="px-4 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-8">
      <AgGridTable
        ExportName="Individual Booking Details"
        // isFetchLoading={isAmrabadIndividualReportsLoading}
        isPagination={false}
        // tableHeight={allAmrabadIndividualReports?.data?.length > 10 ? 560 : 330}
        IsReactPaginate={true}
        // setPageLimit={setPAGE_LIMIT}
        // pageLimit={PAGE_LIMIT}
        // handlePageClick={handlePageClick}
        // currentPage={currentPage}
        // totalCount={allAmrabadIndividualReports[0]?.totalCount}
        // showTotalCount={true}
        // SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
      </div>
    </div>
  );
};

export default AmrabadAvailabilityOuter;
