import React from "react";
import { FaMapMarkedAlt, FaList } from "react-icons/fa";

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end w-full">
      <div className="bg-white rounded-lg p-1 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-[#D0D7CE] flex gap-1">
        <button
          onClick={() => setViewMode('map')}
          className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm ${
            viewMode === 'map'
              ? 'bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <FaMapMarkedAlt className="text-sm" />
          <span className="hidden sm:inline">Map View</span>
          <span className="sm:hidden">Map</span>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm ${
            viewMode === 'list'
              ? 'bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <FaList className="text-sm" />
          <span className="hidden sm:inline">List View</span>
          <span className="sm:hidden">List</span>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle; 