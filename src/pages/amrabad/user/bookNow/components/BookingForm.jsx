import { useEffect, useState } from "react";
import { useUserBookingStore } from "../../../../../store/amrabad/user/userBookingStore";
import DatePickerField from "./DatePickerField";
import HouseCounter from "./HouseCounter";
import BookingSummary from "./BookingSummary";
import ContinueButton from "./ContinueButton";

// Main Booking Form Component
export const BookingForm = ({ packageId, houseId, house, userPackage, isUserPackagesLoading, fromDate, toDate }) => {
  const { GetCalendar, isCalendarLoading, fetchCalendar } = useUserBookingStore();

  useEffect(() => {
    fetchCalendar(packageId, houseId);
  }, [packageId, houseId]);

  const [startDate, setStartDate] = useState(new Date(fromDate));
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date(toDate);
    if(toDate){
      return new Date(toDate);
    }
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [houseCount, setHouseCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  // Fallback test data if API is not working
  const testCalendarData = [
    {
      "date": new Date().toISOString().split('T')[0],
      "price": 100.00,
      "housesLeft": 4
    },
    {
      "date": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "price": 100.00,
      "housesLeft": 4
    },
    {
      "date": new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "price": 100.00,
      "housesLeft": 4
    }
  ];

  const calendarData = GetCalendar && GetCalendar.length > 0 ? GetCalendar : testCalendarData;

  const availableDatesMapWithFallback = calendarData.reduce((acc, item) => {
    let normalizedDate;
    if (typeof item.date === 'string') {
      if (item.date.includes('T')) {
        normalizedDate = item.date.split('T')[0];
      } else {
        normalizedDate = item.date;
      }
    } else if (item.date instanceof Date) {
      normalizedDate = getLocalDateString(item.date);
    } else {
      const date = new Date(item.date);
      normalizedDate = getLocalDateString(date);
    }
    
    acc[normalizedDate] = {
      price: item.price,
      housesLeft: item.housesLeft
    };
    return acc;
  }, {});

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate pricing breakdown
  const calculatePricing = (checkInDate, checkOutDate, count) => {
    let totalPrice = 0;
    const currentDate = new Date(checkInDate);
    
    while (currentDate < checkOutDate) {
      const dateString = getLocalDateString(currentDate);
      const dayData = availableDatesMapWithFallback[dateString];
      
      if (dayData && dayData.price) {
        totalPrice += dayData.price;
      } else {
        // Use house tariff if no calendar data
        totalPrice += (house?.tariffPerDay || 6500);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const subtotal = totalPrice * count;
    let discountAmount = 0;
    
    // Apply discount if available
    if (house?.hasDiscount && house?.discountValue) {
      if (house?.discountType === "Percentage") {
        // Calculate percentage-based discount
        discountAmount = Math.round((subtotal * house?.discountValue) / 100);
      } else {
        // Fixed amount discount
        discountAmount = house?.discountValue;
      }
    }
    
    const finalAmount = subtotal - discountAmount;
    
    setSubTotal(subtotal);
    setDiscount(discountAmount);
    setFinalAmount(finalAmount);
    setTotalPrice(finalAmount);
  };

  const handleCheckInDateChange = (date) => {
    setStartDate(date);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setEndDate(nextDay);
    
    calculatePricing(date, nextDay, houseCount);
  };

  const handleCheckOutDateChange = (date) => {
    setEndDate(date);
    calculatePricing(startDate, date, houseCount);
  };

  const handleHouseCountChange = (increment) => {
    const maxAvailable = house?.noOfHousesAvailable || Infinity;
    const newCount = Math.max(1, Math.min(maxAvailable, houseCount + increment));
    
    if (newCount !== houseCount) {
      setHouseCount(newCount);
      calculatePricing(startDate, endDate, newCount);
    }
  };

  const isDateAvailable = (date) => {
    const dateString = getLocalDateString(date);
    const isAvailable = availableDatesMapWithFallback[dateString] && availableDatesMapWithFallback[dateString].housesLeft > 0;
    return isAvailable;
  };

  const renderDayContents = (day, date) => {
    const dateString = getLocalDateString(date);
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

  const filterDate = (date) => {
    const dateString = getLocalDateString(date);
    const isAvailable = availableDatesMapWithFallback[dateString] && availableDatesMapWithFallback[dateString].housesLeft > 0;
    
    if (calendarData && calendarData.length > 0) {
      return isAvailable;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const filterCheckoutDate = (date) => {
    if (date <= startDate) {
      return false;
    }
    
    const maxDate = new Date(startDate);
    maxDate.setDate(maxDate.getDate() + 2);
    if (date > maxDate) {
      return false;
    }
    
    const dateString = getLocalDateString(date);
    const isAvailable = availableDatesMapWithFallback[dateString] && availableDatesMapWithFallback[dateString].housesLeft > 0;
    
    return isAvailable;
  };

  useEffect(() => {
    if (calendarData && calendarData.length > 0 && !isCalendarLoading && house) {
      calculatePricing(startDate, endDate, houseCount);
    }
  }, [calendarData, isCalendarLoading, startDate, endDate, houseCount, house]);

  return (
    <div className="w-full max-w-full sm:max-w-md lg:max-w-[400px] ">
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-lg ">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Book {house?.roomName}
        </h2>

        {/* Check-in Date */}
        <DatePickerField
          label="Check-in date"
          selected={startDate}
          onChange={handleCheckInDateChange}
          filterDate={filterDate}
          renderDayContents={renderDayContents}
          placeholderText="Select available date"
          isCalendarLoading={isCalendarLoading}
          isDateAvailable={isDateAvailable}
          startDate={startDate}
          endDate={endDate}
          isCheckout={false}
        />

        {/* Check-out Date */}
        <DatePickerField
          label="Check-out date"
          selected={endDate}
          onChange={handleCheckOutDateChange}
          filterDate={filterCheckoutDate}
          renderDayContents={renderDayContents}
          placeholderText="Select checkout date"
          isCalendarLoading={isCalendarLoading}
          isDateAvailable={isDateAvailable}
          startDate={startDate}
          endDate={endDate}
          isCheckout={true}
        />

        {/* Number of Houses */}
        <HouseCounter 
          houseCount={houseCount} 
          onHouseCountChange={handleHouseCountChange}
          maxHouses={house?.noOfHousesAvailable}
        />

        {/* Booking Summary */}
        <BookingSummary 
          houseCount={houseCount}
          house={house}
          userPackage={userPackage}
          startDate={startDate}
          endDate={endDate}
          discount={discount}
          finalAmount={finalAmount}
          isLoading={isCalendarLoading || isUserPackagesLoading}
        />
      </div>
    </div>
  );
};