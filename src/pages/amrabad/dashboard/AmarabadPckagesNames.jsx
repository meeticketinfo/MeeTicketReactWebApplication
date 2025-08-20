import React, { useEffect } from "react";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import CountUp from "react-countup";
import {useAmrabadDashboardStore } from "./store/amarabadDashboardStore";

const AmarabadPckagesNames = () => {
  const {
    amrabadDashboardBookingsSummaryData
  } = useAmrabadDashboardStore();
  return (
    <div>
      {/* Header */}
      {amrabadDashboardBookingsSummaryData?.map((item, packageIndex) => {
        return (
          <div key={packageIndex} className={`bg-[#EFF6FF] rounded-2xl p-6 mb-6 shadow-lg border border-white/50`}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.packageName}</h2>
            
            </div>
  

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 sm:gap- mb-8">
        {/* Total Bookings Count Card */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 leading-tight">
              <CountUp
                end={item.bookingCount}
                duration={2}
                prefix=""
                separator=","
              />
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <IoTicketSharp className="text-blue-600 text-lg" />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            Total Bookings Count
          </div>
        </div>

        {/* Total Amount Received Card */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl sm:text-2xl md:text-xl font-bold text-gray-700 leading-tight">
              <CountUp
                end={item.bookingsTotalAmount}
                duration={2}
                prefix="₹"
                separator=","
              />
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaIndianRupeeSign className="text-blue-600 text-lg" />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            Total Amount Received
          </div>
        </div>
      </div>
      
      {/* Rooms/Houses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {item.rooms && item.rooms.map((room, roomIndex) => (
          <div
            key={roomIndex}
            className="bg-[#fff] rounded-xl p-4 shadow-md relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Thumbnail Image and Title */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                {room.houseImageUrl ? (
                  <img 
                    src={room.houseImageUrl} 
                    alt={room.houseName}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl" style={{display: room.houseImageUrl ? 'none' : 'flex'}}>
                  🏠
                </div>
              </div>
              <h3 className="text-black font-bold text-md mt-2 flex-1">
                {room.houseName}
              </h3>
            </div>

            {/* Statistics with Light Blue Background Sections */}
            <div className="space-y-3">
              {/* Total Bookings Count Row */}
              <div className="bg-[#EFF6FF] rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    Total Tickets Count
                  </span>
                  <span className="text-sm sm:text-base font-bold text-black">
                    <CountUp
                      end={room.ticketCount || 0}
                      duration={2}
                      prefix=""
                      separator=","
                    />
                  </span>
                </div>
              </div>

              {/* Total Amount Count Row */}
              <div className="bg-[#EFF6FF] rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    Total Amount
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">
                    <CountUp
                      end={room.ticketTotalAmount || 0}
                      duration={2}
                      prefix="₹"
                      separator=","
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
        </div>
      );
    })}
    </div>
  );
};

export default AmarabadPckagesNames;
