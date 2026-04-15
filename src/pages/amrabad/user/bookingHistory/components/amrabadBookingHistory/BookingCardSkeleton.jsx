import React from "react";

const BookingCardSkeleton = () => {
  return (
    <div className="bg-white border border-[#D0D7CE] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-3 sm:p-4 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Image Skeleton */}
        <div className="flex-shrink-0 flex justify-center lg:block mb-3 lg:mb-0">
          <div className="w-24 h-16 sm:w-28 sm:h-20 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Header with Property Name and Status */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
            <div className="mb-1 sm:mb-0 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 min-w-0 flex-wrap">
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-16 sm:w-20"></div>
              </div>
              {/* Package */}
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 mb-1 sm:mb-2"></div>
            </div>
            <div className="text-left sm:text-right">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-20 sm:w-24"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mt-1"></div>
            </div>
          </div>

          {/* Details Grid Skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 mb-4 sm:mb-6 max-w-screen-md">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-14"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Skeleton */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 pt-3 sm:pt-4 border-t border-gray-200 mt-3">
        <div className="flex flex-col xs:flex-row gap-1 lg:gap-4">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-28"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="flex gap-2 lg:gap-4">
          <div className="h-6 bg-gray-200 rounded w-16 sm:w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16 sm:w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default BookingCardSkeleton; 