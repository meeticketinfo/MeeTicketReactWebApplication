import React from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const ListView = ({ houses }) => {
  return (
    <div className="space-y-8">
      {houses.map((house, idx) => (
        <div
          key={idx}
          className="flex flex-col lg:flex-row bg-white rounded-2xl p-4 md:p-8 gap-6 md:gap-8"
        >
          {/* Image */}
          <div className="flex-shrink-0 flex justify-center items-center xl:max-w-[440px] md:max-w-[300px]">
            <img
              src={house.image}
              alt={house.title}
              className="aspect-square w-full object-cover rounded-2xl"
            />
          </div>
          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Title and Price */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#333333]">
                    {house.title}
                  </h2>
                  {/* Check-in/out */}
                  <div className="bg-[#EEEDFAB0] lg:text-base text-sm rounded-xl px-4 py-3 mt-3 flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-md">
                    <div>
                      <div className="text-[#79787E]  mb-1">
                        Check-In Time:
                      </div>
                      <div className="font-bold text-[#272628]">
                        {house.checkIn}
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-[#79787E] text-2xl">
                      <span className="hidden sm:inline-block">
                        <IoArrowForwardCircleOutline />
                      </span>
                    </div>
                    <div>
                      <div className="text-[#79787E] mb-1">
                        Check-Out Time:
                      </div>
                      <div className="font-bold text-[#272628]">
                        {house.checkOut}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl md:text-4xl font-bold text-[#362D86]">
                    {house.price}
                  </span>
                  <div className="text-[#5A5961] text-base">
                    / {house.guests}
                  </div>
                </div>
              </div>
              {/* Overview */}
              <div className="mt-4">
                <div className="font-semibold text-[#323136] mb-1 text-base">
                  Overview:
                </div>
                <div className="text-[#626169] text-sm leading-relaxed">
                  {house.overview[0]}
                  <ul className="list-disc pl-5 mt-1">
                    <li>{house.overview[1]}</li>
                  </ul>
                </div>
              </div>
              {/* Special Offer */}
              <div className="mt-4">
                <div className="font-semibold text-[#323136] mb-1 text-base">
                  Special Offer:
                </div>
                <div className="text-[#626169] text-sm">
                  {house.specialOffer}
                </div>
              </div>
            </div>
            {/* Book Now Button */}
            <div className="mt-6">
              <Link 
                to={`/amarabad/book-now/${house.id}`}
                className="w-full md:w-[70%] min-w-[200px] flex items-center justify-between gap-2 bg-[#362D86] hover:bg-indigo-800 text-white font-semibold py-3 px-6 rounded-xl text-xl transition"
              >
                Book Now
                <span className="text-2xl inline-flex items-center">
                  <svg
                    width="79"
                    height="20"
                    viewBox="0 0 79 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
  );
};

export default ListView; 