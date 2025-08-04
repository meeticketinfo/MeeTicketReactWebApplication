const HouseCounter = ({ houseCount, onHouseCountChange }) => {
  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        No. of Houses
      </label>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-sm sm:text-base text-gray-600">Houses</span>
        <button
          onClick={() => onHouseCountChange(-1)}
          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <span className="text-gray-600 font-bold">-</span>
        </button>
        <span className="text-base sm:text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
          {houseCount}
        </span>
        <button
          onClick={() => onHouseCountChange(1)}
          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <span className="text-gray-600 font-bold">+</span>
        </button>
      </div>
    </div>
  );
};

export default HouseCounter; 