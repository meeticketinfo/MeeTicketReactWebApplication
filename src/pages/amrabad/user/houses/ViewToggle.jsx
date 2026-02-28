import React from "react";
import { FaMapMarkedAlt, FaList } from "react-icons/fa";

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end w-full">
      <div className="relative bg-white rounded-lg p-1 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-[#D0D7CE] flex gap-1 w-fit">

        {/* Moving Background */}
        <span
          className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] transition-all duration-300 ease-in-out ${
            viewMode === "list" ? "left-1" : "left-[50%]"
          }`}
        />

        {/* LIST VIEW */}
        <button
          onClick={() => setViewMode("list")}
          className={`relative z-10 px-3 sm:px-4 py-2 rounded-md font-medium flex items-center gap-1 sm:gap-2 text-sm transition-colors duration-300 ${
            viewMode === "list"
              ? "text-[#FDFAF7]"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <FaList className="text-sm" />
          <span className="hidden sm:inline">List View</span>
          <span className="sm:hidden">List</span>
        </button>

        {/* MAP VIEW */}
        <button
          onClick={() => setViewMode("map")}
          className={`relative z-10 px-3 sm:px-4 py-2 rounded-md font-medium flex items-center gap-1 sm:gap-2 text-sm transition-colors duration-300 ${
            viewMode === "map"
              ? "text-[#FDFAF7]"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <FaMapMarkedAlt className="text-sm" />
          <span className="hidden sm:inline">Map View</span>
          <span className="sm:hidden">Map</span>
        </button>

      </div>
    </div>
  );
};

export default ViewToggle;