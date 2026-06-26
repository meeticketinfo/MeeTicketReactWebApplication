import { IoHomeOutline, IoCartOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const HouseCounter = ({ houseCount, onHouseCountChange, maxHouses = Infinity, calendarData, startDate, endDate, alreadyCarted = 0, roomLimit = null }) => {
  const canDecrease = houseCount > 1;
  const canIncrease = houseCount < maxHouses;
  const allCartedOut = maxHouses === 0 && alreadyCarted > 0;

  // Get availability info from calendar data for the selected date range
  const getAvailabilityInfo = () => {
    if (!calendarData || !startDate || !endDate) return null;

    let minHousesLeft = Infinity;

    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const dayData = calendarData.find(item => item.date === dateString);
      if (dayData && typeof dayData.housesLeft === 'number') {
        minHousesLeft = Math.min(minHousesLeft, dayData.housesLeft);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      housesLeft: minHousesLeft === Infinity ? null : minHousesLeft,
    };
  };

  const availabilityInfo = getAvailabilityInfo();

  return (
    <div className="mb-4 sm:mb-6">

      {/* Availability card */}
      {availabilityInfo && (
        <div className={`mb-4 rounded-lg border p-3 ${
          allCartedOut
            ? 'bg-red-50 border-red-200'
            : maxHouses === 0
            ? 'bg-orange-50 border-orange-200'
            : 'bg-[#FDFAF7] border-[#D0D7CE]'
        }`}>
          {/* Stat row */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* Total available */}
            <div className="flex items-center gap-1.5">
              <IoHomeOutline className="text-[#304A3A] text-base shrink-0" />
              <div>
                <p className="text-[10px] text-[#4A6360] leading-none mb-0.5">Total Available</p>
                <p className="text-sm font-bold text-[#304A3A] leading-none">{availabilityInfo.housesLeft ?? '—'}</p>
              </div>
            </div>

            {roomLimit && (
              <>
                <div className="w-px h-6 bg-[#D0D7CE]" />
                <div>
                  <p className="text-[10px] text-[#4A6360] leading-none mb-0.5">Max per Booking</p>
                  <p className="text-sm font-bold text-[#304A3A] leading-none">{roomLimit}</p>
                </div>
              </>
            )}

            {alreadyCarted > 0 && (
              <>
                <div className="w-px h-6 bg-[#D0D7CE]" />
                <div className="flex items-center gap-1.5">
                  <IoCartOutline className="text-[#c4a97a] text-base shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#4A6360] leading-none mb-0.5">In Your Cart</p>
                    <p className="text-sm font-bold text-[#c4a97a] leading-none">{alreadyCarted}</p>
                  </div>
                </div>
              </>
            )}

            {alreadyCarted > 0 && maxHouses > 0 && (
              <>
                <div className="w-px h-6 bg-[#D0D7CE]" />
                <div className="flex items-center gap-1.5">
                  <IoCheckmarkCircleOutline className="text-green-600 text-base shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#4A6360] leading-none mb-0.5">Can Add More</p>
                    <p className="text-sm font-bold text-green-600 leading-none">{maxHouses}</p>
                  </div>
                </div>
              </>
            )}

            {allCartedOut && (
              <>
                <div className="w-px h-6 bg-red-200" />
                <div className="flex items-center gap-1.5">
                  <IoCloseCircleOutline className="text-red-500 text-base shrink-0" />
                  <div>
                    <p className="text-[10px] text-red-400 leading-none mb-0.5">Can Add More</p>
                    <p className="text-sm font-bold text-red-500 leading-none">0</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Status message */}
          {allCartedOut && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              All available houses for this date range are already in your cart.
            </p>
          )}
          {maxHouses === 0 && !allCartedOut && (
            <p className="mt-2 text-xs text-orange-600 font-medium">
              No houses available for the selected dates.
            </p>
          )}
        </div>
      )}

      {/* Counter row */}
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base font-medium text-gray-700">No of Cottages</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onHouseCountChange(-1)}
            disabled={!canDecrease || allCartedOut}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-colors border ${
              canDecrease && !allCartedOut
                ? 'border-[#304A3A] text-[#304A3A] hover:bg-[#EDEBE1]'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            −
          </button>

          <span className={`w-8 text-center text-lg font-bold ${allCartedOut ? 'text-gray-300' : 'text-gray-800'}`}>
            {allCartedOut ? 0 : houseCount}
          </span>

          <button
            onClick={() => onHouseCountChange(1)}
            disabled={!canIncrease || allCartedOut}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-colors border ${
              canIncrease && !allCartedOut
                ? 'border-[#304A3A] text-[#304A3A] hover:bg-[#EDEBE1]'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Max reached hint */}
      {!allCartedOut && maxHouses !== Infinity && houseCount >= maxHouses && maxHouses > 0 && (
        <p className="text-xs text-[#c4a97a] mt-1 text-right">
          Maximum available houses selected
        </p>
      )}
    </div>
  );
};

export default HouseCounter;
