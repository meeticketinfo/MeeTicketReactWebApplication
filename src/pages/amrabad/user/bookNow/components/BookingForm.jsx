import { useState } from "react";
import { Link } from "react-router-dom";

const BookingForm = () => {
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    // Set checkout date to next day of check-in date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [houseCount, setHouseCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(6500);

  const handleHouseCountChange = (increment) => {
    const newCount = Math.max(0, houseCount + increment);
    if (newCount > 0) {
      setHouseCount(newCount);
      setTotalPrice(newCount * 6500);
    }
  };

  const handleCheckInDateChange = (e) => {
    const newCheckInDate = e.target.value;
    setCheckInDate(newCheckInDate);
    
    // Set checkout date to next day of check-in date
    const checkIn = new Date(newCheckInDate);
    const nextDay = new Date(checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    setCheckOutDate(nextDay.toISOString().split('T')[0]);
  };

  return (
    <div className="w-full max-w-full sm:max-w-md lg:max-w-[400px]">
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Book Chital & Otter
        </h2>

        {/* Check-in Date */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in date
          </label>
          <div className="relative">
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={checkInDate}
              onChange={handleCheckInDateChange}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#362D86] focus:border-transparent"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out date
          </label>
          <div className="relative">
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#362D86] focus:border-transparent"
            />
          </div>
        </div>

        {/* Number of Houses */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. of Houses
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-base text-gray-600">Houses</span>
            <button
              onClick={() => handleHouseCountChange(-1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <span className="text-gray-600 font-bold">-</span>
            </button>
            <span className="text-base sm:text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
              {houseCount}
            </span>
            <button
              onClick={() => handleHouseCountChange(1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <span className="text-gray-600 font-bold">+</span>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <Link to={`/amarabad/checkout-details/1`} className="w-full bg-[#362D86] text-white py-3 rounded-lg font-semibold hover:bg-[#362D86]/90 transition-colors flex items-center justify-between px-4 sm:px-6">
          <span className="text-lg sm:text-xl font-bold">₹{totalPrice.toLocaleString()}</span>
          <span className="text-sm sm:text-base">Continue</span>
        </Link>
      </div>
    </div>
  );
};

export default BookingForm; 