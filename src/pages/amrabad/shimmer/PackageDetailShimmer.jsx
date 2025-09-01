import React, { useState, useEffect } from "react";

const PackageDetailShimmer = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-pulse">
      {/* Hero Section Shimmer */}
      <div className="h-[350px] relative mb-7 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
        <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-gray-600/80 to-transparent py-4 md:py-8">
          <div className="container flex flex-col md:flex-row gap-3 md:gap-6 justify-between items-start md:items-center mx-auto px-3">
            <div className="h-8 bg-gray-300 rounded animate-shimmer-wave w-48 md:w-64"></div>
            <div className="h-10 bg-gray-300 rounded-md animate-shimmer-wave w-24 md:w-32"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto text-sm md:text-base px-3">
        <div className="space-y-8">
          {/* Highlights Section Shimmer */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-gray-200 to-gray-100 p-3 md:p-4 pl-6 md:pl-10 rounded-tl-[50px] mb-5 w-full md:max-w-[50%]">
              <div className="h-6 bg-gray-300 rounded animate-shimmer-wave w-40"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded animate-shimmer-wave"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-300 rounded animate-shimmer-wave w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded animate-shimmer-wave w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center py-4">
        <div className="text-gray-500 text-sm font-medium">
          {animationPhase === 0 && "Loading package details..."}
          {animationPhase === 1 && "Preparing your adventure..."}
          {animationPhase === 2 && "Almost ready..."}
        </div>
      </div>
    </div>
  );
};

export default PackageDetailShimmer; 