import React from "react";
import { useBuspassDashboardStore } from "./store/buspassDashboardStore";

const WalkerpassMostPopularPassType = () => {
  const { buspassDashboard, isFetchBuspassDashboardLoading } = useBuspassDashboardStore();

  const mostPopularPassType = buspassDashboard?.data?.mostPopularPassType || "Ordinary Pass";

  // Loading skeleton for the most popular pass type card
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full border border-gray-200 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  if (isFetchBuspassDashboardLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="col-span-full">
      <div className="mb-4 sm:mb-2 mt-4">
        <h2 className="text-xl sm:text-xl font-bold text-gray-800">Most Popular Pass Type</h2>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Popular Pass Type</h3>
        <p className="text-3xl font-bold text-blue-800">{mostPopularPassType}</p>
      </div>
    </div>
  );
};

export default WalkerpassMostPopularPassType;
