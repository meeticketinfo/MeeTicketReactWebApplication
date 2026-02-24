import React, { useEffect, useState } from "react";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { superballs } from "ldrs";
import CountUp from "react-countup";
import { Field, Form, Formik } from "formik";
import BuswiseDetails from "./buswiseDetails";
import { useIntercityDashboardStore } from "./store/intercityDashboardStore";
import { ToastContainer } from "react-toastify";
function IntercitypassDasboard() {
  superballs.register();
  const {
    fetchIntercityDashboard,
    intercityDashboard,
    isFetchIntercityDashboardLoading,
  } = useIntercityDashboardStore();
  const initialValues = {
    fromDate: "",
    toDate: "",
    typeOfBooking: "",
  };
  useEffect(() => {
    fetchIntercityDashboard({
      fromDate: "",
      toDate: "",
      typeOfBooking: "",
    });
  }, []);

  // overAll on submit
  const overAllOnSubmit = (values) => {
    fetchIntercityDashboard({ ...values, active: true });
  };
  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-12 gap-6 uppercase">
        <>
          <div className="col-span-full ">
            <Formik initialValues={initialValues} onSubmit={overAllOnSubmit}>
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-0">
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
                            new Date(fromDateValue) > new Date(values.toDate)
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
                    <div>
                      <label className="block text-sm font-medium">
                        Purchase / Booking
                      </label>
                      <Field
                        as="select"
                        name="typeOfBooking"
                        className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      >
                        <option value="">Select</option>
                        <option value="Purchase">Purchase Date</option>
                        <option value="Booking">Booking Date</option>
                      </Field>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="bg-green-700 text-xs  uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
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

          {/* Ticket Summary Section */}
          <div className="col-span-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Ticket Summary
            </h2>
            {isFetchIntercityDashboardLoading ? (
              <div className="space-y-6">
                {/* Row 1: Ticket-related metrics skeleton (3 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="bg-[#F1F2FBCC] rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                          <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                          {index === 2 && (
                            <div className="h-3 bg-gray-300 rounded w-32"></div>
                          )}
                        </div>
                        <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2: Financial metrics skeleton (3 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="bg-[#F1F2FBCC] rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-28 mb-2"></div>
                          <div className="h-8 bg-gray-300 rounded w-20"></div>
                        </div>
                        <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 3: Refund-related financial metrics skeleton (2 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2].map((index) => (
                    <div key={index} className="bg-[#F1F2FBCC] rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                          <div className="h-8 bg-gray-300 rounded w-20"></div>
                        </div>
                        <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : intercityDashboard?.overallTotals ? (
              <div className="space-y-6">
                {/* Row 1: Ticket-related metrics (3 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Bookings Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg h-[125px] shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Bookings
                        </h3>
                        <div className="text-2xl font-bold text-gray-800">
                          <CountUp end={intercityDashboard.overallTotals.totalBookings || 0} duration={2} separator="," />
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IoTicketSharp className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Tickets Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm h-[125px] p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Tickets
                        </h3>
                        <div className="text-2xl font-bold text-gray-800 mb-2">
                          <CountUp end={intercityDashboard.overallTotals.totalTickets || 0} duration={2} separator="," />
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Male:</span>{" "}
                          <span className="font-semibold text-gray-800">
                            <CountUp end={intercityDashboard.overallTotals.male || 0} duration={2} separator="," />
                          </span>{" "}
                          |{" "}
                          <span className="font-medium">Female:</span>{" "}
                          <span className="font-semibold text-gray-800">
                            <CountUp end={intercityDashboard.overallTotals.female || 0} duration={2} separator="," />
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IoTicketSharp className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Cancelled Tickets Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm h-[125px] p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Cancelled Tickets
                        </h3>
                        <div className="text-2xl font-bold text-gray-800 mb-2">
                          <CountUp end={intercityDashboard.overallTotals.cancelledTickets || 0} duration={2} separator="," />
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Male:</span>{" "}
                          <span className="font-semibold text-gray-800">
                            <CountUp end={intercityDashboard.overallTotals.cancelledMale || 0} duration={2} separator="," />
                          </span>{" "}
                          |{" "}
                          <span className="font-medium">Female:</span>{" "}
                          <span className="font-semibold text-gray-800">
                            <CountUp end={intercityDashboard.overallTotals.cancelledFemale || 0} duration={2} separator="," />
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IoTicketSharp className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Financial metrics (3 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Credited Amount Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm h-[125px] p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Credited Amount
                        </h3>
                        <div className="text-2xl font-bold text-gray-800">
                          <span className="text-gray-700">₹</span>{" "}
                          <CountUp end={intercityDashboard.overallTotals.totalCreditedAmount || 0} duration={2} separator="," />
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaIndianRupeeSign className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Current Amount Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm h-[125px] p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Current Amount
                        </h3>
                        <div className="text-2xl font-bold text-gray-800">
                          <span className="text-gray-700">₹</span>{" "}
                          <CountUp end={intercityDashboard.overallTotals.totalCurrentAmount || 0} duration={2} separator="," />
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaIndianRupeeSign className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Cancelled Amount Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm h-[125px] p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Cancelled Amount
                        </h3>
                        <div className="text-2xl font-bold text-gray-800">
                          <span className="text-gray-700">₹</span>{" "}
                          <CountUp end={intercityDashboard.overallTotals.totalCancelledAmount || 0} duration={2} separator="," />
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaIndianRupeeSign className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Refund-related financial metrics (2 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Refund Processed Amount Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm h-[125px] p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Refund Processed Amount
                        </h3>
                        <div className="text-2xl font-bold text-gray-800">
                          <span className="text-gray-700">₹</span>{" "}
                          <CountUp end={intercityDashboard.overallTotals.totalRefundProcessedAmount || 0} duration={2} separator="," />
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaIndianRupeeSign className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Refunded Amount Card */}
                  <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Total Refunded Amount
                        </h3>
                        <div className="text-2xl font-bold text-gray-800">
                          <span className="text-gray-700">₹</span>{" "}
                          <CountUp end={intercityDashboard.overallTotals.totalRefundAmount || 0} duration={2} separator="," />
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaIndianRupeeSign className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No data available
              </div>
            )}
          </div>
          <div className="col-span-full mb-8">
            <BuswiseDetails intercityDashboard={intercityDashboard}/>
          </div>
        </>
      </div>
    </>
  );
}

export default IntercitypassDasboard;
