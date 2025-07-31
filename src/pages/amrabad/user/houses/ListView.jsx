import React from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import HouseCardShimmer from "./houseShimmer/HouseCardShimmer";

const ListView = ({ houses, isRoomsByPackageIdLoading }) => {
  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {houses?.map((house, idx) => (
          isRoomsByPackageIdLoading ? <HouseCardShimmer /> : <div
            key={idx}
            className="flex flex-col lg:flex-row bg-white rounded-xl p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6"
          >
            {/* Image */}
            <div className="flex-shrink-0 flex justify-center lg:max-w-[280px] md:max-w-[200px] w-full">
              <img
                src={house.images[0].imageUrl}
                alt={house.title}
                className="aspect-square w-full object-cover rounded-lg"
              />
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                {/* Title and Price */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#333333] truncate">
                      {house.roomName}
                    </h2>
                    {/* Check-in/out */}
                    <div className="bg-[#EEEDFAB0] text-xs sm:text-sm rounded-lg px-3 py-2 mt-2 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-sm">
                      <div className="flex-1">
                        <div className="text-[#79787E] text-xs mb-1">
                          Check-In Time:
                        </div>
                        <div className="font-bold text-[#272628] text-sm">
                          12:30 PM
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
                          10:00 AM (Next Day)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#362D86]">
                      ₹{house.tariffPerDay}
                    </span>
                    <div className="text-[#5A5961] text-xs sm:text-sm">
                      / {house.roomLimit} Guests 
                    </div>
                  </div>
                </div>
                {/* Overview */}
                <div className="mt-3 sm:mt-4">
                  <div className="font-semibold text-[#323136] mb-1 text-sm sm:text-base">
                    Overview:
                  </div>
                  <div className="text-[#626169] text-xs sm:text-sm leading-relaxed">
                    These two charming cottages offer a peaceful forest view from the balcony, ideal for nature lovers. Named after local wildlife — the spotted deer (Chital) and smooth-coated otter — both species are signs of a healthy river ecosystem.
                    <ul className="list-disc pl-4 mt-1 text-xs">
                      <li>Each cottage is thoughtfully designed to accommodate 2 guests comfortably.</li>
                    </ul>
                  </div>
                </div>
                {/* Special Offer */}
                <div className="mt-3 sm:mt-4">
                  <div className="font-semibold text-[#323136] mb-1 text-sm sm:text-base">
                    Special Offer:
                  </div>
                  <div className="text-[#626169] text-xs sm:text-sm">
                    Enjoy a 5% discount on bookings from Monday to Friday!
                  </div>
                </div>
              </div>
              {/* Book Now Button */}
              <div className="mt-4 sm:mt-6">
                <Link 
                  to={`/amarabad/book-now/${house.id}`}
                  className="w-full sm:w-auto min-w-[160px] flex items-center justify-between gap-2 bg-[#362D86] hover:bg-indigo-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-lg transition max-w-sm"
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
        ))}
      </div>
    </>
  );
};

export default ListView; 