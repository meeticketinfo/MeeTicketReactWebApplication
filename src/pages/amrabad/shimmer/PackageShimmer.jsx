import React from "react";

const PackageShimmer = () => {
  return (
    <div className="flex flex-col content-center items-center justify-center h-[70vh] min-h-full relative p-10">
      {/* Background image shimmer */}
      <div className="w-full h-full bg-gray-300 animate-pulse absolute top-0 left-0 rounded-lg"></div>
      
      {/* Overlay shimmer */}
      <div className="absolute top-0 left-0 w-full h-full bg-gray-400 bg-opacity-50 rounded-lg"></div>
      
      {/* Content shimmer */}
      <div className="relative z-10 max-w-[350px] flex flex-col gap-6 justify-center items-center">
        {/* Title shimmer */}
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        
        {/* Button shimmer */}
        <div className="h-12 bg-gray-200 rounded-md animate-pulse w-32"></div>
      </div>
    </div>
  );
};

export default PackageShimmer;
