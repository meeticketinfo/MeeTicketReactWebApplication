const HouseCounter = ({ houseCount, onHouseCountChange, maxHouses = Infinity }) => {
  const canDecrease = houseCount > 1;
  const canIncrease = houseCount < maxHouses;

  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        No. of Houses
        {maxHouses !== Infinity && (
          <span className="text-xs text-gray-500 ml-1">
            (Max: {maxHouses} available)
          </span>
        )}
      </label>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-sm sm:text-base text-gray-600">Houses</span>
        <button
          onClick={() => onHouseCountChange(-1)}
          disabled={!canDecrease}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            canDecrease 
              ? 'bg-gray-200 hover:bg-gray-300' 
              : 'bg-gray-100 cursor-not-allowed opacity-50'
          }`}
        >
          <span className={`font-bold ${canDecrease ? 'text-gray-600' : 'text-gray-400'}`}>-</span>
        </button>
        <span className="text-base sm:text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
          {houseCount}
        </span>
        <button
          onClick={() => onHouseCountChange(1)}
          disabled={!canIncrease}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            canIncrease 
              ? 'bg-gray-200 hover:bg-gray-300' 
              : 'bg-gray-100 cursor-not-allowed opacity-50'
          }`}
        >
          <span className={`font-bold ${canIncrease ? 'text-gray-600' : 'text-gray-400'}`}>+</span>
        </button>
      </div>
      {maxHouses !== Infinity && houseCount >= maxHouses && (
        <p className="text-xs text-amber-600 mt-1">
          Maximum available houses selected
        </p>
      )}
    </div>
  );
};

export default HouseCounter; 