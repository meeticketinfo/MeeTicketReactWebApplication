const PropertyDetails = () => {
  return (
    <>
      <div className="">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Property Image - Left Side */}
          <div className="flex-shrink-0 flex justify-center md:block">
            <img
              src="https://amrabadtigerreserve.com/wp-content/uploads/2023/01/20230412_162323-1024x768.jpg"
              alt="Chital And Otter"
              className="w-full max-w-xs sm:max-w-sm md:w-[200px] md:h-[200px] h-40 sm:h-48 object-cover rounded-lg"
            />
          </div>

          {/* Property Details - Right Side */}
          <div className="flex-1">
            {/* Property Title */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Chital And Otter
            </h1>

            {/* Price and Guest Capacity */}
            <div className="mb-2 flex flex-wrap items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#362D86]">₹6,500</span>
              <span className="text-gray-600 ml-2 text-base sm:text-lg">/ For 2 Guests</span>
            </div>

            {/* Check-in/Check-out Times */}
            <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 max-w-full md:max-w-[400px]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-gray-700">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Check-In Time:</div>
                  <div className="text-base sm:text-lg font-semibold text-[#272628]">12:30 PM</div>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center mx-0 sm:mx-4 my-2 sm:my-0 hidden sm:flex">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-gray-700">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Check-Out Time:</div>
                  <div className="text-base sm:text-lg font-semibold text-[#272628]">10:00 AM (Next Day)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-2 mb-2">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Overview:</h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-snug mb-1">
            These two charming cottages offer a peaceful forest view from the balcony,
            ideal for nature lovers. Named after local wildlife - the spotted deer (Chital)
            and smooth-coated otter - both species are signs of a healthy river ecosystem.
          </p>
          <ul className="text-gray-600 text-xs sm:text-sm">
            <li>• Each cottage is thoughtfully designed to accommodate 2 guests comfortably.</li>
          </ul>
        </div>

        {/* Special Offer Section */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Special Offer:</h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Enjoy a 5% discount on bookings from Monday to Friday!
          </p>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails; 