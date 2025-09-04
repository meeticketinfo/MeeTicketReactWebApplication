import React from "react";
import { FaBus } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import CountUp from "react-countup";
import { useBuspassDashboardStore } from "./store/buspassDashboardStore";

const HyderabadPassesDashboard = () => {
  const { buspassDashboard, isFetchBuspassDashboardLoading } = useBuspassDashboardStore();
  
  // Get hyderabadPasses data from the store
  const hyderabadPasses = buspassDashboard?.hyderabadPasses || [];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full lg:flex-1 min-w-0 border border-gray-200 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
      
      {/* Total Section Skeleton */}
      <div className="bg-[#F1F6FB] rounded-lg p-3 mb-3">
        <div className="mb-3">
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="h-6 bg-gray-300 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* New Passes Section Skeleton */}
      <div className="bg-[#F1F6FB] rounded-lg p-3 mb-3">
        <div className="mb-3">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="h-6 bg-gray-300 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Renewal Passes Section Skeleton */}
      <div className="bg-[#F1F6FB] rounded-lg p-3">
        <div className="mb-3">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="h-6 bg-gray-300 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const PassCard = ({ title, icon, data, iconStyle = "" }) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full lg:flex-1 min-w-0 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className={`text-xl sm:text-2xl text-blue-600 ${iconStyle}`}>
          {icon}
        </div>
        <h3 className="text-base sm:text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      
      {/* Total Section */}
      <div className="bg-[#F1F6FB] rounded-lg p-3 mb-3">
        <div className="mb-3">
          <h4 className="text-sm sm:text-base font-semibold text-[#032E69]">Total</h4>
        </div>
        <div className="flex justify-between items-end">
          <div >
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
              <CountUp 
                end={data.totalCount} 
                duration={2.5}
                separator=","
                className="text-lg sm:text-xl font-bold text-gray-800"
              />
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Total Count</div>
          </div>
          <div >
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-1">
              <FaIndianRupeeSign className="text-gray-600 text-xs sm:text-sm" />
              <CountUp 
                end={data.totalAmount} 
                duration={2.5}
                separator=","
                className="text-lg sm:text-xl font-bold text-gray-800"
              />
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Total Amount</div>
          </div>
        </div>
      </div>

      {/* New Passes Section */}
      <div className="bg-[#F1F6FB] rounded-lg p-3 mb-3">
        <div className="mb-3">
          <h4 className="text-sm sm:text-base font-semibold text-[#032E69]">New Passes</h4>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
              <CountUp 
                end={data.newCount} 
                duration={2.5}
                separator=","
                className="text-lg sm:text-xl font-bold text-gray-800"
              />
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">New Pass Count</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-1">
              <FaIndianRupeeSign className="text-gray-600 text-xs sm:text-sm" />
              <CountUp 
                end={data.newAmount} 
                duration={2.5}
                separator=","
                className="text-lg sm:text-xl font-bold text-gray-800"
              />
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">New Pass Amount</div>
          </div>
        </div>
      </div>

      {/* Renewal Passes Section */}
      <div className="bg-[#F1F6FB] rounded-lg p-3">
        <div className="mb-3">
          <h4 className="text-sm sm:text-base font-semibold text-[#032E69]">Renewal Passes</h4>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
              <CountUp 
                end={data.renewalCount} 
                duration={2.5}
                separator=","
                className="text-lg sm:text-xl font-bold text-gray-800"
              />
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Renewal Count</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-1">
              <FaIndianRupeeSign className="text-gray-600 text-xs sm:text-sm" />
              <CountUp 
                end={data.renewalAmount} 
                duration={2.5}
                separator=","
                className="text-lg sm:text-xl font-bold text-gray-800"
              />
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Renewal Amount</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function to get icon style based on pass type
  const getIconStyle = (index) => {
    const styles = [
      "", // No special style for first card
      "border-b-2 border-gray-400", // Second card
      "border-b-2 border-gray-400 border-t-2", // Third card
    ];
    return styles[index] || "";
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-2">
        <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2">Hyderabad Passes</h2>
      </div>
      
      {isFetchBuspassDashboardLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      ) : hyderabadPasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {hyderabadPasses.map((pass, index) => (
            <PassCard
              key={pass.passName}
              title={pass.passName}
              icon={<FaBus />}
              data={{
                totalCount: pass.totalCount,
                totalAmount: pass.totalAmount,
                newCount: pass.newCount,
                newAmount: pass.newAmount,
                renewalCount: pass.renewalCount,
                renewalAmount: pass.renewalAmount,
              }}
              iconStyle={getIconStyle(index)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-gray-500 text-lg">No Hyderabad Pass data available</div>
        </div>
      )}
    </div>
  );
};

export default HyderabadPassesDashboard;
