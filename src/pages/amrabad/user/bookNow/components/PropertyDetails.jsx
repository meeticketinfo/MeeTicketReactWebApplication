import { convertTo12HourFormat } from "../../../../../utils/Helper";

const PropertyDetailsShimmer = () => {
  return (
    <div className="animate-pulse w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Property Image Shimmer - Left Side */}
        <div className="flex-shrink-0 flex justify-center md:block">
          <div className="w-full max-w-xs sm:max-w-sm md:w-[200px] md:h-[200px] h-40 sm:h-48 bg-[#D0D7CE] rounded-lg animate-shimmer-wave"></div>
        </div>

        {/* Property Details Shimmer - Right Side */}
        <div className="flex-1">
          {/* Property Title Shimmer */}
          <div className="h-6 sm:h-7 md:h-8 bg-[#D0D7CE] rounded animate-shimmer-wave w-3/4 mb-2"></div>

          {/* Price and Guest Capacity Shimmer */}
          <div className="mb-2 flex flex-wrap items-center">
            <div className="h-6 sm:h-7 md:h-8 bg-[#D0D7CE] rounded animate-shimmer-wave w-24 sm:w-28 md:w-32"></div>
            <div className="h-4 sm:h-5 md:h-6 bg-[#D0D7CE] rounded animate-shimmer-wave w-32 sm:w-36 md:w-40 ml-2"></div>
          </div>

          {/* Check-in/Check-out Times Shimmer */}
          <div className="bg-[#EDEBE1] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 max-w-full md:max-w-[400px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex-1">
                <div className="h-3 bg-[#D0D7CE] rounded animate-shimmer-wave w-20 mb-1"></div>
                <div className="h-5 sm:h-6 bg-[#D0D7CE] rounded animate-shimmer-wave w-24 sm:w-28"></div>
              </div>
              <div className="w-8 h-8 bg-[#D0D7CE] rounded-full items-center justify-center mx-0 sm:mx-4 my-2 sm:my-0 hidden sm:flex animate-shimmer-wave"></div>
              <div className="flex-1">
                <div className="h-3 bg-[#D0D7CE] rounded animate-shimmer-wave w-24 mb-1"></div>
                <div className="h-5 sm:h-6 bg-[#D0D7CE] rounded animate-shimmer-wave w-32 sm:w-36"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section Shimmer */}
      <div className="mt-2 mb-2">
        <div className="h-4 sm:h-5 bg-[#D0D7CE] rounded animate-shimmer-wave w-20 mb-1"></div>
        <div className="space-y-1">
          <div className="h-3 bg-[#D0D7CE] rounded animate-shimmer-wave w-full"></div>
          <div className="h-3 bg-[#D0D7CE] rounded animate-shimmer-wave w-5/6"></div>
          <div className="h-3 bg-[#D0D7CE] rounded animate-shimmer-wave w-4/6"></div>
        </div>
      </div>

      {/* Special Offer Section Shimmer */}
      <div>
        <div className="h-4 sm:h-5 bg-[#D0D7CE] rounded animate-shimmer-wave w-24 mb-1"></div>
        <div className="space-y-1">
          <div className="h-3 bg-[#D0D7CE] rounded animate-shimmer-wave w-full"></div>
          <div className="h-3 bg-[#D0D7CE] rounded animate-shimmer-wave w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

const PropertyDetails = ({ house, userPackage, isUserPackagesLoading }) => {
  // Show shimmer when loading
  if (isUserPackagesLoading) {
    return <PropertyDetailsShimmer />;
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Property Image - Left Side */}
          <div className="flex-shrink-0 flex justify-center md:block relative">
            {/* <span className="absolute top-0 right-0 text-sm text-gray-700 bg-white px-2 py-1 rounded-bl-lg">
              Available House : <b>{house?.noOfHousesAvailable}</b>
            </span> */}
            <img
              src={house?.images[0]}
              alt={house?.roomName}
              className="w-full max-w-xs sm:max-w-sm md:w-[200px] md:h-[200px] h-40 sm:h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex"; // show SVG fallback
              }}
            />
            {/* Fallback dummy image */}
            <div className="max-w-xs sm:max-w-sm md:w-[200px] md:h-[200px] h-40 sm:h-48 aspect-square w-full bg-[#EDEBE1] rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#C8BFB2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9.75L12 4l9 5.75M4.5 10.5v9h15v-9M9 21V12h6v9"
                />
              </svg>
            </div>
          </div>

          {/* Property Details - Right Side */}
          <div className="flex-1">
            {/* Property Title */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#304A3A] mb-2">
              {house?.roomName}
            </h1>

            {/* Price and Guest Capacity */}
            <div className="mb-2 flex flex-wrap items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#304A3A]">₹{house?.tariffPerDay}</span>
              <span className="text-[#4A6360] ml-2 text-base sm:text-lg">/ For 2 Guests</span>
            </div>

            {/* Check-in/Check-out Times */}
            <div className="bg-[#FDFAF7] border border-[#D0D7CE] shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 max-w-full md:max-w-[400px]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-[#394D48]">
                  <div className="text-xs sm:text-sm text-[#4A6360] mb-1">Check-In Time:</div>
                  <div className="text-base sm:text-lg font-semibold text-[#304A3A]">{convertTo12HourFormat(userPackage?.checkInTime)}</div>
                </div>
                <div className="w-8 h-8 bg-[#EDEBE1] rounded-full items-center justify-center mx-0 sm:mx-4 my-2 sm:my-0 hidden sm:flex">
                  <svg className="w-4 h-4 text-[#304A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-[#394D48]">
                  <div className="text-xs sm:text-sm text-[#4A6360] mb-1">Check-Out Time:</div>
                  <div className="text-base sm:text-lg font-semibold text-[#304A3A]">{convertTo12HourFormat(userPackage?.checkOutTime)} (Next Day)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-2 mb-2">
          <h2 className="text-sm sm:text-base font-semibold text-[#304A3A] mb-1">Overview:</h2>
          <p className="text-[#394D48] text-xs sm:text-sm leading-snug mb-1">
            {house?.overview}
          </p>
        </div>

        {/* Special Offer Section */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-[#304A3A] mb-1">Special Offer:</h2>
          <p className="text-[#394D48] text-xs sm:text-sm">
            {house?.specialOffers}
          </p>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails; 