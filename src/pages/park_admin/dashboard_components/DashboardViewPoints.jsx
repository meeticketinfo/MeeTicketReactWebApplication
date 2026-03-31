import React, { useEffect } from "react";
import CountUp from "react-countup";
import { IoTicketSharp } from "react-icons/io5";
import { useDashboardStore } from "../../../store/dashboard/dashboardStore";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../../utils/TypographyHelper";

const viewPoints = [
  {
    userId: 0,
    username: "Achchampet",
    mobileNumber: "6666666661",
    parkId: "101",
    totalTransactions: 7590,
    confirmedTransactions: 6878,
    failedTransactions: 299,
    totalAmountCollected: 413580.0,
    cashAmount: 220.0,
    upiAmount: 413360.0,
  },
  {
    userId: 0,
    username: "Akkamahadevi Safari",
    mobileNumber: "6666666668",
    parkId: "101",
    totalTransactions: 0,
    confirmedTransactions: 0,
    failedTransactions: 0,
    totalAmountCollected: 0.0,
    cashAmount: 0.0,
    upiAmount: 0.0,
  },
  {
    userId: 0,
    username: "FARAHABAD SAFARI",
    mobileNumber: "6666666665",
    parkId: "101",
    totalTransactions: 850,
    confirmedTransactions: 688,
    failedTransactions: 72,
    totalAmountCollected: 2086000.0,
    cashAmount: 373000.0,
    upiAmount: 1713000.0,
  },
  {
    userId: 0,
    username: "Kollam Safari",
    mobileNumber: "6666666664",
    parkId: "101",
    totalTransactions: 0,
    confirmedTransactions: 0,
    failedTransactions: 0,
    totalAmountCollected: 0.0,
    cashAmount: 0.0,
    upiAmount: 0.0,
  },
  {
    userId: 0,
    username: "Maddimadugu Checkpost",
    mobileNumber: "6666666667",
    parkId: "101",
    totalTransactions: 0,
    confirmedTransactions: 0,
    failedTransactions: 0,
    totalAmountCollected: 0.0,
    cashAmount: 0.0,
    upiAmount: 0.0,
  },
  {
    userId: 0,
    username: "Maddimadugu Chinthamatta Eco Tourism",
    mobileNumber: "6666666666",
    parkId: "101",
    totalTransactions: 0,
    confirmedTransactions: 0,
    failedTransactions: 0,
    totalAmountCollected: 0.0,
    cashAmount: 0.0,
    upiAmount: 0.0,
  },
  {
    userId: 0,
    username: "Octopus view Point",
    mobileNumber: "6666666663",
    parkId: "101",
    totalTransactions: 0,
    confirmedTransactions: 0,
    failedTransactions: 0,
    totalAmountCollected: 0.0,
    cashAmount: 0.0,
    upiAmount: 0.0,
  },
  {
    userId: 0,
    username: "Test",
    mobileNumber: "9999999999",
    parkId: "101",
    totalTransactions: 0,
    confirmedTransactions: 0,
    failedTransactions: 0,
    totalAmountCollected: 0.0,
    cashAmount: 0.0,
    upiAmount: 0.0,
  },
  {
    userId: 0,
    username: "Trekking routes",
    mobileNumber: "6666666662",
    parkId: "101",
    totalTransactions: 3,
    confirmedTransactions: 2,
    failedTransactions: 1,
    totalAmountCollected: 600.0,
    cashAmount: 300.0,
    upiAmount: 300.0,
  },
];

const DashboardViewPoints = () => {
  const { allViewPoints, fetchAllViewPointsCounts, isFetchViewPointsLoading } =
    useDashboardStore();
  
  const InitialValues = {
    fromDate: "",
    toDate: "",
  };

  useEffect(() => {
    fetchAllViewPointsCounts({ fromDate: "", toDate: "" });
  }, []);
  const OnSubmit = (values) => {
   
    fetchAllViewPointsCounts(values);
  };
  return (
    <>
      <div className="mt-4">
        <h3 className="text-xl text-gray-800 mt-6 mb-4 font-bold ">
          POS View Points Summary Count
        </h3>
        <div className="col-span-full mb-6 ">
          <Formik initialValues={InitialValues} onSubmit={OnSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
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
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-0 mb-6  ">
          {allViewPoints?.map((item, index) => (
            <>
              {isFetchViewPointsLoading ? (
                <div class="mx-auto w-full max-w-sm rounded-md border p-4">
                  <div class="flex animate-pulse space-x-4">
                    <div class="size-10 rounded-full bg-gray-200"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 rounded bg-gray-200"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                          <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                        </div>
                        <div class="h-2 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="bg-[#EFF6FF] rounded-xl p-3 shadow-md relative transition-all duration-300 border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-md sm:text-lg text-gray-700 font-medium">
                      {item.username}
                    </div>
                    <div className="w-8 h-8 bg-[#D9DEF7] rounded-lg flex items-center justify-center">
                      <IoTicketSharp className="text-blue-600 text-lg" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        Total Count
                      </div>
                      <div className="text-md sm:text-xl font-bold text-gray-700 leading-tight">
                        <CountUp
                          end={item.confirmedTransactions || 0}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        Total Amount
                      </div>
                      <div className="text-md sm:text-xl font-bold text-gray-700 leading-tight">
                        <CountUp
                          end={item.totalAmountCollected || 0}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500 font-medium">
                        Total Cash
                      </div>
                      <div className="text-md font-bold text-gray-700 leading-tight">
                        <CountUp
                          end={item.cashAmount || 0}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500 font-medium">
                        Total UPI
                      </div>
                      <div className="text-md font-bold text-gray-700 leading-tight">
                        <CountUp
                          end={item.upiAmount || 0}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardViewPoints;
