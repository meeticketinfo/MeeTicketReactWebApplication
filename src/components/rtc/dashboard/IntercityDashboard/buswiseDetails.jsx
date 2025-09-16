import React, { useState } from "react";
import { FaBus } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoTicketSharp } from "react-icons/io5";
import CountUp from "react-countup";

const BuswiseDetails = ({ intercityDashboard }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // BusTypeSummary Component
  const BusTypeCard = ({ data }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
      {/* Header with bus icon and bus type name */}
      <div className="flex items-center gap-1 mb-3">
        <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
          <FaBus className="text-2xl text-blue-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          {data.busType}
        </h3>
      </div>
      
      {/* Total Bookings */}
      <div className="flex justify-between items-center mb-0 pb-1 pt-1 border-b border-t border-gray-200">
        <span className="text-sm text-gray-600 font-normal">Total Bookings</span>
        <span className="text-xl font-bold text-gray-800">
          <CountUp end={data.totalBookings || 0} duration={2} separator="," />
        </span>
      </div>
      <div className="flex justify-between items-center mb-0 pb-0 pt-2 border-gray-200">
        <div className="flex items-center gap-2">
          <IoTicketSharp className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 font-normal">Total Tickets</span>
        </div>
        <span className="text-xl font-bold text-gray-800">
          <CountUp end={data.totalTickets || 0} duration={2} separator="," />
        </span>
      </div>
      
      {/* Male/Female breakdown for tickets */}
      <div className="flex gap-2 mb-0 pb-2 border-gray-200">
        <div className="flex-1 bg-[#EFF6FF] flex justify-between rounded-lg px-3 py-1.5 items-center">
          <span className="text-xs text-blue-600 font-normal">Male</span>
          <span className="text-sm font-bold text-blue-600 ml-1">
            <CountUp end={data.malePassengers || 0} duration={2} separator="," />
          </span>
        </div>
        <div className="flex-1 bg-[#EFF6FF] flex justify-between rounded-lg px-3 py-1.5 items-center">
          <span className="text-xs text-green-600 font-normal">Female</span>
          <span className="text-sm text-green-500 ml-1">
            <CountUp end={data.femalePassengers || 0} duration={2} separator="," />
          </span>
        </div>
      </div>
      
      {/* Total Cancelled */}
      <div className="flex justify-between items-center mb-0 pb-0 pt-1 border-gray-200">
        <div className="flex items-center gap-2">
          <IoTicketSharp className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 font-normal">Total Cancelled</span>
        </div>
        <span className="text-xl font-bold text-gray-800">
          <CountUp end={data.totalCancelledSeats || 0} duration={2} separator="," />
        </span>
      </div>
      
      {/* Male/Female breakdown for cancelled */}
      <div className="flex gap-2 mb-2 pb-2 border-gray-200 border-b">
        <div className="flex-1 bg-[#EFF6FF] flex justify-between rounded-lg px-3 py-1.5 items-center">
          <span className="text-xs text-blue-600 font-normal">Male</span>
          <span className="text-sm font-bold text-blue-600 ml-1">
            <CountUp end={data.cancelledMale || 0} duration={2} separator="," />
          </span>
        </div>
        <div className="flex-1 bg-[#EFF6FF] flex justify-between rounded-lg px-3 py-1.5 items-center">
          <span className="text-xs text-green-600 font-normal">Female</span>
          <span className="text-sm font-bold text-green-600 ml-1">
            <CountUp end={data.cancelledFemale || 0} duration={2} separator="," />
          </span>
        </div>
      </div>
      
      {/* Financial Information */}
      <div className="space-y-2 mb-0">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-normal">₹ Total Credited Amount</span>
          <span className="text-lg text-green-500">
            ₹<CountUp end={data.totalCreditedAmount || 0} duration={2} separator="," />
          </span>
        </div>
        
        {/* Current Amount */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-normal">₹ Current Amount</span>
          <span className="text-lg  text-green-600">
            ₹<CountUp end={data.totalCurrentAmount || 0} duration={2} separator="," />
          </span>
        </div>
        
        {/* Refunded Amount */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-normal">₹ Refunded Amount</span>
          <span className="text-lg text-green-600">
            ₹<CountUp end={data.totalRefundedAmount || 0} duration={2} separator="," />
          </span>
        </div>
      </div>
    </div>
  );


  // Filter bus type summary data based on search query
  const filteredBusTypes = intercityDashboard?.busTypeSummary?.filter(busType =>
    busType.busType?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];


  return (
    <div className="w-full">

      <div className="bg-[white] rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Bus-wise Details</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search buses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Bus Service Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredBusTypes.map((busType, index) => (
              <BusTypeCard key={index} data={busType} />
            ))}
          </div>
      
      {/* No results message */}
      {filteredBusTypes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No bus services found matching your search.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default BuswiseDetails;
