import { FaEye, FaDownload, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { IoIosCloseCircleOutline, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { getStatusBadgeClass } from "../data/bookingData";
import { IoCalendarClearOutline } from "react-icons/io5";
import { PiHouseLine, PiUsersBold } from "react-icons/pi";
import { TbUsers } from "react-icons/tb";
import { BsDownload } from "react-icons/bs";

const BookingCard = ({ booking }) => {
  const getStatusIconComponent = (status) => {
    switch (status) {
      case "completed":
        return <IoMdCheckmarkCircleOutline className="text-green-600" />;
      case "cancelled":
        return <IoIosCloseCircleOutline className="text-red-600" />;
      case "upcoming":
        return <FaClock className="text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Image */}
        <div className="flex-shrink-0 flex justify-center lg:block mb-3 lg:mb-0">
          <img
            src={booking.image}
            alt={booking.propertyName}
            className="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with Property Name and Status */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
            <div className="mb-1 sm:mb-0 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 min-w-0 flex-wrap">
                <h3 className="text-lg sm:text-2xl font-bold text-black  min-w-0">
                  {booking.propertyName}
                </h3>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(booking.status)} flex items-center gap-1 border-0`}>
                  <span className="text-base">{getStatusIconComponent(booking.status)}</span>
                  {booking.statusText}
                </span>
              </div>
              {/* Package */}
              <p className="text-sm sm:text-base text-black mb-1 sm:mb-2  min-w-0">{booking.package}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-2xl font-bold text-[#362D86]">
                ₹{booking.totalAmount.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Total Amount</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 mb-4 sm:mb-6 max-w-screen-md">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-blue-50 rounded-md flex items-center justify-center text-blue-700">
                <IoCalendarClearOutline />
              </div>
              <div>
                <div className="text-xs text-gray-500">Check-in</div>
                <div className="text-xs sm:text-sm font-bold text-black">{booking.checkIn.date}</div>
                <div className="text-xs text-gray-500">{booking.checkIn.time}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-blue-50 rounded-md flex items-center justify-center text-blue-700">
                <IoCalendarClearOutline />
              </div>
              <div>
                <div className="text-xs text-gray-500">Check-out</div>
                <div className="text-xs sm:text-sm font-bold text-black">{booking.checkOut.date}</div>
                <div className="text-xs text-gray-500">{booking.checkOut.time}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-blue-50 rounded-md flex items-center justify-center text-blue-700">
                <TbUsers />
              </div>
              <div>
                <div className="text-xs text-gray-500">Guests</div>
                <div className="text-xs sm:text-sm font-bold text-black">{booking.guests}</div>
                <div className="text-xs text-gray-500">{booking.nights}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-orange-50 rounded-md flex items-center justify-center text-orange-700">
                <PiHouseLine />
              </div>
              <div>
                <div className="text-xs text-gray-500">Houses</div>
                <div className="text-xs sm:text-sm font-bold text-black">{booking.houses}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 pt-3 sm:pt-4 border-t border-gray-200 mt-3">
        <div className="flex flex-col xs:flex-row gap-1 lg:gap-4 text-xs sm:text-sm">
          <div className="text-black">
            <span className="text-gray-600">Booking ID:</span> <span className="font-bold">#{booking.bookingId}</span>
          </div>
          <div className="text-black">
            <span className="text-gray-600">Booking on:</span> <span className="font-bold whitespace-nowrap">{booking.bookingDate}</span>
          </div>
          <div className="text-black">
            <span className="text-gray-600">Category:</span> <span className="font-bold">{booking.category}</span>
          </div>
        </div>
        <div className="flex gap-2 lg:gap-4">
          <button className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 transition-colors text-xs sm:text-sm">
            <FaEye />
            <span className="hidden xs:inline">View Details</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm">
            <BsDownload />
            <span className="hidden xs:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;