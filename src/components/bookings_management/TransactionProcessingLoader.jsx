import React from "react";

function TransactionProcessingLoader() {
  return (
    <>
   <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75">
  {/* Pulsating Dots */}
  <div className="flex space-x-4">
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse delay-400"></div>
  </div>
  {/* Heading */}
  <h2 className="mt-6 text-white text-lg font-semibold">Processing Your Transaction...</h2>
  {/* Subtext */}
  <p className="mt-2 text-center text-gray-300 text-sm max-w-sm">
    Please wait a moment while we complete your transaction. This won’t take long.
  </p>
</div>


    </>
  );
}

export default TransactionProcessingLoader;
