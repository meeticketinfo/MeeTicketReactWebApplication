import { FaHome, FaCalendarAlt, FaRupeeSign, FaBox, FaHashtag } from "react-icons/fa";
import { IoCalendarClearOutline } from "react-icons/io5";
import { PiHouseLine } from "react-icons/pi";
import { BsCurrencyRupee } from "react-icons/bs";

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();
};

const HouseDetails = ({ houses }) => {
  // console.log("houses", houses);
  
  return (
    <div className="">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black flex items-center gap-2">
        <PiHouseLine className="w-5 h-5 text-[#304A3A]" />
        House Details:
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {houses?.bookingItems.map((house, idx) => (
          <div 
            key={house?.bookingId} 
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {house?.roomName ?? "N/A"}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FaHashtag className="w-3 h-3" />
                    <span>Booking: {house?.bookingId ?? "N/A"}</span>
                  </div>
                </div>
              </div>
              
              {/* Price Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                <div className="flex items-center gap-1 text-green-700">
                  <BsCurrencyRupee className="w-4 h-4" />
                  <span className="font-bold text-sm">
                    {house?.amountAfterDiscount?.toLocaleString() ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <FaBox className="w-4 h-4 text-[#304A3A]" />
              <div>
                <span className="text-xs text-gray-500">Package</span>
                <div className="font-medium text-gray-900 text-sm">
                  {house?.packageName ?? "N/A"}
                </div>
              </div>
            </div>

            {/* Check-in & Check-out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Check-in */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <IoCalendarClearOutline className="w-4 h-4 text-[#304A3A]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Check-in</div>
                  <div className="font-medium text-gray-900 text-sm">
                    {house?.checkIn ? formatDateTime(house?.checkIn) : "N/A"}
                  </div>
                </div>
              </div>

              {/* Check-out */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Check-out</div>
                  <div className="font-medium text-gray-900 text-sm">
                    {house?.checkOut ? formatDateTime(house?.checkOut) : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details (if available) */}
            {(house?.guests || house?.nights) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {house?.guests && (
                    <div className="flex items-center gap-1">
                      <span>👥 {house.guests} Guests</span>
                    </div>
                  )}
                  {house?.nights && (
                    <div className="flex items-center gap-1">
                      <span>🌙 {house.nights} Nights</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseDetails;