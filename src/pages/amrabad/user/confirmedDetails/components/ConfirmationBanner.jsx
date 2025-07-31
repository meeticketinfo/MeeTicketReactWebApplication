import { FaCheckCircle } from "react-icons/fa";

const ConfirmationBanner = () => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 flex items-center gap-3 mb-4 sm:mb-6">
      <div>
        <div className="font-semibold text-black flex items-center gap-2 mb-2 sm:mb-3 text-sm sm:text-base">
          <FaCheckCircle className="text-green-600 text-xl sm:text-2xl" /> 
          Booking Confirmed!
        </div>
        <div className="text-black text-xs sm:text-sm">
          Thank you for your reservation. Your stay has been successfully booked.
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBanner;