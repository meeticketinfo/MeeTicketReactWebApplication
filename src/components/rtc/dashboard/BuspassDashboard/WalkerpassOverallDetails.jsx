import React from "react";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import CountUp from "react-countup";
import { useBuspassDashboardStore } from "./store/buspassDashboardStore";

const WalkerpassOverallDetails = () => {
  const { buspassDashboard, isFetchBuspassDashboardLoading } = useBuspassDashboardStore();

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

  return (
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
            </div>
          </div>

          {/* Total Amount Card */}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkerpassOverallDetails;
