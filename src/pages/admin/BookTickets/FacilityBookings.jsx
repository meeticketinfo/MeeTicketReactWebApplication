import React, { useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AgGridTable from "../../../components/tables/AgGridTable";
import { useDashboardStore } from "../../../store/dashboard/dashboardStore";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { Field, Form, Formik } from "formik";

function FacilityBookings() {
  const {
    fetchAllFacilityBookingsByFilters,
    AllFacilityBookings,
    isFetchFacilityBookingsLoading,
  } = useDashboardStore();
  console.log("AllFacilityBookings", AllFacilityBookings);
  useEffect(() => {
    fetchAllFacilityBookingsByFilters({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchAllFacilityBookingsByFilters]);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchAllFacilityBookingsByFilters({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Facility Bookings
            </h1>
          </div>
          <div className="mb-8">
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ values, setFieldValue }) => (
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
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-green-700 hover:border hover:border-green-700 "
                      // disabled={isFetchAllMetroSummaryReportsLoading}
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            {/* <AgGridTable
               rowData={AllFacilityBookings}
               columnDefs={columnDefs}
               isFetchLoading={isFetchFacilityBookingsLoading}
            /> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default FacilityBookings;
