import React from "react";
import { FaMapMarkedAlt, FaList } from "react-icons/fa";

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end mb-3">
      <div className="bg-white rounded-lg p-1 shadow-md border flex gap-1">
        <button
          onClick={() => setViewMode('map')}
          className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
            viewMode === 'map'
              ? 'bg-[#362D86] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <FaMapMarkedAlt className="text-sm sm:text-base" />
          <span className="hidden sm:inline">Map View</span>
          <span className="sm:hidden">Map</span>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
            viewMode === 'list'
              ? 'bg-[#362D86] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <FaList className="text-sm sm:text-base" />
          <span className="hidden sm:inline">List View</span>
          <span className="sm:hidden">List</span>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle; 