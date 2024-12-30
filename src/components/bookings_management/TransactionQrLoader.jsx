import React from "react";
import { hourglass } from "ldrs";

function TransactionQrLoader() {
  hourglass.register();
  return (
    <>
      <div className="fixed inset-0 z-50 flex gap-4 flex-col items-center justify-center bg-[#092537] bg-opacity-100">
        {/* Pulsating Dots */}
        <h2 className="mt-6 text-white text-lg font-semibold">
          Processing Your Transaction...
        </h2>
        <l-hourglass
          size="90"
          bg-opacity="0.1"
          speed="1.75"
          color="#00F6BD"
        ></l-hourglass>
        {/* Heading */}
      </div>
    </>
  );
}

export default TransactionQrLoader;
