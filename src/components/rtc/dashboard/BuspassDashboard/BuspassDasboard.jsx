import React, { useEffect, useState } from "react";
import { IoTicketSharp } from "react-icons/io5";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { superballs } from "ldrs";
import CountUp from "react-countup";
import { Field, Form, Formik } from "formik";
import { useRtcDashboardStore } from "../../../../store/rtc/RtcDashboardStore";
import HyderabadPassesDashboard from "./HyderabadPassesDashboard";

function BuspassDasboard() {
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
;

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
     
        {activeTab === "buspass" && (
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
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Overall Details
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Count Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-center gap-3 mb-0">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IoTicketSharp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Total Count
                        </h3>
                        <p className="text-sm text-[#F1F6FB]0">
                          All Passes Count
                        </p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-800 mb-6">
                      <CountUp end={12847} duration={2} separator="," />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        ID Cards
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        <CountUp end={2156} duration={2} separator="," />
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        New Passes
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        <CountUp end={8234} duration={2} separator="," />
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        Renewal Passes
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        <CountUp end={2457} duration={2} separator="," />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-center gap-3 mb-0">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IoTicketSharp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Total Count
                        </h3>
                        <p className="text-sm text-[#F1F6FB]0">
                          All Passes Count
                        </p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-800 mb-6">
                      <CountUp end={12847} duration={2} separator="," />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        ID Cards
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        <CountUp end={2156} duration={2} separator="," />
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        New Passes
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        <CountUp end={8234} duration={2} separator="," />
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        Renewal Passes
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        <CountUp end={2457} duration={2} separator="," />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full mb-8">
              <HyderabadPassesDashboard />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BuspassDasboard;
