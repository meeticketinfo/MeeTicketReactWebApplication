import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useUserBookingStore } from "../../../../../store/amrabad/user/userBookingStore";

export const BookingForm = () => {

  const { GetCalendar, isCalendarLoading, fetchCalendar } = useUserBookingStore();

  useEffect(() => {
    fetchCalendar();
  }, []);

  // Debug: Log the calendar data
  useEffect(() => {
    console.log("GetCalendar data:", GetCalendar);
    console.log("isCalendarLoading:", isCalendarLoading);
  }, [GetCalendar, isCalendarLoading]);

  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    // Set checkout date to next day of check-in date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [houseCount, setHouseCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(6500);

  // Fallback test data if API is not working
  const testCalendarData = [
    {
      "date": "2025-08-01",
      "price": 100.00,
      "housesLeft": 4
    },
    {
      "date": "2025-08-02", 
      "price": 100.00,
      "housesLeft": 4
    },
    {
      "date": "2025-08-03",
      "price": 100.00,
      "housesLeft": 4
    }
  ];

  // Use test data if GetCalendar is empty
  const calendarData = GetCalendar && GetCalendar.length > 0 ? GetCalendar : testCalendarData;
  const availableDatesMapWithFallback = calendarData.reduce((acc, item) => {
    acc[item.date] = {
      price: item.price,
      housesLeft: item.housesLeft
    };
    return acc;
  }, {});

  const handleHouseCountChange = (increment) => {
    const newCount = Math.max(0, houseCount + increment);
    if (newCount > 0) {
      setHouseCount(newCount);
      setTotalPrice(newCount * 6500);
    }
  };

  const handleCheckInDateChange = (e) => {
    const newCheckInDate = e.target.value;
    setCheckInDate(newCheckInDate);

    // Set checkout date to next day of check-in date
    const checkIn = new Date(newCheckInDate);
    const nextDay = new Date(checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    setCheckOutDate(nextDay.toISOString().split('T')[0]);
  };

  // Function to check if a date is available
  const isDateAvailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const isAvailable = availableDatesMapWithFallback[dateString] && availableDatesMapWithFallback[dateString].housesLeft > 0;
    console.log(`Checking date ${dateString}:`, isAvailable);
    return isAvailable;
  };

  // Custom day renderer for DatePicker
  const renderDayContents = (day, date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayData = availableDatesMapWithFallback[dateString];
    
    if (!dayData) {
      return <div className="text-gray-400">{day}</div>;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center gap-1">
        <span className="text-[10px] leading-none font-medium">₹{dayData.price}</span>
        <span className="text-sm leading-none font-semibold">{day}</span>
        <span className="text-[10px] leading-none">{dayData.housesLeft} left</span>
      </div>
    );
  };

  // Filter function to only show available dates - temporarily allow all dates for debugging
  const filterDate = (date) => {
    // For debugging, let's show all dates first
    const dateString = date.toISOString().split('T')[0];
    const isAvailable = availableDatesMapWithFallback[dateString] && availableDatesMapWithFallback[dateString].housesLeft > 0;
    console.log(`Filtering date ${dateString}:`, isAvailable);
    
    // If we have calendar data, filter by availability
    if (calendarData && calendarData.length > 0) {
      return isAvailable;
    }
    
    // If no calendar data, allow all dates from yesterday onwards
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date >= yesterday;
  };

  return (
    <div className="w-full max-w-full sm:max-w-md lg:max-w-[400px]">
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Book Chital & Otter
        </h2>

        {/* Debug info */}
        <div className="mb-4 p-2 bg-blue-100 rounded text-xs">
          <p>Calendar data loaded: {calendarData.length} dates</p>
          <p>Available dates: {Object.keys(availableDatesMapWithFallback).length}</p>
          <p>Loading: {isCalendarLoading ? 'Yes' : 'No'}</p>
          <p>Using fallback: {GetCalendar && GetCalendar.length > 0 ? 'No' : 'Yes'}</p>
        </div>

        {/* Check-in Date */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in date
          </label>
          <div className="relative">
            {isCalendarLoading ? (
              <div className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-100">
                Loading calendar...
              </div>
            ) : (
              <DatePicker
                showIcon
                dateFormat="dd-MM-yyyy"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                wrapperClassName="w-full"
                calendarClassName="!bg-white !border-gray-200 !rounded-lg !shadow-lg"
                monthClassName="!bg-white"
                weekDayClassName={(date) => {
                  return "!text-gray-500 !text-xs !font-medium !py-2 !text-center";
                }}
                dayClassName={(date) => {
                  const today = new Date();
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = date.toDateString() === startDate.toDateString();
                  const isAvailable = isDateAvailable(date);
                  const commonClass = "!text-gray-800 !hover:!bg-gray-100 !rounded-md !transition-colors !w-[50px] !h-[50px]";
                  
                  if (!isAvailable) {
                    return "!text-gray-300 !cursor-not-allowed !bg-gray-50 " + commonClass;
                  }
                  
                  if (isSelected) {
                    return "!bg-[#362D86] !text-white !rounded-md" + commonClass;
                  }
                  
                  if (isToday) {
                    return "!text-[#362D86] !font-semibold !border-2 !border-[#362D86] !rounded-md " + commonClass;
                  }
                  
                  return commonClass;
                }}
                calendarIconClassName="right-0 h-full !box-border w-8"
                className="w-full !pl-3 !pr-10 py-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#362D86] focus:border-transparent"
                filterDate={filterDate}
                renderDayContents={renderDayContents}
                placeholderText="Select available date"
                showDisabledMonthNavigation
                inline
                calendarStartDay={0}
                formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 3).toUpperCase()}
              />
            )}
          </div>
        </div>

        {/* Check-out Date */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out date
          </label>
          <div className="relative">
          </div>
        </div>

        {/* Number of Houses */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. of Houses
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-base text-gray-600">Houses</span>
            <button
              onClick={() => handleHouseCountChange(-1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <span className="text-gray-600 font-bold">-</span>
            </button>
            <span className="text-base sm:text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
              {houseCount}
            </span>
            <button
              onClick={() => handleHouseCountChange(1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <span className="text-gray-600 font-bold">+</span>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <Link to={`/amarabad/checkout-details/1`} className="w-full bg-[#362D86] text-white py-3 rounded-lg font-semibold hover:bg-[#362D86]/90 transition-colors flex items-center justify-between px-4 sm:px-6">
          <span className="text-lg sm:text-xl font-bold">₹{totalPrice.toLocaleString()}</span>
          <span className="text-sm sm:text-base">Continue</span>
        </Link>
      </div>
    </div>
  );
};