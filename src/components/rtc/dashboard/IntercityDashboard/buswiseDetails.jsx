import React, { useState } from "react";
import { FaBus } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const BuswiseDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for bus services - replace with actual data from your store
  const busServices = [
    {
      name: "Garuda Plus",
      totalTickets: 6543,
      adults: 4321,
      children: 2222,
      totalAmount: 1234560
    },
    {
      name: "Rajadhani",
      totalTickets: 7123,
      adults: 4782,
      children: 2341,
      totalAmount: 1398765
    },
    {
      name: "Super Luxury",
      totalTickets: 8876,
      adults: 5984,
      children: 2892,
      totalAmount: 1776540
    },
    {
      name: "Deluxe",
      totalTickets: 5432,
      adults: 3654,
      children: 1778,
      totalAmount: 1087650
    },
    {
      name: "Express",
      totalTickets: 987,
      adults: 669,
      children: 318,
      totalAmount: 193456
    },
    {
      name: "Indra",
      totalTickets: 1432,
      adults: 970,
      children: 462,
      totalAmount: 281234
    },
    {
      name: "Garuda",
      totalTickets: 765,
      adults: 518,
      children: 247,
      totalAmount: 150123
    },
    {
      name: "Vennela",
      totalTickets: 2543,
      adults: 1723,
      children: 820,
      totalAmount: 498765
    }
  ];
  const filteredServices = busServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const BusServiceCard = ({ service }) => (
    <div className="bg-white rounded-xl shadow-md p-6  transition-shadow duration-200 border border-gray-200">
      {/* Header with bus icon and service name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl text-blue-600">
          <FaBus />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
      </div>
      
      {/* Total Tickets */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Total Tickets</span>
        <span className="text-xl font-bold text-gray-800">{service.totalTickets.toLocaleString()}</span>
      </div>
      
      {/* Adults & Children Breakdown */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600 mb-1">Adults</div>
          <div className="text-lg font-bold text-blue-600">{service.adults.toLocaleString()}</div>
        </div>
        <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600 mb-1">Children</div>
          <div className="text-lg font-bold text-green-600">{service.children.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Total Amount */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Total Amount</span>
        <div className="flex items-center gap-1">
          <FaIndianRupeeSign className="text-green-600 text-sm" />
          <span className="text-xl font-bold text-green-600">{service.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header Section */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredServices.map((service, index) => (
          <BusServiceCard key={index} service={service} />
        ))}
      </div>
      
      {/* No results message */}
      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No bus services found matching your search.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default BuswiseDetails;
