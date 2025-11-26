import React, { useEffect } from "react";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import CountUp from "react-countup";
import {useAmrabadDashboardStore } from "./store/amarabadDashboardStore";

const AmarabadPckagesNames = () => {
  const {
    amrabadDashboardBookingsFullSummaryData
  } = useAmrabadDashboardStore();

  const groupedByPackage = amrabadDashboardBookingsFullSummaryData?.detailed?.reduce((acc, item) => {
    if (!acc[item.packageId]) {
      acc[item.packageId] = {
        packageId: item.packageId,
        packageName: item.packageName,
        rooms: []
      };
    }
    acc[item.packageId].rooms.push({
      roomId: item.roomId,
      roomName: item.roomName,
      totalBookingItems: item.totalBookingItems,
      totalBookings: item.totalBookings,
      totalCreditedAmount: item.totalCreditedAmount,
      totalCurrentAmount: item.totalCurrentAmount,
      totalRefundedAmount: item.totalRefundedAmount,
      totalRefundedProcessAmount: item.totalRefundedProcessAmount
    });
    return acc;
  }, {});

  // Calculate totals for each package
  const packagesWithTotals = Object.values(groupedByPackage || {}).map(packageItem => {
    const totals = packageItem.rooms.reduce((acc, room) => {
      acc.totalBookings += room.totalBookings;
      acc.totalCreditedAmount += room.totalCreditedAmount;
      acc.totalCurrentAmount += room.totalCurrentAmount;
      acc.totalRefundedAmount += room.totalRefundedAmount;
      acc.totalRefundedProcessAmount += room.totalRefundedProcessAmount;
      return acc;
    }, {
      totalBookings: 0,
      totalCreditedAmount: 0,
      totalCurrentAmount: 0,
      totalRefundedAmount: 0,
      totalRefundedProcessAmount: 0
    });

    return {
      ...packageItem,
      ...totals
    };
  });

  return (
    <div>
      {/* Header */}
      {packagesWithTotals?.map((packageItem, packageIndex) => {
        return (
          <div key={packageIndex} className={`bg-[#EFF6FF] rounded-2xl p-6 mb-6 shadow-lg border border-white/50`}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{packageItem.packageName}</h2>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Total Bookings Count Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 leading-tight">
                    <CountUp
                      end={packageItem.totalBookings}
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

              {/* Total Credited Amount Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl sm:text-2xl md:text-xl font-bold text-gray-700 leading-tight">
                    <CountUp
                      end={packageItem.totalCreditedAmount}
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
                  Total Credited Amount
                </div>
              </div>

              {/* Total Current Amount Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl sm:text-2xl md:text-xl font-bold text-gray-700 leading-tight">
                    <CountUp
                      end={packageItem.totalCurrentAmount}
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
                  Total Current Amount
                </div>
              </div>
            </div>
            
            {/* Rooms/Houses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {packageItem.rooms && packageItem.rooms.map((room, roomIndex) => (
                <div
                  key={roomIndex}
                  className="bg-[#fff] rounded-xl p-2 shadow-md relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Thumbnail Image and Title */}
                  <div className="flex items-center mb-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                      <div className="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                        🏠
                      </div>
                    </div>
                    <h3 className="text-black font-bold text-md mt-2 flex-1">
                      {room.roomName}
                    </h3>
                  </div>

                  {/* Statistics with Light Blue Background Sections */}

                  <div className="space-y-3">
                    {/* Total Bookings Count Row */}
                    <div className="bg-[#EFF6FF] rounded-lg p-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Total Users Booked
                        </span>
                        <span className="text-sm sm:text-base font-bold text-black">
                          <CountUp
                            end={room.totalBookings || 0}
                            duration={2}
                            prefix=""
                            separator=","
                          />
                        </span>
                      </div>
                    </div>

                    {/* Total Booking Items Row */}
                    <div className="bg-[#EFF6FF] rounded-lg p-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Total Houses Booked
                        </span>
                        <span className="text-sm sm:text-base font-bold text-gray-800">
                          <CountUp
                            end={room.totalBookingItems || 0}
                            duration={2}
                            prefix=""
                            separator=","
                          />
                        </span>
                      </div>
                    </div>

                    {/* Total Credited Amount Row */}
                    <div className="bg-[#EFF6FF] rounded-lg p-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Credited Amount
                        </span>
                        <span className="text-sm sm:text-base font-bold text-gray-600">
                          <CountUp
                            end={room.totalCreditedAmount || 0}
                            duration={2}
                            prefix="₹"
                            separator=","
                          />
                        </span>
                      </div>
                    </div>

                    {/* Total Current Amount Row */}
                    <div className="bg-[#EFF6FF] rounded-lg p-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Current Amount
                        </span>
                        <span className="text-sm sm:text-base font-bold text-gray-600">
                          <CountUp
                            end={room.totalCurrentAmount || 0}
                            duration={2}
                            prefix="₹"
                            separator=","
                          />
                        </span>
                      </div>
                    </div>

                    {/* Total Refunded Amount Row */}
                    <div className="bg-[#EFF6FF] rounded-lg p-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Refunded Amount
                        </span>
                        <span className="text-sm sm:text-base font-bold text-gray-600">
                          <CountUp
                            end={room.totalRefundedAmount || 0}
                            duration={2}
                            prefix="₹"
                            separator=","
                          />
                        </span>
                      </div>
                    </div>

                    {/* Total Refunded Process Amount Row */}
                    <div className="bg-[#EFF6FF] rounded-lg p-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Refund Processed Amount
                        </span>
                        <span className="text-sm sm:text-base font-bold text-gray-600">
                          <CountUp
                            end={room.totalRefundedProcessAmount || 0}
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
