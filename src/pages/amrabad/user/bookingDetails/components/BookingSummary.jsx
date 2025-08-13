const BookingSummary = ({ bookingData }) => {
  return (
      <div className="bg-[#EEEDFA] rounded-lg p-2 sm:p-4 border border-[#C0C0C5]">
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <img 
                  src={bookingData.image} 
                  alt={bookingData.houseName} 
                  className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded" 
              />
              <div className="flex-1">
                  <div className="font-bold text-base sm:text-lg text-gray-800">
                      {bookingData.houseName}
                  </div>
              </div>
          </div>

          <div className="border-t border-[#C0C0C5] pt-3 sm:pt-4 mb-3 sm:mb-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                      <div className="font-semibold text-gray-700 mb-1">CHECK-IN</div>
                      <div className="text-gray-600">{bookingData.checkIn}</div>
                  </div>
                  <div>
                      <div className="font-semibold text-gray-700 mb-1">CHECK-OUT</div>
                      <div className="text-gray-600">{bookingData.checkOut}</div>
                  </div>
                  <div>
                      <div className="font-semibold text-gray-700 mb-1">NO. OF HOUSES</div>
                      <div className="text-gray-600">0{bookingData.noOfHouses}</div>
                  </div>
              </div>
          </div>

          <div className="border-t border-[#C0C0C5] pt-3 sm:pt-4">
              <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm sm:text-base">SUB-TOTAL</span>
                  <span className="font-bold text-[#362D86] text-base sm:text-lg">
                      ₹{bookingData.subTotal.toLocaleString()}
                  </span>
              </div>
          </div>
      </div>
  );
};

export default BookingSummary;