import React, { useState, useEffect } from "react";

const PackageShimmer = ({ variant = "full" }) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Compact variant for smaller loading states
  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full animate-shimmer-wave"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-slow rounded-full"></div>
        </div>
        <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-shimmer-wave w-32 mb-2"></div>
        <div className="h-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-shimmer-wave w-24"></div>
      </div>
    );
  }

  // Minimal variant for inline loading
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className="flex flex-col content-center items-center justify-center h-[70vh] min-h-full relative p-10 overflow-hidden">
      {/* Animated background with gradient shimmer */}
      <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 absolute top-0 left-0 rounded-lg animate-pulse">
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Overlay with animated opacity */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-400/60 to-gray-600/80 rounded-lg animate-pulse"></div>
      
      {/* Content shimmer with staggered animations */}
      <div className="relative z-10 max-w-[350px] flex flex-col gap-6 justify-center items-center">
        {/* Title shimmer with wave effect */}
        <div className="relative">
          <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-shimmer-wave w-48"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow"></div>
        </div>
        
        {/* Button shimmer with enhanced styling */}
        <div className="relative">
          <div className="h-12 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-md animate-shimmer-wave w-32"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-slow"></div>
        </div>
        
        {/* Additional decorative elements */}
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Loading text with phase changes */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm font-medium">
        {animationPhase === 0 && "Loading packages..."}
        {animationPhase === 1 && "Preparing your experience..."}
        {animationPhase === 2 && "Almost ready..."}
      </div>
    </div>
  );
};

export default PackageShimmer;
