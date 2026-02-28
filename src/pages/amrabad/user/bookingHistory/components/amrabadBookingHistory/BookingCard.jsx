import { FaEye, FaDownload, FaCheck, FaTimes, FaClock, FaTrash } from "react-icons/fa";
import { IoIosCloseCircleOutline, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { getStatusBadgeClass } from "../../data/bookingData";
import { IoCalendarClearOutline } from "react-icons/io5";
import { PiHouseLine, PiUsersBold } from "react-icons/pi";
import { TbUsers } from "react-icons/tb";
import { BsDownload } from "react-icons/bs";
import { formatDateTimeToReadable, formatDate } from "../../../../../../utils/Helper";
import { MdHistory } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import CancelTicketModal from "../../../confirmedDetails/components/CancelTicketModal";
import CancellationSuccessModal from "../../../confirmedDetails/components/CancellationSuccessModal";

const BookingCard = ({ booking }) => {

  const [imageError, setImageError] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Cancel ticket handlers
  const handleCancelTicket = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancellation = () => {
    setShowCancelModal(false);
    setShowSuccessModal(true);
    // Add your cancellation logic here
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };
  const getStatusIconComponent = (historyStatus) => {
    switch (historyStatus) {
      case "Booked":
        return <IoMdCheckmarkCircleOutline className="text-green-600" />;
      case "Cancelled":
        return <IoIosCloseCircleOutline className="text-red-600" />;
      case "upcoming":
        return <FaClock className="text-[#304A3A]" />;
      case "Past":
        return <MdHistory className="text-gray-600" />;
      default:
        return <IoMdCheckmarkCircleOutline className="text-green-600" />;
    }
  };
  // Helper function to get status badge class
  const getStatusBadgeClass = (historyStatus) => {
    switch (historyStatus) {
      case "Booked":
        return "bg-green-50 text-green-800";
      case "Cancelled":
        return "bg-red-50 text-red-800";
      case "upcoming":
        return "bg-[#EDEBE1] text-[#304A3A]";
      case "Past":
        return "bg-gray-50 text-gray-800";
      default:
        return "bg-green-50 text-green-800";
    }
  };
  // Helper function to get status badge class
  const getStatusBadgeText = (historyStatus) => {
    switch (historyStatus) {
      case "Booked":
        return "Booked";
      case "Cancelled":
        return "Cancelled";
      case "upcoming":
        return "Upcoming";
      case "Past":
        return "Past";
      default:
        return "Booked";
    }
  };

  // console.log("BookingCard booking:", booking);
  return (
    <div className="bg-white border border-[#D0D7CE] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Image */}
        <div className="flex-shrink-0 flex justify-center lg:block mb-3 lg:mb-0">
          {imageError || !booking?.imageUrl ? (
            <div className="w-24 h-16 sm:w-28 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <img
              src={booking?.imageUrl}
              alt={booking?.houseName || "Property Image"}
              className="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-lg"
              onError={handleImageError}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with Property Name and Status */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
            <div className="mb-1 sm:mb-0 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 min-w-0 flex-wrap">
                <h3 className="text-lg sm:text-2xl font-bold text-black  min-w-0">
                  {booking?.houseName ?? "N/A"}
                </h3>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(booking.historyStatus)} flex items-center gap-1 border-0`}>
                  <span className="text-base">{getStatusIconComponent(booking.historyStatus)}</span>
                  {getStatusBadgeText(booking.historyStatus)}
                </span>
              </div>
              {/* Package */}
              <p className="text-sm sm:text-base text-black mb-1 sm:mb-2  min-w-0">{booking?.packageName ?? "N/A"}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-2xl font-bold text-[#304A3A]">
                ₹{booking?.amountAfterDiscount?.toLocaleString() ?? "N/A"}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Total Amount</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 sm:mb-6 gap-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-[#EDEBE1] rounded-md flex items-center justify-center text-[#304A3A] p-2">
                <IoCalendarClearOutline />
              </div>
              <div>
                <div className="text-xs text-gray-500">Check-in</div>
                <div className="text-xs sm:text-sm font-medium text-black"><span className="text-nowrap">{booking?.checkIn ? formatDateTimeToReadable(booking?.checkIn) : "N/A"}</span></div>
                <div className="text-xs text-gray-500">onwards</div>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 ">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-[#EDEBE1] rounded-md flex items-center justify-center text-[#304A3A] p-2">
                <IoCalendarClearOutline />
              </div>
              <div>
                <div className="text-xs text-gray-500">Check-out</div>
                  <div className="text-xs sm:text-sm font-medium text-black"><span className="text-nowrap">{booking?.checkOut ? formatDateTimeToReadable(booking?.checkOut) : "N/A"}</span></div>
                {/* <div className="text-xs text-gray-500">onwards</div> */}
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 ">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-[#EDEBE1] rounded-md flex items-center justify-center text-[#304A3A]">
                <TbUsers />
              </div>
              <div>
                <div className="text-xs text-gray-500">Guests</div>
                <div className="text-xs sm:text-sm font-medium text-black">2 Adults</div>
                {/* <div className="text-xs text-gray-500">3 nights stay</div> */}
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 ">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-base sm:text-lg bg-orange-50 rounded-md flex items-center justify-center text-orange-700">
                <PiHouseLine />
              </div>
              <div>
                <div className="text-xs text-gray-500">Houses</div>
                <div className="text-xs sm:text-sm font-medium text-black">{booking?.roomCount ?? "N/A"}<span> House</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 pt-3 sm:pt-4 border-t border-gray-200 mt-3">
        <div className="flex flex-col xs:flex-row gap-1 lg:gap-4 text-xs sm:text-sm">
          <div className="text-black">
            <span className="text-gray-600">Booking ID:</span> <span className="font-bold">#{booking?.bookingId ?? "N/A"}</span>
          </div>
          <div className="text-black">
            <span className="text-gray-600">Booking on:</span> <span className="text-xs sm:text-sm font-medium text-black whitespace-nowrap">{formatDateTimeToReadable(booking?.bookingDate) ?? "N/A"}</span>
          </div>
          {/* <div className="text-black">
            <span className="text-gray-600">Category:</span> <span className="font-bold">{booking.category}</span>
          </div> */}
        </div>
        <div className="flex gap-3 lg:gap-4">
          <Link target="_blank" to={`/amrabad-resort/ticket-view-details/${booking?.paymentTransactionId}`} className="flex items-center gap-1 sm:gap-2 text-[#304A3A] hover:text-[#2E3929] transition-colors text-xs sm:text-sm">
            <FaEye />
            <span className="hidden xs:inline">View Details</span>
          </Link>
          <Link
            target="_blank"
            to={`/amrabad-resort/ticket-view-details/${booking?.paymentTransactionId}?download=true`}
            className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm"
          >
            <BsDownload />
            <span className="hidden xs:inline">Download</span>
          </Link>
          {booking.historyStatus === "Upcoming" && (
            <button 
              onClick={handleCancelTicket}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors text-xs sm:text-sm"
            >
              <IoIosCloseCircleOutline />
              <span className="hidden xs:inline">Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Cancel Ticket Modal */}
      <CancelTicketModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancellation}
        bookingId={booking?.bookingId}
      />

      {/* Cancellation Success Modal */}
      <CancellationSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
};

export default BookingCard;