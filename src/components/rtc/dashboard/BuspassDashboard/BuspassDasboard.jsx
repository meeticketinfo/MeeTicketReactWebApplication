import React, { useEffect, useState } from "react";
import { IoTicketSharp } from "react-icons/io5";
import { getCurrentDate } from "../../../../utils/TypographyHelper";

// Helper function to get current datetime in the format required for date max attribute
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get current date with 23:59 time for To Date field
const getCurrentDateWithEndTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
import { superballs } from "ldrs";
import CountUp from "react-countup";
import { Field, Form, Formik } from "formik";
import HyderabadPassesDashboard from "./HyderabadPassesDashboard";
import { useBuspassDashboardStore } from "./store/buspassDashboardStore";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ExpiredBuspassDashboard from "./ExpiredBuspassDashboard";
import RenewalBuspassDashboard from "./RenewalBuspassDashboard";

function BuspassDasboard() {
  superballs.register();
  const { fetchBuspassDashboard, buspassDashboard, isFetchBuspassDashboardLoading } = useBuspassDashboardStore();
  const initialValues = {
    fromDate: "",
    toDate: "",
  };
  console.log("buspassDashboard", buspassDashboard);
  useEffect(() => {
    fetchBuspassDashboard({
      fromDate: "",
      toDate: "",
    })
  }, []);

  // overAll on submit
  const overAllOnSubmit = (values) => {
    // Validate date range
    if (values.fromDate && values.toDate && new Date(values.fromDate) > new Date(values.toDate)) {
      alert("From Date cannot be greater than To Date. Please select a valid date range.");
      return;
    }

    fetchBuspassDashboard({ ...values, active: true });
  };

  // Loading skeleton for overall details cards
  const OverallLoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Total Count Card Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
        <div className="flex justify-between items-center gap-3 mb-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-16 mb-6"></div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Amount Card Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
        <div className="flex justify-between items-center gap-3 mb-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-5 bg-gray-300 rounded w-28 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-20 mb-6"></div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const genderconfig = {
    "C": "Child",
    "M": "Men",
    "O": "Others",
    "S": "Senior Citizen",
    "UNKNOWN": "Unknown",
    "W": "Women",
  }

  return (
    <>

      <div className="grid grid-cols-12 gap-6">

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
                      max={getCurrentDateTime()} // Prevent future dates from being selected
                      onChange={(e) => {
                        const fromDateValue = e.target.value;
                        setFieldValue("fromDate", fromDateValue);
                        // If fromDate is greater than toDate, update toDate to match fromDate
                        if (values.toDate && new Date(fromDateValue) > new Date(values.toDate)) {
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
                      max={getCurrentDateWithEndTime()} // Prevent future dates and show 23:59 as max time
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        // If toDate is less than fromDate, update fromDate to match toDate
                        if (values.fromDate && new Date(toDateValue) < new Date(values.fromDate)) {
                          setFieldValue("fromDate", toDateValue);
                        }
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Overall Details
          </h2>
          {isFetchBuspassDashboardLoading ? (
            <OverallLoadingSkeleton />
          ) : (
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
                      <p className="text-sm text-gray-500">
                        All Passes Count
                      </p>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800 mb-6">
                    <CountUp
                      end={parseInt(buspassDashboard?.data?.freshPassSummary?.[0]?.newPassCount || 0) + (buspassDashboard?.data?.renewalSummary?.reduce((total, item) => total + parseInt(item.renewalCount || 0), 0) || 0)}
                      duration={2}
                      separator=","
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      ID Cards
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      <CountUp
                        end={parseInt(buspassDashboard?.data?.freshPassSummary?.[0]?.idCardsCount || 0)}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      New Passes
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      <CountUp
                        end={parseInt(buspassDashboard?.data?.freshPassSummary?.[0]?.newPassCount || 0)}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      Renewal Passes
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      <CountUp
                        end={buspassDashboard?.data?.renewalSummary?.reduce((total, item) => total + parseInt(item.renewalCount || 0), 0) || 0}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      One Day Pass
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      <CountUp
                        end={parseInt(buspassDashboard?.data?.freshPassSummary?.[0]?.oneDayPassCount || 0)}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                </div>
              </div>


              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center gap-3 mb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaIndianRupeeSign className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Total Amount
                      </h3>
                      <p className="text-sm text-gray-500">
                        All Passes Amount
                      </p>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800 mb-6">
                    ₹<CountUp
                      end={parseFloat(buspassDashboard?.data?.freshPassSummary?.[0]?.newPassAmount || 0) + (buspassDashboard?.data?.renewalSummary?.reduce((total, item) => total + parseFloat(item.renewalAmount || 0), 0) || 0)}
                      duration={2}
                      separator=","
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      ID Cards
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹<CountUp
                        end={parseFloat(buspassDashboard?.data?.freshPassSummary?.[0]?.idCardsAmount || 0)}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      New Passes
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹<CountUp
                        end={parseFloat(buspassDashboard?.data?.freshPassSummary?.[0]?.newPassAmount || 0)}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      Renewal Passes
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹<CountUp
                        end={buspassDashboard?.data?.renewalSummary?.reduce((total, item) => total + parseFloat(item.renewalAmount || 0), 0) || 0}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
                    <span className="text-sm font-medium text-gray-600">
                      One Day Pass
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹<CountUp
                        end={parseFloat(buspassDashboard?.data?.freshPassSummary?.[0]?.oneDayPassAmount || 0)}
                        duration={2}
                        separator=","
                      />
                    </span>
                  </div>
                </div>
              </div>
              {/* one day pass category */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center gap-3 mb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaIndianRupeeSign className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                         Count
                      </h3>
                      <p className="text-sm text-gray-500">
                        One Day Pass
                      </p>
                    </div>
                  </div>
                </div>
         
                <div className=" grid grid-cols-2 gap-3 my-1">
                  {
                    buspassDashboard?.data?.oneDayPassCategoryCount?.map((p) => {
                      return (
                        <div className="flex justify-between shadow-md  items-center p-3 bg-[#F1F6FB] rounded-lg">
                          <span className="text-sm font-medium text-gray-600">
                            {genderconfig[p.employeeGender]}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            <CountUp
                              end={parseFloat(p.categoryWiseCount || 0)}
                              duration={2}
                              separator=","
                            />
                          </span>
                        </div>
                      )
                    })
                  }
                </div>
                
              </div>

              {/* on day pass amount */}

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center gap-3 mb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaIndianRupeeSign className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                         Amount
                      </h3>
                      <p className="text-sm text-gray-500">
                        One Day Pass
                      </p>
                    </div>
                  </div>
                </div>
         
                <div className=" grid grid-cols-2 gap-3 my-1">
                  {
                    buspassDashboard?.data?.oneDayPassCategoryCount?.map((p) => {
                      return (
                        <div className="flex justify-between shadow-md  items-center p-3 bg-[#F1F6FB] rounded-lg">
                          <span className="text-sm font-medium text-gray-600">
                            {genderconfig[p.employeeGender]}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                          ₹<CountUp
                              end={parseFloat(p.categoryWiseAmount || 0)}
                              duration={2}
                              separator=","
                            />
                          </span>
                        </div>
                      )
                    })
                  }
                </div>
                
              </div>
            </div>
          )}
        </div>
        <div className="col-span-full">
          <HyderabadPassesDashboard />
          <ExpiredBuspassDashboard />
          {/* <RenewalBuspassDashboard /> */}
        </div>
      </div>
    </>
  );
}

export default BuspassDasboard;
