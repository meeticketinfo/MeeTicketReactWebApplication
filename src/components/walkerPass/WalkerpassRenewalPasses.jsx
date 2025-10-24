import React from "react";
import { FaBus } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import CountUp from "react-countup";
import { useWalkerpassStore } from "./store/walkerpassStore";

const WalkerpassRenewalPasses = () => {
  const { walkerPassDashboard, isFetchWalkerpassDashboardLoading } = useWalkerpassStore();
  
  // Get renewalSummary data from the store
  const renewalPasses = walkerPassDashboard?.data?.renewalSummary || [];

  const RenewalPassCard = ({ title, icon, count, amount, iconColor = "text-blue-600" }) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-full border border-gray-200">
      <div className="flex items-start mb-3">
        <div className={`w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        
        <div className="flex-1 ml-3">
          <div className="flex justify-between items-center mb-2">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Count: <CountUp end={count} duration={2.5} separator="," />
            </div>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <FaIndianRupeeSign className="text-xs" />
              <CountUp end={amount} duration={2.5} separator="," />
            </div>
          </div>
          <h3 className="text-sm font-bold text-gray-800 text-start">{title}</h3>
        </div>
      </div>
    </div>
  );

  // Helper function to get icon and color based on pass type
  const getPassConfig = (passName) => {
    const lowerPassName = passName.toLowerCase();
    
    if (lowerPassName.includes('metro') || lowerPassName.includes('luxury')) {
      return { icon: <FaBus className="text-xl" />, color: "text-blue-600" };
    } else if (lowerPassName.includes('ordinary')) {
      return { icon: <FaBus className="text-xl" />, color: "text-green-600" };
    } else if (lowerPassName.includes('pushpak')) {
      return { icon: <FaBus className="text-xl" />, color: "text-purple-600" };
    }
    
    // Default to bus icon
    return { icon: <FaBus className="text-xl" />, color: "text-blue-600" };
  };

  return (
    <div className="col-span-full">
      <div className="mb-4 sm:mb-2 mt-4">
        <h2 className="text-xl sm:text-xl font-bold text-gray-800">Renewal Passes</h2>
      </div>
      
          {isFetchWalkerpassDashboardLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="flex gap-2">
                  <div className="bg-gray-300 h-6 w-16 rounded-full"></div>
                  <div className="bg-gray-300 h-6 w-20 rounded-full"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : renewalPasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {renewalPasses.map((pass) => {
            const config = getPassConfig(pass.passName);
            return (
              <RenewalPassCard
                key={pass.passName}
                title={pass.passName}
                icon={config.icon}
                count={parseInt(pass.renewalCount) || 0}
                amount={parseFloat(pass.renewalAmount) || 0}
                iconColor={config.color}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-gray-500 text-lg">No Renewal Pass data available</div>
        </div>
      )}
    </div>
  );
};

export default WalkerpassRenewalPasses;
