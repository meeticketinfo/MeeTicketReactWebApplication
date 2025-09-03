import React, { useEffect, useState } from "react";
import DashboardCard01 from "../../../../partials/dashboard/DashboardCard01";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { superballs } from "ldrs";
import CountUp from "react-countup";
import { Field, Form, Formik } from "formik";
import { useRtcDashboardStore } from "../../../../store/rtc/RtcDashboardStore";
import BuswiseDetails from "./buswiseDetails";

function IntercitypassDasboard() {
  superballs.register();
  const {
    fetchallPassData,
    fetchallPassTypeData,
    fetchallbuspasses,
    fetchallDashboardReportData,
  } = useRtcDashboardStore();
  const [activeTab, setActiveTab] = useState("buspass");
  const initialValues = {
    fromDate: "",
    toDate: "",
  };
  useEffect(() => {
    fetchallPassData({
      fromDate: "",
      toDate: "",
    });
    fetchallPassTypeData({
      fromDate: "",
      toDate: "",
    });
    fetchallDashboardReportData({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      passTypeId: "",
    });
    fetchallbuspasses();
  }, []);

  // overAll on submit
  const overAllOnSubmit = (values) => {
    fetchallPassData({ ...values, active: true });
  };
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
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

          {/* Ticket Summary Section */}
          <div className="col-span-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Ticket Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-36">
              {/* Total Bookings Card */}
              <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm p-6 border border-gray-200 h-32">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Total Bookings
                    </h3>
                    <div className="text-2xl font-bold text-gray-800">
                      <CountUp end={8456} duration={2} separator="," />
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IoTicketSharp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Tickets Card */}
              <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm p-6 border border-gray-200 h-32">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Total Tickets
                    </h3>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      <CountUp end={12847} duration={2} separator="," />
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Adults:</span>{" "}
                      <span className="font-semibold text-gray-800">
                        <CountUp end={8234} duration={2} separator="," />
                      </span>{" "}
                      |{" "}
                      <span className="font-medium">Children:</span>{" "}
                      <span className="font-semibold text-gray-800">
                        <CountUp end={4613} duration={2} separator="," />
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IoTicketSharp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Amount Card */}
              <div className="bg-[#F1F2FBCC] rounded-lg shadow-sm p-6 border border-gray-200 h-32">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Total Amount
                    </h3>
                    <div className="text-2xl font-bold text-gray-800">
                      <span className="text-gray-700">₹</span>{" "}
                      <CountUp end={2456780} duration={2} separator="," />
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaIndianRupeeSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-full mb-8">
            <BuswiseDetails />
          </div>
        </>
      </div>
    </>
  );
}

export default IntercitypassDasboard;
