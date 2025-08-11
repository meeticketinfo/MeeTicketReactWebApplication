const BookingDetails = ({ booking }) => {
  
  return (
    <div className="">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Booking details:</h2>
      <div className="text-xs sm:text-sm space-y-2">
        <div>
          <span className="font-bold text-black">Package:</span> {booking.packageName}
        </div>
        <div>
          <span className="font-bold text-black">Check-in:</span> {booking.checkIn}
        </div>
        <div>
          <span className="font-bold text-black">Check-out:</span> {booking.checkOut}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;