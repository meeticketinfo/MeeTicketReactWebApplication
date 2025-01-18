import React from "react";
import AdminLayout from "../../layouts/AdminLayout";

function MetroDashboard() {
  return (
    <AdminLayout>
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
            Dashboard
          </h1>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
      </div>
      {/* Cards */}
      {/* <div className="grid grid-cols-12 gap-6">
        {cardsToDisplay &&
          cardsToDisplay.map((card, index) => (
            <DashboardCard01
              key={index} // It's important to provide a key when rendering lists
              lableName={card.lableName}
              count={card.count}
              percentageChange={card.percentageChange}
              icon={card.icon}
            />
          ))}
        {roleDetails?.name == "ROLE_SUPERADMIN" && (
          <DashboardCard07>
            <div className="flex">
              <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
                <PieChart
                  data={allPieCharts}
                  title="Total Booking By Location"
                  angleKey="entityWiseTotalBookings"
                />
              </div>
              <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
                <PieChart
                  data={allPieCharts}
                  title="Total Amount By Location"
                  angleKey="entityWiseTotalAmount"
                />
              </div>
            </div>
          </DashboardCard07>
        )}

        <DashboardCard07 header={true} title="Location Bookings">
          <div className="">
            <div>
              <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions)}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
                      {(role === "ROLE_SUPERADMIN" ||
                        role === "ROLE_NODALOFFICER") && (
                        <div>
                          <label className="block text-xs font-medium">
                            Location
                          </label>
                          <Field
                            as="select"
                            name="entityId"
                            className={`mt-1 block w-full px-2 py-1 border
                            border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          >
                            <option value="">Select </option>
                            {parksToRender
                              ?.filter((park) => park.isActive)
                              ?.map((park) => (
                                <option key={park.id} value={park.id}>
                                  {park.name}
                                </option>
                              ))}
                          </Field>
                        </div>
                      )}

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
                            if (
                              new Date(fromDateValue) >
                              new Date(values.toDate)
                            ) {
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
                          min={values.fromDate || getCurrentDate()} // Ensure toDate can't be earlier than fromDate
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
                          disabled={isFetchEntityBookingsLoading}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <AgGridTable
              isFetchLoading={isFetchEntityBookingsLoading}
              rowData={allEntityBookings || []}
              columnDefs={dashboardColumnDefs}
              onPageChange={handlePageChange}
              totalRecords={totalEntityBookingRecords}
              enableAdvancedFilter={true}
            />
          </div>
        </DashboardCard07>
      </div> */}
    </div>
  </AdminLayout>
  );
}

export default MetroDashboard;
