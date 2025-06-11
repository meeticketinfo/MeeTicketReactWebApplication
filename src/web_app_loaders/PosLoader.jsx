import React from "react";
import { FaRupeeSign, FaCreditCard } from "react-icons/fa";

const PosLoader = () => {
  return (
    <div className="fixed inset-0 z-[99999999] flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 backdrop-blur-sm">
      {/* Funny bouncing rupee */}
      <div className="text-4xl text-green-600 animate-bounce mb-4">
        <FaRupeeSign />
      </div>

      {/* Rotating credit card */}
      <div className="animate-spin-slow mb-4">
        <FaCreditCard className="text-blue-500 text-5xl" />
      </div>

      {/* Fun text */}
      <p className="text-lg text-gray-800 font-semibold">
        Your Booking is doing somersaults 🌀
      </p>
      <p className="text-sm text-gray-600 mt-1 italic">
        Booking is processing... hold tight!
      </p>
    </div>
  );
};

export default PosLoader;
