import React from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import HouseCardShimmer from "./houseShimmer/HouseCardShimmer";
import { convertTo12HourFormat } from "../../../../utils/Helper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { toast } from "react-toastify";

const ListView = ({ houses, isRoomsByPackageIdLoading, userPackage, fromDate, toDate }) => {
  console.log(userPackage, "userPackage");

  // Check if houses array is empty or undefined
  const hasHouses = houses && houses.length > 0;

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const weekday = weekdays[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];

    return `${weekday}, ${day} ${month}`;
  };

  // Function to check availability for a specific date
  const checkAvailabilityForDate = (house, targetDate) => {
    if (!house?.calendar || !targetDate) return false;
    
    const calendarItem = house.calendar.find(item => item.date === targetDate);
    return calendarItem && calendarItem.housesLeft > 0;
  };

  // Function to handle Book Now click with validation
  const handleBookNowClick = (house, e) => {
    // Check if the fromDate has available rooms
    if (!checkAvailabilityForDate(house, fromDate)) {
      e.preventDefault();
      toast.error(`No room available on ${formatDate(fromDate)}`);
      return false;
    }
    
    // If available, proceed with normal navigation
    localStorage.setItem("bookingDate", JSON.stringify({"fromDate": fromDate, "toDate": toDate}));
    return true;
  };

  // Function to handle calendar item click with validation
  const handleCalendarItemClick = (house, item, idx, e) => {
    // Check if the selected date has available rooms
    if (!checkAvailabilityForDate(house, item.date)) {
      e.preventDefault();
      toast.error(`No room available on ${formatDate(item.date)}`);
      return false;
    }
    
    // If available, proceed with normal navigation
    localStorage.setItem("bookingDate", JSON.stringify({"fromDate": item.date, "toDate": house?.calendar[idx + 1]?.date}));
    return true;
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 pb-4">
        {isRoomsByPackageIdLoading ? (
          // Loading state - show shimmer effects matching the house card layout
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row bg-white rounded-xl p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6"
            >
              {/* Left Column - Image Placeholder with Shimmer */}
              <div className="flex-shrink-0 flex justify-center lg:max-w-[320px] md:max-w-[200px] w-full">
                <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center">
                  {/* House icon placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300"
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

              {/* Right Column - Content with Shimmer */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  {/* Title and Price */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title shimmer */}
                      <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>

                      {/* Check-in/out shimmer */}
                      <div className="bg-[#EEEDFAB0] rounded-lg px-3 py-2 mt-2 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-sm">
                        <div className="flex-1">
                          <div className="text-[#79787E] text-xs mb-1">
                            Check-In Time:
                          </div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        </div>
                        <div className="flex items-center justify-center text-[#79787E] text-3xl">
                          <span className="hidden sm:inline-block">
                            <IoArrowForwardCircleOutline />
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-[#79787E] text-xs mb-1">
                            Check-Out Time:
                          </div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {/* Price shimmer */}
                      <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="mt-3 sm:mt-4">
                    <div className="font-semibold text-[#323136] mb-1 text-sm sm:text-base">
                      Overview:
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
                    </div>
                  </div>

                  {/* Special Offer */}
                  <div className="mt-3 sm:mt-4">
                    <div className="font-semibold text-[#323136] mb-1 text-sm sm:text-base">
                      Special Offer:
                    </div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>

                {/* Book Now Button shimmer */}
                <div className="mt-3 sm:mt-4">
                  <div className="w-full sm:w-auto min-w-[160px] h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        ) : !hasHouses ? (
          // No houses available message
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-[]">
            <div className="text-center max-w-md">
              {/* House icon */}
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400"
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

              {/* Message */}
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Houses Available
              </h3>
              <p className="text-gray-500 mb-6">
                Currently there are no houses available for booking. Please check back later or explore other options. Or you can change from date and to date.
              </p>

              {/* Button to Amarabad page */}
              <Link
                to="/amrabad-resort/packages"
                className="inline-flex items-center gap-2 bg-[#C4A97A] text-white hover:bg-[#e7cb9a] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <span>Go to Packages</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 79 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    d="M2 8.75C1.30964 8.75 0.75 9.30964 0.75 10C0.75 10.6904 1.30964 11.25 2 11.25L2 8.75ZM77.8839 10.8839C78.372 10.3957 78.372 9.60427 77.8839 9.11611L69.9289 1.16116C69.4408 0.673004 68.6493 0.673004 68.1612 1.16116C67.673 1.64931 67.673 2.44077 68.1612 2.92893L75.2322 9.99999L68.1612 17.0711C67.673 17.5592 67.673 18.3507 68.1612 18.8388C68.6493 19.327 69.4408 19.327 69.9289 18.8388L77.8839 10.8839ZM2 10L2 11.25L77 11.25L77 9.99999L77 8.74999L2 8.75L2 10Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          // Existing houses mapping logic
          houses?.map((house, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-xl p-3 sm:p-4 space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6">
                {/* Image */}
              <div className="flex-shrink-0 flex justify-center lg:max-w-[320px] md:max-w-[200px] w-full relative">
                <span className="absolute top-0 right-0 text-sm text-gray-700 bg-white px-2 py-1 rounded-bl-lg z-10">
                  Available House : <b>{house?.noOfHousesAvailable}</b>
                </span>

                {Array.isArray(house?.images) && house.images.length > 0 ? (
                  <Swiper
                    spaceBetween={8}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="house-image-swiper w-full"
                  >
                    {house.images.map((src, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={src}
                          alt={`${house?.roomName || "House"} ${i + 1}`}
                          className="aspect-square w-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src =
                              'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 fill=%22%23f3f4f6%22/><path d=%22M3 9.75L12 4l9 5.75M4.5 10.5v9h15v-9M9 21V12h6v9%22 fill=%22none%22 stroke=%22%239ca3af%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>';
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  // No images available - show dummy image
                  <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-300"
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
                )}
              </div>
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0 ">
                  <div>
                    {/* Title and Price */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#333333] truncate">
                          {house?.roomName}
                        </h2>
                        {/* Check-in/out */}
                        <div className="bg-[#FDFAF7] shadow   text-xs sm:text-sm rounded-lg px-3 py-2 mt-2 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-sm">
                          <div className="flex-1">
                            <div className="text-[#79787E] text-xs mb-1">
                              Check-In Time:
                            </div>
                            <div className="font-bold text-[#272628] text-sm">
                              {convertTo12HourFormat(userPackage?.checkInTime)}
                            </div>
                          </div>
                          <div className="flex items-center justify-center text-[#79787E] text-3xl">
                            <span className="hidden sm:inline-block">
                              <IoArrowForwardCircleOutline />
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-[#79787E] text-xs mb-1">
                              Check-Out Time:
                            </div>
                            <div className="font-bold text-[#272628] text-sm">
                              {convertTo12HourFormat(userPackage?.checkOutTime)} (Next Day)
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C4A97A]">
                          ₹{house?.tariffPerDay?.toLocaleString()}
                        </span>
                        <div className="text-[#5A5961] text-xs sm:text-sm">
                          / 2 Guests
                        </div>
                      </div>
                    </div>
                    {/* Overview */}
                    <div className="mt-3 sm:mt-4">
                      <div className="font-semibold text-[#323136] mb-1 text-sm sm:text-base">
                        Overview:
                      </div>
                      <div className="text-[#828285]  font-semibold text-xs leading-relaxed">
                        {house?.overview}
                        {/* <ul className="list-disc pl-4 mt-1 text-xs">
                        <li>
                          Each cottage is thoughtfully designed to accommodate 2
                          guests comfortably.
                        </li>
                      </ul> */}
                      </div>
                    </div>
                    {/* Special Offer */}
                    <div className="mt-3 sm:mt-4">
                      <div className="font-semibold text-[#323136] mb-1 text-sm sm:text-base">
                        Special Offer:
                      </div>
                      <div className="text-[#828285] font-semibold text-xs">
                        {house?.specialOffers}
                      </div>
                    </div>
                  </div>
                  {/* Book Now Button */}
                  <div className="mt-4 sm:mt-6">
                    <Link
                      to={`/amrabad-resort/book-now/${house?.packageId}/${house?.roomId}`}
                      onClick={(e) => handleBookNowClick(house, e)}
                      // state={{ fromDate: fromDate, toDate: toDate }}#C4A97A
                      className="w-full sm:w-auto min-w-[160px] flex items-center justify-between gap-2 bg-[#C4A97A] text-white hover:bg-[#e7cb9a] hover:text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-lg transition max-w-sm"
                    >
                      Book Now
                      <span className="text-lg sm:text-xl inline-flex items-center">
                        <svg
                          width="60"
                          height="16"
                          viewBox="0 0 79 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 sm:w-16 h-4 sm:h-5"
                        >
                          <path
                            d="M2 8.75C1.30964 8.75 0.75 9.30964 0.75 10C0.75 10.6904 1.30964 11.25 2 11.25L2 8.75ZM77.8839 10.8839C78.372 10.3957 78.372 9.60427 77.8839 9.11611L69.9289 1.16116C69.4408 0.673004 68.6493 0.673004 68.1612 1.16116C67.673 1.64931 67.673 2.44077 68.1612 2.92893L75.2322 9.99999L68.1612 17.0711C67.673 17.5592 67.673 18.3507 68.1612 18.8388C68.6493 19.327 69.4408 19.327 69.9289 18.8388L77.8839 10.8839ZM2 10L2 11.25L77 11.25L77 9.99999L77 8.74999L2 8.75L2 10Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Calendar Slider with Navigation */}
              <div className="relative">
                <Swiper
                  spaceBetween={8}
                  slidesPerView={"auto"}
                  navigation={true}
                  modules={[Navigation]}
                  className="calendar-swiper"
                >
                  {house?.calendar?.map((item, idx) => (
                    <SwiperSlide key={idx} className="!w-auto">
                      {item?.housesLeft > 0 ? (
                        <Link 
                          to={`/amrabad-resort/book-now/${house?.packageId}/${house?.roomId}`} 
                          onClick={(e) => handleCalendarItemClick(house, item, idx, e)}
                          // state={{ fromDate: item?.date, toDate: house?.calendar[idx + 1]?.date }}
                          className="relative rounded-md p-2 border transition-all duration-200 cursor-pointer hover:shadow-sm block min-w-[120px] hover:border-[#362D86]"
                        >
                          {/* Date */}
                          <div className="text-center">
                            <div className="flex flex-row gap-2">
                              <div className="text-xs font-bold text-gray-800 mb-1">
                                {formatDate(item?.date)}
                              </div>

                              {/* Availability */}
                              <div className={`
                                text-xs font-bold mb-1
                                ${item?.housesLeft <= 2
                                  ? ' text-red-700'
                                  : ' text-green-700'
                                }
                              `}>
                                {item?.housesLeft} Left
                              </div>
                            </div>

                            {/* Price with Discount */}
                            <div className="flex flex-row gap-2">
                              {item?.discountPercent && item?.discountPercent > 0 ? (
                                <>
                                  {/* Discount Badge */}
                                  <div className="inline-block bg-green-100 text-green-800 text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                                    {item?.discountPercent}% OFF
                                  </div>
                                  {/* Original Price (struck through) */}
                                  <div className="text-[10px] text-gray-400 line-through">
                                    ₹{item?.price?.toLocaleString()}
                                  </div>

                                  {/* Discounted Price */}
                                  <div className="text-xs font-bold text-green-600">
                                    ₹{item?.amountAfterDiscount?.toLocaleString()}/-
                                  </div>
                                </>
                              ) : (
                                /* Regular Price */
                                <div className="text-xs font-medium text-gray-600">
                                  ₹{item?.price?.toLocaleString()}/-
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="relative rounded-md p-2 border transition-all duration-200 cursor-not-allowed block min-w-[120px] bg-gray-50 opacity-60">
                          {/* Date */}
                          <div className="text-center">
                            <div className="flex flex-row gap-2">
                              <div className="text-xs font-bold text-gray-500 mb-1">
                                {formatDate(item?.date)}
                              </div>

                              {/* Availability */}
                              <div className="text-xs font-bold mb-1 text-red-700">
                                {item?.housesLeft} Left
                              </div>
                            </div>

                            {/* Price with Discount */}
                            <div className="flex flex-row gap-2">
                              {item?.discountPercent && item?.discountPercent > 0 ? (
                                <>
                                  {/* Discount Badge */}
                                  <div className="inline-block bg-gray-100 text-gray-500 text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                                    {item?.discountPercent}% OFF
                                  </div>
                                  {/* Original Price (struck through) */}
                                  <div className="text-[10px] text-gray-400 line-through">
                                    ₹{item?.price?.toLocaleString()}
                                  </div>

                                  {/* Discounted Price */}
                                  <div className="text-xs font-bold text-gray-500">
                                    ₹{item?.amountAfterDiscount?.toLocaleString()}/-
                                  </div>
                                </>
                              ) : (
                                /* Regular Price */
                                <div className="text-xs font-medium text-gray-500">
                                  ₹{item?.price?.toLocaleString()}/-
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .calendar-swiper .swiper-button-next,
        .calendar-swiper .swiper-button-prev {
          color: #362D86;
          background: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          opacity: 0;
        }
        
        .calendar-swiper:hover .swiper-button-next,
        .calendar-swiper:hover .swiper-button-prev {
          opacity: 1;
        }
        
        .calendar-swiper .swiper-button-next:after,
        .calendar-swiper .swiper-button-prev:after {
          font-size: 12px;
          font-weight: bold;
        }
        
        .calendar-swiper .swiper-button-next:hover,
        .calendar-swiper .swiper-button-prev:hover {
          background: #362D86;
          color: white;
          transform: scale(1.05);
        }
        
        .calendar-swiper .swiper-button-disabled {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default ListView;
