import React, { useState, useEffect } from "react";

const CheckoutDetailsShimmer = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="p-2 sm:p-4 bg-[#F6F7FB]">
        {/* Breadcrumb Shimmer */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-1 sm:gap-2">
              <div className="h-3 bg-gray-300 rounded animate-shimmer-wave w-16 sm:w-20"></div>
              {item < 4 && <div className="h-3 bg-gray-300 rounded animate-shimmer-wave w-2"></div>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left: House & Room Details Shimmer */}
          <div className="flex-1 min-w-0">
            {/* Add Houses Button Shimmer */}
            <div className="flex justify-end mb-4">
              <div className="h-6 bg-gray-300 rounded animate-shimmer-wave w-24"></div>
            </div>

            {/* Table Shimmer */}
            <div className="overflow-x-auto">
              <div className="w-full text-xs sm:text-sm border rounded-lg mb-4">
                {/* Table Header */}
                <div className="bg-[#F6F7FB] p-2">
                  <div className="grid grid-cols-6 gap-2">
                    <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                    <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                    <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                    <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                    <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                    <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                  </div>
                </div>
                
                {/* Table Body */}
                <div className="space-y-2 p-2">
                  {[1, 2].map((item) => (
                    <div key={item} className="grid grid-cols-6 gap-2 py-2 border-t">
                      <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                      <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                      <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                      <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                      <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                      <div className="h-4 bg-gray-300 rounded animate-shimmer-wave"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Shimmer */}
            <div className="bg-[#F6F7FB] rounded-lg p-3 sm:p-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded animate-shimmer-wave w-20"></div>
                  <div className="h-4 bg-gray-300 rounded animate-shimmer-wave w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded animate-shimmer-wave w-16"></div>
                  <div className="h-4 bg-gray-300 rounded animate-shimmer-wave w-12"></div>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <div className="h-5 bg-gray-300 rounded animate-shimmer-wave w-32"></div>
                  <div className="h-5 bg-gray-300 rounded animate-shimmer-wave w-20"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Cart Total Shimmer */}
          <div className="w-full lg:max-w-[300px]">
            <div className="bg-[#F6F7FB] rounded-lg p-4 sm:p-6">
              <div className="h-6 bg-gray-300 rounded animate-shimmer-wave w-24 mb-4"></div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded animate-shimmer-wave w-20"></div>
                  <div className="h-4 bg-gray-300 rounded animate-shimmer-wave w-16"></div>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <div className="h-5 bg-gray-300 rounded animate-shimmer-wave w-12"></div>
                  <div className="h-5 bg-gray-300 rounded animate-shimmer-wave w-16"></div>
                </div>
              </div>
              <div className="h-12 bg-gray-300 rounded-lg animate-shimmer-wave w-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center py-4">
        <div className="text-gray-500 text-sm font-medium">
          {animationPhase === 0 && "Loading cart details..."}
          {animationPhase === 1 && "Preparing your checkout..."}
          {animationPhase === 2 && "Almost ready..."}
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailsShimmer; 