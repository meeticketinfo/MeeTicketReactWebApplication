import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import DashboardCard01 from "../../partials/dashboard/DashboardCard01";
import useAuthStore from "../../store/authStore";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { getCurrentDate } from "../../utils/TypographyHelper";

function ToursimDashboard() {
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();

  useEffect(() => {
    // fetchAllDashboardCounts(roleDetails, {
    //   fromDate: "",
    //   toDate: "",
    //   active: false,
    // });
  }, []);
  const dashboardCards = [
    {
      lableName: "Total Tickets",
      count:  "10",
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Income",
      // count: allCounts?.totalAmount,
      count:  "100",
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const cardsToDisplay = dashboardCards;

  const initialValues = {
    fromDate: "",
    toDate: "",
  };
  const overAllOnSubmit = (values) => {
    console.log("values", values);
    // fetchAllDashboardCounts(roleDetails, { ...values, active: true });
  };
  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-12 gap-6  ">
        <div className="col-span-full ">
          <Formik initialValues={initialValues} onSubmit={overAllOnSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
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
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
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
      </div>
    </>
  );
}

export default ToursimDashboard;
