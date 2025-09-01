import React from "react";
import BookingCard from "./BookingCard";

const UpcomingBookings = ({ data, searchQuery }) => {
  //  if (isLoading) {
  //   return (
  //     <div className="space-y-4">
  //       {[1, 2, 3, 4, 5].map((index) => (
  //         <BookingCardSkeleton key={index} />
  //       ))}
  //     </div>
  //   );
  // }
  const filteredData = data.filter((booking) => {
    const packageName = booking?.packageName?.toLowerCase().trim();
    const houseName = booking?.houseName?.toLowerCase().trim();
    const bookingId = booking?.bookingId?.toString();
    const fullName = booking?.fullName?.toLowerCase().trim();
    const query = searchQuery?.toLowerCase().trim();

    if (!query) return true;

    return (
      packageName?.includes(query) ||
      houseName?.includes(query) ||
      bookingId?.includes(query) ||
      fullName?.includes(query)
    );
  });
  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredData.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};

export default UpcomingBookings;
