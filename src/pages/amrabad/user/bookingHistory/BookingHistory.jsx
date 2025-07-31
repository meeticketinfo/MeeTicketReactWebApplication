import { useState, useMemo, useEffect } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { bookingData } from "./data/bookingData";
import PageHeader from "./components/PageHeader";
import TabNavigation from "./components/TabNavigation";
import SearchAndFilter from "./components/SearchAndFilter";
import BookingList from "./components/BookingList";

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to parse date string to Date object
  const parseDate = (dateStr) => {
    const months = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    const [month, day, year] = dateStr.split(' ');
    return new Date(parseInt(year), months[month], parseInt(day));
  };

  // Categorize bookings based on current date
  const categorizedBookings = useMemo(() => {
    const currentDate = new Date();
    const allBookings = bookingData.all;
    
    const upcoming = [];
    const past = [];
    const cancelled = [];
    
    allBookings.forEach(booking => {
      const checkInDate = parseDate(booking.checkIn.date);
      
      if (booking.status === 'cancelled') {
        cancelled.push(booking);
      } else if (checkInDate > currentDate) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });
    
    return {
      all: allBookings,
      upcoming,
      past,
      cancelled
    };
  }, []);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "all", label: "All Trips", count: categorizedBookings.all.length },
    { id: "upcoming", label: "Upcoming", count: categorizedBookings.upcoming.length },
    { id: "cancelled", label: "Cancelled", count: categorizedBookings.cancelled.length },
    { id: "past", label: "Past", count: categorizedBookings.past.length }
  ];

  const currentBookings = categorizedBookings[activeTab];

  const filteredBookings = currentBookings.filter(booking =>
    booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.package.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserLayout>
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <PageHeader />

          {/* Tabs and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <TabNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <SearchAndFilter 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          </div>

          {/* Booking Cards */}
          <BookingList bookings={filteredBookings} isLoading={isLoading} />
        </div>
      </div>
    </UserLayout>
  );
};

export default BookingHistory;