import React from "react";
import { FaBus } from "react-icons/fa";
import { FaTrain } from "react-icons/fa";
import CountUp from "react-countup";
import { useBuspassDashboardStore } from "./store/buspassDashboardStore";

const ExpiredBuspassDashboard = () => {
  const { buspassDashboard, isFetchBuspassDashboardLoading } = useBuspassDashboardStore();
  
  // Get expiredBusPasses data from the store
  const expiredBusPasses = buspassDashboard?.expiredBusPasses || [];

  const SimplePassCard = ({ title, icon, count, iconColor = "text-blue-600" }) => (
    <div className="bg-white rounded-2xl shadow-lg p-3 w-full border border-gray-200">
      <div className="flex items-start mb-3">
        <div className={`w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div className="bg-blue-100 text-gray-700 px-4 py-2 mt-1 ml-2 rounded-full text-sm font-medium">
          Count: <CountUp end={count} duration={2.5} separator="," />
        </div>
      </div>
      <h3 className="text- font-bold text-gray-800 text-start text-sm">{title}</h3>
    </div>
  );

  // Helper function to get icon and color based on pass type
  const getPassConfig = (passName) => {
    const lowerPassName = passName.toLowerCase();
    
    if (lowerPassName.includes('metro') || lowerPassName.includes('luxury')) {
      return { icon: <FaTrain className="text-xl" />, color: "text-blue-600" };
    } else if (lowerPassName.includes('ordinary')) {
      return { icon: <FaBus className="text-xl" />, color: "text-blue-600" };
    }
    
    // Default to bus icon
    return { icon: <FaBus className="text-xl" />, color: "text-blue-600" };
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-2 mt-4">
        <h2 className="text-xl sm:text-xl font-bold text-gray-800">Expired Bus Passes</h2>
      </div>
      
      {isFetchBuspassDashboardLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2].map((index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="bg-gray-300 h-6 w-20 rounded-full"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : expiredBusPasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-3">
          {expiredBusPasses.map((pass) => {
            const config = getPassConfig(pass.passName);
            return (
              <SimplePassCard
                key={pass.passName}
                title={pass.passName}
                icon={config.icon}
                count={pass.expiredCount}
                iconColor={config.color}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-gray-500 text-lg">No Expired Bus Pass data available</div>
        </div>
      )}
    </div>
  );
};

export default ExpiredBuspassDashboard;
