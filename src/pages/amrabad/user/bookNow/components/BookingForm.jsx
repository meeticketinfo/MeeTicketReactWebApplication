import { useEffect, useState } from "react";
import { useUserBookingStore } from "../../../../../store/amrabad/user/userBookingStore";
import { useCartStore } from "../../../../../store/amrabad/user/userCartStore";
import DatePickerField from "./DatePickerField";
import HouseCounter from "./HouseCounter";
import BookingSummary from "./BookingSummary";
import ContinueButton from "./ContinueButton";
import { format } from "date-fns";

// Main Booking Form Component
export const BookingForm = ({ packageId, houseId, house, userPackage, isUserPackagesLoading, fromDate, toDate }) => {
  const { GetCalendar, isCalendarLoading, fetchCalendar } = useUserBookingStore();
  const { cartItems, fetchCartItems } = useCartStore();

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    fetchCalendar(packageId, houseId);
  }, [packageId, houseId]);

  const [startDate, setStartDate] = useState(new Date(fromDate));
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date(toDate);
    if (toDate) {
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

  // Clamp houseCount whenever cart or dates change — prevents stale count exceeding max
  useEffect(() => {
    const max = getMaxAvailableHouses(startDate, endDate);
    if (houseCount > max) {
      const clamped = Math.max(0, max);
      setHouseCount(clamped);
      calculatePricing(startDate, endDate, clamped);
    }
  }, [cartItems, startDate, endDate]);

  const calendarData = GetCalendar || [];

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
      housesLeft: item.housesLeft,
      amountAfterDiscount: item.amountAfterDiscount,
      discountPercent: item.discountPercent,
      isBlockedOut: item.isBlockedOut,
      roomLimit: item.roomLimit
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
    let totalDiscountedPrice = 0;
    const currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      const dateString = getLocalDateString(currentDate);
      const dayData = availableDatesMapWithFallback[dateString];

      if (dayData && dayData.price) {
        totalPrice += dayData.price;

        // Use discounted price if available, otherwise use regular price
        if (dayData.amountAfterDiscount && dayData.discountPercent > 0) {
          totalDiscountedPrice += dayData.amountAfterDiscount;
        } else {
          totalDiscountedPrice += dayData.price;
        }
      } else {
        // Use house tariff if no calendar data
        const dayPrice = house?.tariffPerDay || 6500;
        totalPrice += dayPrice;
        totalDiscountedPrice += dayPrice;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const subtotal = totalPrice * count;
    const discountedSubtotal = totalDiscountedPrice * count;

    // Calculate discount amount based on day-specific discounts
    let discountAmount = subtotal - discountedSubtotal;

    // If no day-specific discounts found, check for house-level discount
    if (discountAmount === 0 && house?.hasDiscount && house?.discountValue) {
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

  // How many of this specific room are already in the cart for an overlapping date range.
  // Compares date-string portions only (YYYY-MM-DD extracted from the ISO datetime).
  // Since checkout time (e.g. 10:00 AM) is always BEFORE check-in time (e.g. 12:30 PM)
  // in the same package, two bookings whose checkout/checkin land on the same calendar date
  // do NOT overlap — so itemToDate <= selFromDate means no conflict.
  const getAlreadyCartedCount = (checkInDate, checkOutDate) => {
    const items = cartItems?.data || [];
    const selFromDateStr = getLocalDateString(new Date(checkInDate));
    const selToDateStr = getLocalDateString(new Date(checkOutDate));

    return items
      .filter(item => {
        if (String(item.roomId) !== String(houseId) || String(item.packageId) !== String(packageId)) return false;
        // Extract date-only portion regardless of timezone suffix
        const itemFromDateStr = item.roomFromDate?.split('T')[0];
        const itemToDateStr = item.roomToDate?.split('T')[0];
        if (!itemFromDateStr || !itemToDateStr) return false;
        // No overlap when item ends on or before new check-in date,
        // or item starts on or after new checkout date
        const noOverlap = itemToDateStr <= selFromDateStr || itemFromDateStr >= selToDateStr;
        return !noOverlap;
      })
      .reduce((sum, item) => sum + (item.roomCount || 0), 0);
  };

  // Calculate maximum available houses for the selected date range
  const getMaxAvailableHouses = (checkInDate, checkOutDate) => {
    let minHousesAvailable = Infinity;
    let minRoomLimit = Infinity;
    const currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      const dateString = getLocalDateString(currentDate);
      const dayData = availableDatesMapWithFallback[dateString];

      if (dayData) {
        if (typeof dayData.housesLeft === 'number') {
          minHousesAvailable = Math.min(minHousesAvailable, dayData.housesLeft);
        }
        if (typeof dayData.roomLimit === 'number' && dayData.roomLimit > 0) {
          minRoomLimit = Math.min(minRoomLimit, dayData.roomLimit);
        }
      } else {
        // Only fallback to house config if no calendar data exists
        // If calendar data exists but housesLeft is 0, respect that
        if (minHousesAvailable === Infinity) {
          minHousesAvailable = house?.noOfHousesAvailable || 1;
        }
        if (typeof house?.roomLimit === 'number' && house.roomLimit > 0) {
          minRoomLimit = Math.min(minRoomLimit, house.roomLimit);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // If we have calendar data and housesLeft is 0, return 0
    if (minHousesAvailable === 0) {
      return 0;
    }

    const fallbackHouses = house?.noOfHousesAvailable || 1;
    const fallbackRoomLimit = (typeof house?.roomLimit === 'number' && house.roomLimit > 0) ? house.roomLimit : Infinity;

    const available = minHousesAvailable === Infinity ? fallbackHouses : minHousesAvailable;
    const limit = minRoomLimit === Infinity ? fallbackRoomLimit : minRoomLimit;

    // Subtract only cart items whose dates overlap with this specific date range
    const alreadyCarted = getAlreadyCartedCount(checkInDate, checkOutDate);
    return Math.max(0, Math.min(available, limit) - alreadyCarted);
  };

  const handleHouseCountChange = (increment) => {
    const maxAvailable = getMaxAvailableHouses(startDate, endDate);

    // If max available is 0, don't allow any changes
    if (maxAvailable === 0) {
      setHouseCount(0);
      return;
    }

    const newCount = Math.max(1, Math.min(maxAvailable, houseCount + increment));

    if (newCount !== houseCount) {
      setHouseCount(newCount);
      calculatePricing(startDate, endDate, newCount);
    }
  };

  // Update max houses when dates change
  const maxAvailableHouses = getMaxAvailableHouses(startDate, endDate);

  const handleCheckInDateChange = (date) => {
    setStartDate(date);

    if (date >= endDate) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(nextDay);
    }

    calculatePricing(date, endDate, houseCount);
  };

  const handleCheckOutDateChange = (date) => {
    setEndDate(date);

    // Reset house count if it exceeds new maximum
    const newMaxHouses = getMaxAvailableHouses(startDate, date);
    if (houseCount > newMaxHouses) {
      setHouseCount(newMaxHouses);
      calculatePricing(startDate, date, newMaxHouses);
    } else {
      calculatePricing(startDate, date, houseCount);
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

    const hasDiscount = dayData.discountPercent && dayData.discountPercent > 0;

    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center gap-1 p-1">
        {/* Price */}
        {hasDiscount ? (
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 font-medium line-through leading-none">₹{dayData.price}</span>
            <span className="text-[12px] leading-none font-bold text-green-600">₹{dayData.amountAfterDiscount}</span>
          </div>
        ) : (
          <span className="text-[12px] leading-none font-medium">₹{dayData.price}</span>
        )}

        {/* Day */}
        <span className="text-sm leading-none font-semibold">{day}</span>

        {/* Houses Left */}
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
    maxDate.setDate(maxDate.getDate() + 3); // Changed from +2 to +3 to allow 3 days
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
      <div className="bg-[#FDFAF7] rounded-lg p-4 sm:p-6 shadow-lg ">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Book {house?.roomName}
        </h2>

        {/* Check-in Date */}
        <DatePickerField
          inline={true}
          label=""
          selected={startDate}
          onChange={(dates) => {
            const [start, end] = dates;

            if (!start) return;

            setStartDate(start);

            if (end) {
              setEndDate(end);
              calculatePricing(start, end, houseCount);
            } else {
              const nextDay = new Date(start);
              nextDay.setDate(nextDay.getDate() + 1);
              setEndDate(nextDay);
              calculatePricing(start, nextDay, houseCount);
            }
          }}
          filterDate={filterDate}
          renderDayContents={renderDayContents}
          isCalendarLoading={isCalendarLoading}
          isDateAvailable={isDateAvailable}
          startDate={startDate}
          endDate={endDate}
          isCheckout={false}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#304A3A] mb-2">
            Check-in Date
          </label>

          <input
            readOnly
            value={startDate ? format(startDate, "dd-MM-yyyy") : ""}
            className="w-full px-3 py-4 border border-[#C8BFB2] rounded-lg bg-[#FDFAF7] text-[#304A3A]"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-[#304A3A] mb-2">
            Check-out Date
          </label>

          <input
            readOnly
            value={endDate ? format(endDate, "dd-MM-yyyy") : ""}
            className="w-full px-3 py-4 border border-[#C8BFB2] rounded-lg bg-[#FDFAF7] text-[#304A3A]"
          />
        </div>

        {/* Number of Houses */}
        <HouseCounter
          houseCount={houseCount}
          onHouseCountChange={handleHouseCountChange}
          maxHouses={maxAvailableHouses}
          calendarData={calendarData}
          startDate={startDate}
          endDate={endDate}
          alreadyCarted={getAlreadyCartedCount(startDate, endDate)}
          roomLimit={calendarData.find(item => typeof item.roomLimit === 'number' && item.roomLimit > 0)?.roomLimit ?? null}
        />

        {/* Booking Summary */}
        <BookingSummary
          houseCount={houseCount}
          house={house}
          userPackage={userPackage}
          startDate={startDate}
          endDate={endDate}
          subTotal={subTotal}
          discount={discount}
          finalAmount={finalAmount}
          isLoading={isCalendarLoading || isUserPackagesLoading}
        />
      </div>
    </div>
  );
};