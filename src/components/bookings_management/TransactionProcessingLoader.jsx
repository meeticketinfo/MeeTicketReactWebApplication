import React from "react";
import { superballs } from "ldrs";

function TransactionProcessingLoader() {
  superballs.register();
  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#092537] bg-opacity-95">
        {/* Pulsating Dots */}
        <l-superballs size="100" speed="1.4" color="#00F6BD"></l-superballs>
        {/* Heading */}
        <h2 className="mt-6 text-white text-lg font-semibold">
          Processing Your Transaction...
        </h2>
        {/* Subtext */}
        {/* <p className="mt-2 text-center text-gray-300 text-sm max-w-sm">
          Please wait a moment while we complete your transaction. This won’t
          take long.
        </p> */}
      </div>
    </>
  );
}

export default TransactionProcessingLoader;
