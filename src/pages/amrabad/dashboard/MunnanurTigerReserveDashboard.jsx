import React from "react";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import CountUp from "react-countup";

const MunnanurTigerReserveDashboard = () => {
  // Sample data for accommodation types
  const accommodationData = [
    {
      id: 1,
      name: "Chital And Otter",
      bookings: 2145,
      amount: 45670, 
      image: "🏠", // Placeholder emoji - replace with actual image
    },
    {
      id: 2,
      name: "Chenchu Hut",
      bookings: 2145,
      amount: 45670,
      image: "🏡",
    },
    {
      id: 3,
      name: "Dhuva & Sambar - Mud Houses",
      bookings: 2145,
      amount: 45670,
      image: "🏘️",
    },
    {
      id: 4,
      name: "Farha - Tree House",
      bookings: 2145,
      amount: 45670,
      image: "🌳",
    },
    {
      id: 5,
      name: "Standard Room",
      bookings: 2145,
      amount: 45670,
      image: "🏨",
    },
  ];

  // Overall statistics
  const totalBookings = 12847;
  const totalAmount = 2456780;

  return (
    <div className="min-h-screen rounded-2xl bg-[#EFF6FF] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-lg text-gray-800">Munnanur Tiger Reserve Package</p>
      </div>

      {/* Overall Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 sm:gap- mb-8">
        {/* Total Bookings Count Card */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 leading-tight">
              <CountUp
                end={totalBookings}
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
                end={totalAmount}
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

      {/* Accommodation Cards Grid - 3 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {accommodationData.map((accommodation, index) => (
          <div
            key={accommodation.id}
            className="bg-[#fff] rounded-xl p-4 shadow-md relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Thumbnail Image and Title */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 text-2xl">
                {accommodation.image}
              </div>
              <h3 className="text-black font-bold text-md mt-2 flex-1">
                {accommodation.name}
              </h3>
            </div>

            {/* Statistics with Light Blue Background Sections */}
            <div className="space-y-3">
              {/* Total Bookings Count Row */}
              <div className="bg-[#EFF6FF] rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    Total Bookings Count
                  </span>
                  <span className="text-sm sm:text-base font-bold text-black">
                    <CountUp
                      end={accommodation.bookings}
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
                    Total Amount Count
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">
                    <CountUp
                      end={accommodation.amount}
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
};

export default MunnanurTigerReserveDashboard;
