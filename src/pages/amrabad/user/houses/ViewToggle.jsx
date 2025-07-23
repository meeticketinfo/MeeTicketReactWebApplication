import React from "react";
import { FaMapMarkedAlt, FaList } from "react-icons/fa";

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end mb-3">
      <div className="bg-white rounded-xl p-1 shadow-lg border flex gap-2">
        <button
          onClick={() => setViewMode('map')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            viewMode === 'map'
              ? 'bg-[#362D86] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaMapMarkedAlt className="text-lg" />
          Map View
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            viewMode === 'list'
              ? 'bg-[#362D86] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaList className="text-lg" />
          List View
        </button>
      </div>
    </div>
  );
};

export default ViewToggle; 