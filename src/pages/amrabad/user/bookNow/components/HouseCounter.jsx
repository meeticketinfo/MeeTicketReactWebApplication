import { IoInformationCircleOutline } from "react-icons/io5";

const HouseCounter = ({ houseCount, onHouseCountChange, maxHouses = Infinity, calendarData, startDate, endDate }) => {
  const canDecrease = houseCount > 1;
  const canIncrease = houseCount < maxHouses;

  // Get availability info from calendar data for the selected date range
  const getAvailabilityInfo = () => {
    if (!calendarData || !startDate || !endDate) return null;
    
    let minHousesLeft = Infinity;
    let minRoomLimit = Infinity;
    
    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const dayData = calendarData.find(item => item.date === dateString);
      
      if (dayData) {
        if (typeof dayData.housesLeft === 'number') {
          minHousesLeft = Math.min(minHousesLeft, dayData.housesLeft);
        }
        if (typeof dayData.roomLimit === 'number' && dayData.roomLimit > 0) {
          minRoomLimit = Math.min(minRoomLimit, dayData.roomLimit);
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      housesLeft: minHousesLeft === Infinity ? 'N/A' : minHousesLeft,
      roomLimit: minRoomLimit === Infinity ? 'N/A' : minRoomLimit
    };
  };

  const availabilityInfo = getAvailabilityInfo();

  return (
    <div className="mb-4 sm:mb-6">
      {/* Availability Information */}
      {availabilityInfo && (
        <div className="mb-3 bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-600">
          <IoInformationCircleOutline className="text-gray-400" />
          <span>
            Available Houses: {availabilityInfo.housesLeft} 
            {availabilityInfo.roomLimit !== 'N/A' && ` (Max Limit: ${availabilityInfo.roomLimit})`}
          </span>
        </div>
      )}

      {/* <label className="block text-sm font-medium text-gray-700 mb-2">
        No. of Houses
        {maxHouses !== Infinity && (
          <span className="text-xs text-gray-500 ml-1">
            (Max: {maxHouses} available)
          </span>
        )}
      </label> */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-sm sm:text-base text-gray-600">No. of Houses</span>
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