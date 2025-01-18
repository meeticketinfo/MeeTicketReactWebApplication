import React from "react";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import { VscError } from "react-icons/vsc";

function TransactionFailed() {
  const { setIsFirstStepTransaction } = useBookingsStore();
  return (
    <div className="p-20">
      <div className="flex flex-col gap-5 items-center mt">
        <VscError className="text-red-700 text-8xl" />
        <h1 className="text-xl">
        Your transaction couldn’t be completed. Please click below to continue with your booking..
        </h1>
        <button
          className="bg-blue-v2 text-white rounded-md px-4 py-2"
          onClick={() => {
            setIsFirstStepTransaction(false);
          }}
        >
          Click Here
        </button>
      </div>
    </div>
  );
}

export default TransactionFailed;
